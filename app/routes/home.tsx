import Navbar from "components/Navbar";
import type { Route } from "./+types/home";
import { ArrowRight, ArrowUpRight, Clock, Layers, Trash2 } from "lucide-react";
import { Button } from "components/ui/Button";
import Upload from "components/Upload";
import { useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";
import { createProject, deleteProject, getProject } from "lib/puter.action";
import { useToast } from "components/Toast";

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

      // Optimistic update: use local item if save fails
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
    <div className="home">
      <Navbar />
      <section className="hero">
        <div className="hero-content">
          <div className="announce">
            <div className="dot">
              <div className="pulse"></div>
            </div>

            <p>Introducing Planora 2.0</p>
          </div>

          <h1>Build beautiful spaces at the speed of thought with Planora</h1>

          <p className="subtitle">
            Planora is an AI-FIRST powerful design tool that helps you create
            beautiful and functional spaces.
          </p>

          <div className="actions">
            <a href="#upload" className="cta">
              Start Building <ArrowRight className="icon" />
            </a>

            <Button variant="outline" size="lg" className="demo">
              Watch Demo!
            </Button>
          </div>
        </div>

        <div className="hero-visual">
          <div id="upload" className="upload-shell">
            <div className="grid-overlay" />
            <div className="upload-card">
              <div className="upload-head">
                <div className="upload-icon">
                  <Layers className="icon" />
                </div>

                <h3>Upload your floor plan</h3>
                <p>Supports JPG, PNG format up to 50 MB</p>
              </div>

              <Upload onComplete={handleUploadComplete} fileSizeLimit={50} />
            </div>
          </div>
        </div>
      </section>

      <section className="projects">
        <div className="section-inner">
          <div className="section-head">
            <div className="copy">
              <h2>Projects</h2>
              <p>
                Your latest work and shared community projects, all in one
                place.
              </p>
            </div>
          </div>

          <div className="projects-grid">
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
                No projects yet — upload a floor plan to get started.
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
                    className="project-card group"
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
                          <Clock className="icon" size={12} />

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
    </div>
  );
}
