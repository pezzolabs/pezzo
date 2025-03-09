import { KafkaProducerService } from "./kafka-producer.service";
import { KafkaConsumerService } from "./kafka-consumer.service";
import { ConsumerConfig, KafkaConfig, ProducerConfig } from "kafkajs";
import { Global, Module } from "@nestjs/common";
import { ConfigurableModuleClass } from "./kafka.module-definitions";

export interface KafkaModuleOptions {
  client: KafkaConfig;
  consumer?: ConsumerConfig;
  producer?: ProducerConfig;
}

@Module({
  providers: [KafkaProducerService, KafkaConsumerService],
  exports: [KafkaProducerService, KafkaConsumerService],
})
export class KafkaModule extends ConfigurableModuleClass {}
