import { useOnlineStatus } from "@/hooks/useOnlineStatus";

import { Button } from "./ui/button";
import { Info } from "lucide-react";

function NetworkStatus() {
  const isOnline = useOnlineStatus();

  return (
    <div className="relative">
      <Button
        size={"xs"}
        popoverTarget="netStatPopover"
        className={`${isOnline ? "bg-green-300 hover:bg-green-300" : "bg-red-300 hover:bg-red-300"} [anchor-name:--network-status]`}
      >
        {isOnline ? "Online" : "Offline"}
      </Button>
      <div
        id="netStatPopover"
        popover="auto"
        className="m-2 items-center gap-2 rounded-lg border-2 border-dashed bg-card p-2 text-blue-300 [position-anchor:--network-status] [position-area:top] open:flex"
      >
        <Info className="size-5" />
        <div>
          <p>Ready to use offline</p>
          <p>
            You are: <u>{isOnline ? "Online" : "Offline"}</u>
          </p>
        </div>
      </div>
    </div>
  );
}

export default NetworkStatus;
