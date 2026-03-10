import { motion } from "framer-motion";
import { Trade } from "@/types/trade";
import { TrendingUp, TrendingDown, BarChart3, Activity } from "lucide-react";

interface StatsBarProps {
  trades: Trade[];
}

const StatsBar = ({ trades: rawTrades }: StatsBarProps) => {
  const trades = Array.isArray(rawTrades) ? rawTrades : [];
  const totalPL = trades.reduce(
    (sum, t) => sum + (t.sellval - t.buyval) * t.quantity,
    0
  );
  const totalCharges = trades.reduce((char, t) => char + (t.charges || 0), 0);
  const finalPL = totalPL - totalCharges;
  const winners = trades.filter((t) => (t.sellval - t.buyval) * t.quantity >= 0).length;
  const winRate = trades.length > 0 ? ((winners / trades.length) * 100).toFixed(1) : "0";

  const stats = [
    {
      label: "Total Trades",
      value: trades.length.toString(),
      icon: BarChart3,
      color: "text-primary",
    },
    {
      label: "P/L",
      value: `${totalPL >= 0 ? "+" : "-"}₹${Math.abs(totalPL).toFixed(2)}`,
      icon: totalPL >= 0 ? TrendingUp : TrendingDown,
      color: totalPL >= 0 ? "text-profit" : "text-loss",
    },
    {
      label: "Charges",
      value: `${totalCharges >= 0 ? "-" : "+"}₹${Math.abs(totalCharges).toFixed(2)}`,
      icon: totalCharges >= 0 ? TrendingDown : TrendingUp,
      color: totalCharges >= 0 ? "text-loss" : "text-profit",
    },
    {
      label: "Net P/L",
      value: `${finalPL >= 0 ? "+" : "-"}₹${Math.abs(finalPL).toFixed(2)}`,
      icon: finalPL >= 0 ? TrendingUp : TrendingDown,
      color: finalPL >= 0 ? "text-profit" : "text-loss",
    },
    {
      label: "Win Rate",
      value: `${winRate}%`,
      icon: Activity,
      color: parseFloat(winRate) >= 50 ? "text-profit" : "text-loss",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass-card flex items-center gap-4 rounded-xl p-5"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{stat.label}</p>
            <p className={`font-mono-nums text-xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsBar;
