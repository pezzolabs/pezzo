export type SupertokensMetadata = {
  metadata:
    | { profile: { name: string | null; photoUrl: string | null } }
    | undefined;
};
