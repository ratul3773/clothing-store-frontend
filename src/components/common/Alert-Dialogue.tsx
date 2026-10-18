import { Trash2Icon, AlertCircle, CheckCircle } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type ActionType = 'delete' | 'update' | 'confirm' | 'warning';

interface AlertDialogProps {
    title?: string;
    dialogueDescription: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    onCancel?: () => void;
    warningMessage?: React.ReactNode;
    actionType?: ActionType;
    disabled?: boolean;
    size?: "default" | "sm" ;
    confirmButtonText?: string;
}

const getActionConfig = (type: ActionType) => {
  const config: Record<ActionType, { icon: React.ReactNode; bgColor: string; textColor: string; variant: 'destructive' | 'default' }> = {
    delete: {
      icon: <Trash2Icon className="w-6 h-6" />,
      bgColor: 'bg-destructive/10 dark:bg-destructive/20',
      textColor: 'text-destructive dark:text-destructive',
      variant: 'destructive'
    },
    update: {
      icon: <CheckCircle className="w-6 h-6" />,
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
      variant: 'default'
    },
    confirm: {
      icon: <CheckCircle className="w-6 h-6" />,
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400',
      variant: 'default'
    },
    warning: {
      icon: <AlertCircle className="w-6 h-6" />,
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
      textColor: 'text-yellow-600 dark:text-yellow-400',
      variant: 'default'
    }
  };
  return config[type];
};

export default function AlertDialogText({ 
  title = 'Confirm Action',
  open, 
  onOpenChange, 
  onConfirm, 
  onCancel,
  dialogueDescription,
  warningMessage,
  actionType = 'delete',
  size = 'sm',
  confirmButtonText,
  disabled
}: AlertDialogProps) {
  const config = getActionConfig(actionType);
  const defaultButtonText = {
    delete: 'Delete',
    update: 'Update',
    confirm: 'Confirm',
    warning: 'Proceed'
  };

  const buttonText = confirmButtonText || defaultButtonText[actionType];

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent size={size}>
        <AlertDialogHeader>
          <AlertDialogMedia className={`${config.bgColor} ${config.textColor}`}>
            {config.icon}
          </AlertDialogMedia>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {dialogueDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {warningMessage && ( warningMessage
        )}
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline" onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            variant={config.variant} 
            onClick={onConfirm}
            disabled={disabled}
            className={actionType === 'delete' ? 'bg-destructive hover:bg-destructive/90' : ''}
          >
            {buttonText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
