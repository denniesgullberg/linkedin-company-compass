import heroIcon from "@/assets/icon.png";

const HeroSection = () => {
  const handleDownload = () => {
    fetch("/hirescore-extension.zip")
      .then((res) => {
        if (!res.ok) throw new Error(`Download failed: ${res.status}`);
        return res.blob();
      })
      .then((blob) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "hirescore-extension.zip";
        a.click();
        URL.revokeObjectURL(a.href);
      })
      .catch((err) => alert(err.message));
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(hsl(150 100% 50%) 1px, transparent 1px), linear-gradient(90deg, hsl(150 100% 50%) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />
      
      <div className="relative z-10 text-center max-w-3xl animate-float-up">
        <img 
          src={heroIcon} 
          alt="HireScore icon" 
          width={80} 
          height={80} 
          className="mx-auto mb-8 rounded-lg animate-pulse-glow"
        />
        
        <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground uppercase mb-4">
          Chrome Extension for LinkedIn
        </p>
        
        <h1 className="font-mono text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-foreground">
          Know before<br />
          you <span className="text-primary">apply</span>.
        </h1>
        
        <p className="text-secondary-foreground text-lg md:text-xl max-w-xl mx-auto mb-10 font-body leading-relaxed">
          Rate companies after applying on LinkedIn. See real scores from real applicants — response quality, interview rates, and more.
        </p>
        
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-3 bg-primary text-primary-foreground font-mono text-sm font-bold tracking-wider px-8 py-4 rounded hover:opacity-90 transition-opacity uppercase"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download Extension
        </button>
        
        <p className="text-muted-foreground text-xs font-mono mt-4">
          Works on Chrome, Edge, Brave, Arc, Opera, Firefox & Safari
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
