import { formatTime } from "@/utils/formatTime";
import type { Calculator } from "@/types/calculator";
import { Fuel, Gauge, ShieldCheck } from "lucide-react";

type CalculatorResultsProps = {
  data: Calculator;
};

type ResultItemProps = {
  label: string;
  value: string;
};

function ResultItem({ label, value }: ResultItemProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-right font-semibold tabular-nums">{value}</dd>
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
    <section className="space-y-4" aria-label="Fuel check results">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border bg-muted/30 p-3">
          <div className="mb-1 flex items-center gap-2 text-sm font-medium">
            <Fuel className="size-4 text-muted-foreground" aria-hidden="true" />
            Initial reading
          </div>
          <dl className="divide-y">
            <ResultItem label="Time" value={formatTime(data.startTime)} />
            <ResultItem label="Main Fuel" value={`${data.fuelInitial} lbs`} />
            {data.auxTank && (
              <ResultItem
                label="Aux Fuel"
                value={`${data.auxInitial} lbs`}
              ></ResultItem>
            )}
          </dl>
        </div>

        <div className="rounded-lg border bg-muted/30 p-3">
          <div className="mb-1 flex items-center gap-2 text-sm font-medium">
            <Fuel className="size-4 text-muted-foreground" aria-hidden="true" />
            Final reading
          </div>
          {data.stopTime ? (
            <dl className="divide-y">
              <ResultItem label="Time" value={formatTime(data.stopTime)} />
              <ResultItem label="Main Fuel" value={`${data.fuelFinal} lbs`} />
              {data.auxTank && (
                <ResultItem
                  label="Aux Fuel"
                  value={`${data.auxFinal} lbs`}
                ></ResultItem>
              )}
            </dl>
          ) : (
            <p className="py-5 text-sm text-muted-foreground">
              Waiting for the final fuel reading.
            </p>
          )}
        </div>
      </div>

      {data.stopTime && (
        <div className="overflow-hidden rounded-lg border">
          <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-2">
            <Gauge
              className="size-4 text-muted-foreground"
              aria-hidden="true"
            />
            <h2 className="font-semibold">Results</h2>
          </div>

          <dl className="px-4 py-1">
            <ResultItem
              label="Burn rate"
              value={`${Math.round(data.burnRate)} lbs/hr`}
            />
            <ResultItem
              label="Time to burn-out"
              value={formatDuration(data.timeToBO)}
            />
            <ResultItem label="Burn-out time" value={formatTime(data.boTime)} />
          </dl>

          <div className="grid border-t bg-muted/20 sm:grid-cols-2 sm:divide-x">
            <div className="px-4 py-3">
              <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                <ShieldCheck className="size-4" aria-hidden="true" />
                VFR reserve
              </div>
              <p className="mt-1 text-lg font-semibold tabular-nums">
                {formatTime(data.boVFR)}
              </p>
            </div>
            <div className="border-t px-4 py-3 sm:border-t-0">
              <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                <ShieldCheck className="size-4" aria-hidden="true" />
                IFR reserve
              </div>
              <p className="mt-1 text-lg font-semibold tabular-nums">
                {formatTime(data.boIFR)}
              </p>
            </div>
          </div>
        </div>
      )}

      {data.error && (
        <p className="text-sm font-medium text-destructive" role="alert">
          {data.error}
        </p>
      )}
    </section>
  );
}

export default CalculatorResults;
