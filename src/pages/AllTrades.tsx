import { motion } from "framer-motion";
import { useTrades, useDeleteTrade } from "@/hooks/useTrades";
import { useNavigate } from "react-router-dom";
import TradeTable from "@/components/TradeTable";
import StatsBar from "@/components/StatsBar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const AllTrades = () => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { data: trades = [], isLoading, refetch } = useTrades();
  const deleteTrade = useDeleteTrade();

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteTrade.mutateAsync(id);
      toast.success("Trade deleted");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete trade");
    } finally {
      setDeletingId(null);
    }
  };

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
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
            </Button>
            <div>
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl">All Trades</h1>
              <p className="text-sm text-muted-foreground">Complete trade history</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="border-border text-muted-foreground hover:bg-secondary">
            <RefreshCw className="mr-1.5 h-4 w-4" /> Refresh
          </Button>
        </motion.header>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mb-6">
          <StatsBar trades={trades} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          {isLoading ? (
            <div className="glass-card flex items-center justify-center rounded-2xl py-16">
              <RefreshCw className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <TradeTable trades={trades} onDelete={handleDelete} deleting={deletingId} />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AllTrades;
