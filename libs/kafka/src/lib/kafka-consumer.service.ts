import {
  Inject,
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from "@nestjs/common";
import { ConsumerRunConfig } from "kafkajs";
import { Consumer, ConsumerSubscribeTopics, Kafka } from "kafkajs";
import { MODULE_OPTIONS_TOKEN } from "./kafka.module-definitions";
import { KafkaModuleOptions } from "./kafka.module";

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

  async connect() {
    this.kafka = new Kafka(this.kafkaConfig.client);
  }

  async consume(topics: ConsumerSubscribeTopics, config: ConsumerRunConfig) {
    const consumer = this.kafka.consumer(this.kafkaConfig.consumer);
    await consumer.connect();
    await consumer.subscribe(topics);
    await consumer.run(config);
    this.consumers.push(consumer);
  }

  async onApplicationShutdown() {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }
}
