import { version } from '@pezzo/common';
import { InlineCodeSnippet } from '../components/common/InlineCodeSnippet';

const InfoPage = () => {
  return (
    <>
      <strong>Version:</strong>  <InlineCodeSnippet>{version}</InlineCodeSnippet> 
    </>
  )
};

export default InfoPage;