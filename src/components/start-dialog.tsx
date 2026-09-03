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
import { Switch } from "./ui/switch";

type StartDialogProps = {
  data: Calculator;
  onStart(
    fuelInitial: Calculator["fuelInitial"],
    auxTank: Calculator["auxTank"],
    auxInitial: Calculator["auxInitial"],
  ): void;
};

function StartDialog({ data, onStart }: StartDialogProps) {
  const [fuelInitial, setFuelInitial] = useState<number>(0);
  const [auxTank, setAuxtank] = useState<boolean>(false);
  const [auxInitial, setAuxInitial] = useState<number>(0);
  const isStartDisabled = fuelInitial <= 0 || (auxTank && auxInitial <= 0);

  const handleMainFuel = (e: ChangeEvent<HTMLInputElement>) => {
    setFuelInitial(Number(e.target.value));
  };
  const handleAuxFuel = (e: ChangeEvent<HTMLInputElement>) => {
    setAuxInitial(Number(e.target.value));
  };
  const handleCheckedChange = () => {
    setAuxtank(() => {
      setAuxInitial(0);
      return !auxTank;
    });
  };

  const handleStart = () => {
    if (isStartDisabled) return;

    onStart(fuelInitial, auxTank, auxInitial);
    setFuelInitial(0);
    setAuxtank(false);
    setAuxInitial(0);
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
          </AlertDialogHeader>
          <div className="flex flex-col gap-3">
            <Label htmlFor="initialFuel">Main Tanks</Label>
            <InputGroup>
              <InputGroupInput
                value={fuelInitial || ""}
                onChange={(e) => handleMainFuel(e)}
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
            <div className="flex gap-3">
              <Switch
                checked={auxTank}
                onCheckedChange={handleCheckedChange}
                id="auxTank"
              ></Switch>
              <Label htmlFor="auxTank">Auxiliary Tank</Label>
            </div>

            {auxTank && (
              <>
                <Label htmlFor="auxFuel">Auxiliary Tank</Label>
                <InputGroup>
                  <InputGroupInput
                    value={auxInitial || ""}
                    onChange={(e) => handleAuxFuel(e)}
                    type="number"
                    id="auxFuel"
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
              </>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
            <AlertDialogCancel
              disabled={isStartDisabled}
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
