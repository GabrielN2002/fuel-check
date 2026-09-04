import { formatTime } from "@/utils/formatTime";
import type { Calculator } from "@/types/calculator";
import { Fuel, Gauge, ShieldCheck } from "lucide-react";

type CalculatorResultsProps = {
  data: Calculator;
};

type ResultItemProps = {
  title: string;
  item: string;
};

function ResultItem({ title, item }: ResultItemProps) {
  return (
    <div className="flex justify-between py-2">
      <p className="text-muted-foreground">{title}</p>
      <b>{item}</b>
    </div>
  );
}

function formatDuration(hours: number) {
  if (!Number.isFinite(hours) || hours < 0) return "—";

  const totalMinutes = Math.round(hours * 60);
  const wholeHours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return wholeHours > 0 ? `${wholeHours} hr ${minutes} min` : `${minutes} min`;
}

function CalculatorResults({ data }: CalculatorResultsProps) {
  if (!data.startTime) {
    return (
      <div className="p-6 text-center">
        <Fuel
          className="mx-auto mb-2 size-6 text-muted-foreground"
          aria-hidden="true"
        />
        <p className="font-medium">No fuel check in progress</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Start a check to record the initial fuel reading.
        </p>
      </div>
    );
  }

  return (
    <div aria-label="Fuel check results">
      <div className="flex flex-col gap-3 overflow-y-auto">
        <div className="flex flex-col rounded-xl border p-3">
          <div className="flex items-center gap-2">
            <Fuel className="size-4" />
            <b>Initial Reading</b>
          </div>

          <div className="flex flex-col divide-y">
            <ResultItem title="Time" item={formatTime(data.startTime)} />
            <ResultItem title="Main Fuel" item={`${data.fuelInitial} lbs`} />
            {data.auxTank && (
              <ResultItem title="Aux Fuel" item={`${data.auxInitial} lbs`} />
            )}
          </div>
        </div>

        {data.stopTime && (
          <div className="flex flex-col rounded-xl border p-3">
            <div className="flex items-center gap-2">
              <Fuel className="size-4" />
              <b>Final Reading</b>
            </div>
            <div className="flex flex-col divide-y">
              <ResultItem title="Time" item={formatTime(data.stopTime)} />
              <ResultItem title="Main Fuel" item={`${data.fuelFinal} lbs`} />
              {data.auxTank && (
                <ResultItem title="Aux Fuel" item={`${data.auxFinal} lbs`} />
              )}
            </div>
          </div>
        )}

        {data.boTime && (
          <div className="flex flex-col rounded-xl border p-3">
            <div className="flex items-center gap-2">
              <Gauge className="size-4" />
              <b>Results</b>
            </div>
            <div className="flex flex-col divide-y">
              <ResultItem
                title="Burn Rate"
                item={`${Math.round(data.burnRate)} lbs/h`}
              />
              <ResultItem
                title="Time to burn-out"
                item={formatDuration(data.timeToBO)}
              />
              <ResultItem
                title="Burn-out time"
                item={formatTime(data.boTime)}
              />
              <ResultItem title="VFR Reserve" item={formatTime(data.boVFR)} />
              <ResultItem title="IFR Reserve" item={formatTime(data.boIFR)} />
            </div>
          </div>
        )}
      </div>

      {data.error && (
        <p className="text-sm font-medium text-destructive" role="alert">
          {data.error}
        </p>
      )}
    </div>
  );
}

export default CalculatorResults;
