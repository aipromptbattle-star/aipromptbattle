"use client";

import React from "react";

export function HowItWorks() {
  const steps = [
    {
      num: "01",
      icon: "✍️",
      label: "CRAFT PROMPT",
      sub: "Human Imagination",
      desc: "Structure precision system prompts, contextual anchors, and multimodal constraints under live arena pressure.",
      meta: "LATENCY: ~0.4s · CONTEXT: 128K",
    },
    {
      num: "02",
      icon: "⚡",
      label: "AI SYNTHESIS",
      sub: "Neural Inference",
      desc: "Transformers & diffusion architectures execute cross-attention layers to interpret nuance and render artifacts.",
      meta: "PROCESSING: MULTI-AGENT · PARALLEL",
    },
    {
      num: "03",
      icon: "✨",
      label: "LIVE ARTIFACT",
      sub: "Evaluated Output",
      desc: "Instant score generation judging prompt efficiency, creative boundary-pushing, accuracy, and presentation.",
      meta: "OUTPUT: ARTIFACT READY · RANKED",
    },
  ];

  return (
    <section className="hiw-section" id="how-it-works" aria-label="How it works">
      <div className="hiw-inner">
        <div className="hiw-header">
          <span className="cin-label-sm">THE PIPELINE</span>
          <h2 className="hiw-title">HOW IT WORKS.</h2>
          <p className="hiw-subtitle">From structured intent to synthesized intelligence in 3 stages.</p>
        </div>

        <div className="hiw-grid">
          {steps.map((step, idx) => (
            <div key={idx} className="hiw-card-wrap">
              <div className="hiw-card">
                <div className="hiw-card-top">
                  <span className="hiw-card-num">{step.num}</span>
                  <span className="hiw-card-icon">{step.icon}</span>
                </div>

                <div className="hiw-card-body">
                  <span className="hiw-card-sub">{step.sub}</span>
                  <h3 className="hiw-card-label">{step.label}</h3>
                  <p className="hiw-card-desc">{step.desc}</p>
                </div>

                <div className="hiw-card-meta">
                  <span className="hiw-card-pulse-dot" aria-hidden="true" />
                  <span>{step.meta}</span>
                </div>
              </div>

              {idx < steps.length - 1 && (
                <div className="hiw-connector" aria-hidden="true">
                  <div className="hiw-connector-line" />
                  <span className="hiw-connector-arrow">→</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
