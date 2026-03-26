const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Install",
      desc: "Download the extension and load it unpacked in your browser.",
    },
    {
      number: "02",
      title: "Browse Jobs",
      desc: "Navigate LinkedIn job posts as usual. HireScore detects company names automatically.",
    },
    {
      number: "03",
      title: "See Scores",
      desc: "A score badge appears showing the company's average rating from past applicants.",
    },
    {
      number: "04",
      title: "Rate & Share",
      desc: "After applying, rate the company on response quality, interview, and overall experience.",
    },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-mono text-2xl md:text-3xl font-bold mb-16 text-center tracking-tight">
          How it <span className="text-primary">works</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="border border-border bg-card p-6 rounded hover:border-primary/30 transition-colors group"
            >
              <span className="font-mono text-xs text-primary tracking-widest">{step.number}</span>
              <h3 className="font-mono text-lg font-bold mt-2 mb-2 text-card-foreground group-hover:text-primary transition-colors">
                {step.title}
              </h3>
              <p className="text-secondary-foreground text-sm font-body leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
