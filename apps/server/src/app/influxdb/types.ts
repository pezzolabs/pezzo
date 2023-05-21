import { ModuleMetadata } from "@nestjs/common/interfaces";
import { ClientOptions } from "@influxdata/influxdb-client";

export interface InfluxModuleAsyncOptions
    extends Pick<ModuleMetadata, "imports"> {
    useFactory: (
        ...args: any[]
    ) => Promise<ClientOptions> | ClientOptions;
    inject: any[];
}

export type InfluxModuleOptions = ClientOptions;