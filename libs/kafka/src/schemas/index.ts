import { OrgRole } from "@prisma/client";

type SchemaWithKey = {
  key: string;
};

export type KafkaSchemas = {
  "org-invitation-created": SchemaWithKey & {
    invitationUrl: string;
    invitationId: string;
    organizationId: string;
    organizationName: string;
    email: string;
    role: OrgRole;
  };
};
