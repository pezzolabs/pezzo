import { useParams } from "react-router-dom";
import { useDataset } from "../../graphql/hooks/queries";
import { Card } from "antd";

export const DatasetPage = () => {
  const { datasetId } = useParams();
  const { dataset } = useDataset(datasetId);

  const renderData = () => {
    const { data } = dataset;
    return (
      <>
      Dataset size: {data.length}
      <pre>{JSON.stringify(data, null, 2)}</pre>
      </>
    )
  }

  return dataset && (
    <>
      <h3>{dataset.name}</h3>

      <h4>Data</h4>
      <Card>
        {renderData()}
      </Card>
    </>
  )
}