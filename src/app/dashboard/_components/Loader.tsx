import { cn } from "@/lib/utils";
import * as React from "react";

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: "sm" | "md" | "lg";
    variant?: "primary" | "secondary" | "white";
}

function Loader({
    className,
    size = "md",
    variant = "primary",
    ...props
}: LoaderProps) {
    return (
        <div
            className={cn(
                "inline-flex items-center justify-center",
                {
                    "h-4 w-4": size === "sm",
                    "h-6 w-6": size === "md",
                    "h-8 w-8": size === "lg",
                },
                className
            )}
            {...props}
        >
            <svg
                className={cn(
                    "animate-spin",
                    {
                        "text-indigo-600": variant === "primary",
                        "text-gray-600": variant === "secondary",
                        "text-white": variant === "white",
                    }
                )}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                ></circle>
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
            </svg>
            <span className="sr-only">Loading...</span>
        </div>
    );
}

export { Loader };