import { useRef, useEffect, useState, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export interface TextElement {
  key: string;
  label: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  enabled: boolean;
}

interface CertificateEditorProps {
  templateUrl: string | null;
  elements: TextElement[];
  onElementsChange: (elements: TextElement[]) => void;
  enableQR: boolean;
  onQRChange: (enabled: boolean) => void;
  qrPosition: { x: number; y: number };
  onQRPositionChange: (pos: { x: number; y: number }) => void;
}

const COLORS = [
  { value: "#000000", label: "Black" },
  { value: "#FFFFFF", label: "White" },
  { value: "#1a1a2e", label: "Dark Navy" },
  { value: "#d4a017", label: "Gold" },
  { value: "#8B0000", label: "Dark Red" },
  { value: "#003366", label: "Dark Blue" },
];

const CertificateEditor = ({
  templateUrl,
  elements,
  onElementsChange,
  enableQR,
  onQRChange,
  qrPosition,
  onQRPositionChange,
}: CertificateEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [templateImg, setTemplateImg] = useState<HTMLImageElement | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 566 });
  const dragOffset = useRef({ x: 0, y: 0 });

  // Load template image
  useEffect(() => {
    if (!templateUrl) return;
    const img = new window.Image();
    img.onload = () => {
      setTemplateImg(img);
      const aspect = img.width / img.height;
      const maxW = 800;
      const w = Math.min(img.width, maxW);
      const h = w / aspect;
      setCanvasSize({ width: w, height: h });
    };
    img.src = templateUrl;
  }, [templateUrl]);

  // Draw canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (templateImg) {
      ctx.drawImage(templateImg, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = "#1a1a2e";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "#d4a01744";
      ctx.lineWidth = 2;
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
      ctx.fillStyle = "#666";
      ctx.font = "16px Inter";
      ctx.textAlign = "center";
      ctx.fillText("Upload a template to preview", canvas.width / 2, canvas.height / 2);
    }

    // Draw text elements
    elements.forEach((el) => {
      if (!el.enabled) return;
      const scale = canvas.width / 800;
      ctx.font = `${el.fontSize * scale}px Inter`;
      ctx.fillStyle = el.color;
      ctx.textAlign = "center";
      ctx.fillText(`[${el.label}]`, el.x * scale, el.y * scale);
    });

    // Draw QR placeholder
    if (enableQR) {
      const scale = canvas.width / 800;
      const qrSize = 60 * scale;
      const qx = qrPosition.x * scale;
      const qy = qrPosition.y * scale;
      ctx.strokeStyle = "#d4a017";
      ctx.lineWidth = 2;
      ctx.strokeRect(qx - qrSize / 2, qy - qrSize / 2, qrSize, qrSize);
      ctx.fillStyle = "#d4a017";
      ctx.font = `${10 * scale}px JetBrains Mono`;
      ctx.textAlign = "center";
      ctx.fillText("QR", qx, qy + 4 * scale);
    }
  }, [templateImg, elements, enableQR, qrPosition]);

  useEffect(() => {
    draw();
  }, [draw, canvasSize]);

  const getCanvasCoords = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = 800 / rect.width;
    const scaleY = (canvasSize.height / (canvasSize.width / 800)) / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const coords = getCanvasCoords(e);
    const scale = 1;

    // Check QR
    if (enableQR) {
      const dist = Math.hypot(coords.x - qrPosition.x, coords.y - qrPosition.y);
      if (dist < 40) {
        setDragging("__qr__");
        dragOffset.current = { x: coords.x - qrPosition.x, y: coords.y - qrPosition.y };
        return;
      }
    }

    // Check elements
    for (const el of elements) {
      if (!el.enabled) continue;
      const dist = Math.hypot(coords.x - el.x, coords.y - el.y);
      if (dist < el.fontSize * scale) {
        setDragging(el.key);
        dragOffset.current = { x: coords.x - el.x, y: coords.y - el.y };
        return;
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    const coords = getCanvasCoords(e);
    const newX = coords.x - dragOffset.current.x;
    const newY = coords.y - dragOffset.current.y;

    if (dragging === "__qr__") {
      onQRPositionChange({ x: newX, y: newY });
    } else {
      onElementsChange(
        elements.map((el) =>
          el.key === dragging ? { ...el, x: newX, y: newY } : el
        )
      );
    }
  };

  const handleMouseUp = () => setDragging(null);

  const updateElement = (key: string, updates: Partial<TextElement>) => {
    onElementsChange(
      elements.map((el) => (el.key === key ? { ...el, ...updates } : el))
    );
  };

  return (
    <div className="space-y-6">
      {/* Canvas */}
      <div ref={containerRef} className="overflow-hidden rounded-lg border border-border glow-amber">
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          className="w-full cursor-move"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>

      <p className="text-xs text-muted-foreground font-mono text-center">
        Drag elements on the preview to position them
      </p>

      {/* Element controls */}
      <div className="space-y-4">
        {elements.map((el) => (
          <div
            key={el.key}
            className={`rounded-lg border p-4 transition-colors ${
              el.enabled ? "border-glow bg-card" : "border-border bg-secondary/30"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <Checkbox
                checked={el.enabled}
                onCheckedChange={(checked) =>
                  updateElement(el.key, { enabled: !!checked })
                }
              />
              <Label className="font-mono text-sm font-semibold">{el.label}</Label>
            </div>
            {el.enabled && (
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Size</Label>
                  <Input
                    type="number"
                    value={el.fontSize}
                    onChange={(e) =>
                      updateElement(el.key, { fontSize: Number(e.target.value) })
                    }
                    className="bg-secondary border-border h-8 text-sm"
                    min={8}
                    max={72}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Color</Label>
                  <Select
                    value={el.color}
                    onValueChange={(val) => updateElement(el.key, { color: val })}
                  >
                    <SelectTrigger className="bg-secondary border-border h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COLORS.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          <div className="flex items-center gap-2">
                            <div
                              className="h-3 w-3 rounded-full border border-border"
                              style={{ backgroundColor: c.value }}
                            />
                            {c.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Position</Label>
                  <p className="text-xs text-muted-foreground font-mono mt-2">
                    {Math.round(el.x)}, {Math.round(el.y)}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* QR Option */}
        <div className={`rounded-lg border p-4 transition-colors ${
          enableQR ? "border-glow bg-card" : "border-border bg-secondary/30"
        }`}>
          <div className="flex items-center gap-3">
            <Checkbox
              checked={enableQR}
              onCheckedChange={(checked) => onQRChange(!!checked)}
            />
            <Label className="font-mono text-sm font-semibold">QR Verification Code</Label>
          </div>
          {enableQR && (
            <p className="mt-2 text-xs text-muted-foreground">
              Position: {Math.round(qrPosition.x)}, {Math.round(qrPosition.y)} — drag on preview
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificateEditor;
