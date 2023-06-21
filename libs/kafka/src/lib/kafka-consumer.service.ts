import {
  Inject,
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from "@nestjs/common";
import { ConsumerRunConfig, EachMessagePayload } from "kafkajs";
import { Consumer, Kafka } from "kafkajs";
import { MODULE_OPTIONS_TOKEN } from "./kafka.module-definitions";
import { KafkaModuleOptions } from "./kafka.module";
import { KafkaSchemas } from "../schemas";

@Injectable()
export class KafkaConsumerService
  implements OnModuleInit, OnApplicationShutdown
{
  private kafka: Kafka;
  private consumers: Consumer[] = [];

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private kafkaConfig: KafkaModuleOptions
  ) {}

  async onModuleInit() {
    return this.connect();
  }

  async onApplicationShutdown() {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }

  async connect() {
    this.kafka = new Kafka(this.kafkaConfig.client);
  }

  async consume<K extends keyof KafkaSchemas>(
    topic: K,
    handler: (data: KafkaSchemas[K]) => Promise<void> | void
  ): Promise<Consumer> {
    const consumer = this.kafka.consumer(this.kafkaConfig.consumer);
    await consumer.connect();
    await consumer.subscribe({ topic: topic as string });

    const config: ConsumerRunConfig = {
      eachMessage: async (payload: EachMessagePayload) => {
        const data = JSON.parse(payload.message.value.toString());
        await handler(data);
      },
    };

    await consumer.run(config);
    this.consumers.push(consumer);
    return consumer;
  }
}
