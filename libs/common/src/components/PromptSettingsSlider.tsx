import React from 'react';
import { Slider, Row, Col, InputNumber } from "antd";

interface Props {
  min: number;
  max: number;
  step: number;
  value?: number;
  onChange?: (value: number) => void;
}

export const PromptSettingsSlider = ({
  min,
  max,
  step,
  value,
  onChange,
}: Props) => {
  return (
    <Row>
      <Col flex={1}>
        <Slider
          min={min}
          max={max}
          step={step}
          style={{ marginTop: 4 }}
          value={value}
          onChange={onChange}
        />
      </Col>
      <Col flex="70px">
        <InputNumber
          min={min}
          max={max}
          step={step}
          style={{ marginLeft: 16, width: 70 }}
          size="small"
          value={value}
          onChange={onChange}
        />
      </Col>
    </Row>
  );
};
