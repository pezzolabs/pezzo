import { Inject, Injectable } from "@nestjs/common";
import { InfluxDB } from "@influxdata/influxdb-client";
import { ClientOptions } from "@influxdata/influxdb-client";

@Injectable()
export class InfluxDbService {
  connection: InfluxDB | null;

  constructor(
    @Inject("INFLUX_DB_OPTIONS") private readonly clientOptions: ClientOptions
  ) {
    // This must be here for offline GraphQL schema generation to work, until we find
    // a neater solution to mock dependencies.
    const skipInstantiation = process.env.GITHUB_ACTIONS === "true";
    if (!skipInstantiation) {
      this.connection = new InfluxDB(this.clientOptions);
    }
  }

  getWriteApi(org: string, bucket: string) {
    return this.connection.getWriteApi(org, bucket, "ns");
  }

  getQueryApi(org: string) {
    return this.connection.getQueryApi(org);
  }
}
