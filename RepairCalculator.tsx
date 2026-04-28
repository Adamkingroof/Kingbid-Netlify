import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MARKUP = 1.5; // 50% markup

interface RepairItem {
  id: string;
  type: string;
  quantity: number;
}

const REPAIR_OPTIONS: Record<string, { label: string; category: string; calcType: "flat" | "perUnit" | "minPlusLF"; cost: number; minCost?: number; perLF?: number }> = {
  "shingle_1_5": { label: "Shingle Replacement (1–5)", category: "Shingle Replacement", calcType: "flat", cost: 109 },
  "shingle_6_15": { label: "Shingle Replacement (6–15)", category: "Shingle Replacement", calcType: "flat", cost: 159 },
  "shingle_16_30": { label: "Shingle Replacement (16–30)", category: "Shingle Replacement", calcType: "flat", cost: 234 },
  "shingle_30_plus": { label: "Shingle Replacement (30+)", category: "Shingle Replacement", calcType: "flat", cost: 284 },
  "counter_flash_std": { label: "Counter Flashing – Standard (per LF)", category: "Flashing", calcType: "minPlusLF", cost: 0, minCost: 150, perLF: 16.34 },
  "counter_flash_brick": { label: "Counter Flashing – Brick (per LF)", category: "Flashing", calcType: "minPlusLF", cost: 0, minCost: 150, perLF: 28.53 },
  "step_flashing": { label: "Step Flashing (per LF)", category: "Flashing", calcType: "minPlusLF", cost: 0, minCost: 100, perLF: 38.09 },
  "skylight_flashing": { label: "Skylight Flashing Replacement", category: "Flashing", calcType: "perUnit", cost: 172.94 },
  "valley_metal": { label: "Valley Metal Repair/Replacement (per LF)", category: "Flashing", calcType: "minPlusLF", cost: 0, minCost: 75, perLF: 18.75 },
  "turtle_vent": { label: "Turtle Vent Replacement", category: "Vents & Pipe Jacks", calcType: "perUnit", cost: 66.80 },
  "pipe_jack": { label: "Pipe Jack Boot Replacement", category: "Vents & Pipe Jacks", calcType: "perUnit", cost: 98.14 },
  "ridge_vent": { label: "Ridge Vent Cut-In (per LF)", category: "Vents & Pipe Jacks", calcType: "minPlusLF", cost: 0, minCost: 75, perLF: 25.45 },
  "drip_edge": { label: "Drip Edge Replacement (per LF)", category: "Drip Edge & Ridge Cap", calcType: "minPlusLF", cost: 0, minCost: 75, perLF: 11.40 },
  "ridge_cap": { label: "Ridge Cap Replacement (per LF)", category: "Drip Edge & Ridge Cap", calcType: "minPlusLF", cost: 0, minCost: 75, perLF: 70.50 },
};

function calcItemPrice(key: string, qty: number): { ourCost: number; customerPrice: number } {
  const opt = REPAIR_OPTIONS[key];
  if (!opt || qty <= 0) return { ourCost: 0, customerPrice: 0 };

  let ourCost = 0;
  if (opt.calcType === "flat") {
    ourCost = opt.cost * qty;
  } else if (opt.calcType === "perUnit") {
    ourCost = opt.cost * qty;
  } else if (opt.calcType === "minPlusLF") {
    const lfCost = (opt.perLF || 0) * qty;
    ourCost = Math.max(opt.minCost || 0, lfCost);
  }

  return { ourCost, customerPrice: ourCost * MARKUP };
}

