import * as React from "react"
import { cn } from "@/lib/utils"
import styles from "./badge.module.css"

function Badge({ className, variant = "default", ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "secondary" | "outline" | "featured" }) {
    return (
        <div
            className={cn(
                styles.badge,
                styles[variant],
                className
            )}
            {...props}
        />
    )
}

export { Badge }
