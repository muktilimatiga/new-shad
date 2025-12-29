
import { FormBase, type FormControlProps } from "./FormBase"
import { Checkbox } from "../ui/checkbox"
import type { AnyFieldApi } from "@tanstack/react-form"

export function FormCheckbox({ field, ...props }: FormControlProps & { field: AnyFieldApi }) {
  // Remove useFieldContext
  // const contextField = useFieldContext<boolean>()
  // const field = propField || contextField
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <FormBase {...props} controlFirst horizontal field={field}>
      <Checkbox
        id={field.name}
        name={field.name}
        checked={field.state.value}
        onBlur={field.handleBlur}
        onCheckedChange={e => field.handleChange(e === true)}
        aria-invalid={isInvalid}
      />
    </FormBase>
  )
}