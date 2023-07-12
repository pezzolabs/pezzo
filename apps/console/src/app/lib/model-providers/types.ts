interface BaseFormField {
  label: string;
  name: string[];
}

export interface SelectFormField extends BaseFormField {
  type: "select";
  defaultValue: string;
  options: {
    value: string;
    label: string;
  }[];
}

export interface SliderFormField extends BaseFormField {
  type: "slider";
  min: number;
  max: number;
  step: number;
}

export type FormField = SelectFormField | SliderFormField;

export type FormSchema = FormField[];
