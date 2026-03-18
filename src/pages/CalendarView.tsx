import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTrades } from "@/hooks/useTrades";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Monday = 0
}

const CalendarView = () => {
  const navigate = useNavigate();
  const { data: trades = [], isLoading, refetch } = useTrades();
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());

  const dailyPL = useMemo(() => {
    const map = new Map<string, { pl: number; trades: number; charges: number }>();
    trades.forEach((t) => {
      const dateKey = t.date.split("T")[0];
      const existing = map.get(dateKey) || { pl: 0, trades: 0, charges: 0 };
      existing.pl += (t.sellVal - t.buyVal) * t.quantity;
      existing.charges += t.charges || 0;
      existing.trades += 1;
      map.set(dateKey, existing);
    });
    return map;
  }, [trades]);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(viewYear - 1); setViewMonth(11); }
    else setViewMonth(viewMonth - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(viewYear + 1); setViewMonth(0); }
    else setViewMonth(viewMonth + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(hsl(var(--primary)/0.02)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--primary)/0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate("/dashboard")} className="border-border text-muted-foreground hover:bg-secondary">
              <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
            </Button>
            <div>
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Calendar</h1>
              <p className="text-sm text-muted-foreground">Daily P/L heatmap</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="border-border text-muted-foreground hover:bg-secondary">
            <RefreshCw className="mr-1.5 h-4 w-4" /> Refresh
          </Button>
        </motion.header>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          {isLoading ? (
            <div className="glass-card flex items-center justify-center rounded-2xl py-16">
              <RefreshCw className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-6">
              {/* Month navigation */}
              <div className="mb-6 flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={prevMonth} className="text-muted-foreground hover:text-foreground">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-lg font-semibold">{MONTHS[viewMonth]} {viewYear}</h2>
                <Button variant="ghost" size="sm" onClick={nextMonth} className="text-muted-foreground hover:text-foreground">
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {DAYS.map((d) => (
                  <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">{d}</div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const data = dailyPL.get(dateStr);
                  const isToday = viewYear === now.getFullYear() && viewMonth === now.getMonth() && day === now.getDate();

                  let bgClass = "bg-secondary/50";
                  if (data) {
                    const net = data.pl - data.charges;
                    bgClass = net >= 0 ? "bg-[hsl(var(--profit))] text-[hsl(var(--primary-foreground))]" : "bg-[hsl(var(--loss))] text-destructive-foreground";
                  }

                  const cell = (
                    <div
                      className={`relative flex aspect-square items-center justify-center rounded-lg text-sm font-medium transition-all ${bgClass} ${isToday ? "ring-2 ring-ring ring-offset-1 ring-offset-background" : ""} ${data ? "cursor-pointer hover:opacity-80" : "text-muted-foreground"}`}
                    >
                      {day}
                    </div>
                  );

                  if (!data) return <div key={day}>{cell}</div>;

                  const net = data.pl - data.charges;
                  return (
                    <HoverCard key={day} openDelay={100} closeDelay={50}>
                      <HoverCardTrigger asChild>{cell}</HoverCardTrigger>
                      <HoverCardContent className="w-auto min-w-[180px] border-border bg-card text-card-foreground p-3" side="top">
                        <div className="space-y-1.5 text-sm">
                          <p className="font-semibold">{day}/{viewMonth + 1}/{viewYear}</p>
                          <div className="flex justify-between gap-4">
                            <span className="text-muted-foreground">Trades</span>
                            <span className="font-medium">{data.trades}</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-muted-foreground">Gross P/L</span>
                            <span className={`font-medium ${data.pl >= 0 ? "text-[hsl(var(--profit))]" : "text-destructive"}`}>
                              ₹{data.pl.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-muted-foreground">Charges</span>
                            <span className="font-medium">₹{data.charges.toFixed(2)}</span>
                          </div>
                          <div className="border-t border-border pt-1.5 flex justify-between gap-4">
                            <span className="text-muted-foreground">Net P/L</span>
                            <span className={`font-bold ${net >= 0 ? "text-[hsl(var(--profit))]" : "text-destructive"}`}>
                              ₹{net.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CalendarView;
