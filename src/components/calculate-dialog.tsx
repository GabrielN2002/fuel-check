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
import { Label } from "./ui/label";

type CalculateDialogProps = {
  data: Calculator;
  onCalculate(
    fuelFinal: Calculator["fuelFinal"],
    auxFinal: Calculator["auxFinal"],
  ): void;
};

function CalculateDialog({ data, onCalculate }: CalculateDialogProps) {
  const [fuelFinal, setFuelFinal] = useState<number>(0);
  const [auxFinal, setAuxFinal] = useState<number>(0);

  const handleMainFuel = (e: ChangeEvent<HTMLInputElement>) => {
    setFuelFinal(Number(e.target.value));
  };

  const handleAuxFuel = (e: ChangeEvent<HTMLInputElement>) => {
    setAuxFinal(Number(e.target.value));
  };

  const handleCalculate = () => {
    if (fuelFinal <= 0) return;

    if (fuelFinal > 0) {
      onCalculate(fuelFinal, auxFinal);
      setFuelFinal(0);
      setAuxFinal(0);
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
          </AlertDialogHeader>
          <div className="flex flex-col gap-3">
            <Label htmlFor="finalFuel">Main Tanks</Label>
            <InputGroup>
              <InputGroupInput
                id="finalFuel"
                value={fuelFinal || ""}
                onChange={(e) => handleMainFuel(e)}
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

            {data.auxTank && (
              <>
                <Label htmlFor="auxFuel">Auxiliary Tank</Label>
                <InputGroup>
                  <InputGroupInput
                    value={auxFinal || ""}
                    onChange={(e) => handleAuxFuel(e)}
                    type="number"
                    id="auxFuel"
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
              </>
            )}
          </div>
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
