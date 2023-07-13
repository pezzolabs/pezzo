import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { OnEvent } from "@nestjs/event-emitter";
import { KafkaSchemas } from "@pezzo/kafka";
import sgMail, { MailDataRequired } from "@sendgrid/mail";
import { PinoLogger } from "../logger/pino-logger";

export const emailTemplates: Record<keyof KafkaSchemas, string> = {
  "org-invitation-created": "d-a36b6b8076b040ba89aff0dd5bf11936",
};

@Injectable()
export class NotificationsService {
  constructor(private config: ConfigService, private logger: PinoLogger) {
    sgMail.setApiKey(this.config.get("SENDGRID_API_KEY"));
  }

  @OnEvent("org-invitation-created")
  async sendOrgInvitationEmail(data: KafkaSchemas["org-invitation-created"]) {
    const templateId = emailTemplates["org-invitation-created"];

    this.logger.info({ templateId, data }, "Sending org invitation email");

    const mailData: MailDataRequired = {
      to: data.email,
      from: "Pezzo <noreply@pezzo.ai>",
      templateId,
      dynamicTemplateData: {
        ...data,
      },
    };

    await sgMail.send(mailData);
  }
}
