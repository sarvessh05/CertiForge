import { useState, useCallback } from "react";
import * as XLSX from "xlsx";
import { Flame, ChevronRight, ChevronLeft, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/FileUpload";
import FieldMapper from "@/components/FieldMapper";
import CertificateEditor, { type TextElement, type SignatureElement } from "@/components/CertificateEditor";
import GenerationProgress from "@/components/GenerationProgress";
import { generateCertificates, downloadZip } from "@/lib/certificate-engine";

const STEPS = ["Upload", "Map Fields", "Design", "Generate"];

const DEFAULT_ELEMENTS: TextElement[] = [
  { key: "name", label: "Recipient Name", x: 400, y: 280, fontSize: 36, color: "#000000", fontFamily: "Playfair Display", enabled: true },
  { key: "event", label: "Event / Course", x: 400, y: 230, fontSize: 20, color: "#003366", fontFamily: "Montserrat", enabled: true },
  { key: "date", label: "Date", x: 400, y: 400, fontSize: 16, color: "#666666", fontFamily: "Lato", enabled: true },
  { key: "id", label: "Certificate ID", x: 400, y: 440, fontSize: 12, color: "#999999", fontFamily: "Courier", enabled: false },
];

const Index = () => {
  const [step, setStep] = useState(0);

  // Files
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const [templateUrl, setTemplateUrl] = useState<string | null>(null);
  const [dataFile, setDataFile] = useState<File | null>(null);

  // Data
  const [columns, setColumns] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});

  // Editor
  const [elements, setElements] = useState<TextElement[]>(DEFAULT_ELEMENTS);
  const [enableQR, setEnableQR] = useState(false);
  const [qrPosition, setQrPosition] = useState({ x: 700, y: 480 });
  const [signatures, setSignatures] = useState<SignatureElement[]>([]);

  // Generation
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);

  const handleTemplateSelect = useCallback((file: File) => {
    setTemplateFile(file);
    const url = URL.createObjectURL(file);
    setTemplateUrl(url);
  }, []);

  const handleDataSelect = useCallback((file: File) => {
    setDataFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, { defval: "" });
      if (json.length > 0) {
        setColumns(Object.keys(json[0]));
        setRows(json);
      }
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const handleGenerate = async () => {
    if (!templateFile) return;
    setIsGenerating(true);
    setIsComplete(false);
    setProgress(0);

    try {
      const blob = await generateCertificates({
        templateFile,
        data: rows,
        mapping,
        elements,
        enableQR,
        qrPosition,
        signatures,
        onProgress: setProgress,
      });
      setZipBlob(blob);
      setIsComplete(true);
    } catch (err) {
      console.error("Generation failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 0: return !!templateFile && !!dataFile;
      case 1: return !!mapping["name"];
      case 2: return true;
      case 3: return true;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-background bg-grid-pattern">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-forge">
              <Flame className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="font-mono text-xl font-bold tracking-tight">
              <span className="gradient-forge-text">CertiForge</span>
            </h1>
          </div>
          <p className="hidden text-sm text-muted-foreground sm:block font-mono">
            Bulk Certificate Automation
          </p>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-6 py-8">
        {/* Stepper */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <button
                onClick={() => i < step && setStep(i)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs font-semibold transition-all ${
                  i === step
                    ? "gradient-forge text-primary-foreground glow-amber"
                    : i < step
                    ? "bg-primary/20 text-primary cursor-pointer hover:bg-primary/30"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-background/20 text-[10px]">
                  {i + 1}
                </span>
                <span className="hidden sm:inline">{s}</span>
              </button>
              {i < STEPS.length - 1 && (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-mono text-lg font-bold text-foreground mb-1">
                  Upload Files
                </h2>
                <p className="text-sm text-muted-foreground">
                  Add your certificate template and data file
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    Certificate Template
                  </p>
                  <FileUpload
                    onFileSelect={handleTemplateSelect}
                    accept={{
                      "application/pdf": [".pdf"],
                      "image/png": [".png"],
                      "image/jpeg": [".jpg", ".jpeg"],
                    }}
                    label="Drop template here"
                    description="PDF, PNG, or JPG"
                    selectedFile={templateFile}
                    onClear={() => {
                      setTemplateFile(null);
                      setTemplateUrl(null);
                    }}
                    icon="template"
                  />
                </div>
                <div className="space-y-2">
                  <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    Data File
                  </p>
                  <FileUpload
                    onFileSelect={handleDataSelect}
                    accept={{
                      "text/csv": [".csv"],
                      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
                      "application/vnd.ms-excel": [".xls"],
                    }}
                    label="Drop spreadsheet here"
                    description="CSV, XLSX, or XLS"
                    selectedFile={dataFile}
                    onClear={() => {
                      setDataFile(null);
                      setColumns([]);
                      setRows([]);
                    }}
                    icon="data"
                  />
                </div>
              </div>
              {rows.length > 0 && (
                <p className="text-sm text-primary font-mono">
                  ✓ {rows.length} rows loaded with {columns.length} columns
                </p>
              )}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-mono text-lg font-bold text-foreground mb-1">
                  Map Fields
                </h2>
                <p className="text-sm text-muted-foreground">
                  Match your spreadsheet columns to certificate fields
                </p>
              </div>
              <FieldMapper
                columns={columns}
                previewData={rows}
                mapping={mapping}
                onMappingChange={(field, col) =>
                  setMapping((prev) => ({ ...prev, [field]: col }))
                }
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-mono text-lg font-bold text-foreground mb-1">
                  Design Layout
                </h2>
                <p className="text-sm text-muted-foreground">
                  Position text and customize appearance on your template
                </p>
              </div>
              <CertificateEditor
                templateUrl={templateUrl}
                elements={elements}
                onElementsChange={setElements}
                enableQR={enableQR}
                onQRChange={setEnableQR}
                qrPosition={qrPosition}
                onQRPositionChange={setQrPosition}
                signatures={signatures}
                onSignaturesChange={setSignatures}
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-mono text-lg font-bold text-foreground mb-1">
                  Generate Certificates
                </h2>
                <p className="text-sm text-muted-foreground">
                  {rows.length} certificates ready to forge
                </p>
              </div>
              <GenerationProgress
                total={rows.length}
                current={progress}
                isComplete={isComplete}
                isGenerating={isGenerating}
                onDownload={() => zipBlob && downloadZip(zipBlob)}
              />
              {!isGenerating && !isComplete && (
                <div className="flex justify-center">
                  <Button
                    onClick={handleGenerate}
                    size="lg"
                    className="gradient-forge text-primary-foreground font-mono font-bold glow-amber-strong hover:opacity-90 transition-opacity"
                  >
                    <Zap className="mr-2 h-5 w-5" />
                    Start Forging
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-6 flex justify-between">
          <Button
            variant="outline"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="font-mono border-border"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
          {step < 3 && (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
              className="gradient-forge text-primary-foreground font-mono font-bold hover:opacity-90 transition-opacity"
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-4 mt-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-xs text-muted-foreground">
            Designed & Built by{" "}
            <a 
              href="https://sarveshghotekar.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors font-semibold"
            >
              Sarvesh Ghotekar
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
