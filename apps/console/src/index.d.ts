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
      message: Identity & {
        event: string;
        properties?: any;
        timestamp?: Date | undefined;
        context?: any;
        integrations?: Integrations | undefined;
      },
      callback?: (err: Error) => void
    ): Analytics;

    /* The page method lets you record page views on your website, along with
       optional extra information about the page being viewed. */
    page(
      message: Identity & {
        category?: string | undefined;
        name?: string | undefined;
        properties?: any;
        timestamp?: Date | undefined;
        context?: any;
        integrations?: Integrations | undefined;
        messageId?: string | undefined;
      },
      callback?: (err: Error) => void
    ): Analytics;

    /* The screen method lets you record whenever a user sees a screen,
       the mobile equivalent of page, in your mobile app, along with
       any properties about the screen. */
    screen(
      message: Identity & {
        name?: string | undefined;
        properties?: any;
        timestamp?: Date | undefined;
        context?: any;
        integrations?: Integrations | undefined;
      },
      callback?: (err: Error) => void
    ): Analytics;

    /* alias is how you associate one identity with another. */
    alias(
      message: Identity & {
        previousId: string | number;
        integrations?: Integrations | undefined;
      },
      callback?: (err: Error) => void
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
