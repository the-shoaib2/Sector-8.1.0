"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Wifi, WifiOff } from "lucide-react";

declare global {
  interface Window {
    __APP_OFFLINE?: boolean;
  }
}

export default function InternetStatusBanner() {
  const [online, setOnline] = useState(true);
  const [showOnline, setShowOnline] = useState(false);
  const [showOffline, setShowOffline] = useState(false);

  useEffect(() => {
    const updateStatus = () => {
      const isOnline = navigator.onLine;
      const wasOffline = !online;
      
      setOnline(isOnline);
      
      if (typeof window !== 'undefined') {
        window.__APP_OFFLINE = !isOnline;
      }
      
      if (isOnline && wasOffline) {
        // Transition from offline to online
        setShowOnline(true);
        setShowOffline(false);
        setTimeout(() => setShowOnline(false), 3000);
      } else if (!isOnline) {
        // Just went offline
        setShowOffline(true);
        setShowOnline(false);
      }
    };

    // Initial status check
    const initialStatus = navigator.onLine;
    setOnline(initialStatus);
    if (typeof window !== 'undefined') {
      window.__APP_OFFLINE = !initialStatus;
    }
    
    // If initially offline, show the banner
    if (!initialStatus) {
      setShowOffline(true);
    }

    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);
    
    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, [online]);

  // Show banner when offline OR when showing online transition
  if (!showOffline && !showOnline) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-end justify-end">
      <Card
        className={`rounded-full px-4 py-2 shadow-lg border border-border flex items-center gap-2 text-sm transition-all duration-300 backdrop-blur-md
          ${online ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}
          ${showOnline ? 'animate-in slide-in-from-bottom-2' : ''}
          ${showOffline ? 'animate-in slide-in-from-bottom-2' : ''}`}
        style={{ minWidth: 140 }}
        aria-live="polite"
      >
        {online ? (
          <Wifi className="w-4 h-4 text-success" />
        ) : (
          <WifiOff className="w-4 h-4 text-destructive" />
        )}
        <span className="font-medium">
          {online ? 'You are online' : 'No internet connection'}
        </span>
      </Card>
    </div>
  );
}
