import Navbar from "components/Navbar";
import type { Route } from "./+types/how-it-works";
import {
  Box,
  Upload,
  Cpu,
  Paintbrush,
  ImageDown,
  ArrowRight,
} from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PLANORA_RENDER_PROMPT } from "lib/constants";

gsap.registerPlugin(ScrollTrigger);

export function meta({}: Route.MetaArgs) {
  return [
    { title: "How It Works — Planora" },
    {
      name: "description",
      content:
        "Learn how Planora transforms 2D floor plans into photorealistic 3D renders using AI-powered prompt engineering and Gemini.",
    },
  ];
}

const STEPS = [
  {
    number: "01",
    title: "Upload Your Floor Plan",
    description:
      "Drag and drop a JPG or PNG floor plan image (up to 50 MB). Planora accepts standard architectural floor plans with room labels, door arcs, and window markers.",
    icon: Upload,
    detail:
      "Supported formats: JPG, PNG. The image is converted to a base64 data URL for processing.",
  },
  {
    number: "02",
    title: "AI Analyzes Geometry",
    description:
      "The Gemini vision model interprets walls, doors, windows, and furniture icons from the floor plan. It maps architectural symbols to real-world objects.",
    icon: Cpu,
    detail:
      "Model: gemini-2.5-flash-image-preview via Puter AI. The floor plan is sent as an input image alongside a carefully engineered prompt.",
  },
  {
    number: "03",
    title: "Prompt Engineering Drives the Render",
    description:
      "A detailed prompt instructs the AI on strict requirements: remove text, match geometry exactly, apply realistic materials, and render top-down orthographic view.",
    icon: Paintbrush,
    detail:
      "The prompt includes style overrides when a user selects Modern, Minimalist, Rustic, Industrial, or Scandinavian presets.",
  },
  {
    number: "04",
    title: "Photorealistic Output Delivered",
    description:
      "A 1024×1024 photorealistic top-down 3D render is generated and displayed. Users can compare before/after with a slider, export as PNG, or share a link.",
    icon: ImageDown,
    detail:
      "The rendered image is persisted to cloud storage and associated with your project for future access.",
  },
];

export default function HowItWorks() {
  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const promptRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (heroRef.current) {
        gsap.set(heroRef.current.children, { opacity: 0, y: 30 });
        gsap.fromTo(
          heroRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
          },
        );
      }

      if (stepsRef.current) {
        gsap.set(stepsRef.current.querySelectorAll(".step-card"), {
          opacity: 0,
          y: 50,
        });
        gsap.fromTo(
          stepsRef.current.querySelectorAll(".step-card"),
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: stepsRef.current,
              start: "top 80%",
              once: true,
            },
          },
        );
      }

      if (promptRef.current) {
        gsap.set(promptRef.current, { opacity: 0, y: 40 });
        gsap.fromTo(
          promptRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: promptRef.current,
              start: "top 85%",
              once: true,
            },
          },
        );
      }
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="how-it-works" ref={pageRef}>
      <Navbar />

      {/* ─── Hero ─── */}
      <section className="hiw-hero" ref={heroRef}>
        <p className="hiw-label">Under the Hood</p>
        <h1>
          How <span className="accent">Planora</span> Works
        </h1>
        <p className="hiw-subtitle">
          From a 2D floor plan to a photorealistic 3D render in four steps,
          powered by AI prompt engineering and the Gemini vision model.
        </p>
      </section>

      {/* ─── Steps ─── */}
      <section className="hiw-steps" ref={stepsRef}>
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={step.number} className="step-card">
              <div className="step-number">{step.number}</div>
              <div className="step-icon">
                <Icon size={28} />
              </div>
              <h3>{step.title}</h3>
              <p className="step-desc">{step.description}</p>
              <p className="step-detail">{step.detail}</p>
              {i < STEPS.length - 1 && (
                <div className="step-arrow">
                  <ArrowRight size={16} />
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* ─── Prompt Engineering Showcase ─── */}
      <section className="hiw-prompt" ref={promptRef}>
        <div className="prompt-header">
          <p className="prompt-label">Prompt Engineering</p>
          <h2>The AI Instruction Set</h2>
          <p className="prompt-subtitle">
            This is the exact prompt sent to Gemini to generate each render.
            Every line was iterated to ensure geometry accuracy, text removal,
            and material realism.
          </p>
        </div>
        <div className="prompt-block">
          <div className="prompt-topbar">
            <span className="prompt-dot" />
            <span className="prompt-dot" />
            <span className="prompt-dot" />
            <span className="prompt-filename">planora_render_prompt.txt</span>
          </div>
          <pre className="prompt-code">
            <code>{PLANORA_RENDER_PROMPT}</code>
          </pre>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <Box className="logo" />
            <span>Planora</span>
          </div>
          <div className="footer-links">
            <a href="/">Home</a>
            <a href="/how-it-works">How It Works</a>
            <a href="/demo">Demo</a>
          </div>
          <span className="footer-copy">
            &copy; {new Date().getFullYear()} Planora. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}
