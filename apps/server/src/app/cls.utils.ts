import cls, { createNamespace } from "cls-hooked";

export const CLS_NAMESPACE = "_PEZZO_CONTEXT";
export const CLS_CONTEXT_KEY = "_PEZZO_KEY";

interface RequestContext {
  traceId: string;
  appName: string;
  methodName?: string;
  userId?: string;
  organizationId?: string;
  projectId?: string;
  promptId?: string;
}

const createTraceId = (): string => new Date().getTime().toString();

createNamespace(CLS_NAMESPACE);

export const namespace = cls.getNamespace(CLS_NAMESPACE) as cls.Namespace;

// eslint-disable-next-line @typescript-eslint/ban-types
export const initRequestWithContext = <Func extends Function>(
  func: Func,
  additionalContext?: Partial<RequestContext>
): Func => {
  const traceId = createTraceId();
  const requestContext = { traceId, appName: "main", ...additionalContext };
  return namespace.bind(func, { [CLS_CONTEXT_KEY]: requestContext });
};

export const getRequestContext = (): RequestContext => {
  return namespace.get(CLS_CONTEXT_KEY) || {};
};

export const setRequestContext = (context: RequestContext): void => {
  if (namespace.active) {
    namespace.set(CLS_CONTEXT_KEY, context);
  }
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const bindRequestContext = <Func extends Function>(
  requestContext: Partial<RequestContext>,
  func: Func
): Func => {
  return namespace.bind(func, { [CLS_CONTEXT_KEY]: requestContext });
};

export const updateRequestContext = (
  context: Partial<RequestContext>
): void => {
  const currentContext = getRequestContext();
  setRequestContext({ ...currentContext, ...context });
};

export const runWithRequestContext = <T>(
  requestContext: Partial<RequestContext>,
  func: () => Promise<T>
): Promise<T> => {
  updateRequestContext(requestContext);
  return func();
};
