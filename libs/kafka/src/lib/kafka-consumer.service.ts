import {
  Inject,
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from "@nestjs/common";
import { ConsumerRunConfig } from "kafkajs";
import { Consumer, ConsumerSubscribeTopics, Kafka } from "kafkajs";
import { KafkaModuleConfig } from "./kafka.module";

@Injectable()
export class KafkaConsumerService
  implements OnModuleInit, OnApplicationShutdown
{
  private kafka: Kafka;
  private consumers: Consumer[] = [];

  constructor(@Inject("KAFKA_CONFIG") private kafkaConfig: KafkaModuleConfig) {}

  async onModuleInit() {
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
