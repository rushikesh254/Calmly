import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Variant-driven class generator for the Alert component.
 * Keeps visual styles consistent across different alert states.
 */
const alertStyles = cva(
	"relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
	{
		variants: {
			variant: {
				default: "bg-background text-foreground",
				destructive:
					"border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive bg-destructive/10 dark:bg-destructive/20",
				success:
					"border-green-500/50 text-green-700 dark:text-green-300 [&>svg]:text-green-600 dark:[&>svg]:text-green-400 bg-green-50 dark:bg-green-900/20",
				warning:
					"border-yellow-500/50 text-yellow-700 dark:text-yellow-300 [&>svg]:text-yellow-600 dark:[&>svg]:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20",
				info: "border-blue-500/50 text-blue-700 dark:text-blue-300 [&>svg]:text-blue-600 dark:[&>svg]:text-blue-400 bg-blue-50 dark:bg-blue-900/20",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	}
);

/**
 * Base alert container.
 */
const Alert = React.forwardRef(
	({ className, variant, ...props }, forwardedRef) => (
		<div
			ref={forwardedRef}
			role="alert"
			className={cn(alertStyles({ variant }), className)}
			{...props}
		/>
	)
);
Alert.displayName = "Alert";

/**
 * Alert title text.
 */
const AlertTitle = React.forwardRef(({ className, ...props }, forwardedRef) => (
	<h5
		ref={forwardedRef}
		className={cn("mb-1 font-medium leading-none tracking-tight", className)}
		{...props}
	/>
));
AlertTitle.displayName = "AlertTitle";

/**
 * Alert description/body text.
 */
const AlertDescription = React.forwardRef(
	({ className, ...props }, forwardedRef) => (
		<div
			ref={forwardedRef}
			className={cn("text-sm [&_p]:leading-relaxed", className)}
			{...props}
		/>
	)
);
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
