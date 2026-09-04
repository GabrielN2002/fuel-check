import { useEffect, useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import CalculatorResults from "@/components/calculator-results";
import type { Calculator } from "./types/calculator";
import StopWatch from "./components/stop-watch";
import ResetDialog from "./components/reset-dialog";
import StartDialog from "./components/start-dialog";
import CalculateDialog from "./components/calculate-dialog";
import { useRegisterSW } from "virtual:pwa-register/react";
import { Button } from "./components/ui/button";
import NetworkStatus from "./components/network-status";
import ResultHistory from "./components/result-history";
import { APP_VERSION } from "./utils/version";

const STORAGE_KEY = "calculator";

const initialCalculator: Calculator = {
  startTime: null,
  stopTime: null,
  fuelInitial: 0,
  fuelFinal: 0,
  isStarted: false,
  burnRate: 0,
  timeToBO: 0,
  boTime: null,
  boVFR: null,
  boIFR: null,
  auxTank: false,
  auxInitial: 0,
  auxFinal: 0,
  error: "",
};

function restoreDate(value: unknown): Date | null {
  if (typeof value !== "string") return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function loadHistory(): Calculator[] {
  const savedHistory = localStorage.getItem("history");

  if (!savedHistory) {
    return [];
  }

  try {
    const parsed = JSON.parse(savedHistory);

    if (!Array.isArray(parsed)) {
      throw new Error("Stored history is not an array");
    }

    return parsed.map((item) => ({
      ...initialCalculator,
      ...item,
      startTime: restoreDate(item.startTime),
      stopTime: restoreDate(item.stopTime),
      boTime: restoreDate(item.boTime),
      boVFR: restoreDate(item.boVFR),
      boIFR: restoreDate(item.boIFR),
    }));
  } catch (error) {
    console.error("Failed to load history:", error);
    return [];
  }
}

function loadCalculator(): Calculator {
  const savedData = localStorage.getItem(STORAGE_KEY);

  if (!savedData) {
    return initialCalculator;
  }

  try {
    const parsed = JSON.parse(savedData);

    if (!parsed || typeof parsed !== "object") {
      throw new Error("Stored calculator data is invalid");
    }

    return {
      ...initialCalculator,
      ...parsed,
      startTime: restoreDate(parsed.startTime),
      stopTime: restoreDate(parsed.stopTime),
      boTime: restoreDate(parsed.boTime),
      boVFR: restoreDate(parsed.boVFR),
      boIFR: restoreDate(parsed.boIFR),
    };
  } catch (error) {
    console.error("Failed to load calculator data:", error, savedData);
    return initialCalculator;
  }
}

function App() {
  const [calculator, setCalculator] = useState<Calculator>(loadCalculator);
  const [history, setHistory] = useState<Calculator[]>(loadHistory);

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // eslint-disable-next-line prefer-template
      console.log("SW Registered: " + r);
    },
    onRegisterError(error) {
      console.log("SW registration error", error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(calculator));
  }, [calculator]);

  useEffect(() => {
    localStorage.setItem("history", JSON.stringify(history));
  }, [history]);

  const handleStart = (
    fuelInitial: Calculator["fuelInitial"],
    auxTank: Calculator["auxTank"],
    auxInitial: Calculator["auxInitial"],
  ) => {
    handleReset();
    setCalculator((previous) => ({
      ...previous,
      startTime: new Date(),
      fuelInitial: fuelInitial,
      isStarted: true,
      auxTank: auxTank,
      auxInitial: auxInitial,
    }));
  };

  const handleCalculate = (
    fuelFinal: Calculator["fuelFinal"],
    auxFinal: Calculator["auxFinal"],
  ) => {
    setCalculator((previous) => {
      if (!previous.startTime) {
        return {
          ...previous,
          error: "Burn rate calculation failed",
        };
      }

      const stopTime = new Date();

      const elapsedMinutes =
        (stopTime.getTime() - previous.startTime.getTime()) / 1000 / 60;

      const fuelUsed =
        previous.fuelInitial + previous.auxInitial - (fuelFinal + auxFinal);
      const burnRate = fuelUsed * (60 / elapsedMinutes);

      const timeToBO = (fuelFinal + auxFinal) / burnRate;
      const millisecondsToBO = timeToBO * 60 * 60 * 1000;

      const boTime = new Date(stopTime.getTime() + millisecondsToBO);
      const boVFR = new Date(boTime.getTime() - 20 * 60 * 1000);
      const boIFR = new Date(boTime.getTime() - 30 * 60 * 1000);

      const result: Calculator = {
        ...previous,
        stopTime,
        fuelFinal,
        burnRate,
        timeToBO,
        boTime,
        boVFR,
        boIFR,
        auxFinal,
        error: "",
      };

      setHistory((currentHistory) => [...currentHistory, result]);

      return result;
    });
  };

  const handleReset = () => {
    setCalculator(initialCalculator);
  };

  return (
    <div className="m-5 flex flex-col items-center gap-3">
      {(offlineReady || needRefresh) && (
        <div className="flex items-center gap-3 rounded-xl border-2 border-destructive p-2">
          {offlineReady ? (
            <span>App ready to work offline</span>
          ) : (
            <span>
              New content available, click on reload button to update.
            </span>
          )}
          {needRefresh && (
            <Button onClick={() => updateServiceWorker(true)}>Refresh</Button>
          )}
          <Button onClick={() => close()}>Close</Button>
        </div>
      )}
      <Card className="w-full md:w-3/4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <p>Fuel Consumption Calculator </p>
            <p className="text-xs text-muted-foreground">v{APP_VERSION}</p>
          </CardTitle>
          <CardAction>
            <ResetDialog onReset={handleReset} data={calculator} />
          </CardAction>
        </CardHeader>
        <CardContent>
          <StopWatch startTime={calculator.startTime} />
          <CalculatorResults data={calculator} />
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex gap-3">
            <StartDialog data={calculator} onStart={handleStart} />
            <CalculateDialog data={calculator} onCalculate={handleCalculate} />
          </div>
          <div className="flex items-center gap-3">
            <ResultHistory history={history} />
            <NetworkStatus />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default App;
