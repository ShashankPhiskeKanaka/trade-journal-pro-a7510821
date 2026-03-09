import { motion } from "framer-motion";
import { Trade } from "@/types/trade";
import { Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TradeTableProps {
  trades: Trade[];
  onDelete: (_id: string) => void;
  deleting?: string | null;
}

const TradeTable = ({ trades, onDelete, deleting }: TradeTableProps) => {
  // ... (No changes to empty state)

  return (
    <div className="glass-card overflow-hidden rounded-2xl">
      {/* Desktop Table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              {/* Added Charges and Net P/L to headers */}
              {["Name", "Buy", "Sell", "Qty", "P/L", "Charges", "Net P/L", "Date", "Buy Time", "Sell Time", ""].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trades.map((trade, i) => {
              const isProfit = trade.realisedgains >= 0;
              return (
                <motion.tr
                  key={trade._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="group border-b border-border/30 transition-colors hover:bg-secondary/30"
                >
                  <td className="px-4 py-3 font-medium">{trade.name}</td>
                  <td className="px-4 py-3 font-mono-nums text-sm">₹{trade.buyVal.toFixed(2)}</td>
                  <td className="px-4 py-3 font-mono-nums text-sm">₹{trade.sellVal.toFixed(2)}</td>
                  <td className="px-4 py-3 font-mono-nums text-sm">{trade.quantity}</td>
                  
                  {/* Gross P/L (Unrealised) */}
                  <td className="px-4 py-3 font-mono-nums text-sm text-muted-foreground">
                    ₹{trade.unrealisedgains.toFixed(2)}
                  </td>

                  {/* Charges */}
                  <td className="px-4 py-3 font-mono-nums text-sm text-destructive/80">
                    -₹{trade.charges.toFixed(2)}
                  </td>

                  {/* Net P/L (Realised Gains) */}
                  <td className={`px-4 py-3 font-mono-nums text-sm font-bold ${isProfit ? "text-profit" : "text-loss"}`}>
                    <span className="inline-flex items-center gap-1">
                      {isProfit ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                      ₹{Math.abs(trade.realisedgains).toFixed(2)}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-sm text-muted-foreground">{new Date(trade.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 font-mono-nums text-sm text-muted-foreground">{trade.buyTime}</td>
                  <td className="px-4 py-3 font-mono-nums text-sm text-muted-foreground">{trade.sellTime}</td>
                  
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(trade._id)}
                      disabled={deleting === trade._id}
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
          const isProfit = trade.realisedgains >= 0;
          return (
            <motion.div
              key={trade._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-xl border p-4 bg-background/50 border-border/50`}
            >
              <div className="mb-3 flex items-center justify-between border-b border-border/30 pb-2">
                <span className="font-semibold">{trade.name}</span>
                <div className="text-right">
                  <div className={`text-lg font-bold leading-none ${isProfit ? "text-profit" : "text-loss"}`}>
                    {isProfit ? "+" : "-"}₹{Math.abs(trade.realisedgains).toFixed(2)}
                  </div>
                  <span className="text-[10px] uppercase text-muted-foreground">Net P/L</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <div className="text-muted-foreground">Buy: <span className="font-mono-nums text-foreground">₹{trade.buyVal.toFixed(2)}</span></div>
                <div className="text-muted-foreground">Sell: <span className="font-mono-nums text-foreground">₹{trade.sellVal.toFixed(2)}</span></div>
                <div className="text-muted-foreground">Charges: <span className="font-mono-nums text-destructive/80">₹{trade.charges.toFixed(2)}</span></div>
                <div className="text-muted-foreground">Qty: <span className="font-mono-nums text-foreground">{trade.quantity}</span></div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border/30 pt-3">
                <span className="text-xs text-muted-foreground">{new Date(trade.date).toLocaleDateString()} • {trade.buyTime}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(trade._id)}
                  disabled={deleting === trade._id}
                  className="h-8 px-2 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="mr-1 h-3.5 w-3.5" /> Delete
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
