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
import { TimerReset } from "lucide-react";
import { Button } from "./ui/button";
import type { Calculator } from "@/types/calculator";

type ResetDialogProps = {
  data: Calculator;
  onReset(): void;
};

function ResetDialog({ data, onReset }: ResetDialogProps) {
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger
          render={<Button disabled={!data.isStarted}>Reset</Button>}
        />
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
              <TimerReset />
            </AlertDialogMedia>
            <AlertDialogTitle>Reset fuel check?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reset all values to their original state and all
              progress will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
            <AlertDialogCancel onClick={onReset} variant="destructive">
              Reset
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default ResetDialog;
