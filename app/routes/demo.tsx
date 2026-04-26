import Navbar from "components/Navbar";
import type { Route } from "./+types/demo";
import { DEMO_ITEMS, type DemoItem } from "lib/demo-data";
import { Box, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useLayoutEffect, useRef, useState, useCallback, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";

gsap.registerPlugin(ScrollTrigger);

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Demo Gallery — Planora" },
    {
      name: "description",
      content:
        "Explore sample floor plan to 3D render transformations created by Planora.",
    },
  ];
}

export default function Demo() {
  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const [activeDemo, setActiveDemo] = useState<DemoItem | null>(null);
  const [autoPlay, setAutoPlay] = useState(false);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activeIndex = activeDemo
    ? DEMO_ITEMS.findIndex((d) => d.id === activeDemo.id)
    : -1;

  const handlePrev = useCallback(() => {
    if (activeIndex <= 0) return;
    setActiveDemo(DEMO_ITEMS[activeIndex - 1]);
  }, [activeIndex]);

  const handleNext = useCallback(() => {
    if (activeIndex >= DEMO_ITEMS.length - 1) return;
    setActiveDemo(DEMO_ITEMS[activeIndex + 1]);
  }, [activeIndex]);

  useEffect(() => {
    if (!autoPlay || !activeDemo) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      return;
    }

    autoPlayRef.current = setInterval(() => {
      setActiveDemo((prev) => {
        if (!prev) return DEMO_ITEMS[0];
        const idx = DEMO_ITEMS.findIndex((d) => d.id === prev.id);
        return DEMO_ITEMS[(idx + 1) % DEMO_ITEMS.length];
      });
    }, 4000);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [autoPlay, activeDemo]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!activeDemo) return;
      if (e.key === "Escape") setActiveDemo(null);
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeDemo, handlePrev, handleNext]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (heroRef.current) {
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

      if (gridRef.current) {
        gsap.fromTo(
          gridRef.current.querySelectorAll(".demo-card"),
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: gridRef.current,
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
    <div className="demo-gallery" ref={pageRef}>
      <Navbar />

      {/* ─── Hero ─── */}
      <section className="demo-hero" ref={heroRef}>
        <p className="demo-label" style={{ opacity: 0 }}>
          Gallery
        </p>
        <h1 style={{ opacity: 0 }}>
          Demo <span className="accent">Showcase</span>
        </h1>
        <p className="demo-subtitle" style={{ opacity: 0 }}>
          Pre-loaded floor plan transformations. Click any card to explore the
          before/after comparison.
        </p>
      </section>

      {/* ─── Grid ─── */}
      <section className="demo-grid" ref={gridRef}>
        {DEMO_ITEMS.map((item) => (
          <button
            key={item.id}
            className="demo-card"
            style={{ opacity: 0 }}
            onClick={() => {
              setActiveDemo(item);
              setAutoPlay(false);
            }}
          >
            <div className="card-image">
              <img src={item.renderedImage} alt={item.name} />
              <div className="card-overlay">
                <span className="card-badge">{item.style}</span>
              </div>
            </div>
            <div className="card-info">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
            </div>
          </button>
        ))}
      </section>

      {/* ─── Lightbox ─── */}
      {activeDemo && (
        <div
          className="demo-lightbox"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setActiveDemo(null);
              setAutoPlay(false);
            }
          }}
        >
          <div className="lightbox-content">
            <div className="lightbox-header">
              <div>
                <h2>{activeDemo.name}</h2>
                <span className="lightbox-style">{activeDemo.style}</span>
              </div>
              <div className="lightbox-actions">
                <button
                  className={`auto-btn ${autoPlay ? "active" : ""}`}
                  onClick={() => setAutoPlay((p) => !p)}
                >
                  {autoPlay ? "Pause" : "Auto-Cycle"}
                </button>
                <button
                  className="close-btn"
                  onClick={() => {
                    setActiveDemo(null);
                    setAutoPlay(false);
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="lightbox-slider">
              <ReactCompareSlider
                defaultValue={50}
                style={{ width: "100%", height: "100%" }}
                itemOne={
                  <ReactCompareSliderImage
                    src={activeDemo.sourceImage}
                    alt="Floor Plan"
                    style={{
                      width: "100%",
                      height: "100%",
                      maxHeight: "65vh",
                      objectFit: "contain",
                    }}
                  />
                }
                itemTwo={
                  <ReactCompareSliderImage
                    src={activeDemo.renderedImage}
                    alt="3D Render"
                    style={{
                      width: "100%",
                      height: "100%",
                      maxHeight: "65vh",
                      objectFit: "contain",
                    }}
                  />
                }
              />
            </div>

            <div className="lightbox-nav">
              <button
                className="nav-btn"
                onClick={handlePrev}
                disabled={activeIndex <= 0}
              >
                <ChevronLeft size={18} /> Prev
              </button>
              <span className="nav-count">
                {activeIndex + 1} / {DEMO_ITEMS.length}
              </span>
              <button
                className="nav-btn"
                onClick={handleNext}
                disabled={activeIndex >= DEMO_ITEMS.length - 1}
              >
                Next <ChevronRight size={18} />
              </button>
            </div>

            <p className="lightbox-desc">{activeDemo.description}</p>
          </div>
        </div>
      )}

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
