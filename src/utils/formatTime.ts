
export function formatTime(date: Date | null): string {
  return (
    date?.toLocaleTimeString([], {
      timeStyle: "short",
    }) ?? "—"
  );
}
