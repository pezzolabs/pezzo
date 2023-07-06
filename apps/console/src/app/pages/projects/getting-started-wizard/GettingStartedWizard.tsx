import { Steps, Typography } from "antd";
import { ProgrammingLanguageSelector } from "./ProgrammingLanguageSelector";
import { ProviderSelector } from "./ProviderSelector";
import { useGettingStartedWizard } from "../../../lib/providers/GettingStartedWizardProvider";
import { IntegrateTutorial } from "./IntegrateTutorial";
import { UsageSelector } from "./UsageSelector";

export const GettingStartedWizard = () => {
  const { currentStep } = useGettingStartedWizard();

  return (
    <>
      <Typography.Title level={2} style={{ marginTop: 24 }}>
        Getting started
      </Typography.Title>
      <Steps
        direction="vertical"
        current={currentStep}
        items={[
          {
            title: "Select provider",
            description: currentStep >= 0 && (
              <div>
                <Typography.Paragraph type="secondary">
                  Select the provider you want to integrate with.
                </Typography.Paragraph>
                <ProviderSelector />
              </div>
            ),
          },
          {
            title: "Select language",
            description: currentStep >= 1 && (
              <div>
                <Typography.Paragraph type="secondary">
                  Select the programming language you are using for your
                  project.
                </Typography.Paragraph>
                <ProgrammingLanguageSelector />
              </div>
            ),
          },
          {
            title: "How do you want to use Pezzo?",
            description: currentStep >= 2 && (
              <div>
                <Typography.Paragraph type="secondary">
                  You can always change your mind.
                </Typography.Paragraph>
                <UsageSelector />
              </div>
            ),
          },
          {
            title: "Integrate",
            description: currentStep >= 3 && (
              <div>
                <Typography.Paragraph type="secondary">
                  Integrate Pezzo into your project in just a minute.
                </Typography.Paragraph>
                <IntegrateTutorial />
              </div>
            ),
          },
        ]}
      />
    </>
  );
};
