import { usePezzoApiKeys } from "~/graphql/hooks/queries";
import { PezzoApiKeyListItem } from "~/components/api-keys/PezzoApiKeyListItem";
import { ProviderApiKeysList } from "~/components/api-keys/ProviderApiKeysList";
import { Card } from "@pezzo/ui";

export const OrgApiKeysPage = () => {
  const { pezzoApiKeys } = usePezzoApiKeys();

  return (
    <>
      <div className="mb-6 border-b border-b-border">
        <div className="container flex h-24 items-center">
          <h1>API Keys</h1>
        </div>
      </div>

      <div className="container space-y-6">
        <Card className="mx-auto flex flex-col gap-y-6 p-10">
          <section>
            <h2>Pezzo API Keys</h2>
            <p className="mt-2 opacity-60">
              Below you can find your Pezzo API key. This API key is provided to
              the Pezzo Client when executing prompts.
            </p>

            <div className="mt-4 max-w-[500px]">
              {pezzoApiKeys?.map((item, index) => (
                <PezzoApiKeyListItem key={item.id} value={item.id} />
              ))}
            </div>
          </section>
        </Card>

        <Card className="mx-auto flex flex-col gap-y-6 p-10">
          <section>
            <h2>Provider API Keys</h2>
            <p className="mt-2 opacity-60">
              In order to be able to test your prompts within the Pezzo Console,
              you must provide an API key for each provider you wish to test.
              This is optional.
            </p>

            <div className="mt-4 max-w-[500px]">
              <ProviderApiKeysList />
            </div>
          </section>
        </Card>
      </div>
    </>
  );
};
