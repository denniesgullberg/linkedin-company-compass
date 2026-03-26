import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { ArrowLeft, TrendingUp, TrendingDown, Trophy, Skull } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

type Company = {
  id: string;
  name: string;
  avg_score: number | null;
  total_ratings: number | null;
};

const ScoreBadge = ({ score }: { score: number }) => {
  const colorClass =
    score >= 70 ? "score-green" : score >= 40 ? "score-yellow" : "score-red";
  return (
    <span className={`font-mono text-2xl font-extrabold ${colorClass}`}>
      {Math.round(score)}
    </span>
  );
};

const CompanyRow = ({ company, rank }: { company: Company; rank: number }) => (
  <div className="flex items-center gap-4 border-b border-border py-4 px-2 last:border-0">
    <span className="font-mono text-sm text-muted-foreground w-8 text-right">
      #{rank}
    </span>
    <div className="flex-1 min-w-0">
      <p className="font-mono font-bold text-foreground truncate">{company.name}</p>
      <p className="text-xs text-muted-foreground">
        {company.total_ratings ?? 0} rating{(company.total_ratings ?? 0) !== 1 ? "s" : ""}
      </p>
    </div>
    <ScoreBadge score={company.avg_score ?? 0} />
  </div>
);

const Leaderboard = () => {
  const [topCompanies, setTopCompanies] = useState<Company[]>([]);
  const [worstCompanies, setWorstCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [topRes, worstRes] = await Promise.all([
        supabase
          .from("companies")
          .select("id, name, avg_score, total_ratings")
          .gt("total_ratings", 0)
          .order("avg_score", { ascending: false })
          .limit(20),
        supabase
          .from("companies")
          .select("id, name, avg_score, total_ratings")
          .gt("total_ratings", 0)
          .order("avg_score", { ascending: true })
          .limit(20),
      ]);
      setTopCompanies(topRes.data ?? []);
      setWorstCompanies(worstRes.data ?? []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const SkeletonList = () => (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-4 px-2">
          <Skeleton className="h-5 w-8" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-8 w-12" />
        </div>
      ))}
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-16 text-muted-foreground font-mono text-sm">
      No rated companies yet. Be the first to submit a rating!
    </div>
  );

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary font-mono text-xs mb-8 transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          BACK
        </Link>

        <h1 className="font-mono text-3xl font-extrabold text-foreground tracking-tight mb-2">
          LEADERBOARD
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          How companies treat their applicants, ranked by score.
        </p>

        <Tabs defaultValue="top" className="w-full">
          <TabsList className="w-full bg-secondary mb-6">
            <TabsTrigger value="top" className="flex-1 gap-2 font-mono text-xs">
              <Trophy className="w-3.5 h-3.5" />
              TOP RATED
            </TabsTrigger>
            <TabsTrigger value="worst" className="flex-1 gap-2 font-mono text-xs">
              <Skull className="w-3.5 h-3.5" />
              WORST RATED
            </TabsTrigger>
          </TabsList>

          <TabsContent value="top">
            <div className="rounded-md border border-border bg-card p-2">
              <div className="flex items-center gap-2 px-2 pb-2 mb-2 border-b border-border">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="font-mono text-xs text-muted-foreground">
                  HIGHEST SCORES
                </span>
              </div>
              {loading ? (
                <SkeletonList />
              ) : topCompanies.length === 0 ? (
                <EmptyState />
              ) : (
                topCompanies.map((c, i) => (
                  <CompanyRow key={c.id} company={c} rank={i + 1} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="worst">
            <div className="rounded-md border border-border bg-card p-2">
              <div className="flex items-center gap-2 px-2 pb-2 mb-2 border-b border-border">
                <TrendingDown className="w-4 h-4 text-destructive" />
                <span className="font-mono text-xs text-muted-foreground">
                  LOWEST SCORES
                </span>
              </div>
              {loading ? (
                <SkeletonList />
              ) : worstCompanies.length === 0 ? (
                <EmptyState />
              ) : (
                worstCompanies.map((c, i) => (
                  <CompanyRow key={c.id} company={c} rank={i + 1} />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default Leaderboard;
