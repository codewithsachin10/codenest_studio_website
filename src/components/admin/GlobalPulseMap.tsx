import React, { useState, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from "react-simple-maps";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";

// TopoJSON containing world map shapes
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface PulseMarker {
  id: string;
  coordinates: [number, number]; // [longitude, latitude]
  city: string;
  timestamp: number;
}

// Some dummy global cities for the simulation
const CITIES = [
  { name: "New York", coordinates: [-74.006, 40.7128] as [number, number] },
  { name: "London", coordinates: [-0.1276, 51.5074] as [number, number] },
  { name: "Tokyo", coordinates: [139.6503, 35.6762] as [number, number] },
  { name: "Berlin", coordinates: [13.4050, 52.5200] as [number, number] },
  { name: "Sydney", coordinates: [151.2093, -33.8688] as [number, number] },
  { name: "Mumbai", coordinates: [72.8777, 19.0760] as [number, number] },
  { name: "São Paulo", coordinates: [-46.6333, -23.5505] as [number, number] },
  { name: "Lagos", coordinates: [3.3792, 6.5244] as [number, number] },
  { name: "Dubai", coordinates: [55.2708, 25.2048] as [number, number] },
  { name: "Singapore", coordinates: [103.8198, 1.3521] as [number, number] },
];

export const GlobalPulseMap = () => {
  const [pulses, setPulses] = useState<PulseMarker[]>([]);

  // Simulation effect
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const triggerPulse = () => {
      const randomCity = CITIES[Math.floor(Math.random() * CITIES.length)];
      const newPulse: PulseMarker = {
        id: Math.random().toString(36).substr(2, 9),
        coordinates: randomCity.coordinates,
        city: randomCity.name,
        timestamp: Date.now(),
      };

      setPulses((prev) => [...prev, newPulse]);

      // Remove the pulse after animation completes (3s)
      setTimeout(() => {
        setPulses((prev) => prev.filter((p) => p.id !== newPulse.id));
      }, 3000);
      
      // Schedule next pulse
      timeoutId = setTimeout(triggerPulse, Math.random() * 2500 + 1500);
    };

    // Start simulation
    timeoutId = setTimeout(triggerPulse, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative w-full rounded-2xl border border-border/50 bg-card/40 p-4 overflow-hidden group min-h-[400px]"
    >
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/10 blur-[100px] rounded-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
      
      <div className="absolute top-6 left-6 z-10 flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2 border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.3)]">
          <Globe className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground text-sm tracking-wide uppercase">Global Pulse Network</h3>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs text-muted-foreground font-mono">Live Installation Stream</span>
          </div>
        </div>
      </div>

      {/* The Map */}
      <div className="w-full h-full relative mt-16 lg:mt-8">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 140,
            center: [0, 30]
          }}
          className="w-full h-full opacity-80"
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="hsl(var(--muted))"
                  stroke="hsl(var(--border))"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "hsl(var(--primary) / 0.2)", outline: "none", transition: "fill 0.3s" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {/* Render Active Pulses */}
          <AnimatePresence>
            {pulses.map((pulse) => (
              <Marker key={pulse.id} coordinates={pulse.coordinates}>
                <motion.circle
                  initial={{ r: 0, opacity: 1 }}
                  animate={{ r: 25, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
                <motion.circle
                  initial={{ r: 0, opacity: 1 }}
                  animate={{ r: 15, opacity: 0 }}
                  transition={{ duration: 2, delay: 0.2, ease: "easeOut" }}
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth={1.5}
                />
                <circle r={3} className="fill-primary drop-shadow-[0_0_8px_rgba(var(--primary),1)]" />
                <motion.text
                  textAnchor="middle"
                  y={-10}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: -10 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5 }}
                  style={{ fontFamily: "system-ui", fill: "hsl(var(--foreground))", fontSize: 10, fontWeight: "600" }}
                  className="drop-shadow-md"
                >
                  {pulse.city}
                </motion.text>
              </Marker>
            ))}
          </AnimatePresence>
        </ComposableMap>
      </div>
      
      {/* Decorative Grid Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02] select-none" 
        style={{
          backgroundImage: "linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "20px 20px"
        }}
      />
    </motion.div>
  );
};
