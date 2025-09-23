import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
    text?: string;
    className?: string;
}

export function LoadingSpinner({ text, className }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <div className="spinner-container">
        <div className="spinner-ball"></div>
        <div className="spinner-ball"></div>
        <div className="spinner-ball"></div>
      </div>
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  );
}
