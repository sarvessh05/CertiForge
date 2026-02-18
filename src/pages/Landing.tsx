import { Flame, Zap, FileText, QrCode, Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const FEATURES = [
  { icon: FileText, title: "Template Upload", desc: "Drop your PDF or image certificate template" },
  { icon: Zap, title: "Auto-Map Fields", desc: "Match spreadsheet columns to certificate fields" },
  { icon: QrCode, title: "QR Verification", desc: "Embed unique QR codes for instant verification" },
  { icon: Download, title: "Bulk Export", desc: "Download thousands of certificates as a single ZIP" },
];

const Landing = () => {
  const navigate = useNavigate();

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
          <Button
            onClick={() => navigate("/app")}
            className="gradient-forge text-primary-foreground font-mono font-bold hover:opacity-90 transition-opacity"
          >
            Launch App
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto max-w-4xl px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 mb-8">
          <Zap className="h-3.5 w-3.5 text-primary" />
          <span className="font-mono text-xs font-semibold text-primary">100% Browser-Based</span>
        </div>

        <h2 className="font-mono text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-tight mb-6">
          Forge <span className="gradient-forge-text">Thousands</span> of
          <br />Certificates in Seconds
        </h2>

        <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-10">
          Upload your template, drop in a spreadsheet, position your fields — and let CertiForge
          generate bulk certificates with QR verification. No server needed.
        </p>

        <Button
          onClick={() => navigate("/app")}
          size="lg"
          className="gradient-forge text-primary-foreground font-mono text-base font-bold glow-amber-strong hover:opacity-90 transition-opacity px-10 py-6 text-lg"
        >
          <Flame className="mr-2 h-5 w-5" />
          Get Started
        </Button>
      </section>

      {/* Features */}
      <section className="container mx-auto max-w-4xl px-6 pb-24">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:glow-amber"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-mono text-sm font-bold text-foreground mb-1">{title}</h3>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-6">
        <p className="text-center font-mono text-xs text-muted-foreground">
          CertiForge — Bulk Certificate Automation
        </p>
      </footer>
    </div>
  );
};

export default Landing;
