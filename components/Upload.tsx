import { CheckCircle2, ImageIcon, UploadIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router";
import {
  PROGRESS_INCREMENT,
  PROGRESS_INTERVAL_MS,
  REDIRECT_DELAY_MS,
} from "lib/constants";

type UploadProps = {
  onComplete?: (base64Data: string) => void;
  fileSizeLimit?: number;
};

const Upload = ({ onComplete, fileSizeLimit = 50 }: UploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const redirectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { isSignedIn } = useOutletContext<AuthContext>();
  const maxFileSizeBytes = fileSizeLimit * 1024 * 1024;

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }

      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

  const processFile = (selectedFile: File) => {
    if (!isSignedIn) return;
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    if (redirectTimeoutRef.current) {
      clearTimeout(redirectTimeoutRef.current);
    }
    setFile(selectedFile);
    setProgress(0);
    const reader = new FileReader();
    reader.onerror = () => {
      setFile(null);
      setProgress(0);
    };
    reader.onload = () => {
      const base64Data = String(reader.result ?? "");
      progressIntervalRef.current = setInterval(() => {
        setProgress((currentProgress) => {
          const nextProgress = Math.min(
            100,
            currentProgress + PROGRESS_INCREMENT,
          );
          if (nextProgress >= 100 && progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
            redirectTimeoutRef.current = setTimeout(() => {
              onComplete?.(base64Data);
            }, REDIRECT_DELAY_MS);
          }
          return nextProgress;
        });
      }, PROGRESS_INTERVAL_MS);
    };
    reader.readAsDataURL(selectedFile);
  };

  const isValidImageFile = (selectedFile: File) => {
    const allowedTypes = ["image/jpeg", "image/png"];
    return (
      allowedTypes.includes(selectedFile.type) &&
      selectedFile.size <= maxFileSizeBytes
    );
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isSignedIn) return;

    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!isValidImageFile(selectedFile)) {
      event.target.value = "";
      return;
    }

    processFile(selectedFile);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (!isSignedIn) return;
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (!isSignedIn) return;
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (!isSignedIn) return;

    setIsDragging(false);
    const droppedFile = event.dataTransfer.files?.[0];
    if (!droppedFile || !isValidImageFile(droppedFile)) return;

    processFile(droppedFile);
  };

  return (
    <div className="upload">
      {!file ? (
        <div
          className={`dropzone ${isDragging ? "is-dragging" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            className="drop-input"
            accept=".jpg, .jpeg, .png"
            disabled={!isSignedIn}
            onChange={handleInputChange}
          />

          <div className="drop-content">
            <div className="drop-icon">
              <UploadIcon size={20} />
            </div>
            <p>
              {isSignedIn
                ? "Click or drag and drop your image here to upload."
                : "Signin or Signup with Puter to upload your image."}
            </p>
            <p className="help">Maximum file size {fileSizeLimit} MB.</p>
          </div>
        </div>
      ) : (
        <div className="upload-status">
          <div className="status-content">
            <div className="status-icon">
              {progress === 100 ? (
                <CheckCircle2 className="check" />
              ) : (
                <ImageIcon className="image" />
              )}
            </div>

            <h3>{file.name}</h3>
            <div className="progress">
              <div className="bar" style={{ width: `${progress}%` }} />

              <p className="status-text">
                {progress < 100 ? "Analysing Floor Plan..." : "Redirecting..."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;
