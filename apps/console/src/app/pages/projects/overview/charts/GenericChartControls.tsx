import { Col, Radio, Row, Select } from "antd";
import { Granularity } from "../../../../../@generated/graphql/graphql";

export const GenericChartControls = () => {
  return (
    <Row style={{ marginBottom: 18 }}>
      <Col span={12}>
        <Select
          defaultValue="-7d"
          style={{ width: 140 }}
          // onSelect={onTimeRangeChange}
        >
          <Select.Option value="-1h">Past Hour</Select.Option>
          <Select.Option value="-1d">Past Day</Select.Option>
          <Select.Option value="-7d">Past 7 days</Select.Option>
          <Select.Option value="-30d">Past 30 days</Select.Option>
          <Select.Option value="-1y">Past year</Select.Option>
        </Select>
      </Col>
      <Col span={12} style={{ display: "flex", justifyContent: "flex-end" }}>
        <Radio.Group
          value={Granularity.Day}
          // onChange={(e) => onGranularityChange(e.target.value)}
        >
          <Radio.Button value={Granularity.Hour}>Hour</Radio.Button>
          <Radio.Button value={Granularity.Day}>Day</Radio.Button>
          <Radio.Button value={Granularity.Week}>Week</Radio.Button>
          <Radio.Button value={Granularity.Month}>Month</Radio.Button>
        </Radio.Group>
      </Col>
    </Row>
  );
};
