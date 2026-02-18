import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, Image, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept: Record<string, string[]>;
  label: string;
  description: string;
  selectedFile: File | null;
  onClear: () => void;
  icon?: "template" | "data";
}

const FileUpload = ({
  onFileSelect,
  accept,
  label,
  description,
  selectedFile,
  onClear,
  icon = "template",
}: FileUploadProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple: false,
  });

  if (selectedFile) {
    return (
      <div className="rounded-lg border border-glow bg-card p-6 glow-amber">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md gradient-forge">
              {icon === "template" ? (
                <Image className="h-5 w-5 text-primary-foreground" />
              ) : (
                <FileText className="h-5 w-5 text-primary-foreground" />
              )}
            </div>
            <div>
              <p className="font-mono text-sm font-semibold text-foreground">
                {selectedFile.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClear}
            className="text-muted-foreground hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-all duration-200 ${
        isDragActive
          ? "border-primary bg-primary/5 glow-amber"
          : "border-border hover:border-primary/50 hover:bg-card"
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
          <Upload className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="font-mono text-sm font-semibold text-foreground">
            {label}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
