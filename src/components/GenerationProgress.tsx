import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GenerationProgressProps {
  total: number;
  current: number;
  isComplete: boolean;
  isGenerating: boolean;
  onDownload: () => void;
}

const GenerationProgress = ({
  total,
  current,
  isComplete,
  isGenerating,
  onDownload,
}: GenerationProgressProps) => {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-12">
      {isGenerating && !isComplete && (
        <>
          <div className="relative">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
          </div>
          <div className="w-full max-w-md space-y-2">
            <Progress value={percent} className="h-3" />
            <p className="text-center font-mono text-sm text-muted-foreground">
              Forging certificate {current} of {total}...
            </p>
          </div>
        </>
      )}

      {isComplete && (
        <>
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10 glow-amber-strong">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="font-mono text-xl font-bold text-foreground">
              Forging Complete!
            </h3>
            <p className="text-sm text-muted-foreground">
              {total} certificates generated successfully
            </p>
          </div>
          <Button
            onClick={onDownload}
            size="lg"
            className="gradient-forge text-primary-foreground font-mono font-bold glow-amber-strong hover:opacity-90 transition-opacity"
          >
            <Download className="mr-2 h-5 w-5" />
            Download ZIP
          </Button>
        </>
      )}

      {!isGenerating && !isComplete && (
        <div className="text-center space-y-2">
          <p className="font-mono text-lg font-semibold text-foreground">
            Ready to forge
          </p>
          <p className="text-sm text-muted-foreground">
            Click "Generate" to start creating {total} certificates
          </p>
        </div>
      )}
    </div>
  );
};

export default GenerationProgress;
