import { TypeScriptOpenAIIntegrationTutorial } from "../getting-started-wizard/TypeScriptOpenAIIntegrationTutorial";
import { useState } from "react";
import { PythonOpenAIIntegrationTutorial } from "../getting-started-wizard/PythonOpenAIIntegrationTutorial";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@pezzo/ui";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const ConsumePromptModal = ({ open, onClose }: Props) => {
  const [integration, setIntegration] = useState("typescript");

  const renderInsructions = () => {
    switch (integration) {
      case "typescript":
        return <TypeScriptOpenAIIntegrationTutorial />;
      case "python":
        return <PythonOpenAIIntegrationTutorial />;
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent onPointerDownOutside={onClose} className="max-w-[800px]">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center justify-between pr-8">
              <div className="flex-1">How to consume</div>

              <div className="w-[300px]">
                <Select value={integration} onValueChange={setIntegration}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="typescript">TypeScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="w-full overflow-x-hidden">{renderInsructions()}</div>
      </DialogContent>
    </Dialog>
  );
};
