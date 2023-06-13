import { KafkaProducerService } from "./kafka-producer.service";
import { KafkaConsumerService } from "./kafka-consumer.service";
import { ConsumerConfig, KafkaConfig, ProducerConfig } from "kafkajs";
import { Global, Module } from "@nestjs/common";

export interface KafkaModuleConfig {
  client: KafkaConfig;
  consumer?: ConsumerConfig;
  producer?: ProducerConfig;
}

const defaultConfig = {
  client: {},
  consumer: {
    rebalanceTimeout: 3000,
    sessionTimeout: 10000,
    heartbeatInterval: 3000,
  },
  producer: {},
};

@Global()
@Module({})
export class KafkaModule {
  static register(config: KafkaModuleConfig) {
    const useValue = {
      client: {
        ...defaultConfig.client,
        ...config.client,
      },
      consumer: {
        ...defaultConfig.consumer,
        ...config.consumer,
      },
      producer: {
        ...defaultConfig.producer,
        ...config.producer,
      },
    };

    return {
      module: KafkaModule,
      providers: [
        { provide: "KAFKA_CONFIG", useValue },
        KafkaProducerService,
        KafkaConsumerService,
      ],
      exports: [KafkaProducerService, KafkaConsumerService],
    };
  }
}
