export {};

declare global {
  class Analytics {
    load(writeKey: string);

    /* The identify method lets you tie a user to their actions and record
       traits about them. */
    identify(
      message: Identity & {
        traits?: any;
        timestamp?: Date | undefined;
        context?: any;
        integrations?: Integrations | undefined;
      },
      callback?: (err: Error) => void
    ): Analytics;

    /* The track method lets you record the actions your users perform. */
    track(
      event: string,
      properties: any,
      context: { groupId: string; projectId?: string }
    ): Analytics;

    /* Group calls can be used to associate individual users with shared
       accounts or companies. */
    group(
      message: Identity & {
        groupId: string | number;
        traits?: any;
        context?: any;
        timestamp?: Date | undefined;
        integrations?: Integrations | undefined;
      },
      callback?: (err: Error) => void
    ): Analytics;

    /* Flush batched calls to make sure nothing is left in the queue */
    flush(
      callback?: (err: Error, data: Data) => void
    ): Promise<{ batch: any; timestamp: string; sentAt: string }>;
  }

  interface Window {
    analytics: Analytics;
  }
}
