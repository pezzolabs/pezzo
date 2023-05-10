import { Settings as AI21Settings } from './integrations/settings/ai21';

interface Props {
  integrationId: string;
}

export const PromptSettings = ({ integrationId }: Props) => {
  switch(integrationId) {
    case 'ai21':
      return <AI21Settings />;
  } 
};
