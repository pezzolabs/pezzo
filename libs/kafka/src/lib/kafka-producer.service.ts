import {
  Inject,
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from "@nestjs/common";
import { Kafka, Producer, ProducerRecord } from "kafkajs";
import { KafkaModuleOptions } from "./kafka.module";
import { MODULE_OPTIONS_TOKEN } from "./kafka.module-definitions";

@Injectable()
export class KafkaProducerService
  implements OnModuleInit, OnApplicationShutdown
{
  private kafka: Kafka;
  private producer: Producer;

  constructor(@Inject(MODULE_OPTIONS_TOKEN) private kafkaConfig: KafkaModuleOptions) {}

  async onModuleInit() {
    this.kafka = new Kafka(this.kafkaConfig.client);
    this.producer = this.kafka.producer(this.kafkaConfig.producer);
    await this.producer.connect();
  }

  async onApplicationShutdown() {
    await this.producer.disconnect();
  }

  async produce(record: ProducerRecord) {
    await this.producer.send(record);
  }
}
