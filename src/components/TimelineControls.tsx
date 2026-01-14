import { Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TimelineControlsProps {
  time: number;
  maxTime: number;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
}

export const TimelineControls = ({
  time,
  maxTime,
  isPlaying,
  onPlay,
  onPause,
  onReset,
}: TimelineControlsProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = (time / maxTime) * 100;

  return (
    <div className="panel-card">
      <div className="flex items-center gap-4">
        {/* Time Display */}
        <div className="font-mono text-2xl tabular-nums text-accent min-w-[100px]">
          {formatTime(time)}
        </div>

        {/* Progress Bar */}
        <div className="flex-1">
          <div className="h-3 bg-muted rounded-full overflow-hidden relative">
            {/* Phase markers */}
            <div className="absolute top-0 left-[16.67%] w-px h-full bg-border/50" title="Phase 2 start" />
            <div className="absolute top-0 left-[50%] w-px h-full bg-border/50" title="Phase 3 start" />
            
            {/* Progress fill */}
            <div
              className="h-full bg-gradient-to-r from-accent to-accent/70 transition-all duration-100 rounded-full relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-accent-foreground rounded-full" />
            </div>
          </div>
          
          {/* Phase labels */}
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1 font-mono px-1">
            <span>0:00</span>
            <span className="text-safe">Normal</span>
            <span className="text-warning">Rising</span>
            <span className="text-danger">Critical</span>
            <span>1:00</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onReset}
            className="border-border hover:bg-muted"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          
          {isPlaying ? (
            <Button
              variant="default"
              size="icon"
              onClick={onPause}
              className="bg-accent hover:bg-accent/80"
            >
              <Pause className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              variant="default"
              size="icon"
              onClick={onPlay}
              className="bg-accent hover:bg-accent/80"
            >
              <Play className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
