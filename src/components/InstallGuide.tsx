const InstallGuide = () => {
  const browsers = [
    {
      name: "Chrome / Edge / Brave / Arc / Opera",
      steps: [
        "Unzip the downloaded file",
        "Open chrome://extensions (or edge://extensions)",
        "Enable Developer mode (toggle in top-right)",
        "Click Load unpacked and select the unzipped folder",
        "Navigate to LinkedIn and start rating!",
      ],
    },
    {
      name: "Firefox",
      steps: [
        "Unzip the downloaded file",
        "Open about:debugging#/runtime/this-firefox",
        "Click Load Temporary Add-on",
        "Select the manifest.json file from the unzipped folder",
        "Navigate to LinkedIn and start rating!",
      ],
    },
    {
      name: "Safari (iOS & macOS)",
      steps: [
        "Requires a Mac with Xcode installed",
        "Clone the repo and run: xcrun safari-web-extension-converter /path/to/extension",
        "Open the generated Xcode project and build it",
        "Enable the extension in Safari → Settings → Extensions",
        "On iOS, enable in Settings → Safari → Extensions",
      ],
    },
  ];

  return (
    <section className="py-24 px-6 border-t border-border">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-mono text-2xl md:text-3xl font-bold mb-4 text-center tracking-tight">
          Installation <span className="text-primary">guide</span>
        </h2>
        <p className="text-muted-foreground mb-12 font-body text-center">
          Works on all major browsers. Pick yours below.
        </p>

        <div className="space-y-10">
          {browsers.map((browser) => (
            <div key={browser.name} className="border border-border bg-card rounded p-6">
              <h3 className="font-mono text-sm font-bold text-primary tracking-wider uppercase mb-6">
                {browser.name}
              </h3>
              <div className="space-y-4">
                {browser.steps.map((step, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <span className="font-mono text-muted-foreground text-xs font-bold shrink-0 mt-0.5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-foreground font-body text-sm">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstallGuide;
