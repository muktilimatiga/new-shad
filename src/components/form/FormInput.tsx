import type { ComponentProps } from "react"
import { Input } from "../ui/input"
import { FormBase, type FormControlProps } from "./FormBase"

// Fixed: Revert field to 'any' to avoid the "23 arguments" error
type FormInputProps = FormControlProps & ComponentProps<"input"> & {
    field: any
    onFieldChange?: (val: any) => void
}

export function FormInput({
    label,
    description,
    disabled,
    field,
    onFieldChange,
    className,
    ...props
}: FormInputProps) {
    const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0;

    return (
        <FormBase label={label} description={description} disabled={disabled} field={field}>
            <Input
                {...props}
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={e => {
                    // 1. TanStack Logic
                    field.handleChange(e.target.value);
                    // 2. Optional Side Effect (from FieldWrapper)
                    onFieldChange?.(e.target.value);
                }}
                aria-invalid={isInvalid}
                disabled={disabled}
                className={className} 
            />
        </FormBase>
    )
}