const RepairCalculator = () => {
  const navigate = useNavigate();
  const [squares, setSquares] = useState(0);
  const [repairItems, setRepairItems] = useState<RepairItem[]>([
    { id: crypto.randomUUID(), type: "", quantity: 0 },
  ]);

  const rejuvCostPerSq = 155;
  const rejuvTotal = squares * rejuvCostPerSq;

  const addItem = () => {
    setRepairItems((prev) => [...prev, { id: crypto.randomUUID(), type: "", quantity: 0 }]);
  };

  const removeItem = (id: string) => {
    setRepairItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateItem = (id: string, field: keyof RepairItem, value: string | number) => {
    setRepairItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  };

  const repairTotal = repairItems.reduce((sum, item) => {
    if (!item.type) return sum;
    const { customerPrice } = calcItemPrice(item.type, item.quantity);
    return sum + customerPrice;
  }, 0);

  const grandTotal = rejuvTotal + repairTotal;

  const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

  // Group repair options by category for display
  const categories = Object.entries(REPAIR_OPTIONS).reduce<Record<string, { key: string; label: string }[]>>((acc, [key, val]) => {
    if (!acc[val.category]) acc[val.category] = [];
    acc[val.category].push({ key, label: val.label });
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background py-6 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>

        <div className="text-center space-y-2">
          <img src="/King-Roofing-Logo-Black.png" alt="King Roofing" className="h-16 mx-auto object-contain invert brightness-200" />
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Rejuvenation & Repairs</h1>
        </div>

        {/* Rejuvenation Section */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-primary">Rejuvenation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 items-end">
              <div className="space-y-2">
                <Label>Number of Squares</Label>
                <Input
                  type="number"
                  min={0}
                  value={squares || ""}
                  onChange={(e) => setSquares(Number(e.target.value))}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">Rate: $155 / square</Label>
                <div className="h-10 flex items-center rounded-md border border-border bg-secondary/50 px-3 text-lg font-semibold text-primary">
                  {fmt(rejuvTotal)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Repairs Section */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-primary">Repairs</CardTitle>
            <Button variant="outline" size="sm" onClick={addItem} className="border-primary/30 text-primary hover:bg-primary/10">
              <Plus className="h-4 w-4 mr-1" /> Add Item
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {repairItems.map((item, idx) => {
              const { customerPrice } = item.type ? calcItemPrice(item.type, item.quantity) : { customerPrice: 0 };
              const opt = item.type ? REPAIR_OPTIONS[item.type] : null;
              const qtyLabel = opt?.calcType === "minPlusLF" ? "Linear Feet" : opt?.calcType === "flat" ? "Qty (jobs)" : "Quantity";

              return (
                <div key={item.id} className="grid grid-cols-[1fr_120px_120px_40px] gap-3 items-end">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Item {idx + 1}</Label>
                    <Select value={item.type} onValueChange={(v) => updateItem(item.id, "type", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select repair item" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(categories).map(([cat, items]) => (
                          <div key={cat}>
                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{cat}</div>
                            {items.map((i) => (
                              <SelectItem key={i.key} value={i.key}>{i.label}</SelectItem>
                            ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">{qtyLabel}</Label>
                    <Input
                      type="number"
                      min={0}
                      value={item.quantity || ""}
                      onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Price</Label>
                    <div className="h-10 flex items-center rounded-md border border-border bg-secondary/50 px-3 text-sm font-medium text-foreground">
                      {fmt(customerPrice)}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    className="text-destructive hover:bg-destructive/10 h-10 w-10"
                    disabled={repairItems.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}

            {repairItems.some((i) => i.type) && (
              <div className="flex justify-between items-center pt-4 border-t border-border">
                <span className="text-muted-foreground font-medium">Repairs Subtotal</span>
                <span className="text-lg font-semibold text-foreground">{fmt(repairTotal)}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Grand Total */}
        <Card className="border-primary/30 bg-gradient-to-br from-card to-primary/5">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold text-foreground">Grand Total</span>
              <span className="text-3xl font-bold text-primary">{fmt(grandTotal)}</span>
            </div>
            {squares > 0 && repairTotal > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>Rejuvenation: {fmt(rejuvTotal)}</div>
                <div>Repairs: {fmt(repairTotal)}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RepairCalculator;
