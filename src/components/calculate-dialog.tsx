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

type CalculateDialogProps = {
  data: Calculator;
  onCalculate(fuelFinal: Calculator["fuelFinal"]): void;
};

function CalculateDialog({ data, onCalculate }: CalculateDialogProps) {
  const [fuelFinal, setFuelFinal] = useState<number>(0);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFuelFinal(Number(e.target.value));
  };

  const handleCalculate = () => {
    if (fuelFinal <= 0) return;

    if (fuelFinal > 0) {
      onCalculate(fuelFinal);
      setFuelFinal(0);
    }
  };

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger
          render={<Button disabled={!data.isStarted}>Calculate</Button>}
        />
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia>
              <Fuel />
            </AlertDialogMedia>
            <AlertDialogTitle>Final Fuel</AlertDialogTitle>
            <AlertDialogDescription>
              Enter final fuel reading in lbs
            </AlertDialogDescription>
            <InputGroup>
              <InputGroupInput
                value={fuelFinal || ""}
                onChange={(e) => handleInputChange(e)}
                type="number"
                autoComplete="off"
                placeholder="0 lbs"
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText>
                  {data.stopTime &&
                    `Stop: ${data.stopTime?.toLocaleTimeString()}`}
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
            <AlertDialogCancel
              disabled={fuelFinal <= 0}
              onClick={handleCalculate}
              variant="default"
            >
              Calculate
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default CalculateDialog;
