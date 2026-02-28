import * as React from "react"
import { cn } from "@/lib/utils"
import styles from "./button.module.css"

const Button = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & {
        variant?: "default" | "outline" | "ghost" | "link" | "secondary"
        size?: "default" | "sm" | "lg" | "icon"
    }
>(({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
        <button
            ref={ref}
            className={cn(
                styles.button,
                styles[variant],
                styles[`size-${size}`],
                className
            )}
            {...props}
        />
    )
})
Button.displayName = "Button"

export { Button }
