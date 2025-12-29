import { Field } from "@tanstack/react-form";
import { FormInput } from "./FormInput";
import { FormSelect } from "./FormSelect";
import { FormTextarea } from "./FormTextArea";
import { FormCheckbox } from "./FormCheckbox";
import { useFormContext } from "./hooks";

const componentMap = {
  Input: FormInput,
  Select: FormSelect,
  Textarea: FormTextarea,
  Checkbox: FormCheckbox,
} as const;

export function FieldWrapper({
  name,
  component,
  validators,
  children,
  onChange, 
  ...props
}: any) {
  const form = useFormContext();
  const Component = componentMap[component as keyof typeof componentMap];

  return (
    <Field 
      // FIX: Cast name to 'any' to bypass the "never" inference error
      name={name as never} 
      validators={validators} 
      form={form}
    >
      {(field: any) => (
        <Component
          {...props}
          id={field.name}
          field={field}
          onFieldChange={onChange} 
        >
          {component === "Select" ? children : null}
        </Component>
      )}
    </Field>
  );
}