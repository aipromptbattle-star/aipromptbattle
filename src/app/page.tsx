"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FlipText } from "@/components/ui/flip-text";
import { MaskedAvatars } from "@/components/ui/masked-avatars";
import { CreepyButton } from "@/components/ui/creepy-button";
import { LineHoverLink } from "@/components/ui/line-hover-link";
import { KineticTextLoader } from "@/components/ui/kinetic-text-loader";
import { AsciiGlitchRipple } from "@/components/ui/ascii-glitch-ripple";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const REGISTRATION_LINK = "YOUR_GOOGLE_FORM_LINK";
const EVENT_DATE = new Date("2026-10-30T09:00:00+05:30");

const RULES = [
  "Each team must consist of 4 members.",
  "A unique Team ID will be assigned to every team.",
  "All members of a team must remain together during the rounds unless a round specifically requires a split.",
  "Teams must use only the AI tools/platforms specified by the organizers.",
  "No team may communicate with another team during an active round.",
  "Sharing prompts, answers, outputs, screenshots, files, or strategies with another team is strictly prohibited.",
  "All submissions must be made before the submission timer expires.",
  "Once a submission is locked, no modification or resubmission will be permitted unless explicitly allowed by the organizers.",
  "Prompts and AI-generated outputs may be recorded and retained by organizers for verification and judging.",
  "Any attempt to manipulate the competition platform, bypass restrictions, access another team's work, or obtain unauthorized information can result in immediate disqualification.",
  "The organisers/judges decision will be final for subjective evaluation.",
  "Any tie-break mechanism applicable to a round will be announced before that round begins.",
];

const FAQS = [
  {
    q: "Who can participate?",
    a: "The competition is open to all currently enrolled students. Please contact the coordinators for specific eligibility details.",
  },
  {
    q: "Do all team members need to be from the same college?",
    a: "No — cross-college teams are welcome. All 4 members must register together under a single team name.",
  },
  {
    q: "Which AI tools are allowed during the competition?",
    a: "The specific tools and platforms will be announced to registered teams before the event. Only organizer-approved tools may be used during rounds.",
  },
  {
    q: "What happens if a team member is absent on the day?",
    a: "All registered team members are expected to be present. If a member is absent, the team may be disqualified or allowed to continue at the organizers' discretion. No refund will be provided.",
  },
  {
    q: "Is there a dress code or ID requirement?",
    a: "Carry a valid college ID. No specific dress code — smart casual is recommended.",
  },
  {
    q: "When will we receive confirmation after registration?",
    a: "A confirmation will be sent to the registered contact within 48 hours of submission. Reach out to coordinators if you haven't heard back.",
  },
  {
    q: "Can a participant be part of multiple teams?",
    a: "No. Each participant can only be registered under one team. Duplicate registrations across teams will lead to disqualification.",
  },
  {
    q: "Will certificates be provided to participants?",
    a: "Yes — participation certificates will be provided to all competing teams. Winners will receive additional merit certificates.",
  },
  {
    q: "Can participants from outside Bengaluru/Karnataka participate?",
    a: "Yes, the event is open to students from across India. Participants are responsible for their own travel and accommodation arrangements.",
  },
  {
    q: "What devices or laptops are required on the day?",
    a: "Participants are required to bring their own laptops. Specific software or browser requirements will be communicated to registered teams before the event.",
  },
  {
    q: "What is the last date to register?",
    a: "The registration deadline will be announced soon. Register early to secure your spot — seats are limited.",
  },
];

const PRIZE_TIERS = [
  {
    label: "< 15 TEAMS",
    desc: "Single prize awarded",
    prizes: [{ place: "1st", amount: "TBA", active: true }],
  },
  {
    label: "20+ TEAMS",
    desc: "Two prizes awarded",
    prizes: [
      { place: "1st", amount: "TBA", active: true },
      { place: "2nd", amount: "TBA", active: true },
    ],
  },
  {
    label: "30+ TEAMS",
    desc: "Full prize pool unlocked",
    prizes: [
      { place: "1st", amount: "TBA", active: true },
      { place: "2nd", amount: "TBA", active: true },
      { place: "3rd", amount: "TBA", active: true },
    ],
  },
];

