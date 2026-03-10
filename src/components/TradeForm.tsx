import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trade, TradeCreatePayload } from "@/types/trade";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface TradeFormProps {
  onSubmit: (data: TradeCreatePayload) => void;
  onClose: () => void;
  loading?: boolean;
  initialData?: Trade | null;
}

const TradeForm = ({ onSubmit, onClose, loading, initialData }: TradeFormProps) => {
  const [form, setForm] = useState<TradeCreatePayload>({
    name: initialData?.name || "",
    buyval: initialData?.buyval || 0,
    sellval: initialData?.sellval || 0,
    quantity: initialData?.quantity || 0,
    date: initialData?.date || new Date().toISOString().split("T")[0],
    buytime: initialData?.buytime || "",
    selltime: initialData?.selltime || "",
  });

  const handleChange = (field: keyof TradeCreatePayload, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const fields: { key: keyof TradeCreatePayload; label: string; type: string; step?: string }[] = [
    { key: "name", label: "Trade Name", type: "text" },
    { key: "buyval", label: "Buy Value", type: "number", step: "0.01" },
    { key: "sellval", label: "Sell Value", type: "number", step: "0.01" },
    { key: "quantity", label: "Quantity", type: "number", step: "1" },
    { key: "date", label: "Date", type: "date" },
    { key: "buytime", label: "Buy Time", type: "time" },
    { key: "selltime", label: "Sell Time", type: "time" },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="glass-card glow-primary w-full max-w-lg rounded-2xl p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold">
              {initialData ? "Edit Trade" : "Log New Trade"}
            </h2>
            <button onClick={onClose} className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {fields.map((field, i) => (
                <motion.div
                  key={field.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={field.key === "name" ? "sm:col-span-2" : ""}
                >
                  <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                    {field.label}
                  </label>
                  <Input
                    type={field.type}
                    step={field.step}
                    value={form[field.key]}
                    onChange={(e) =>
                      handleChange(
                        field.key,
                        field.type === "number" ? parseFloat(e.target.value) || 0 : e.target.value
                      )
                    }
                    className="bg-secondary/50 border-border focus:border-primary"
                    required
                  />
                </motion.div>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 border-border text-muted-foreground hover:bg-secondary"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
              >
                {loading ? "Saving..." : initialData ? "Update Trade" : "Log Trade"}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TradeForm;
