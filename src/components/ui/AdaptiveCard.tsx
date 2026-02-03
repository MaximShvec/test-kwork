import * as React from "react"
import { cn } from "@/lib/utils"

export interface AdaptiveCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost';
  adaptive?: boolean;
}


const AdaptiveCard = React.forwardRef<HTMLDivElement, AdaptiveCardProps>(
  ({ className, variant = 'default', adaptive = true, ...props }, ref) => {
    const variantClasses = {
      default: "rounded-lg border bg-card text-card-foreground shadow-sm",
      elevated: "rounded-lg border-0 bg-card text-card-foreground shadow-lg",
      outlined: "rounded-lg border-2 border-accent bg-card text-card-foreground shadow-none",
      ghost: "rounded-lg border-0 bg-transparent text-card-foreground shadow-none"
    };

    return (
      <div
        ref={ref}
        className={cn(
          variantClasses[variant],
          className
        )}
        {...props}
      />
    );
  }
);
AdaptiveCard.displayName = "AdaptiveCard";

const AdaptiveCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-adaptive-small card-adaptive", className)}
    {...props}
  />
));
AdaptiveCardHeader.displayName = "AdaptiveCardHeader";

const AdaptiveCardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-adaptive-card font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
AdaptiveCardTitle.displayName = "AdaptiveCardTitle";

const AdaptiveCardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-adaptive-ui-small text-muted-foreground", className)}
    {...props}
  />
));
AdaptiveCardDescription.displayName = "AdaptiveCardDescription";

const AdaptiveCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("card-adaptive pt-0", className)} {...props} />
));
AdaptiveCardContent.displayName = "AdaptiveCardContent";

const AdaptiveCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center card-adaptive pt-0", className)}
    {...props}
  />
));
AdaptiveCardFooter.displayName = "AdaptiveCardFooter";

export { 
  AdaptiveCard, 
  AdaptiveCardHeader, 
  AdaptiveCardFooter, 
  AdaptiveCardTitle, 
  AdaptiveCardDescription, 
  AdaptiveCardContent 
};
