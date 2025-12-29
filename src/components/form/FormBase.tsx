import { cn } from "~/lib/utils"
import { Label } from "../ui/label"
// 1. Add 'disabled' to the shared props
export type FormControlProps = {
    label?: string
    description?: string
    disabled?: boolean
}

export function FormBase({ children, label, description, field, className }: any) {
    const error = field.state.meta.isTouched ? field.state.meta.errors[0] : null;

    return (
        <div className={cn("space-y-2", className)}>
            {label && (
                <Label 
                    htmlFor={field.name} 
                    className={error ? "text-destructive" : ""}
                >
                    {label}
                </Label>
            )}
            
            {children}
            
            {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
            )}
            
            {error && (
                <p className="text-sm font-medium text-destructive">
                    {String(error)}
                </p>
            )}
        </div>
    )
}