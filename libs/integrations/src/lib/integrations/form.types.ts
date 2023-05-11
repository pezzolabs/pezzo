interface BaseFormField {
  label: string;
  name: string[];
}

interface SelectFormField extends BaseFormField {
  type: 'select';
  defaultValue: string;
  options: {
    value: string;
    label: string;
  }[];
}

interface SliderFormField extends BaseFormField {
  type: 'slider';
  min: number;
  max: number;
  step: number;
}

type FormField = SelectFormField | SliderFormField;

export type FormSchema = FormField[];