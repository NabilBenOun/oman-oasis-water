"use client";

import { useEffect, useRef } from "react";

export type VisitorStep = "browsing" | "delivery" | "personal_info" | "entering_otp";

export function usePresence(step: VisitorStep = "browsing") {
  const visitorIdRef = useRef<string | null>(null);
  const stepRef = useRef<VisitorStep>(step);
  stepRef.current = step;

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Retrieve or create tab-unique visitorId
    let visitorId = sessionStorage.getItem("oasis_visitor_id");
    if (!visitorId) {
      visitorId = `v_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem("oasis_visitor_id", visitorId);
    }
    visitorIdRef.current = visitorId;

    function sendHeartbeat(currentStep: VisitorStep) {
      const vid = visitorIdRef.current;
      if (!vid) return;

      const payload = JSON.stringify({ visitorId: vid, step: currentStep });

      // Send to server API endpoint
      fetch("/api/presence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
      }).catch(() => {
        // Silent catch for network hiccups
      });

      // Broadcast locally across tabs
      try {
        if ("BroadcastChannel" in window) {
          const bc = new BroadcastChannel("oasis_presence_channel");
          bc.postMessage({ type: "PRESENCE_UPDATE", visitorId: vid, step: currentStep });
          bc.close();
        }
      } catch {
        // ignore fallback errors
      }
    }

    // Send initial heartbeat
    sendHeartbeat(stepRef.current);

    // Heartbeat timer every 3.5s
    const interval = setInterval(() => {
      sendHeartbeat(stepRef.current);
    }, 3500);

    // Send disconnect beacon on unload
    const handleUnload = () => {
      const vid = visitorIdRef.current;
      if (!vid) return;

      const url = `/api/presence?visitorId=${encodeURIComponent(vid)}`;
      if (navigator.sendBeacon) {
        navigator.sendBeacon(url);
      } else {
        fetch(url, { method: "DELETE", keepalive: true }).catch(() => {});
      }
    };

    window.addEventListener("beforeunload", handleUnload);
    window.addEventListener("pagehide", handleUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleUnload);
      window.removeEventListener("pagehide", handleUnload);

      // On component unmount (e.g. leaving page), send disconnect
      handleUnload();
    };
  }, []);

  // Send immediate update whenever step changes
  useEffect(() => {
    if (typeof window === "undefined" || !visitorIdRef.current) return;

    const vid = visitorIdRef.current;
    const payload = JSON.stringify({ visitorId: vid, step });

    fetch("/api/presence", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
    }).catch(() => {});

    try {
      if ("BroadcastChannel" in window) {
        const bc = new BroadcastChannel("oasis_presence_channel");
        bc.postMessage({ type: "PRESENCE_UPDATE", visitorId: vid, step });
        bc.close();
      }
    } catch {}
  }, [step]);
}
