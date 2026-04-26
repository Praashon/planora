import Navbar from "components/Navbar";
import type { Route } from "./+types/home";
import {
  ArrowRight,
  ArrowUpRight,
  Box,
  Clock,
  Download,
  GitCompareArrows,
  Layers,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Button } from "components/ui/Button";
import Upload from "components/Upload";
import { useNavigate } from "react-router";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createProject, deleteProject, getProject } from "lib/puter.action";
import { useToast } from "components/Toast";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Planora — AI-First Floor Plan to 3D Render" },
    {
      name: "description",
      content:
        "Planora converts 2D floor plans into photorealistic top-down 3D architectural renders using AI. Upload, visualize, compare, and export.",
    },
    {
      property: "og:title",
      content: "Planora — AI-First Floor Plan to 3D Render",
    },
    {
      property: "og:description",
      content: "Convert 2D floor plans into photorealistic 3D renders with AI.",
    },
    { name: "twitter:card", content: "summary_large_image" },
  ];
}

export default function Home() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projects, setProjects] = useState<DesignItem[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const isCreatingProjectRef = useRef(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const uploadShellRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const projectsHeadRef = useRef<HTMLDivElement>(null);
  const projectsGridRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      if (headingRef.current) {
        const el = headingRef.current;
        const fullText = el.textContent?.trim().replace(/\+s/g, " ") ?? "";
        const accentStart = fullText.indexOf("speed of thought");
        el.innerHTML = "";
        el.style.opacity = "1";
        el.classList.add("typing");
        const obj = { length: 0 };
        tl.to(
          obj,
          {
            length: fullText.length,
            duration: 2,
            ease: "none",
            onUpdate: () => {
              const idx = Math.round(obj.length);
              const typed = fullText.slice(0, idx);
              const accentStart = fullText.indexOf("speed of thought");
              if (idx > accentStart) {
                el.innerHTML =
                  typed.slice(0, accentStart) +
                  '<span class="accent">' +
                  typed.slice(accentStart) +
                  "</span>";
              } else {
                el.textContent = typed;
              }
            },
            onComplete: () => {
              el.classList.remove("typing");
            },
          },
          0.3,
        );
      }

      if (subtitleRef.current) {
        tl.fromTo(
          subtitleRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          2.0,
        );
      }

      if (actionsRef.current) {
        tl.fromTo(
          actionsRef.current.children,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.12 },
          2.5,
        );
      }

      if (uploadShellRef.current) {
        tl.fromTo(
          uploadShellRef.current,
          { opacity: 0, y: 40, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 1 },
          0.5,
        );
        gsap.to(uploadShellRef.current, {
          y: -8,
          duration: 3,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: 2,
        });
      }

      if (featuresRef.current) {
        gsap.fromTo(
          featuresRef.current.querySelectorAll(".feature-card"),
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: featuresRef.current,
              start: "top 80%",
              once: true,
            },
          },
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (projectsHeadRef.current) {
        gsap.fromTo(
          projectsHeadRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: projectsHeadRef.current,
              start: "top 85%",
              once: true,
            },
          },
        );
      }

      if (projectsGridRef.current) {
        gsap.fromTo(
          projectsGridRef.current.children,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: projectsGridRef.current,
              start: "top 85%",
              once: true,
            },
          },
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, [isLoadingProjects, projects]);

  const handleUploadComplete = async (base64Image: string) => {
    try {
      if (isCreatingProjectRef.current) return false;
      isCreatingProjectRef.current = true;

      const newId = Date.now().toString();
      const name = `Residence ${newId}`;

      const newItem = {
        id: newId,
        name,
        sourceImage: base64Image,
        renderedImage: undefined,
        timestamp: Date.now(),
      };

      const saved = await createProject({
        item: newItem,
        visibility: "private",
      });

      const projectToUse = saved || newItem;

      if (!saved) {
        console.warn("Project save failed, proceeding with local data.");
        toast("Project saved locally — cloud sync unavailable.", "warning");
      }

      setProjects((prev) => [projectToUse, ...prev]);

      navigate(`/visualizer/${newId}`, {
        state: {
          initialImage: projectToUse.sourceImage,
          initialRendered: projectToUse.renderedImage || null,
          name,
        },
      });

      return true;
    } finally {
      isCreatingProjectRef.current = false;
    }
  };

  const handleDelete = async (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    const confirmed = window.confirm(
      "Delete this project? This cannot be undone.",
    );
    if (!confirmed) return;

    const ok = await deleteProject({ id: projectId });
    if (ok) {
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      toast("Project deleted.", "success");
    } else {
      toast("Failed to delete project.", "error");
    }
  };

  useEffect(() => {
    const fetchProject = async () => {
      setIsLoadingProjects(true);
      try {
        const items = await getProject();
        setProjects(items);
      } catch {
        toast("Failed to load projects.", "error");
      } finally {
        setIsLoadingProjects(false);
      }
    };

    fetchProject();
  }, []);

  return (
    <div className="home" ref={heroRef}>
      <Navbar />

      {/* ─── Hero ─── */}
      <section className="hero">
        <div className="hero-content">
          <h1 ref={headingRef} style={{ opacity: 0 }}>
            Build beautiful spaces at the{" "}
            <span className="accent">speed of thought</span>
          </h1>

          <p ref={subtitleRef} className="subtitle" style={{ opacity: 0 }}>
            Planora is an AI-first design tool that transforms 2D floor plans
            into photorealistic 3D architectural renders in seconds.
          </p>

          <div ref={actionsRef} className="actions">
            <a href="#upload" className="cta">
              Start Building <ArrowRight className="icon" />
            </a>
            <Button variant="outline" size="lg" className="demo">
              Watch Demo
            </Button>
          </div>
        </div>

        <div className="hero-visual">
          <div
            id="upload"
            ref={uploadShellRef}
            className="upload-shell"
            style={{ opacity: 0 }}
          >
            <div className="grid-overlay" />
            <div className="upload-card">
              <div className="upload-head">
                <div className="upload-icon">
                  <Layers size={24} />
                </div>
                <h3>Upload your floor plan</h3>
                <p>Supports JPG, PNG format up to 50 MB</p>
              </div>
              <Upload onComplete={handleUploadComplete} fileSizeLimit={50} />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features Strip ─── */}
      <section className="features">
        <div className="features-inner" ref={featuresRef}>
          <p className="features-label">Why Planora</p>
          <div className="features-grid">
            <div className="feature-card relative cursor-pointer">
              <div className="feature-icon">
                <Sparkles size={22} />
              </div>
              <h4>AI-Powered Renders</h4>
              <p>
                Transform any floor plan into a photorealistic 3D visualization
                using cutting-edge generative AI.
              </p>
            </div>
            <div className="feature-card relative cursor-pointer">
              <div className="feature-icon">
                <GitCompareArrows size={22} />
              </div>
              <h4>Before &amp; After</h4>
              <p>
                Interactive comparison slider lets you see the transformation
                side-by-side in real time.
              </p>
            </div>
            <div className="feature-card relative cursor-pointer">
              <div className="feature-icon">
                <Download size={22} />
              </div>
              <h4>One-Click Export</h4>
              <p>
                Download high-resolution renders instantly or share a link with
                your team and clients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Projects ─── */}
      <section className="projects">
        <div className="section-inner">
          <div
            ref={projectsHeadRef}
            className="section-head"
            style={{ opacity: 0 }}
          >
            <div className="copy">
              <h2>Your Projects</h2>
              <p>Recent work and shared community renders</p>
            </div>
          </div>

          <div ref={projectsGridRef} className="projects-grid">
            {isLoadingProjects ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-preview" />
                  <div className="skeleton-body">
                    <div className="skeleton-title" />
                    <div className="skeleton-meta" />
                  </div>
                </div>
              ))
            ) : projects.length === 0 ? (
              <div className="empty">
                No projects yet - upload a floor plan to get started.
              </div>
            ) : (
              projects.map(
                ({
                  id,
                  name,
                  sourceImage,
                  renderedImage,
                  timestamp,
                  sharedBy,
                }) => (
                  <div
                    key={id}
                    className="project-card"
                    onClick={() => navigate(`/visualizer/${id}`)}
                  >
                    <div className="preview">
                      <img
                        src={renderedImage || sourceImage}
                        alt={name || "Project"}
                        loading="lazy"
                      />
                      <div className="badge">
                        <span>Community</span>
                      </div>
                      <button
                        className="delete-btn"
                        onClick={(e) => handleDelete(e, id)}
                        aria-label={`Delete ${name || "project"}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="card-body">
                      <div>
                        <h3>{name}</h3>
                        <div className="meta">
                          <Clock size={12} />
                          <span>
                            {new Date(timestamp).toLocaleDateString()}
                          </span>
                          <span>By {sharedBy || "You"}</span>
                        </div>
                      </div>
                      <div className="arrow">
                        <ArrowUpRight size={18} />
                      </div>
                    </div>
                  </div>
                ),
              )
            )}
          </div>
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
            <a href="#">Product</a>
            <a href="#">Community</a>
            <a href="#">GitHub</a>
          </div>
          <span className="footer-copy">
            &copy; {new Date().getFullYear()} Planora. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}
