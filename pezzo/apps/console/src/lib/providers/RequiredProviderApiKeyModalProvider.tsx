import { createContext, useContext, useRef, useState } from "react";
import { useProviderApiKeys } from "src/graphql/hooks/queries";
import { ProviderApiKeyListItem } from "src/components/api-keys/ProviderApiKeyListItem";
import { trackEvent } from "../utils/analytics";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "pezzo/libs/ui/src";

enum Reason {
  prompt_tester,
}

interface OpenRequiredProviderApiKeyModalOptions {
  callback: () => void;
  provider: "OpenAI";
  reason: keyof typeof Reason;
}

interface RequiredProviderApiKeyModalContextValue {
  openRequiredProviderApiKeyModal: (
    options?: OpenRequiredProviderApiKeyModalOptions
  ) => void;
  closeRequiredProviderApiKeyModal: () => void;
}

const RequiredProviderApiKeyModalContext =
  createContext<RequiredProviderApiKeyModalContextValue>({
    openRequiredProviderApiKeyModal: () => void 0,
    closeRequiredProviderApiKeyModal: () => void 0,
  });

export const useRequiredProviderApiKeyModal = () =>
  useContext(RequiredProviderApiKeyModalContext);

export const RequiredProviderApiKeyModalProvider = ({ children }) => {
  const reasonRef = useRef<keyof typeof Reason>(null);
  const callbackRef = useRef(null);

  const { providerApiKeys } = useProviderApiKeys();
  const [open, setOpen] = useState(false);

  const openRequiredProviderApiKeyModal = (
    options: OpenRequiredProviderApiKeyModalOptions
  ) => {
    setOpen(true);
    trackEvent("provider_api_keys_modal_opened", {
      provider: options.provider,
      reason: options.reason,
    });

    callbackRef.current = options.callback;
    reasonRef.current = options.reason;
  };

  const closeRequiredProviderApiKeyModal = (cancel = false) => {
    setOpen(false);

    if (cancel) {
      trackEvent("provider_api_keys_modal_canceled", {
        reason: reasonRef.current,
      });
    } else {
      callbackRef.current();
    }

    callbackRef.current = null;
    reasonRef.current = null;
  };

  const value = {
    openRequiredProviderApiKeyModal,
    closeRequiredProviderApiKeyModal,
  };

  const key =
    providerApiKeys?.find((key) => key.provider === "OpenAI") ?? undefined;

  return (
    <RequiredProviderApiKeyModalContext.Provider value={value}>
      <Dialog open={open}>
        <DialogContent
          onPointerDownOutside={() => setOpen(false)}
          className="text-sm"
        >
          <DialogHeader>
            <DialogTitle>API Key Required</DialogTitle>
          </DialogHeader>
          <p>
            In order to test your prompts within the Pezzo Console, you must
            provide an OpenAI API key.
          </p>
          <ProviderApiKeyListItem
            provider={"OpenAI"}
            value={key?.censoredValue}
            initialIsEditing={true}
            canCancelEdit={false}
            onSave={closeRequiredProviderApiKeyModal}
          />

          <div className="border-b border-muted" />

          <Accordion type="multiple" className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                How do I get an OpenAI API key?
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col space-y-4">
                  <p>
                    We recommend creating a new API key specifically for the
                    Pezzo. This way, you can always revoke it if you need to.
                  </p>
                  <p>
                    <a
                      href="https://platform.openai.com/account/api-keys"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary underline"
                    >
                      Click here to create a new OpenAI API key.
                    </a>
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                How does Pezzo securely store my API keys?
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col space-y-4">
                  <p>
                    All API keys stored on Pezzo are encrypted using AES-256
                    with a unique data key, generated per API key, using a
                    master key stored and rotated regularly on AWS KMS. This
                    technique is also called{" "}
                    <a
                      href="https://en.wikipedia.org/wiki/Key_encapsulation_mechanism"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary underline"
                    >
                      Key Encapsulation
                    </a>
                    .
                  </p>
                  <p>
                    Even in the event of a data breach, your API keys are safe.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                Can I later delete my API key?
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col space-y-4">
                  <p>
                    Yes. You can view and manage all API keys for your
                    organization by navigating to your Organization page, and
                    then to the API Keys view.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </DialogContent>
      </Dialog>
      {children}
    </RequiredProviderApiKeyModalContext.Provider>
  );
};
