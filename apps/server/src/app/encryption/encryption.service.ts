import { Global, Injectable } from "@nestjs/common";
import { KMS } from "@aws-sdk/client-kms";
import { ConfigService } from "@nestjs/config";
import crypto from "crypto";
import { PinoLogger } from "../logger/pino-logger";

@Global()
@Injectable()
export class EncryptionService {
  private kms: KMS;

  constructor(private config: ConfigService, private logger: PinoLogger) {
    const isLocalKMS = this.config.get("KMS_LOCAL");
    const region = this.config.get("KMS_REGION");

    this.kms = new KMS({
      region,
      endpoint: isLocalKMS ? "http://localhost:9981" : undefined,
      credentials: isLocalKMS ? { accessKeyId: "", secretAccessKey: "" } : undefined,
    });
  }

  private async generateDataKey(): Promise<{
    plaintext: Uint8Array;
    ciphertext: Uint8Array;
  }> {
    this.logger.info("Generating data key");

    const result = await this.kms.generateDataKey({
      KeyId: this.config.get("KMS_KEY_ARN"),
      KeySpec: "AES_256",
    });

    return {
      plaintext: result.Plaintext,
      ciphertext: result.CiphertextBlob,
    };
  }

  async encrypt(data: string): Promise<{
    encryptedData: string;
    encryptedDataKey: string;
  }> {
    this.logger.info("Encrypting data");

    const dataKey = await this.generateDataKey();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", dataKey.plaintext, iv);
    const encrypted = Buffer.concat([
      cipher.update(data, "utf8"),
      cipher.final(),
    ]);
    const encryptedData = Buffer.concat([iv, encrypted]);

    return {
      encryptedData: encryptedData.toString("hex"),
      encryptedDataKey: Buffer.from(dataKey.ciphertext).toString("base64"),
    };
  }

  async decrypt(encryptedData: string, dataKeyBase64: string): Promise<string> {
    this.logger.info("Decrypting data");

    const encryptedDataBuffer = Buffer.from(encryptedData, "hex");
    const { Plaintext: dataKey } = await this.kms.decrypt({
      CiphertextBlob: Buffer.from(dataKeyBase64, "base64"),
    });

    const iv = encryptedDataBuffer.slice(0, 16);
    const data = encryptedDataBuffer.slice(16);
    const decipher = crypto.createDecipheriv("aes-256-cbc", dataKey, iv);
    return decipher.update(data) + decipher.final("utf8");
  }
}
