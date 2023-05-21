import { DynamicModule, Module, Global } from "@nestjs/common";
import { InfluxDbService } from "./influxdb.service";
import { InfluxModuleAsyncOptions, InfluxModuleOptions } from "./types";

@Global()
@Module({})
export class InfluxDbModule {
  static forRoot(options: InfluxModuleOptions): DynamicModule {
    return {
      module: InfluxDbModule,
      providers: [
        {
          provide: "INFLUX_DB_OPTIONS",
          useValue: options,
        },
        InfluxDbService,
      ],
      exports: [InfluxDbService],
    };
  }
  static forRootAsync(options: InfluxModuleAsyncOptions): DynamicModule {
    return {
      module: InfluxDbModule,
      providers: [
        {
          provide: "INFLUX_DB_OPTIONS",
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        InfluxDbService,
      ],
      imports: options.imports || [],
      exports: [InfluxDbService],
    };
  }
}
