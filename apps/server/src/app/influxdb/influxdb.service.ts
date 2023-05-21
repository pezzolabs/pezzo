import { Inject, Injectable } from "@nestjs/common";
import { InfluxDB } from "@influxdata/influxdb-client";
import { ClientOptions } from "@influxdata/influxdb-client";

@Injectable()
export class InfluxDbService {
  connection: InfluxDB | null;

  constructor(@Inject("INFLUX_DB_OPTIONS") private readonly config: ClientOptions) {
    this.connection = new InfluxDB(this.config);
  }

  getWriteApi(org: string, bucket: string) {
    return this.connection.getWriteApi(org, bucket, "ns");
  }

  getQueryApi(org: string) {
    return this.connection.getQueryApi(org);
  }
}