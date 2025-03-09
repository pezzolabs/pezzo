import { useCopyToClipboard } from "usehooks-ts";
import { trackEvent } from "../../lib/utils/analytics";
import { Button, Card } from "../../../../../libs/ui/src";
import { CopyIcon } from "lucide-react";

interface Props {
  value: string;
}

export const PezzoApiKeyListItem = ({ value }: Props) => {
  const [copied, copy] = useCopyToClipboard();

  const onCopy = () => {
    copy(value);
    trackEvent("organization_api_key_copied");
  };

  return (
    <Card className="mb-4 px-4 py-2" key={value}>
      <div className="flex items-center justify-between">
        <div className="font-mono text-sm">{value}</div>
        <Button variant="ghost" onClick={onCopy}>
          {copied ? "Copied!" : <CopyIcon className="h-4 w-4" />}
        </Button>
      </div>
    </Card>
  );
};
