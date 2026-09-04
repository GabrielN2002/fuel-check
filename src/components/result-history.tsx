import { RotateCcwClock } from "lucide-react";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import type { Calculator } from "@/types/calculator";
import { formatTime } from "@/utils/formatTime";

type ResultHistoryProps = {
  history: Calculator[];
};

type HistoryItemProps = {
  title: string;
  item: string;
};

function HistoryItem({ title, item }: HistoryItemProps) {
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

function ResultHistory({ history }: ResultHistoryProps) {
  return (
    <Drawer showSwipeHandle>
      <DrawerTrigger render={<Button variant={"outline"} />}>
        <RotateCcwClock />
      </DrawerTrigger>
      <DrawerContent className="max-h-[90%] min-h-[50%]">
        <DrawerHeader>
          <DrawerTitle>Result History</DrawerTitle>
          <DrawerDescription>
            Press <b>View</b> to see all details
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
          {history.map((item, index) => (
            <div
              key={index}
              className="m-3 flex justify-between items-center rounded-xl border p-3"
            >
              <div className="flex flex-col">
                <b>Fuel Check {index + 1}</b>
                <div className="text-muted-foreground">{`Closed ${formatTime(item.stopTime)}`}</div>
              </div>

              <Drawer showSwipeHandle>
                <DrawerTrigger render={<Button variant="outline" />}>
                  View
                </DrawerTrigger>
                <DrawerContent className="max-h-[90%] min-h-[50%]">
                  <DrawerHeader className="mb-2">
                    <DrawerTitle>Fuel Check {index + 1}</DrawerTitle>
                  </DrawerHeader>
                  <div className="flex flex-col gap-4 overflow-y-auto p-4">
                    <div className="flex flex-col rounded-xl border p-3">
                      <b>Initial Reading</b>
                      <div className="flex flex-col divide-y">
                        <HistoryItem
                          title="Time"
                          item={formatTime(item.startTime)}
                        />
                        <HistoryItem
                          title="Main Fuel"
                          item={`${item.fuelInitial} lbs`}
                        />
                        {item.auxTank && (
                          <HistoryItem
                            title="Aux Fuel"
                            item={`${item.auxInitial} lbs`}
                          />
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col rounded-xl border p-3">
                      <b>Final Reading</b>
                      <div className="flex flex-col divide-y">
                        <HistoryItem
                          title="Time"
                          item={formatTime(item.stopTime)}
                        />
                        <HistoryItem
                          title="Main Fuel"
                          item={`${item.fuelFinal} lbs`}
                        />
                        {item.auxTank && (
                          <HistoryItem
                            title="Aux Fuel"
                            item={`${item.auxFinal} lbs`}
                          />
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col rounded-xl border p-3">
                      <b>Results</b>
                      <div className="flex flex-col divide-y">
                        <HistoryItem
                          title="Burn Rate"
                          item={`${Math.round(item.burnRate)} lbs/h`}
                        />
                        <HistoryItem
                          title="Time to burn-out"
                          item={formatDuration(item.timeToBO)}
                        />
                        <HistoryItem
                          title="Burn-out time"
                          item={formatTime(item.boTime)}
                        />
                        <HistoryItem
                          title="VFR Reserve"
                          item={formatTime(item.boVFR)}
                        />
                        <HistoryItem
                          title="IFR Reserve"
                          item={formatTime(item.boIFR)}
                        />
                      </div>
                    </div>
                  </div>
                  <DrawerFooter className="mt-3">
                    <DrawerClose render={<Button />}>Close</DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </div>
          ))}
        </div>
        <DrawerFooter className="mt-3">
          <DrawerClose render={<Button />}>Close</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default ResultHistory;
