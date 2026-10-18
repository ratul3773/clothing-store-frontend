import { AlertCircle,AlertTriangle } from "lucide-react";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "../ui/alert";

interface AlertProps {
    variant?: 'default' | 'destructive' | 'warning';
    className?: string;
    title?: string;
    showCrossIcon?: boolean;
    description?: string | React.ReactNode;
    setSubmitError? : (error: string) => void; // Optional prop to set the error state
}

export default function AlertText({ variant = 'destructive', className, title, description, setSubmitError, showCrossIcon = true }: AlertProps) {
    return (
        <Alert variant={variant} className={`mt-2 max-w-2xl ${className}`}>
              {variant === 'warning' ? (
                <AlertTriangle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertTitle>{title}</AlertTitle>
              <AlertDescription>{description}</AlertDescription>
              {showCrossIcon && (
                <AlertAction onClick={() => setSubmitError && setSubmitError('')} >
                </AlertAction>
              )}
        </Alert>
    );
}