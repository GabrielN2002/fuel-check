export type Calculator = {
  startTime: Date | null;
  stopTime: Date | null;
  fuelInitial: number;
  fuelFinal: number;
  isStarted: boolean;
  burnRate: number;
  timeToBO: number;
  boTime: Date | null;
  boVFR: Date | null;
  boIFR: Date | null;
  error: string;
};
