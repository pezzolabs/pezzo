import { ConfigurableModuleBuilder } from "@nestjs/common";
import { KafkaModuleOptions } from "./kafka.module";

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<KafkaModuleOptions>().setClassMethodName("forRoot").setExtras({
    isGlobal: true
  }, (definition, extras) => ({
    ...definition,
    global: extras.isGlobal
  })).build();
