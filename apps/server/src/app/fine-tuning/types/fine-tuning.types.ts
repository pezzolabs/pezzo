export interface OpenAIFile {
  id: string;
  status: "uploaded" | "processed" | "pending" | "error" | "deleting" | "deleted";
  status_details: string | null;
}

export interface CreateFineTuningJobsDto {
  model: string;
  suffix: string;
  training_file: string;
  validation_file?: string;
  hyperparameters?: {
    n_epochs?: number;
  }
}

export interface OpenAIFineTuningJob {
  id: string;
  status: "created" | "pending" | "running" | "succeeded" | "failed" | "cancelled";
  trained_tokens: number;
  fine_tuned_model: string;
  model: string;
  hyperparameters: {
    n_epochs: number;
  }
}