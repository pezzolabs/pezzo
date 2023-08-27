import { Injectable, InternalServerErrorException } from "@nestjs/common";
import OpenAI from "openai";
import Axios, { AxiosInstance } from "axios";
import { ConfigService } from "@nestjs/config";
import path from "path";
import fsp from "fs/promises";
import fs from "fs";
import FormData from "form-data";
import {
  CreateFineTuningJobsDto,
  OpenAIFile,
  OpenAIFineTuningJob,
} from "./types/fine-tuning.types";

const TEMP_FILES_DIR = "./tmp/";

@Injectable()
export class OpenAIFineTuningService {
  axios: AxiosInstance;

  constructor(private configService: ConfigService) {
    this.axios = Axios.create({
      baseURL: "https://api.openai.com/v1/",
      headers: {
        Authorization: `Bearer ${this.configService.get(
          "TESTER_OPENAI_API_KEY"
        )}`,
      },
    });
  }

  async createFineTuningJob(
    dto: CreateFineTuningJobsDto
  ): Promise<OpenAIFineTuningJob> {
    try {
      const { data } = await this.axios.post("/fine_tuning/jobs", {
        model: dto.model,
        training_file: dto.training_file,
        suffix: dto.suffix,
      });

      console.log("data", data);
      return data;
    } catch (error) {
      console.error("Error uploading file to OpenAI", error.response.data);
      throw new InternalServerErrorException(error.response.data);
    }
  }

  async getFineTuningJob(
    jobId: string
  ): Promise<OpenAIFineTuningJob> {
    try {
      const { data } = await this.axios.get(`/fine_tuning/jobs/${jobId}`);
      return data;
    } catch (error) {
      console.error("Error uploading file to OpenAI", error.response.data);
      throw new InternalServerErrorException(error.response.data);
    }
  }

  async uploadDataset(
    data: { messages: OpenAI.Chat.ChatCompletionMessage[] }[]
  ): Promise<OpenAIFile> {
    const hash =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    const filename = path.resolve(TEMP_FILES_DIR, `${hash}.jsonl`);
    const jsonl = data.map((d) => JSON.stringify(d)).join("\n");
    await fsp.writeFile(filename, jsonl);
    const fileStream = fs.createReadStream(filename);
    const formData = new FormData();
    formData.append("file", fileStream);
    formData.append("purpose", "fine-tune");

    let fileId: string;

    try {
      const { data } = await this.axios.post("/files", formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });

      fileId = data.id;
    } catch (error) {
      console.error("Error uploading file to OpenAI", error.response.data);
      throw new InternalServerErrorException(error.response.data);
    }

    const processedFile = await this.waitForFileToBeProcessed(fileId);
    return processedFile
  }

  private async waitForFileToBeProcessed(fileId: string): Promise<OpenAIFile> {
    const MAX_RETRIES = 10;
    let retries = 0;

    const checkStatus = async (resolve: any, reject: any): Promise<OpenAIFile> => {
      if (retries >= MAX_RETRIES) {
        reject(new Error("Max retries reached"));
        return;
      }
      
      console.log("Checking file status...");
      const file = await this.getFile(fileId);
      console.log("Status", file.status);

      if (file.status !== "uploaded") {
        if (file.status === "processed") {
          resolve(file);
          return;
        } else {
          console.error("Error processing file", {
            status: file.status,
            details: file.status_details,
          });
          reject();
          return;
        }
      } else {
        retries++;
        setTimeout(() => checkStatus(resolve, reject), 2000); // Retry after 2 seconds
      }
    };

    return new Promise((resolve, reject) => checkStatus(resolve, reject));
  }

  private async getFile(fileId: string): Promise<OpenAIFile> {
    try {
      const { data } = await this.axios.get(`/files/${fileId}`);
      return data;
    } catch (error) {
      console.error("Error uploading file to OpenAI", error.response.data);
      throw new InternalServerErrorException(error.response.data);
    }
  }
}
