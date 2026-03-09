import { motion } from "framer-motion";
import { Trade } from "@/types/trade";
import { Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TradeTableProps {
  trades: Trade[];
  onDelete: (id: string) => void;
  deleting?: string | null;
}

const TradeTable = ({ trades, onDelete, deleting }: TradeTableProps) => {
  if (trades.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-card flex flex-col items-center justify-center rounded-2xl py-16"
      >
        <TrendingUp className="mb-4 h-12 w-12 text-muted-foreground/30" />
        <p className="text-lg font-medium text-muted-foreground">No trades logged yet</p>
        <p className="text-sm text-muted-foreground/60">Start by adding your first trade</p>
      </motion.div>
    );
  }

  return (
    <div className="glass-card overflow-hidden rounded-2xl">
      {/* Desktop Table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              {["Name", "Buy", "Sell", "Qty", "P/L", "Date", "Buy Time", "Sell Time", ""].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trades.map((trade, i) => {
              const pl = (trade.sellValue - trade.buyValue) * trade.quantity;
              const isProfit = pl >= 0;
              return (
                <motion.tr
                  key={trade.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="group border-b border-border/30 transition-colors hover:bg-secondary/30"
                >
                  <td className="px-4 py-3 font-medium">{trade.name}</td>
                  <td className="px-4 py-3 font-mono-nums text-sm">₹{trade.buyValue.toFixed(2)}</td>
                  <td className="px-4 py-3 font-mono-nums text-sm">₹{trade.sellValue.toFixed(2)}</td>
                  <td className="px-4 py-3 font-mono-nums text-sm">{trade.quantity}</td>
                  <td className={`px-4 py-3 font-mono-nums text-sm font-semibold ${isProfit ? "text-profit" : "text-loss"}`}>
                    <span className="inline-flex items-center gap-1">
                      {isProfit ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                      ₹{Math.abs(pl).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{trade.date}</td>
                  <td className="px-4 py-3 font-mono-nums text-sm text-muted-foreground">{trade.buyTime}</td>
                  <td className="px-4 py-3 font-mono-nums text-sm text-muted-foreground">{trade.sellTime}</td>
                  <td className="px-4 py-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(trade.id)}
                      disabled={deleting === trade.id}
                      className="text-muted-foreground opacity-0 transition-all hover:text-destructive group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-3 p-4 md:hidden">
        {trades.map((trade, i) => {
          const pl = (trade.sellValue - trade.buyValue) * trade.quantity;
          const isProfit = pl >= 0;
          return (
            <motion.div
              key={trade.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-xl border p-4 ${isProfit ? "bg-profit border-primary/20" : "bg-loss border-destructive/20"}`}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="font-semibold">{trade.name}</span>
                <span className={`font-mono-nums text-sm font-bold ${isProfit ? "text-profit" : "text-loss"}`}>
                  {isProfit ? "+" : "-"}₹{Math.abs(pl).toFixed(2)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                <div>Buy: <span className="font-mono-nums text-foreground">₹{trade.buyValue.toFixed(2)}</span></div>
                <div>Sell: <span className="font-mono-nums text-foreground">₹{trade.sellValue.toFixed(2)}</span></div>
                <div>Qty: <span className="font-mono-nums text-foreground">{trade.quantity}</span></div>
                <div>Date: <span className="text-foreground">{trade.date}</span></div>
              </div>
              <div className="mt-3 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(trade.id)}
                  disabled={deleting === trade.id}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="mr-1 h-4 w-4" /> Delete
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TradeTable;
