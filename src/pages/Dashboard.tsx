import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useTrades, useCreateTrade, useDeleteTrade } from "@/hooks/useTrades";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/api/client";
import TradeTable from "@/components/TradeTable";
import TradeForm from "@/components/TradeForm";
import StatsBar from "@/components/StatsBar";
import { Button } from "@/components/ui/button";
import { Plus, LogOut, TrendingUp, RefreshCw, History, LineChart, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { TradeCreatePayload } from "@/types/trade";

const Dashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const { data: trades = [], isLoading, refetch } = useTrades();
  const createTrade = useCreateTrade();
  const deleteTrade = useDeleteTrade();

  const todayTrades = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    return trades.filter((t) => t.date.split("T")[0] === todayStr);
  }, [trades]);

  const handleCreate = async (data: TradeCreatePayload) => {
    try {
      await createTrade.mutateAsync(data);
      toast.success("Trade logged successfully");
      setShowForm(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to create trade");
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    console.log(id);
    try {
      await deleteTrade.mutateAsync(id);
      toast.success("Trade deleted");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete trade");
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
      navigate("/");
    } catch {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background grid */}
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(hsl(var(--primary)/0.02)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--primary)/0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Investment Logger</h1>
              <p className="text-sm text-muted-foreground">Today's trades</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="border-border text-muted-foreground hover:bg-secondary"
            >
              <RefreshCw className="mr-1.5 h-4 w-4" /> Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/trades")}
              className="border-border text-muted-foreground hover:bg-secondary"
            >
              <History className="mr-1.5 h-4 w-4" /> All Trades
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/progress")}
              className="border-border text-muted-foreground hover:bg-secondary"
            >
              <LineChart className="mr-1.5 h-4 w-4" /> Progress
            </Button>
            <Button
              size="sm"
              onClick={() => setShowForm(true)}
              className="bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="mr-1.5 h-4 w-4" /> New Trade
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </motion.header>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mb-6"
        >
          <StatsBar trades={todayTrades} />
        </motion.div>

        {/* Trade Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {isLoading ? (
            <div className="glass-card flex items-center justify-center rounded-2xl py-16">
              <RefreshCw className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <TradeTable trades={todayTrades} onDelete={handleDelete} deleting={deletingId} />
          )}
        </motion.div>
      </div>

      {/* Trade Form Modal */}
      {showForm && (
        <TradeForm
          onSubmit={handleCreate}
          onClose={() => setShowForm(false)}
          loading={createTrade.isPending}
        />
      )}
    </div>
  );
};

export default Dashboard;