const PROMPT_EXAMPLES = [
  { tag: "CREATIVE", prompt: "Design a sci-fi movie poster for an AI uprising story with dark neon aesthetics", model: "GPT-4o", time: "0.8s" },
  { tag: "CODE", prompt: "Write a Python function that detects AI-generated text using perplexity scoring", model: "Claude 3.5", time: "1.2s" },
  { tag: "STRATEGY", prompt: "Give me a 5-step marketing plan for launching an AI product to Gen-Z audience", model: "Gemini Pro", time: "0.6s" },
];

// ── Reusable typing animation ──────────────────────────────
function TypingLine({ lines, prefix = "›", className = "", startDelay = 800 }: {
  lines: string[]; prefix?: string; className?: string; startDelay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let lIdx = 0, cIdx = 0, deleting = false;
    let tid: ReturnType<typeof setTimeout>;
    const tick = () => {
      const cur = lines[lIdx];
      if (!deleting) {
        cIdx++;
        if (ref.current) ref.current.textContent = cur.slice(0, cIdx);
        if (cIdx >= cur.length) { deleting = true; tid = setTimeout(tick, 1800); return; }
      } else {
        cIdx = Math.max(0, cIdx - 1);
        if (ref.current) ref.current.textContent = cur.slice(0, cIdx);
        if (cIdx === 0) { deleting = false; lIdx = (lIdx + 1) % lines.length; tid = setTimeout(tick, 350); return; }
      }
      tid = setTimeout(tick, deleting ? 20 : 50);
    };
    tid = setTimeout(tick, startDelay);
    return () => clearTimeout(tid);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={`hero-typer-box ${className}`}>
      <span className="hero-typer-prefix">{prefix} </span>
      <span ref={ref} className="hero-typer-text" />
      <span className="hero-typer-cursor" aria-hidden="true">▎</span>
    </div>
  );
}

// ── Countdown component ────────────────────────────────────
function Countdown() {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const calc = () => {
      const diff = Math.max(0, EVENT_DATE.getTime() - Date.now());
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const iv = setInterval(calc, 1000);
    return () => clearInterval(iv);
  }, []);
  const pad = (n: number) => String(n).padStart(2, "0");
  const units = [
    { v: time.d, l: "DAYS" },
    { v: time.h, l: "HRS" },
    { v: time.m, l: "MIN" },
    { v: time.s, l: "SEC" },
  ];
  return (
    <div className="cd-row">
      {units.map(({ v, l }, i) => (
        <div key={l} className="cd-row__group">
          <div className="cd-row__cell">
            <span className="cd-row__num">{pad(v)}</span>
            <span className="cd-row__lbl">{l}</span>
          </div>
          {i < 3 && <span className="cd-row__colon" aria-hidden="true">:</span>}
        </div>
      ))}
    </div>
  );
}

// ── Prize counter ──────────────────────────────────────────
function PrizeCounter() {
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          let cur = 0;
          const target = 50000;
          const step = Math.ceil(target / 80);
          const iv = setInterval(() => {
            cur = Math.min(cur + step, target);
            setVal(cur);
            if (cur >= target) clearInterval(iv);
          }, 18);
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fmt = (n: number) =>
    "₹" + n.toLocaleString("en-IN");

  return (
    <div ref={ref} className="prize-counter">
      <span className="prize-counter__label">TOTAL PRIZE POOL</span>
      <span className="prize-counter__num">{fmt(val)}</span>
      <span className="prize-counter__sub">up for grabs · 30 OCT 2026</span>
    </div>
  );
}


