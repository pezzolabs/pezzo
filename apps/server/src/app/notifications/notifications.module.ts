import { Module } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";

@Module({
  providers: [NotificationsService],
})
export class NotificationsModule {}
