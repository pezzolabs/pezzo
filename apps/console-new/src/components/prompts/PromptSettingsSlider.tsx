import { Input, Slider } from "@pezzo/ui";
import { ControllerRenderProps, FieldValues } from "react-hook-form";

interface Props {
  min: number;
  max: number;
  step: number;
  value?: number;
  onChange?: (value: number) => void;
  field: ControllerRenderProps<FieldValues, any>;
}

export const PromptSettingsSlider = ({
  min,
  max,
  step,
  value,
  onChange,
  field,
}: Props) => {
  return (
    <div className="flex gap-4 py-2">
      <Slider
        className="flex-1"
        onValueChange={(value) => field.onChange(value[0])}
        value={[field.value]}
        min={min}
        max={max}
        step={step}
      />
      <Input
        step={step}
        type="number"
        min={min}
        max={max}
        size="sm"
        {...field}
        className="w-20"
      />
    </div>
    // <Row>
    //   <Col flex={1}>

    //   </Col>
    //   <Col flex="70px">
    //     <InputNumber
    //       min={min}
    //       max={max}
    //       step={step}
    //       style={{ marginLeft: 16, width: 70 }}
    //       size="small"
    //       value={value}
    //       onChange={onChange}
    //     />
    //   </Col>
    // </Row>
  );
};
