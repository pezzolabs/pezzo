import { usePezzoApiKeys } from "~/graphql/hooks/queries";
import { PezzoApiKeyListItem } from "~/components/api-keys/PezzoApiKeyListItem";
import { ProviderApiKeysList } from "~/components/api-keys/ProviderApiKeysList";

export const OrgApiKeysPage = () => {
  const { pezzoApiKeys } = usePezzoApiKeys();

  return (
    <>
      {pezzoApiKeys && (
        <div className="mb-4">
          <h1 className="mb-2 text-3xl font-semibold">Pezzo API Keys</h1>
          <p className="mb-4">
            Below you can find your Pezzo API key. This API key is provided to
            the Pezzo client when executing prompts.
          </p>
          <div className="max-w-[500px]">
            {pezzoApiKeys.map((item, index) => (
              <PezzoApiKeyListItem key={item.id} value={item.id} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <h1 className="mb-2 text-3xl font-semibold">Provider API Keys</h1>
        <p className="mb-2">
          In order to be able to test your prompts within the Pezzo Console, you
          must provide an API key for each provider you wish to test. This is
          optional.
        </p>

        <ProviderApiKeysList />
      </div>
    </>
  );
};
