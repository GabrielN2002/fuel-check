import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash, TriangleAlert } from "lucide-react";
import { Button } from "./ui/button";
import type { Calculator } from "@/types/calculator";

type DestructiveDialogProps = {
  data?: Calculator;
  onAction(): void;
  message?: string;
  title: string;
  action: "Reset" | "Delete" | "Clear";
};

function DestructiveDialog({
  data,
  onAction,
  title,
  message,
  action,
}: DestructiveDialogProps) {
  const isActionDisabled = (): boolean => {
    if (data) {
      return !data?.isStarted;
    } else {
      return false;
    }
  };
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger
          render={
            <Button variant={"destructive"} disabled={isActionDisabled()}>
              {action == "Delete" ? <Trash /> : action}
            </Button>
          }
        />
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
              <TriangleAlert />
            </AlertDialogMedia>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{message}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
            <AlertDialogCancel onClick={onAction} variant="destructive">
              {action}
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default DestructiveDialog;
