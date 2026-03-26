const InstallGuide = () => {
  return (
    <section className="py-24 px-6 border-t border-border">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="font-mono text-2xl md:text-3xl font-bold mb-4 tracking-tight">
          Installation <span className="text-primary">guide</span>
        </h2>
        <p className="text-muted-foreground mb-12 font-body">
          Load it as an unpacked extension in any Chromium browser.
        </p>
        
        <div className="text-left space-y-6">
          {[
            "Unzip the downloaded file",
            "Open chrome://extensions in your browser",
            "Enable Developer mode (toggle in top-right)",
            "Click Load unpacked and select the unzipped folder",
            "Navigate to LinkedIn and start rating!",
          ].map((step, i) => (
            <div key={i} className="flex gap-4 items-start">
              <span className="font-mono text-primary text-sm font-bold shrink-0 mt-0.5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-foreground font-body text-sm">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstallGuide;
