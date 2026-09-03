import type { Calculator } from "@/types/calculator";
import { useEffect, useState } from "react";

type StopWatchProps = {
  startTime: Calculator["startTime"];
};

function StopWatch({ startTime }: StopWatchProps) {
  const [timeDelta, setTimeDelta] = useState(0);

  useEffect(() => {
    if (!startTime) return;

    const updateTime = () => {
      setTimeDelta(Date.now() - startTime.getTime());
    };

    updateTime();
    const intervalId = window.setInterval(updateTime, 1000);

    return () => window.clearInterval(intervalId);
  }, [startTime]);

  if (!startTime) return null;

  const totalSeconds = Math.floor(timeDelta / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return (
    <div className="mb-3 text-4xl font-extrabold md:text-6xl">
      <p className="flex justify-center rounded-4xl border-2 p-3">{`${hours}:${minutes}:${seconds}`}</p>
    </div>
  );
}

export default StopWatch;
