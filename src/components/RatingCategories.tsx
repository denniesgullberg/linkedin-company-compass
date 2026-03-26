const RatingCategories = () => {
  const categories = [
    {
      label: "Overall Score",
      value: "1–100",
      desc: "Your overall impression of the application experience with this company.",
    },
    {
      label: "Response Type",
      value: "AUTO / PERSONAL / NONE",
      desc: "Did you get an automated rejection, a personal reply, or complete silence?",
    },
    {
      label: "Got Interview",
      value: "YES / NO",
      desc: "Were you invited for an interview after applying?",
    },
    {
      label: "Comment",
      value: "FREE TEXT",
      desc: "Share details about your experience to help future applicants.",
    },
  ];

  return (
    <section className="py-24 px-6 border-t border-border">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-mono text-2xl md:text-3xl font-bold mb-4 text-center tracking-tight">
          What you <span className="text-primary">rate</span>
        </h2>
        <p className="text-muted-foreground text-center mb-16 font-body">
          Simple, honest feedback that helps the next applicant.
        </p>
        
        <div className="space-y-4">
          {categories.map((cat) => (
            <div
              key={cat.label}
              className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8 border border-border bg-card p-5 rounded"
            >
              <div className="md:w-48 shrink-0">
                <span className="font-mono text-sm font-bold text-foreground">{cat.label}</span>
              </div>
              <div className="md:w-48 shrink-0">
                <span className="font-mono text-xs text-primary tracking-wider">{cat.value}</span>
              </div>
              <p className="text-secondary-foreground text-sm font-body">{cat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RatingCategories;
