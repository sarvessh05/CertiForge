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
  fontFamily: string;
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
  { value: "#4B0082", label: "Indigo" },
  { value: "#2F4F4F", label: "Dark Slate" },

  // Added Premium Shades
  { value: "#2C3E50", label: "Midnight Blue" },
  { value: "#7B3F00", label: "Royal Brown" },
  { value: "#800020", label: "Burgundy" },
  { value: "#DAA520", label: "Goldenrod" },
];

const FONTS = [
  // Elegant Serif (Best for Names)
  { value: "Playfair Display", label: "Playfair Display (Elegant)" },
  { value: "Cinzel", label: "Cinzel (Royal)" },
  { value: "Cormorant Garamond", label: "Cormorant Garamond (Classic)" },
  { value: "Libre Baskerville", label: "Libre Baskerville (Formal)" },
  { value: "Merriweather", label: "Merriweather (Traditional)" },
  { value: "EB Garamond", label: "EB Garamond (Refined)" },
  { value: "Crimson Text", label: "Crimson Text (Academic)" },
  { value: "Old Standard TT", label: "Old Standard TT (Vintage)" },

  // Modern Sans (For Event/Date)
  { value: "Montserrat", label: "Montserrat (Modern)" },
  { value: "Poppins", label: "Poppins (Clean)" },
  { value: "Raleway", label: "Raleway (Professional)" },
  { value: "Lato", label: "Lato (Minimal)" },
  { value: "Oswald", label: "Oswald (Bold)" },
  { value: "Roboto", label: "Roboto (Neutral)" },
  { value: "Open Sans", label: "Open Sans (Friendly)" },

  // Script/Signature (For Decorative Elements)
  { value: "Great Vibes", label: "Great Vibes (Signature)" },
  { value: "Allura", label: "Allura (Elegant Script)" },
  { value: "Dancing Script", label: "Dancing Script (Casual)" },
  { value: "Pacifico", label: "Pacifico (Playful)" },
  { value: "Sacramento", label: "Sacramento (Handwritten)" },

  // Fallback PDF Fonts
  { value: "Helvetica", label: "Helvetica (Default)" },
  { value: "Times-Roman", label: "Times New Roman (Default)" },
  { value: "Courier", label: "Courier (Default)" }
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
  const [hovering, setHovering] = useState<string | null>(null);
  const [templateImg, setTemplateImg] = useState<HTMLImageElement | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 566 });
  const dragOffset = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);

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
      
      // Use the actual selected font family for canvas preview
      let fontFamily = el.fontFamily;
      let fontWeight = "400";
      
      // Handle font weights for different font categories
      if (["Playfair Display", "Cinzel", "Cormorant Garamond", "Libre Baskerville", 
           "Merriweather", "EB Garamond", "Crimson Text", "Old Standard TT"].includes(fontFamily)) {
        fontWeight = "700"; // Bold for elegant serif fonts
      } else if (["Montserrat", "Poppins", "Raleway", "Lato", "Oswald", "Roboto", "Open Sans"].includes(fontFamily)) {
        fontWeight = "600"; // Semi-bold for modern sans
      } else if (["Great Vibes", "Allura", "Dancing Script", "Pacifico", "Sacramento"].includes(fontFamily)) {
        fontWeight = "400"; // Regular for script fonts
      }
      
      ctx.font = `${fontWeight} ${el.fontSize * scale}px "${fontFamily}", serif`;
      ctx.fillStyle = el.color;
      ctx.textAlign = "center";
      
      // Highlight if hovering or dragging
      if (hovering === el.key || dragging === el.key) {
        const textWidth = ctx.measureText(`[${el.label}]`).width;
        const padding = 8 * scale;
        ctx.fillStyle = "rgba(212, 160, 23, 0.2)";
        ctx.fillRect(
          el.x * scale - textWidth / 2 - padding,
          el.y * scale - el.fontSize * scale - padding,
          textWidth + padding * 2,
          el.fontSize * scale + padding * 2
        );
        ctx.fillStyle = el.color;
      }
      
      ctx.fillText(`[${el.label}]`, el.x * scale, el.y * scale);
      
      // Draw drag handle
      if (hovering === el.key || dragging === el.key) {
        ctx.strokeStyle = "#d4a017";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(el.x * scale, el.y * scale - el.fontSize * scale / 2, 6 * scale, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "#d4a017";
        ctx.fill();
      }
    });

    // Draw QR placeholder
    if (enableQR) {
      const scale = canvas.width / 800;
      const qrSize = 60 * scale;
      const qx = qrPosition.x * scale;
      const qy = qrPosition.y * scale;
      
      // Highlight if hovering or dragging
      if (hovering === "__qr__" || dragging === "__qr__") {
        ctx.fillStyle = "rgba(212, 160, 23, 0.2)";
        ctx.fillRect(qx - qrSize / 2 - 4, qy - qrSize / 2 - 4, qrSize + 8, qrSize + 8);
      }
      
      ctx.strokeStyle = "#d4a017";
      ctx.lineWidth = 2;
      ctx.strokeRect(qx - qrSize / 2, qy - qrSize / 2, qrSize, qrSize);
      ctx.fillStyle = "#d4a017";
      ctx.font = `${10 * scale}px JetBrains Mono`;
      ctx.textAlign = "center";
      ctx.fillText("QR", qx, qy + 4 * scale);
      
      // Draw drag handle
      if (hovering === "__qr__" || dragging === "__qr__") {
        ctx.beginPath();
        ctx.arc(qx, qy - qrSize / 2 - 10 * scale, 6 * scale, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();
      }
    }
  }, [templateImg, elements, enableQR, qrPosition, hovering, dragging]);

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
    const canvas = canvasRef.current;
    if (!canvas) return;
    const scale = canvas.width / 800;

    // Check QR with larger hit area
    if (enableQR) {
      const qrSize = 60;
      const hitArea = 80; // Larger hit area for easier clicking
      const distX = Math.abs(coords.x - qrPosition.x);
      const distY = Math.abs(coords.y - qrPosition.y);
      if (distX < hitArea / 2 && distY < hitArea / 2) {
        setDragging("__qr__");
        isDraggingRef.current = true;
        dragOffset.current = { x: coords.x - qrPosition.x, y: coords.y - qrPosition.y };
        return;
      }
    }

    // Check elements with better hit detection
    for (const el of elements) {
      if (!el.enabled) continue;
      
      // Calculate text bounds for better hit detection
      const ctx = canvas.getContext("2d");
      if (!ctx) continue;
      
      // Use actual font for measurement
      let fontFamily = el.fontFamily;
      let fontWeight = "400";
      
      if (["Playfair Display", "Cinzel", "Cormorant Garamond", "Libre Baskerville", 
           "Merriweather", "EB Garamond", "Crimson Text", "Old Standard TT"].includes(fontFamily)) {
        fontWeight = "700";
      } else if (["Montserrat", "Poppins", "Raleway", "Lato", "Oswald", "Roboto", "Open Sans"].includes(fontFamily)) {
        fontWeight = "600";
      }
      
      ctx.font = `${fontWeight} ${el.fontSize * scale}px "${fontFamily}", serif`;
      const textWidth = ctx.measureText(`[${el.label}]`).width / scale;
      
      const hitPadding = 20; // Extra padding for easier clicking
      const distX = Math.abs(coords.x - el.x);
      const distY = Math.abs(coords.y - el.y);
      
      if (distX < textWidth / 2 + hitPadding && distY < el.fontSize / 2 + hitPadding) {
        setDragging(el.key);
        isDraggingRef.current = true;
        dragOffset.current = { x: coords.x - el.x, y: coords.y - el.y };
        return;
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const coords = getCanvasCoords(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const scale = canvas.width / 800;

    if (dragging && isDraggingRef.current) {
      // Dragging mode
      const newX = Math.max(0, Math.min(800, coords.x - dragOffset.current.x));
      const newY = Math.max(0, Math.min(canvasSize.height / scale * 800 / canvasSize.width, coords.y - dragOffset.current.y));

      if (dragging === "__qr__") {
        onQRPositionChange({ x: newX, y: newY });
      } else {
        onElementsChange(
          elements.map((el) =>
            el.key === dragging ? { ...el, x: newX, y: newY } : el
          )
        );
      }
    } else {
      // Hover detection
      let foundHover = null;

      // Check QR
      if (enableQR) {
        const hitArea = 80;
        const distX = Math.abs(coords.x - qrPosition.x);
        const distY = Math.abs(coords.y - qrPosition.y);
        if (distX < hitArea / 2 && distY < hitArea / 2) {
          foundHover = "__qr__";
        }
      }

      // Check elements
      if (!foundHover) {
        for (const el of elements) {
          if (!el.enabled) continue;
          
          const ctx = canvas.getContext("2d");
          if (!ctx) continue;
          
          // Use actual font for measurement
          let fontFamily = el.fontFamily;
          let fontWeight = "400";
          
          if (["Playfair Display", "Cinzel", "Cormorant Garamond", "Libre Baskerville", 
               "Merriweather", "EB Garamond", "Crimson Text", "Old Standard TT"].includes(fontFamily)) {
            fontWeight = "700";
          } else if (["Montserrat", "Poppins", "Raleway", "Lato", "Oswald", "Roboto", "Open Sans"].includes(fontFamily)) {
            fontWeight = "600";
          }
          
          ctx.font = `${fontWeight} ${el.fontSize * scale}px "${fontFamily}", serif`;
          const textWidth = ctx.measureText(`[${el.label}]`).width / scale;
          
          const hitPadding = 20;
          const distX = Math.abs(coords.x - el.x);
          const distY = Math.abs(coords.y - el.y);
          
          if (distX < textWidth / 2 + hitPadding && distY < el.fontSize / 2 + hitPadding) {
            foundHover = el.key;
            break;
          }
        }
      }

      setHovering(foundHover);
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
    isDraggingRef.current = false;
  };

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
          className={`w-full ${dragging ? "cursor-grabbing" : hovering ? "cursor-grab" : "cursor-default"}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>

      <p className="text-xs text-muted-foreground font-mono text-center">
        {dragging ? "Dragging..." : "Hover and drag elements to reposition them"}
      </p>

      <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
        <p className="text-xs text-muted-foreground text-center">
          ✨ <span className="font-semibold">Google Fonts are embedded in PDFs</span> — What you see is what you get!
        </p>
      </div>

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
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Font</Label>
                  <Select
                    value={el.fontFamily}
                    onValueChange={(val) => updateElement(el.key, { fontFamily: val })}
                  >
                    <SelectTrigger className="bg-secondary border-border h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FONTS.map((f) => (
                        <SelectItem key={f.value} value={f.value}>
                          {f.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
