import Button from "components/ui/Button";
import { generate3DView } from "lib/ai.action";
import { createProject, getProjectById } from "lib/puter.action";
import { STYLE_PRESETS, type StylePreset } from "lib/styles";
import { Box, Download, RefreshCcw, Share2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";
import { useNavigate, useOutletContext, useParams } from "react-router";
import { useToast } from "components/Toast";

const VisualizerId = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userId } = useOutletContext<AuthContext>();

  const { toast } = useToast();
  const hasInitialGenerated = useRef(false);

  const [project, setProject] = useState<DesignItem | null>(null);
  const [isProjectLoading, setIsProjectLoading] = useState(true);

  const [isProcessing, setIsProcessing] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<StylePreset>(
    STYLE_PRESETS[0],
  );
  const vizRef = useRef<HTMLDivElement>(null);

  const handleBack = () => navigate("/");

  const handleExport = () => {
    if (!currentImage) return;
    const link = document.createElement("a");
    link.href = currentImage;
    link.download = `planora-export-${id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast("Image exported successfully!", "success");
  };

  const handleShare = async () => {
    if (!id) return;
    const url = `${window.location.origin}/visualizer/${id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast("Link copied to clipboard!", "success");
    } catch {
      toast("Failed to copy link.", "error");
    }
  };

  const runGeneration = async (item: DesignItem, styleId?: string) => {
    if (!id || !item.sourceImage) return;

    try {
      setIsProcessing(true);
      const result = await generate3DView({
        sourceImage: item.sourceImage,
        styleId: styleId ?? selectedStyle.id,
      });

      if (result.renderedImage) {
        setCurrentImage(result.renderedImage);

        const updateItem = {
          ...item,
          renderedImage: result.renderedImage,
          renderedPath: result.renderedPath,
          timestamp: Date.now(),
          ownerId: item.ownerId ?? userId ?? null,
          isPublic: item.isPublic ?? false,
        };

        const saved = await createProject({
          item: updateItem,
          visibility: "private",
        });

        if (saved) {
          setProject(saved);
          setCurrentImage(saved.renderedImage || result.renderedImage);
        }
      }
    } catch (error) {
      console.error("Generation failed: ", error);
      toast("Render generation failed. Please try again.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadProject = async () => {
      if (!id) {
        setIsProjectLoading(false);
        return;
      }

      setIsProjectLoading(true);

      const fetchedProject = await getProjectById({ id });

      if (!isMounted) return;

      setProject(fetchedProject);
      setCurrentImage(fetchedProject?.renderedImage || null);
      setIsProjectLoading(false);
      hasInitialGenerated.current = false;
    };

    loadProject();

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (
      isProjectLoading ||
      hasInitialGenerated.current ||
      !project?.sourceImage
    )
      return;

    if (project.renderedImage) {
      setCurrentImage(project.renderedImage);
      hasInitialGenerated.current = true;
      return;
    }

    hasInitialGenerated.current = true;
    void runGeneration(project);
  }, [project, isProjectLoading]);

  useEffect(() => {
    if (vizRef.current) {
      gsap.fromTo(
        vizRef.current.children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" },
      );
    }
  }, []);

  return (
    <div className="visualizer" ref={vizRef}>
      <nav className="topbar">
        <div className="brand">
          <Box className="logo" />
          <span className="name">Planora</span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleBack} className="exit">
          <X className="icon" /> Exit Editor
        </Button>
      </nav>

      <section className="content">
        <div className="panel">
          <div className="panel-header">
            <div className="panel-meta">
              <p>Project</p>
              <h2>{project?.name || `Residence ${id}`}</h2>
              <p className="note">Created by You</p>
            </div>

            <div className="panel-actions">
              <Button
                size="sm"
                onClick={handleExport}
                className="export"
                disabled={!currentImage}
              >
                <Download className="w-4 h-4 mr-2" /> Export
              </Button>
              <Button
                className="share"
                size="sm"
                onClick={handleShare}
                disabled={!currentImage}
              >
                <Share2 className="w-4 h-4 mr-2" /> Share
              </Button>
            </div>
          </div>

          <div className="style-selector">
            <p className="style-label">Interior Style</p>
            <div className="style-options">
              {STYLE_PRESETS.map((style) => (
                <button
                  key={style.id}
                  className={`style-pill ${selectedStyle.id === style.id ? "active" : ""}`}
                  onClick={() => setSelectedStyle(style)}
                  disabled={isProcessing}
                  title={style.description}
                >
                  <span className="style-icon">{style.icon}</span>
                  <span className="style-name">{style.name}</span>
                </button>
              ))}
            </div>
            {selectedStyle.id !== "default" && currentImage && (
              <Button
                size="sm"
                className="re-render"
                onClick={() =>
                  project && runGeneration(project, selectedStyle.id)
                }
                disabled={isProcessing}
              >
                <RefreshCcw className="w-3.5 h-3.5 mr-2" />
                Re-render with {selectedStyle.name}
              </Button>
            )}
          </div>

          <div className={`render-area ${isProcessing ? "is-processing" : ""}`}>
            {currentImage ? (
              <img src={currentImage} alt="Ai Render" className="render-img" />
            ) : (
              <div className="render-placeholder">
                {project?.sourceImage && (
                  <img
                    src={project?.sourceImage}
                    alt="Original"
                    className="render-fallback"
                  />
                )}
              </div>
            )}

            {isProcessing && (
              <div className="render-overlay">
                <div className="rendering-card">
                  <RefreshCcw className="spinner" />
                  <span className="title">Rendering...</span>
                  <span className="subtitle">
                    Please wait while we generate your 3D view.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="panel compare">
          <div className="panel-header">
            <div className="panel-meta">
              <p>Comparison</p>
              <h3>Before and After</h3>
            </div>
            <div className="hint">Drag to Compare</div>
          </div>

          <div className="compare-stage">
            {project?.sourceImage && currentImage ? (
              <ReactCompareSlider
                defaultValue={50}
                style={{ width: "100%", height: "100%" }}
                itemOne={
                  <ReactCompareSliderImage
                    src={project?.sourceImage}
                    alt="Before"
                    style={{
                      width: "100%",
                      height: "100%",
                      maxHeight: "70vh",
                      objectFit: "contain",
                    }}
                  />
                }
                itemTwo={
                  <ReactCompareSliderImage
                    src={currentImage || project?.renderedImage || ""}
                    alt="After"
                    style={{
                      width: "100%",
                      height: "100%",
                      maxHeight: "70vh",
                      objectFit: "contain",
                    }}
                  />
                }
              />
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
};
export default VisualizerId;
