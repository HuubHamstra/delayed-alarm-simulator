import { useState, useCallback, useRef, useEffect } from "react";

interface SimulationState {
  time: number;
  pressureTrue: number;
  tempTrue: number;
  consumptionTrue: number;
  pressureEngine: number;
  tempEngine: number;
  consumptionEngine: number;
  pressureBridge: number;
  tempBridge: number;
  consumptionBridge: number;
  engineAlarm: boolean;
  bridgeAlarm: boolean;
}

const PRESSURE_HIGH_THRESHOLD = 120;
const DT = 0.1; // Time step in seconds
const MAX_TIME = 60;
const DELAY_STEPS = 100; // 10 seconds delay at 0.1s steps
const ALPHA = 0.92; // Smoothing factor

export const useSimulation = () => {
  const [state, setState] = useState<SimulationState>({
    time: 0,
    pressureTrue: 100,
    tempTrue: 110,
    consumptionTrue: 100,
    pressureEngine: 100,
    tempEngine: 110,
    consumptionEngine: 100,
    pressureBridge: 100,
    tempBridge: 110,
    consumptionBridge: 100,
    engineAlarm: false,
    bridgeAlarm: false,
  });

  const [isPlaying, setIsPlaying] = useState(false);
  
  const pressureDelayBuffer = useRef<number[]>(Array(DELAY_STEPS).fill(100));
  const tempDelayBuffer = useRef<number[]>(Array(DELAY_STEPS).fill(110));
  const pressureBridgeDisplay = useRef(100);
  const tempBridgeDisplay = useRef(110);
  const intervalRef = useRef<number | null>(null);

  const calculateTrueValues = useCallback((t: number) => {
    let pressure: number, temp: number, consumption: number;

    if (t < 10) {
      // Phase 1: Normal operation
      pressure = 100;
      temp = 110;
      consumption = 100;
    } else if (t < 30) {
      // Phase 2: Pressure rising (leak/obstruction)
      const factor = (t - 10) / 20; // 0 → 1
      pressure = 100 + factor * 40; // 100 → 140
      temp = 110 + factor * 20; // 110 → 130
      consumption = 100 + factor * 4; // 100 → 104
    } else {
      // Phase 3: Critical - stabilized high
      pressure = 140;
      temp = 130;
      consumption = 104;
    }

    return { pressure, temp, consumption };
  }, []);

  const update = useCallback(() => {
    setState((prev) => {
      const newTime = prev.time + DT;
      
      if (newTime >= MAX_TIME) {
        setIsPlaying(false);
        return { ...prev, time: MAX_TIME };
      }

      // Calculate true physical values
      const trueValues = calculateTrueValues(newTime);

      // Engine room gets near-real data (no manipulation)
      const pressureEngine = trueValues.pressure;
      const tempEngine = trueValues.temp;
      const consumptionEngine = trueValues.consumption;

      // Update delay buffers for bridge
      const pressureTrueDelayed = pressureDelayBuffer.current[0];
      const tempTrueDelayed = tempDelayBuffer.current[0];

      pressureDelayBuffer.current.shift();
      pressureDelayBuffer.current.push(trueValues.pressure);

      tempDelayBuffer.current.shift();
      tempDelayBuffer.current.push(trueValues.temp);

      // Apply smoothing for bridge display
      pressureBridgeDisplay.current =
        ALPHA * pressureBridgeDisplay.current + (1 - ALPHA) * pressureTrueDelayed;
      tempBridgeDisplay.current =
        ALPHA * tempBridgeDisplay.current + (1 - ALPHA) * tempTrueDelayed;

      // Alarm logic
      const engineAlarm = trueValues.pressure > PRESSURE_HIGH_THRESHOLD;
      const bridgeAlarm =
        newTime > 35 && pressureBridgeDisplay.current > PRESSURE_HIGH_THRESHOLD;

      return {
        time: newTime,
        pressureTrue: trueValues.pressure,
        tempTrue: trueValues.temp,
        consumptionTrue: trueValues.consumption,
        pressureEngine,
        tempEngine,
        consumptionEngine,
        pressureBridge: pressureBridgeDisplay.current,
        tempBridge: tempBridgeDisplay.current,
        consumptionBridge: trueValues.consumption,
        engineAlarm,
        bridgeAlarm,
      };
    });
  }, [calculateTrueValues]);

  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    pressureDelayBuffer.current = Array(DELAY_STEPS).fill(100);
    tempDelayBuffer.current = Array(DELAY_STEPS).fill(110);
    pressureBridgeDisplay.current = 100;
    tempBridgeDisplay.current = 110;

    setState({
      time: 0,
      pressureTrue: 100,
      tempTrue: 110,
      consumptionTrue: 100,
      pressureEngine: 100,
      tempEngine: 110,
      consumptionEngine: 100,
      pressureBridge: 100,
      tempBridge: 110,
      consumptionBridge: 100,
      engineAlarm: false,
      bridgeAlarm: false,
    });
  }, []);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = window.setInterval(update, DT * 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, update]);

  return {
    state,
    isPlaying,
    play,
    pause,
    reset,
    maxTime: MAX_TIME,
  };
};
