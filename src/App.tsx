import { useEffect, useState } from "react";

import CalculatorResults from "@/components/calculator-results";
import type { Calculator } from "./types/calculator";
import StopWatch from "./components/stop-watch";
import StartDialog from "./components/start-dialog";
import CalculateDialog from "./components/calculate-dialog";
import { useRegisterSW } from "virtual:pwa-register/react";
import { Button } from "./components/ui/button";
import NetworkStatus from "./components/network-status";
import ResultHistory from "./components/result-history";
import { APP_VERSION } from "./utils/version";
import DestructiveDialog from "./components/destructive-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import { Info, Share, WifiOff } from "lucide-react";
import { Analytics } from "@vercel/analytics/react";

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
    handleHistoryReset();
  };

  const handleHistoryDelete = (index: number) => {
    setHistory((prev) => prev.filter((_value, i) => index != i));
  };

  const handleHistoryReset = () => {
    setHistory([]);
  };
  const handleHistorySort = () => {
    setHistory((prev) => prev.toSorted(() => -1));
  };

  return (
    <div className="flex h-dvh w-full flex-col">
      <Dialog open={offlineReady || needRefresh}>
        <DialogContent showCloseButton={false}>
          {needRefresh && (
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Info className="size-5" />
                Attention
              </DialogTitle>
            </DialogHeader>
          )}

          {offlineReady ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <WifiOff className="size-4" />
                <p>App ready to work offline</p>
              </div>
              <div className="flex items-center gap-2 font-bold text-blue-300">
                <Share className="size-4" />
                <p>Add website to home screen for easy acces</p>
              </div>
            </div>
          ) : (
            <div className="m-1">
              <p>New content available, click on reload button to update.</p>
            </div>
          )}
          {needRefresh ? (
            <Button
              variant={"destructive"}
              onClick={() => updateServiceWorker(true)}
            >
              Reload
            </Button>
          ) : (
            <Button onClick={() => close()}>Close</Button>
          )}
        </DialogContent>
      </Dialog>

      <header className="flex shrink-0 touch-none justify-between bg-card p-3">
        <div className="flex items-center gap-2">
          <b>Fuel Consumption Calculator </b>
          <p className="text-xs text-muted-foreground">v{APP_VERSION}</p>
        </div>
        <DestructiveDialog
          title={"Reset fuel check?"}
          message={
            "This will reset all values and history to their original state and all progress will be lost."
          }
          action={"Reset"}
          onAction={handleReset}
          data={calculator}
        />
      </header>

      <main className="min-h-0 flex-1 scrollbar-thumb-secondary scrollbar-track-transparent overflow-y-auto bg-card p-3">
        <div className="flex min-h-full flex-col justify-center">
          <StopWatch startTime={calculator.startTime} />
          <CalculatorResults data={calculator} />
        </div>
      </main>

      <footer className="flex shrink-0 touch-none justify-between bg-card px-3 py-8">
        <div className="flex gap-3">
          <StartDialog data={calculator} onStart={handleStart} />
          <CalculateDialog data={calculator} onCalculate={handleCalculate} />
        </div>
        <div className="flex items-center gap-3">
          <ResultHistory
            onSort={handleHistorySort}
            onReset={handleHistoryReset}
            onDelete={handleHistoryDelete}
            history={history}
          />
          <NetworkStatus />
        </div>
      </footer>
      <Analytics />
    </div>
  );
}

export default App;
