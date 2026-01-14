import { cn } from "@/lib/utils";

interface SimulationPanelProps {
  title: string;
  subtitle?: string;
  pressure: number;
  temperature: number;
  consumption: number;
  alarm: boolean;
  alarmMessage?: string;
  compromised?: boolean;
  showTrueLabel?: boolean;
}

const getStatusColor = (value: number, thresholds: { warning: number; danger: number }) => {
  if (value > thresholds.danger) return "text-danger";
  if (value > thresholds.warning) return "text-warning";
  return "text-safe";
};

const getBarWidth = (value: number, min: number, max: number) => {
  const percentage = ((value - min) / (max - min)) * 100;
  return Math.min(Math.max(percentage, 0), 100);
};

const getBarColor = (value: number, thresholds: { warning: number; danger: number }) => {
  if (value > thresholds.danger) return "bg-danger";
  if (value > thresholds.warning) return "bg-warning";
  return "bg-safe";
};

export const SimulationPanel = ({
  title,
  subtitle,
  pressure,
  temperature,
  consumption,
  alarm,
  alarmMessage = "HIGH FUEL PRESSURE",
  compromised = false,
  showTrueLabel = false,
}: SimulationPanelProps) => {
  const pressureThresholds = { warning: 110, danger: 125 };
  const tempThresholds = { warning: 120, danger: 130 };

  return (
    <div
      className={cn(
        "panel-card relative overflow-hidden",
        alarm && "ring-2 ring-danger animate-pulse-glow",
        compromised && "border-warning/50"
      )}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className={cn(
            "w-2 h-2 rounded-full",
            alarm ? "bg-danger animate-pulse" : "bg-safe"
          )} />
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground font-mono">{subtitle}</p>
        )}
        {compromised && (
          <div className="mt-2 px-2 py-1 bg-warning/10 border border-warning/30 rounded text-xs text-warning font-mono">
            ⚠ Data smoothing active
          </div>
        )}
        {showTrueLabel && (
          <div className="mt-2 px-2 py-1 bg-accent/10 border border-accent/30 rounded text-xs text-accent font-mono">
            Physical sensor data
          </div>
        )}
      </div>

      {/* Metrics */}
      <div className="space-y-5">
        {/* Pressure */}
        <div>
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Pressure</span>
            <span className={cn(
              "text-2xl font-mono font-bold tabular-nums",
              getStatusColor(pressure, pressureThresholds)
            )}>
              {pressure.toFixed(1)}
              <span className="text-sm ml-1 text-muted-foreground">bar</span>
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-300 rounded-full",
                getBarColor(pressure, pressureThresholds)
              )}
              style={{ width: `${getBarWidth(pressure, 80, 150)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5 font-mono">
            <span>80</span>
            <span className="text-warning">120</span>
            <span>150</span>
          </div>
        </div>

        {/* Temperature */}
        <div>
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Temperature</span>
            <span className={cn(
              "text-2xl font-mono font-bold tabular-nums",
              getStatusColor(temperature, tempThresholds)
            )}>
              {temperature.toFixed(1)}
              <span className="text-sm ml-1 text-muted-foreground">°C</span>
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-300 rounded-full",
                getBarColor(temperature, tempThresholds)
              )}
              style={{ width: `${getBarWidth(temperature, 90, 150)}%` }}
            />
          </div>
        </div>

        {/* Consumption */}
        <div>
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Fuel Consumption</span>
            <span className="text-2xl font-mono font-bold tabular-nums text-foreground">
              {consumption.toFixed(1)}
              <span className="text-sm ml-1 text-muted-foreground">L/min</span>
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-300 rounded-full bg-accent"
              style={{ width: `${getBarWidth(consumption, 80, 120)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Alarm Display */}
      <div className={cn(
        "mt-6 p-3 rounded border font-mono text-sm text-center transition-all duration-300",
        alarm
          ? "bg-danger/20 border-danger text-danger animate-pulse"
          : "bg-muted/30 border-border text-muted-foreground"
      )}>
        {alarm ? (
          <div className="flex items-center justify-center gap-2">
            <span className="inline-block w-2 h-2 bg-danger rounded-full animate-ping" />
            <span className="font-bold">{alarmMessage}</span>
          </div>
        ) : (
          "SYSTEM NOMINAL"
        )}
      </div>
    </div>
  );
};
