"use client";

import React from "react";

export function CircuitConnector({ label = "DATA CONDUIT" }: { label?: string }) {
  return (
    <div className="circuit-connector-wrap" aria-hidden="true">
      <div className="circuit-connector-line">
        <div className="circuit-connector-packet" />
      </div>
      {label && <span className="circuit-connector-label">{label}</span>}
    </div>
  );
}

export default CircuitConnector;
