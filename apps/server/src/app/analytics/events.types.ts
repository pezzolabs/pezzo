// Event names follow a "{subject}_{action}" pattern
export enum AnalyticsEvents {
  USER_CREATED = 'USER_CREATED',
}

export type AnalyticsPayloads = {
  [AnalyticsEvents.USER_CREATED]: {};
};