function RegisterModal({ onClose }: { onClose: () => void }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("INITIALIZING BATTLE PORTAL...");
  const isFormConfigured = REGISTRATION_LINK && REGISTRATION_LINK !== "YOUR_GOOGLE_FORM_LINK";

  useEffect(() => {
    const startTime = Date.now();
    const duration = 2400;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 35) {
        setStatusText("INITIALIZING BATTLE PORTAL...");
      } else if (pct < 70) {
        setStatusText("CONNECTING TO SJBIT VIGYANTRA...");
      } else if (pct < 98) {
        setStatusText(isFormConfigured ? "PREPARING REGISTRATION FORM..." : "CHECKING REGISTRATION STATUS...");
      } else {
        setStatusText(isFormConfigured ? "REDIRECTING NOW..." : "REGISTRATION LINK COMING SOON!");
      }

      if (pct >= 100) {
        clearInterval(interval);
        if (isFormConfigured) {
          setTimeout(() => {
            window.open(REGISTRATION_LINK, "_blank", "noopener,noreferrer");
            onClose();
          }, 350);
        }
      }
    }, 30);

    return () => clearInterval(interval);
  }, [onClose, isFormConfigured]);

  const handleManualOpen = () => {
    if (isFormConfigured) {
      window.open(REGISTRATION_LINK, "_blank", "noopener,noreferrer");
    }
    onClose();
  };

  return (
    <div className="register-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="register-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="register-modal-close" onClick={onClose} aria-label="Close modal">✕</button>
        
        {/* Animated Quantum Scanner Core */}
        <div className="reg-loader-core" aria-hidden="true">
          <div className="reg-loader-ring reg-loader-ring--outer" />
          <div className="reg-loader-ring reg-loader-ring--inner" />
          <div className="reg-loader-pulse" />
          <div className="reg-loader-node">
            <span className="reg-loader-pct">{progress}%</span>
          </div>
        </div>

        <div className="reg-modal-content">
          <span className="reg-modal-tag">SJBIT × VIGYANTRA 2026</span>
          <h3 className="reg-modal-title">{statusText}</h3>
          
          {/* Progress track */}
          <div className="reg-progress-track">
            <div className="reg-progress-bar" style={{ width: `${progress}%` }} />
          </div>

          <p className="reg-modal-desc">
            {isFormConfigured
              ? "Redirecting you to the official Google Form registration page…"
              : "Registration link will be updated here shortly by coordinators."}
          </p>

          {isFormConfigured ? (
            <button className="reg-fallback-btn" onClick={handleManualOpen}>
              Click here if not redirected automatically →
            </button>
          ) : (
            <button className="reg-fallback-btn" onClick={onClose}>
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── FAQ item ───────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? "faq-item--open" : ""}`}>
      <button className="faq-item__q" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <span className="faq-item__q-text">{q}</span>
        <span className="faq-item__icon" aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      {open && <p className="faq-item__a">{a}</p>}
    </div>
  );
}

const HERO_PROMPTS = [
  "Generate a cinematic poster for 'AI Prompt Battle 2026'...",
  "Write Python code to build a sentiment analysis model...",
  "Design a logo representing human-AI collaboration...",
  "Summarise transformer architecture in 5 bullet points...",
];
const ARENA_PROMPTS = [
  "Explain diffusion models to a 10-year-old in 3 sentences...",
  "Write a haiku about the moment AI becomes sentient...",
  "Generate 5 startup names for an AI healthcare app...",
];
const INFO_PROMPTS = [
  "Who can participate in the AI Prompt Battle?",
  "What is the prize pool for Vigyantra 2026?",
  "When and where is the event happening?",
];
const CTA_PROMPTS = [
  "I want to register for AI Prompt Battle 2026...",
  "What makes a perfect AI prompt?",
  "Join the battle. Think. Prompt. Create.",
];

export default function Home() {
  const [loading, setLoading]       = useState(true);
  const [showRegModal, setShowRegModal] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navRef         = useRef<HTMLElement>(null);
  const heroTrackRef   = useRef<HTMLElement>(null);
  const handRobotRef   = useRef<HTMLDivElement>(null);
  const handHumanRef   = useRef<HTMLDivElement>(null);
  const fingerGlowRef  = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const ed1Ref         = useRef<HTMLElement>(null);
  const ed2Ref         = useRef<HTMLElement>(null);
  const ed3Ref         = useRef<HTMLElement>(null);
  const promptArenaRef = useRef<HTMLElement>(null);

  const openRegister = () => setShowRegModal(true);

  // ── Loader ─────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 3500);
    return () => clearTimeout(t);
  }, []);

  // ── Nav scrolled rounding ──────────────────────────────
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const onScroll = () => {
      nav.classList.toggle("cin-nav--scrolled", window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── GSAP ───────────────────────────────────────────────
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis();
    lenis.on("scroll", () => ScrollTrigger.update());
    gsap.ticker.add((time: number) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    const isMobile = window.innerWidth <= 768;
    const vw = window.innerWidth;
    const robotEl = handRobotRef.current, humanEl = handHumanRef.current;
    const glowEl = fingerGlowRef.current, contentEl = heroContentRef.current;
    const track = heroTrackRef.current;

    if (robotEl && humanEl && glowEl && contentEl && track) {
      gsap.set(robotEl,   { x: -vw * (isMobile ? 0.52 : 0.58), opacity: 0 });
      gsap.set(humanEl,   { x:  vw * (isMobile ? 0.52 : 0.58), opacity: 0 });
      gsap.set(glowEl,    { opacity: 0, scale: 0.4 });
      gsap.set(contentEl, { y: 40, opacity: 0 });
      const closeBy = vw * 0.03;
      const tl = gsap.timeline({ scrollTrigger: { trigger: track, start: "top top", end: "bottom bottom", scrub: 1.8 } });
      tl.to(robotEl,   { x: 0, opacity: 1, duration: 0.7, ease: "power2.out" }, 0)
        .to(humanEl,   { x: 0, opacity: 1, duration: 0.7, ease: "power2.out" }, 0)
        .to(contentEl, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 0)
        .to(robotEl,   { x:  closeBy, duration: 1.0, ease: "power1.inOut" }, 0.8)
        .to(humanEl,   { x: -closeBy, duration: 1.0, ease: "power1.inOut" }, 0.8)
        .to(glowEl,    { opacity: 0.8, scale: 1, duration: 0.8, ease: "power2.out" }, 1.2);
    }

    const animateEd = (ref: React.RefObject<HTMLElement | null>) => {
      if (!ref.current) return;
      const words = ref.current.querySelectorAll(".ed-word-inner");
      if (!words.length) return;
      gsap.fromTo(words, { y: "110%", opacity: 0 }, { y: "0%", opacity: 1, duration: 0.9, stagger: 0.07, ease: "power3.out", scrollTrigger: { trigger: ref.current, start: "top 80%" } });
    };
    animateEd(ed1Ref); animateEd(ed2Ref); animateEd(ed3Ref);

    if (promptArenaRef.current) {
      gsap.fromTo(".prompt-card", { y: 60, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: "power3.out", scrollTrigger: { trigger: promptArenaRef.current, start: "top 75%" } });
      gsap.fromTo(".arena-title-line", { x: -60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: "power3.out", scrollTrigger: { trigger: promptArenaRef.current, start: "top 80%" } });
    }
    gsap.fromTo(".ev-item", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "power2.out", scrollTrigger: { trigger: ".info-section", start: "top 78%" } });
    gsap.fromTo(".rules-list__item", { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: "power2.out", scrollTrigger: { trigger: ".rules-list", start: "top 82%" } });
    gsap.fromTo(".fca-inner > *", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: ".fca-section", start: "top 78%" } });
    gsap.fromTo(".prize-tier", { y: 50, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.14, ease: "power3.out", scrollTrigger: { trigger: ".prize-section", start: "top 78%" } });
    gsap.fromTo(".faq-item", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power2.out", scrollTrigger: { trigger: ".faq-section", start: "top 80%" } });

    // ── Entry animations ───────────────────────────────
    gsap.utils.toArray<HTMLElement>(".cin-label-sm").forEach(el => {
      gsap.fromTo(el, { y: -22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 88%" } });
    });
    const headings = gsap.utils.toArray<HTMLElement>(".coords-title, .prompt-arena__title, .fca-h2, .rules-panel__title, .prize-title, .faq-title");
    headings.forEach((el, i) => {
      gsap.fromTo(el, { x: i % 2 === 0 ? -70 : 70, opacity: 0 }, { x: 0, opacity: 1, duration: 0.85, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 84%" } });
    });
    gsap.utils.toArray<HTMLElement>(".ed-sub-text, .fca-sub, .prompt-arena__sub, .fca-meta").forEach(el => {
      gsap.fromTo(el, { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 87%" } });
    });
    gsap.fromTo(".coord-card:first-of-type", { x: -55, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: "power2.out", scrollTrigger: { trigger: ".coords-info-row", start: "top 82%" } });
    gsap.fromTo(".coord-card:last-of-type", { x: 55, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, delay: 0.12, ease: "power2.out", scrollTrigger: { trigger: ".coords-info-row", start: "top 82%" } });
    gsap.utils.toArray<HTMLElement>(".hero-typer-box").forEach(el => {
      gsap.fromTo(el, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 90%" } });
    });
    gsap.fromTo(".prompt-card__tag", { x: 18, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out", scrollTrigger: { trigger: ".prompt-cards-grid", start: "top 82%" } });
    gsap.fromTo(".rules-panel__head", { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: ".rules-panel", start: "top 82%" } });

    return () => { ScrollTrigger.getAll().forEach(st => st.kill()); lenis.destroy(); };
  }, []);

  const smoothTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div className="grain-layer" aria-hidden="true" />
      {showRegModal && <RegisterModal onClose={() => setShowRegModal(false)} />}

      {/* Mobile nav overlay */}
      {mobileOpen && (
        <div className="mobile-nav-overlay" onClick={() => setMobileOpen(false)}>
          <div className="mobile-nav-drawer" onClick={e => e.stopPropagation()}>
            <button className="mobile-nav-close" onClick={() => setMobileOpen(false)} aria-label="Close menu">✕</button>
            <a href="#top"           className="mobile-nav-link" onClick={(e) => smoothTo(e, "top")}>HOME</a>
            <a href="#event-section" className="mobile-nav-link" onClick={(e) => smoothTo(e, "event-section")}>ABOUT</a>
            <a href="#coordinators"  className="mobile-nav-link" onClick={(e) => smoothTo(e, "coordinators")}>TEAM</a>
            <a href="#faq"           className="mobile-nav-link" onClick={(e) => smoothTo(e, "faq")}>FAQ</a>
            <a href="#register"      className="mobile-nav-link" onClick={(e) => smoothTo(e, "register")}>REGISTER</a>
            <CreepyButton onClick={() => { setMobileOpen(false); openRegister(); }} coverClassName="!bg-[#E5E7EB] !text-[#0A0A0F] font-extrabold tracking-widest text-sm w-full justify-center">
              REGISTER NOW →
            </CreepyButton>
          </div>
        </div>
      )}

      {loading && (
        <div className="cin-loader" aria-live="polite">
          <div className="cin-loader__bg" aria-hidden="true" />
          <div className="cin-loader__inner">
            <div className="cin-loader__line cin-loader__line--top" aria-hidden="true" />
            <div className="cin-loader__wordmark">
              {"VIGYANTRA".split("").map((ch, i) => (
                <span key={i} className="cin-loader__char" style={{ animationDelay: `${0.05 + i * 0.07}s` }}>{ch}</span>
              ))}
            </div>
            <div className="cin-loader__sub">
              <span className="cin-loader__x">× AI</span>
              <span className="cin-loader__year">2026</span>
            </div>
            <div className="cin-loader__line cin-loader__line--bottom" aria-hidden="true" />
          </div>
        </div>
      )}

      {/* NAV */}
      <nav ref={navRef} className="cin-nav cin-nav--scroll" aria-label="Main navigation">
        <a href="#top" className="cin-nav__brand" onClick={(e) => smoothTo(e, "top")}>VIGYANTRA <span>× AI</span></a>
        <div className="cin-nav__links">
          <LineHoverLink variant="slide" href="#event-section" onClick={(e) => smoothTo(e as React.MouseEvent<HTMLAnchorElement>, "event-section")} className="cin-nav__link">ABOUT</LineHoverLink>
          <LineHoverLink variant="slide" href="#coordinators"  onClick={(e) => smoothTo(e as React.MouseEvent<HTMLAnchorElement>, "coordinators")}  className="cin-nav__link">TEAM</LineHoverLink>
          <LineHoverLink variant="slide" href="#faq"           onClick={(e) => smoothTo(e as React.MouseEvent<HTMLAnchorElement>, "faq")}           className="cin-nav__link">FAQ</LineHoverLink>
          <CreepyButton onClick={openRegister} className="!min-w-0 text-xs" coverClassName="!bg-[#E5E7EB] !text-[#0A0A0F] font-extrabold tracking-widest !text-xs !px-4 !py-1.5 !rounded-full">
            REGISTER
          </CreepyButton>
        </div>
        {/* Hamburger */}
        <button className="cin-nav__hamburger" onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <span /><span /><span />
        </button>
      </nav>

      <main>
        {/* HERO */}
        <section ref={heroTrackRef} className="hero-track" id="top" aria-label="Hero">
          <div className="hero-sticky">
            <div className="hands-stage" aria-hidden="true">
              <div className="hand-clip hand-clip--robot">
                <div ref={handRobotRef} className="hand-wrap hand-wrap--robot">
                  <Image src="/robot_hand.jpg" alt="Robotic AI hand" fill sizes="50vw" style={{ objectFit: "contain", objectPosition: "right center" }} priority />
                </div>
              </div>
              <div className="hand-clip hand-clip--human">
                <div ref={handHumanRef} className="hand-wrap hand-wrap--human">
                  <Image src="/human_hand.jpg" alt="Human hand" fill sizes="50vw" style={{ objectFit: "contain", objectPosition: "left center" }} priority />
                </div>
              </div>
              <div ref={fingerGlowRef} className="finger-glow" aria-hidden="true" />
            </div>
            <div className="hero-overlay" aria-hidden="true" />
            <div ref={heroContentRef} className="hero-content">
              <span className="cin-label">SJBIT × VIGYANTRA 2026</span>
              <h1 className="hero-h1">AI PROMPT<br />BATTLE</h1>
              <p className="hero-tagline">Think. Prompt. Create.</p>
              <div className="hero-chips">
                <span>30 OCT 2026</span>
                <span>SJBIT, BENGALURU</span>
                <span>₹50,000 PRIZE</span>
              </div>
              <TypingLine lines={HERO_PROMPTS} startDelay={1400} />
              <CreepyButton onClick={openRegister} coverClassName="!bg-[#E5E7EB] !text-[#0A0A0F] font-extrabold tracking-widest text-sm">
                REGISTER NOW →
              </CreepyButton>
            </div>
            <div className="scroll-hint" aria-label="Scroll to explore">
              <span className="scroll-hint__label">SCROLL</span>
              <div className="scroll-hint__line" />
            </div>
          </div>
        </section>

        {/* COUNTDOWN BANNER */}
        <div className="countdown-banner" aria-label="Event countdown">
          <div className="countdown-banner__inner">
            <span className="countdown-banner__label">EVENT STARTS IN</span>
            <div className="countdown-banner__timer">
              <div className="cd-cell">
                <Countdown />
              </div>
            </div>
            <span className="countdown-banner__date">30 OCTOBER 2026 · SJBIT, BENGALURU</span>
          </div>
        </div>

        {/* EDITORIAL 1 */}
        <section ref={ed1Ref} className="ed-section" id="event-section" aria-label="Editorial">
          <div className="ed-block">
            <div className="ed-line">
              <div className="ed-word"><span className="ed-word-inner">PROMPTS</span></div>
              <div className="ed-word ed-word--accent"><span className="ed-word-inner">THAT</span></div>
            </div>
            <div className="ed-line ed-line--shift">
              <div className="ed-word ed-word--thin"><span className="ed-word-inner">THINK</span></div>
              <div className="ed-word"><span className="ed-word-inner">AHEAD.</span></div>
            </div>
          </div>
          <div className="ed-sub-row">
            <p className="ed-sub-text">Craft intelligent prompts that push the boundaries of AI.<br />Compete. Create. Conquer.</p>
            <TypingLine lines={ARENA_PROMPTS} prefix="✦" className="typer--editorial" startDelay={400} />
          </div>
        </section>

        {/* PROMPT ARENA */}
        <section ref={promptArenaRef} className="prompt-arena" aria-label="Prompt examples">
          <div className="prompt-arena__inner">
            <div className="prompt-arena__header">
              <span className="cin-label-sm">THE ARENA</span>
              <h2 className="prompt-arena__title">
                <span className="arena-title-line">CRAFT THE</span>
                <span className="arena-title-line arena-title-line--accent">PERFECT PROMPT.</span>
              </h2>
              <p className="prompt-arena__sub">Real prompts. Real results. Real competition.</p>
            </div>
            <div className="prompt-cards-grid">
              {PROMPT_EXAMPLES.map((ex, i) => (
                <div key={i} className="prompt-card">
                  <div className="prompt-card__top">
                    <span className="prompt-card__tag">{ex.tag}</span>
                    <span className="prompt-card__model">{ex.model}</span>
                  </div>
                  <div className="prompt-card__body">
                    <span className="prompt-card__icon">›</span>
                    <p className="prompt-card__text">{ex.prompt}</p>
                  </div>
                  <div className="prompt-card__foot">
                    <span className="prompt-card__time">⚡ {ex.time} response</span>
                    <span className="prompt-card__dot-row"><span /><span /><span /></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>



        {/* PRIZE BREAKDOWN */}
        <section className="prize-section" aria-label="Prize breakdown">
          <div className="prize-section__inner">
            <PrizeCounter />
            <div className="prize-divider" aria-hidden="true" />
            <h2 className="section-heading-left">PRIZE BREAKDOWN</h2>
            <p className="prize-sub">More teams registered = bigger prize pool. Every registration counts.</p>
            <div className="prize-tiers">
              {PRIZE_TIERS.map((tier, ti) => (
                <div key={ti} className="prize-tier">
                  <div className="prize-tier__badge">{tier.label}</div>
                  <p className="prize-tier__desc">{tier.desc}</p>
                  <div className="prize-tier__list">
                    {tier.prizes.map((p, pi) => (
                      <div key={pi} className="prize-row">
                        <span className="prize-row__place">{p.place} PLACE</span>
                        <span className="prize-row__amount">{p.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* EVENT DETAILS */}
        <section className="info-section" aria-label="Event details">
          <div className="info-section__inner">
            <h2 className="section-heading-left">EVENT DETAILS</h2>
            <div className="ev-details-grid ev-details-grid--hover">
              <div className="ev-item">
                <span className="ev-item__k">WHEN</span>
                <LineHoverLink variant="double" href="#" className="ev-item__v ev-hover-link">30 OCT 2026</LineHoverLink>
              </div>
              <div className="ev-item">
                <span className="ev-item__k">WHERE</span>
                <LineHoverLink variant="double" href="#" className="ev-item__v ev-hover-link">SJBIT, BENGALURU</LineHoverLink>
              </div>
              <div className="ev-item">
                <span className="ev-item__k">TEAM SIZE</span>
                <LineHoverLink variant="double" href="#" className="ev-item__v ev-hover-link">4 MEMBERS</LineHoverLink>
              </div>
              <div className="ev-item">
                <span className="ev-item__k">REG FEE</span>
                <LineHoverLink variant="double" href="#" className="ev-item__v ev-hover-link">₹400 / TEAM</LineHoverLink>
              </div>
              <div className="ev-item ev-item--prize">
                <span className="ev-item__k">PRIZE POOL</span>
                <span className="ev-item__v ev-item__v--prize">₹50,000</span>
              </div>
            </div>
            <TypingLine lines={INFO_PROMPTS} prefix="?" className="typer--info" startDelay={600} />
          </div>
        </section>

        {/* EDITORIAL 2 */}
        <section ref={ed2Ref} className="ed-section ed-section--alt" aria-label="Editorial 2">
          <div className="ed-block">
            <div className="ed-line ed-line--shift-right">
              <div className="ed-word ed-word--thin"><span className="ed-word-inner">IMAGINATION</span></div>
            </div>
            <div className="ed-line">
              <div className="ed-word ed-word--accent"><span className="ed-word-inner">MEETS</span></div>
              <div className="ed-word"><span className="ed-word-inner">AI.</span></div>
            </div>
          </div>
          <div className="ed-sub-row ed-sub-row--end">
            <CreepyButton onClick={openRegister} coverClassName="!bg-[#E5E7EB] !text-[#0A0A0F] font-extrabold tracking-widest text-sm">
              REGISTER NOW →
            </CreepyButton>
          </div>
        </section>

        {/* EDITORIAL 3 */}
        <section ref={ed3Ref} className="ed-section" aria-label="Editorial 3">
          <div className="ed-block ed-block--center">
            <div className="ed-line ed-line--center">
              <div className="ed-word ed-word--thin"><span className="ed-word-inner">ONE PROMPT.</span></div>
            </div>
            <div className="ed-line ed-line--center">
              <div className="ed-word ed-word--accent ed-word--xl"><span className="ed-word-inner">INFINITE</span></div>
            </div>
            <div className="ed-line ed-line--center">
              <div className="ed-word"><span className="ed-word-inner">POSSIBILITIES.</span></div>
            </div>
          </div>
        </section>

        {/* GENERAL RULES */}
        <section className="coords-section" aria-label="General Rules">
          <div className="coords-inner">
            <div className="rules-panel">
              <div className="rules-panel__head">
                <span className="cin-label-sm">COMPETITION</span>
                <h3 className="rules-panel__title">GENERAL RULES.</h3>
              </div>
              <ol className="rules-list">
                {RULES.map((rule, i) => (
                  <li key={i} className="rules-list__item">
                    <span className="rules-list__num">{String(i + 1).padStart(2, "0")}</span>
                    <AsciiGlitchRipple as="span" className="rules-list__text rules-list__text--glitch" dur={900} spread={1.2}>{rule}</AsciiGlitchRipple>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="faq-section" id="faq" aria-label="FAQ">
          <div className="faq-inner">
            <span className="cin-label-sm">GOT QUESTIONS?</span>
            <h2 className="faq-title">FREQUENTLY<br />ASKED.</h2>
            <div className="faq-list">
              {FAQS.map((item, i) => <FaqItem key={i} q={item.q} a={item.a} />)}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="fca-section" id="register" aria-label="Registration">
          <div className="fca-glow" aria-hidden="true" />
          <div className="fca-inner">
            <span className="cin-label-sm">THE FINAL CALL</span>
            <h2 className="fca-h2">READY TO<br />ENTER?</h2>
            <p className="fca-sub">Bring your ideas. Build your prompts. Make your impact.</p>
            <div className="fca-meta">
              <span>30 OCTOBER 2026</span><span className="fca-dot">·</span>
              <span>SJBIT, BENGALURU</span>
            </div>
            <TypingLine lines={CTA_PROMPTS} prefix="›" className="typer--cta" startDelay={500} />
            <CreepyButton onClick={openRegister} className="text-lg" coverClassName="!bg-[#E5E7EB] !text-[#0A0A0F] font-extrabold tracking-widest !text-base px-8 py-3">
              REGISTER NOW →
            </CreepyButton>
          </div>
        </section>

        {/* COORDINATORS */}
        <section className="coords-section" id="coordinators" aria-label="Coordinators">
          <div className="coords-inner">
            <span className="cin-label-sm">EVENT COORDINATORS</span>
            <div className="coords-avatars-wrap">
              <MaskedAvatars
                avatars={[
                  { avatar: "/hemanth.jpg", name: "Hemanth U" },
                  { avatar: "/ayush.jpg", name: "A.Aayush Sharma" },
                ]}
                size={96} column={52} ringed={true} movement={0.85} blurOnRest={true}
              />
            </div>
            <div className="coords-info-row">
              <div className="coord-card"><span className="coord-name">HEMANTH U</span><a href="tel:9916749639" className="coord-phone">📞 9916749639</a></div>
              <div className="coords-divider" aria-hidden="true" />
              <div className="coord-card"><span className="coord-name">A.AAYUSH SHARMA</span><a href="tel:9008016477" className="coord-phone">📞 9008016477</a></div>
            </div>
          </div>
        </section>

      </main>

      <footer className="cin-footer" role="contentinfo">
        <span>AI Prompt Battle 2026 · SJBIT, Bengaluru · Vigyantra</span>
        <a href="#top" onClick={(e) => smoothTo(e, "top")}>↑ Back to top</a>
      </footer>
    </>
  );
}
