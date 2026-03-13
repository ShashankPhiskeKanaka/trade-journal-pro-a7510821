import { useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTrades } from "@/hooks/useTrades";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, TrendingUp } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

const chartConfig: ChartConfig = {
  cumPL: {
    label: "Cumulative P/L",
    color: "hsl(var(--primary))",
  },
  cumNet: {
    label: "Net P/L (after charges)",
    color: "hsl(var(--accent))",
  },
};

const Progress = () => {
  const navigate = useNavigate();
  const { data: trades = [], isLoading, refetch } = useTrades();

  const chartData = useMemo(() => {
    if (!trades.length) return [];

    // Group trades by date and sort chronologically
    const byDate = new Map<string, { pl: number; charges: number }>();
    trades.forEach((t) => {
      const dateKey = t.date.split("T")[0];
      const existing = byDate.get(dateKey) || { pl: 0, charges: 0 };
      existing.pl += (t.sellVal - t.buyVal) * t.quantity;
      existing.charges += t.charges || 0;
      byDate.set(dateKey, existing);
    });

    const sorted = Array.from(byDate.entries()).sort(([a], [b]) => a.localeCompare(b));

    let cumPL = 0;
    let cumNet = 0;
    return sorted.map(([date, { pl, charges }]) => {
      cumPL += pl;
      cumNet += pl - charges;
      const d = new Date(date);
      return {
        date: `${d.getDate()}/${d.getMonth() + 1}`,
        cumPL: parseFloat(cumPL.toFixed(2)),
        cumNet: parseFloat(cumNet.toFixed(2)),
      };
    });
  }, [trades]);

  return (
    <div className="min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(hsl(var(--primary)/0.02)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--primary)/0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="border-border text-muted-foreground hover:bg-secondary"
            >
              <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
            </Button>
            <div>
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Progress</h1>
              <p className="text-sm text-muted-foreground">Cumulative P/L over time</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="border-border text-muted-foreground hover:bg-secondary"
          >
            <RefreshCw className="mr-1.5 h-4 w-4" /> Refresh
          </Button>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {isLoading ? (
            <div className="glass-card flex items-center justify-center rounded-2xl py-16">
              <RefreshCw className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : chartData.length === 0 ? (
            <div className="glass-card flex flex-col items-center justify-center gap-3 rounded-2xl py-16">
              <TrendingUp className="h-10 w-10 text-muted-foreground" />
              <p className="text-muted-foreground">No trade data yet</p>
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-6">
              <ChartContainer config={chartConfig} className="h-[400px] w-full">
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="date"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `₹${v}`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="cumPL"
                    stroke="var(--color-cumPL)"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "var(--color-cumPL)" }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="cumNet"
                    stroke="var(--color-cumNet)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 3, fill: "var(--color-cumNet)" }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ChartContainer>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Progress;
