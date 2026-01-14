import { SimulationPanel } from "@/components/SimulationPanel";
import { TimelineControls } from "@/components/TimelineControls";
import { useSimulation } from "@/hooks/useSimulation";
import { Shield, AlertTriangle, Ship } from "lucide-react";

const Index = () => {
  const { state, isPlaying, play, pause, reset, maxTime } = useSimulation();

  return (
    <div className="min-h-screen p-6 md:p-8">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
            <Ship className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Maritime Cyber Security Demo
            </h1>
            <p className="text-sm text-muted-foreground">
              Engine Room Telemetry Manipulation Simulation
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="panel-card flex items-start gap-4 mt-4">
          <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              This simulation demonstrates how <span className="text-accent font-medium">cyber data manipulation</span> (smoothing + delay) 
              causes the Bridge to receive delayed and falsified sensor readings compared to the Engine Room.
            </p>
            <p>
              Watch how the <span className="text-safe font-medium">Engine Room alarm</span> triggers first, 
              while the <span className="text-warning font-medium">compromised Bridge display</span> shows 
              "normal" readings until it's too late.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto space-y-6">
        {/* Panels Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* True System Panel */}
          <div className="relative">
            <div className="absolute -top-3 left-4 px-2 py-0.5 bg-background text-xs font-mono text-accent border border-accent/30 rounded z-10">
              <Shield className="w-3 h-3 inline mr-1" />
              HIDDEN REALITY
            </div>
            <SimulationPanel
              title="True System"
              subtitle="Physical sensor readings"
              pressure={state.pressureTrue}
              temperature={state.tempTrue}
              consumption={state.consumptionTrue}
              alarm={state.pressureTrue > 120}
              showTrueLabel
            />
          </div>

          {/* Engine Room Panel */}
          <div className="relative">
            <div className="absolute -top-3 left-4 px-2 py-0.5 bg-background text-xs font-mono text-safe border border-safe/30 rounded z-10">
              ENGINE ROOM HMI
            </div>
            <SimulationPanel
              title="Engine Room"
              subtitle="Direct sensor connection"
              pressure={state.pressureEngine}
              temperature={state.tempEngine}
              consumption={state.consumptionEngine}
              alarm={state.engineAlarm}
            />
          </div>

          {/* Bridge Panel */}
          <div className="relative">
            <div className="absolute -top-3 left-4 px-2 py-0.5 bg-background text-xs font-mono text-warning border border-warning/30 rounded z-10">
              BRIDGE HMI
            </div>
            <SimulationPanel
              title="Bridge"
              subtitle="Compromised telemetry feed"
              pressure={state.pressureBridge}
              temperature={state.tempBridge}
              consumption={state.consumptionBridge}
              alarm={state.bridgeAlarm}
              compromised
            />
          </div>
        </div>

        {/* Timeline Controls */}
        <TimelineControls
          time={state.time}
          maxTime={maxTime}
          isPlaying={isPlaying}
          onPlay={play}
          onPause={pause}
          onReset={reset}
        />

        {/* Legend */}
        <div className="panel-card">
          <h3 className="text-sm font-semibold text-foreground mb-3">Simulation Phases</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 rounded-full bg-safe mt-1 flex-shrink-0" />
              <div>
                <span className="font-medium text-foreground">Phase 1 (0–10s):</span>
                <span className="text-muted-foreground ml-1">Normal operation. All systems nominal.</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 rounded-full bg-warning mt-1 flex-shrink-0" />
              <div>
                <span className="font-medium text-foreground">Phase 2 (10–30s):</span>
                <span className="text-muted-foreground ml-1">Fuel system obstruction. Pressure rising.</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 rounded-full bg-danger mt-1 flex-shrink-0" />
              <div>
                <span className="font-medium text-foreground">Phase 3 (30–60s):</span>
                <span className="text-muted-foreground ml-1">Critical pressure. Bridge alarm delayed by cyber manipulation.</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto mt-8 text-center text-xs text-muted-foreground">
        <p>
          Cyber manipulation: 10s delay + exponential smoothing (α=0.92) applied to bridge telemetry feed.
        </p>
      </footer>
    </div>
  );
};

export default Index;
