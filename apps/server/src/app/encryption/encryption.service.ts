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

    const endpoint = isLocalKMS
      ? this.config.get("KMS_LOCAL_ENDPOINT")
      : undefined;

    const credentials = isLocalKMS
      ? { accessKeyId: "", secretAccessKey: "" }
      : undefined;

    this.kms = new KMS({
      region,
      endpoint,
      credentials,
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
    tag: string; // Include the authentication tag in the encryption result
  }> {
    this.logger.info("Encrypting data");

    const dataKey = await this.generateDataKey();
    const iv = crypto.randomBytes(12); // 12 bytes is recommended for GCM
    const cipher = crypto.createCipheriv("aes-256-gcm", dataKey.plaintext, iv);
    let encrypted = cipher.update(data, "utf8");
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return {
      encryptedData: Buffer.concat([iv, encrypted]).toString("hex"),
      encryptedDataKey: Buffer.from(dataKey.ciphertext).toString("base64"),
      tag: cipher.getAuthTag().toString("hex"), // Store the tag for verification during decryption
    };
  }

  async decrypt(
    encryptedData: string,
    dataKeyBase64: string,
    tagHex: string
  ): Promise<string> {
    this.logger.info("Decrypting data");

    const encryptedDataBuffer = Buffer.from(encryptedData, "hex");
    const { Plaintext: dataKey } = await this.kms.decrypt({
      CiphertextBlob: Buffer.from(dataKeyBase64, "base64"),
    });

    const iv = encryptedDataBuffer.slice(0, 12);
    const data = encryptedDataBuffer.slice(12);
    const decipher = crypto.createDecipheriv("aes-256-gcm", dataKey, iv);
    decipher.setAuthTag(Buffer.from(tagHex, "hex")); // Set the authentication tag for verification

    return decipher.update(data) + decipher.final("utf8");
  }
}
