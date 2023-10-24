import { Collapse, Divider, Modal, Space, Typography } from "antd";
import { createContext, useContext, useRef, useState } from "react";
import { useProviderApiKeys } from "~/graphql/hooks/queries";
import { ProviderApiKeyListItem } from "~/components/api-keys/ProviderApiKeyListItem";
import { trackEvent } from "../utils/analytics";

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
      <Modal
        width={600}
        open={open}
        closable={false}
        cancelText={"Cancel"}
        okButtonProps={{ style: { display: "none" } }}
        title={`API Key Required`}
        onCancel={() => closeRequiredProviderApiKeyModal(true)}
      >
        <Space direction="vertical">
          <Typography.Paragraph>
            In order to test your prompts within the Pezzo Console, you must
            provide an OpenAI API key.
          </Typography.Paragraph>

          <ProviderApiKeyListItem
            provider={"OpenAI"}
            value={key?.censoredValue}
            initialIsEditing={true}
            canCancelEdit={false}
            onSave={closeRequiredProviderApiKeyModal}
          />

          <Divider />

          <Collapse
            items={[
              {
                key: "1",
                label: "How to create an OpenAI API key",
                children: (
                  <>
                    <Typography.Paragraph>
                      We recommend creating a new API key specifically for the
                      Pezzo. This way, you can always revoke it if you need to.
                    </Typography.Paragraph>
                    <Typography.Paragraph>
                      <a
                        href="https://platform.openai.com/account/api-keys"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Click here to create a new OpenAI API key.
                      </a>
                    </Typography.Paragraph>
                  </>
                ),
              },
              {
                key: "2",
                label: "How Pezzo securely stores your API keys",
                children: (
                  <>
                    All API keys stored on Pezzo are encrypted using AES-256
                    with a unique data key, generated per API key, using a
                    master key stored and rotated regularly on AWS KMS. This
                    technique is also called{" "}
                    <a
                      href="https://en.wikipedia.org/wiki/Key_encapsulation_mechanism"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Key Encapsulation
                    </a>
                    . Even in the event of a data breach, your API keys are
                    safe.
                  </>
                ),
              },
              {
                key: "3",
                label: "Can I later delete my API key?",
                children: (
                  <>
                    Yes. You can view and manage all API keys for your
                    organization by navigation to your Organization page, and
                    then to the API Keys view.
                  </>
                ),
              },
            ]}
          ></Collapse>
        </Space>
      </Modal>

      {children}
    </RequiredProviderApiKeyModalContext.Provider>
  );
};
