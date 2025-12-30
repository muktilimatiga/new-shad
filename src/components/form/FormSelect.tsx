import { FormBase, type FormControlProps } from "./FormBase"
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "../ui/select"
import type { AnyFieldApi } from "@tanstack/react-form"

export function FormSelect({
    items,
    field,
    placeholder,
    onFieldChange, // Receive the side effect
    children,
    ...props
}: FormControlProps & {
    items?: { value: string, label: string }[],
    field: AnyFieldApi,
    onFieldChange?: (val: string) => void
    placeholder?: string
    children?: React.ReactNode
}) {
    const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0;

    return (
        <FormBase {...props} field={field}>
            <Select
                value={field.state.value}
                onValueChange={(val) => {
                    field.handleChange(val);
                    onFieldChange?.(val);
                }}
            >
                <SelectTrigger aria-invalid={isInvalid} id={field.name}>
                    <SelectValue>
                        {field.state.value || <span className="text-muted-foreground">{placeholder}</span>}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {children}
                    {items?.map(item => (
                        <SelectItem key={item.value} value={item.value}>
                            {item.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </FormBase>
    )
}