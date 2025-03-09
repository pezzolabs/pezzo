import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
  Input,
} from "@pezzo/ui";
import { useCallback, useMemo, useState } from "react";
import { FilterInput, FilterOperator } from "~/@generated/graphql/graphql";
import {
  FILTER_FIELDS_LIST,
  NUMBER_FILTER_OPERATORS,
  STRING_FILTER_OPERATORS,
} from "~/lib/constants/filters";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, PlusIcon, XIcon } from "lucide-react";

interface Props {
  onRemoveFilter: () => void;
  field: string;
  operator: string;
  value: string;
  property?: string;
}

export const FilterItem = ({
  field,
  operator,
  value,
  onRemoveFilter,
}: Props) => {
  const translatedField = useMemo(() => {
    const found = FILTER_FIELDS_LIST.find((f) => f.value === field);
    return found?.label.toLocaleLowerCase();
  }, [field]);

  return (
    <div className="flex items-center gap-1 rounded-md border border-primary px-2 py-1 text-sm">
      <div>{translatedField}</div>
      <div>{operator}</div>
      <div>{value}</div>
      <button onClick={onRemoveFilter}>
        <XIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

const formSchema = z.object({
  field: z.string().min(1).max(100),
  operator: z.nativeEnum(FilterOperator),
  value: z.string().min(1).max(100),
  // property: z.string().min(1).max(100).optional(),
});

export const AddFilterForm = ({
  onAdd,
  onCancel,
}: {
  onAdd: (input: FilterInput) => void;
  onCancel: () => void;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      field: "",
      operator: FilterOperator.Eq,
      value: "",
      // property: undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const filterValue: FilterInput = {
      field: values.field,
      operator: values.operator,
      value: values.value,
    };

    onAdd(filterValue);
    form.reset();
  };

  const formValues = form.watch();
  const { field } = formValues;
  const selectedFilterField = FILTER_FIELDS_LIST.find(
    (fieldInList) => fieldInList.value === field
  );

  const isFormValid = form.formState.isValid;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-2 text-sm font-semibold">Add Filter</div>
        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="field"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Field" />
                    </SelectTrigger>
                    <SelectContent>
                      {FILTER_FIELDS_LIST.map((field) => (
                        <SelectItem
                          key={field.value}
                          value={field.value}
                          {...field}
                        >
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          {/* {form.watch("field") === "property" && (
            <FormField
              control={form.control}
              name="property"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Property name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          )} */}
          <FormField
            control={form.control}
            name="operator"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(selectedFilterField?.type === "string"
                        ? STRING_FILTER_OPERATORS
                        : NUMBER_FILTER_OPERATORS
                      ).map((operator) => (
                        <SelectItem
                          key={operator.value}
                          value={operator.value}
                          {...operator}
                        >
                          {operator.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Value" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button size="icon" type="submit" disabled={!isFormValid}>
            <CheckIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            type="button"
            onClick={onCancel}
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
};

export const AddFilterItem = ({
  onAdd,
}: {
  onAdd: (input: FilterInput) => void;
}) => {
  const [addFormOpen, setAddFormOpen] = useState(false);

  const handleAdd = useCallback(
    (filter: FilterInput) => {
      onAdd(filter);
      setAddFormOpen(false);
    },
    [onAdd]
  );

  if (addFormOpen) {
    return (
      <AddFilterForm onAdd={handleAdd} onCancel={() => setAddFormOpen(false)} />
    );
  }
  return (
    <Button size="sm" className="w-24" onClick={() => setAddFormOpen(true)}>
      <PlusIcon className="mr-2 h-4 w-4" /> Add Filter
    </Button>
  );
};
