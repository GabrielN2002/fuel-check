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

import { Button } from "./ui/button";
import type { Calculator } from "@/types/calculator";
import { Fuel } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "./ui/input-group";
import { useState, type ChangeEvent } from "react";

type StartDialogProps = {
  data: Calculator;
  onStart(fuelInitial: Calculator["fuelInitial"]): void;
};

function StartDialog({ data, onStart }: StartDialogProps) {
  const [fuelInitial, setFuelInitial] = useState<number>(0);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFuelInitial(Number(e.target.value));
  };

  const handleStart = () => {
    if (fuelInitial <= 0) return;

    onStart(fuelInitial);
    setFuelInitial(0);
  };

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger
          render={<Button>{data.isStarted ? "Restart" : "Start"}</Button>}
        />
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia>
              <Fuel />
            </AlertDialogMedia>
            <AlertDialogTitle>Initial Fuel</AlertDialogTitle>
            <AlertDialogDescription>
              Enter initial fuel reading in lbs
            </AlertDialogDescription>
            <InputGroup>
              <InputGroupInput
                value={fuelInitial || ""}
                onChange={(e) => handleInputChange(e)}
                type="number"
                id="initialFuel"
                autoComplete="off"
                placeholder="0 lbs"
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText>
                  {data.isStarted &&
                    `Start: ${data.startTime?.toLocaleTimeString()}`}
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
            <AlertDialogCancel
              disabled={fuelInitial <= 0}
              onClick={handleStart}
              variant="default"
            >
              {data.isStarted ? "Restart" : "Start"}
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default StartDialog;
