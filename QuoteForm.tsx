import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

interface QuoteData {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  city: string;
  state: string;
  squares: number;
  pitch: number;
  wastePct: number;
  stories: string;
  hipsLF: number;
  ridgeLF: number;
  valleysLF: number;
  flashingLF: number;
  dripEdgeLF: number;
  layers: number;
  guttersLF: number;
  guttersIncluded: boolean;
  leakBarrierSquares: number;
  stepFlashingLF: number;
  eaves: number;
  iceWaterSquares: number;
  starterLF: number;
  existingShingle: string;
  newShingleType: string;
  decking: string;
  underlayment: string;
  iceWaterType: string;
  starterType: string;
  valleysType: string;
  ridgeVent: string;
  turtleVents: string;
  hipRidgeType: string;
  turtleVentCount: number;
  upgradedWarranty: string;
  marginPct: number;
  commissionPct: number;
  priceSubtotal: number;
  priceWithMargin: number;
  priceWithFinancingFee: number;
  finalPrice: number;
  paymentMethod: string;
  financingOption: string;
  loanTermYears: number;
  downPayment: number;
  monthlyPayment: number;
  calc?: any;
}

export default function QuoteForm() {
  const [quote, setQuote] = useState<QuoteData>({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    address: "",
    city: "",
    state: "",
    squares: 0,
    pitch: 0,
    wastePct: 10,
    stories: "1",
    hipsLF: 0,
    ridgeLF: 0,
    valleysLF: 0,
    flashingLF: 0,
    dripEdgeLF: 0,
    layers: 1,
    guttersLF: 0,
    guttersIncluded: false,
    leakBarrierSquares: 0,
    stepFlashingLF: 0,
    eaves: 0,
    iceWaterSquares: 0,
    starterLF: 0,
    existingShingle: "Asphalt Shingle",
    newShingleType: "GAF Natural Shadow",
    decking: "No replacement",
    underlayment: "Generic",
    iceWaterType: "Generic",
    starterType: "GAF ProStart",
    valleysType: "Shingle",
    ridgeVent: "Yes",
    turtleVents: "No",
    hipRidgeType: "GAF Seal a Ridge (25 LF per bundle $60)",
    turtleVentCount: 0,
    upgradedWarranty: "None",
    marginPct: 50,
    commissionPct: 8,
    priceSubtotal: 0,
    priceWithMargin: 0,
    priceWithFinancingFee: 0,
    finalPrice: 0,
    paymentMethod: "",
    financingOption: "",
    loanTermYears: 10,
    downPayment: 0,
    monthlyPayment: 0,
  });

  const updateQuote = (field: string, value: any) => {
    setQuote(prev => {
      const updated = { ...prev, [field]: value };
      
      if (field === "newShingleType") {
        const highTempShingles = ["Woodshake", "F-Wave", "Brava", "DaVinci"];
        if (highTempShingles.includes(value)) {
          updated.underlayment = "High Temp";
          updated.iceWaterType = "High Temp Ice & Water";
          updated.valleysType = "Metal";
        }
      }
      
      if (field === "squares") {
        updated.leakBarrierSquares = value;
      }
      
      if (field === "eaves") {
        updated.iceWaterSquares = Math.round((value * 2) / 60 * 100) / 100;
      }
      
      if (field === "marginPct") {
        if (value >= 60) updated.commissionPct = 12;
        else if (value >= 55) updated.commissionPct = 10;
        else if (value >= 50) updated.commissionPct = 8;
        else if (value >= 45) updated.commissionPct = 7;
        else updated.commissionPct = 6;
      }
      
      return updated;
    });
  };

  const calculateMonthlyPayment = (principal: number, annualRate: number, years: number) => {
    if (annualRate === 0) {
      return principal / (years * 12);
    }
    const monthlyRate = annualRate / 12 / 100;
    const numPayments = years * 12;
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
           (Math.pow(1 + monthlyRate, numPayments) - 1);
  };

  // Real-time calculation effect
  useEffect(() => {
    const sq = quote.squares;
    const pitch = quote.pitch;
    const layers = quote.layers;
    const valleysLF = quote.valleysLF;
    const hipsLF = quote.hipsLF;
    const ridgeLF = quote.ridgeLF;
    const starterLF = quote.starterLF;
    const guttersLF = quote.guttersIncluded ? quote.guttersLF : 0;
    const stepLF = quote.stepFlashingLF;
    const dripLF = quote.dripEdgeLF;
    const iceSwq = quote.iceWaterSquares * 1.5;
    const stories = quote.stories;
    const existing = quote.existingShingle;
    const shingle = quote.newShingleType;
    const ridgeVentYes = quote.ridgeVent === "Yes";
    const valleysMetal = quote.valleysType === "Metal" || ["F-Wave", "Woodshake", "Brava", "DaVinci"].includes(shingle);

    let tearBase = 50;
    if (layers === 2) tearBase += 10;
    else if (layers === 3) tearBase += 20;
    else if (layers >= 4) tearBase += 30;
    if (existing === "Woodshake") tearBase += 15;
    const tearOff = sq * tearBase;

    let installBase = 100;
    if (shingle === "Woodshake") installBase = 300;
    else if (shingle === "Stone Coated Steel") installBase = 260;
    else if (shingle === "Standing Seam Metal") installBase = 180;
    else if (shingle === "Brava" || shingle === "DaVinci") installBase = 200;
    else if (shingle === "F-Wave") installBase = 145;

    if (stories !== "1") installBase += 10;
    if (pitch >= 9 && pitch < 11) installBase += 13;
    else if (pitch >= 11 && pitch <= 12) installBase += 15;
    else if (pitch > 12) installBase += 20;
    const installLabor = sq * installBase;
    
    const valleyLaborMetal = valleysMetal ? valleysLF * 8 : 0;

    let warrantyCost = 0;
    let warrantyPricePerSquare = 0;
    if (quote.upgradedWarranty === "Systems Plus") {
      warrantyCost = 70;
      warrantyPricePerSquare = 10;
    } else if (quote.upgradedWarranty === "Silver Pledge") {
      warrantyCost = 130;
      warrantyPricePerSquare = 15;
    } else if (quote.upgradedWarranty === "Golden Pledge") {
      warrantyCost = 7 * sq;
      warrantyPricePerSquare = 20;
    }

    let shingleMat = 110.50;
    if (shingle === "GAF HDZ") shingleMat = 113.50;
    else if (shingle === "GAF UHDZ") shingleMat = 155.76;
    else if (shingle === "Woodshake") shingleMat = 1250;
    else if (shingle === "F-Wave") shingleMat = 498;
    else if (shingle === "Stone Coated Steel") shingleMat = 650;
    else if (shingle === "Standing Seam Metal") shingleMat = 750;
    else if (shingle === "Brava" || shingle === "DaVinci") shingleMat = 729.30;
    const shingleMaterialsCost = sq * shingleMat;

    let underlaymentCostPerRoll = 69;
    if (["GAF Natural Shadow", "GAF HDZ", "GAF UHDZ"].includes(shingle)) {
      underlaymentCostPerRoll = quote.underlayment === "GAF FeltBuster" ? 118 : 69;
    } else if (["Woodshake", "F-Wave", "Brava", "DaVinci"].includes(shingle)) {
      underlaymentCostPerRoll = 410.50;
    }
    const underlaymentRolls = Math.ceil(sq / 10);
    const underlaymentCost = underlaymentRolls * underlaymentCostPerRoll;

    let iceCostPerRoll = 69;
    if (["GAF Natural Shadow", "GAF HDZ", "GAF UHDZ"].includes(shingle)) {
      iceCostPerRoll = quote.iceWaterType === "GAF WeatherWatch" ? 95 : 69;
    } else if (["Woodshake", "F-Wave", "Brava", "DaVinci"].includes(shingle)) {
      iceCostPerRoll = 110;
    }
    const iceRolls = Math.ceil(iceSwq / 2);
    const iceCost = iceRolls * iceCostPerRoll;

    let starterBundleLF = 120;
    let starterBundleCost = 76.80;
    if (shingle === "Woodshake") {
      starterBundleLF = 16;
      starterBundleCost = 186;
    } else if (shingle === "F-Wave") {
      starterBundleLF = 52.5;
      starterBundleCost = 151;
    } else if (shingle === "Brava" || shingle === "DaVinci") {
      starterBundleLF = 10;
      starterBundleCost = 57.75;
    }
    const starterBundles = Math.ceil(starterLF / starterBundleLF);
    const starterCost = starterBundles * starterBundleCost;

    let hrLF = ridgeVentYes ? hipsLF : hipsLF + ridgeLF;
    let hrBundleLF = 25;
    let hrBundleCost = 60;
    if (shingle === "Woodshake") {
      hrBundleLF = 16;
      hrBundleCost = 186;
    } else if (shingle === "F-Wave") {
      hrBundleLF = 25;
      hrBundleCost = 166.75;
    } else if (shingle === "Brava" || shingle === "DaVinci") {
      hrBundleLF = 8.3;
      hrBundleCost = 78.33;
    }
    const hrBundles = Math.ceil(hrLF / hrBundleLF);
    const hipRidgeCost = hrBundles * hrBundleCost;
    const ridgeVentCost = ridgeVentYes ? ridgeLF * 15 : 0;

    const valleyPieces = Math.ceil(valleysLF / 10);
    const valleyMetalCost = valleysMetal ? valleyPieces * 48.56 : 0;

    let deckingCost = 0;
    if (quote.decking === "Replace") {
      const boards = sq * 4;
      deckingCost = boards * 70;
    }

    const turtleCost = quote.turtleVents === "Yes" ? quote.turtleVentCount * 15.70 : 0;

    const stepBundles = Math.ceil(Math.ceil(stepLF / 8) / 50);
    const stepFlashingCost = stepBundles * 32;
    const dripPieces = Math.ceil(dripLF / 10);
    const dripCost = dripPieces * 5.69;

    const coilBoxes = Math.ceil(sq / 15);
    const coilCost = coilBoxes * 37;
    const capBoxes = Math.ceil(sq / 10);
    const capCost = capBoxes * 22;

    const gutterCost = guttersLF * 10;

    let subtotal = tearOff + installLabor + valleyLaborMetal + shingleMaterialsCost + 
                   underlaymentCost + iceCost + starterCost + hipRidgeCost + ridgeVentCost +
                   valleyMetalCost + deckingCost + turtleCost + stepFlashingCost + dripCost +
                   coilCost + capCost + gutterCost + warrantyCost;

    const m = Math.min(Math.max(quote.marginPct, 0), 95) / 100;
    const priceWithMargin = (m >= 0.95 ? subtotal * 10 : subtotal / (1 - m)) + (warrantyPricePerSquare * sq);
    
    const priceWithFinancingFee = priceWithMargin * 1.06;
    
    let finalPrice = priceWithFinancingFee;
    if (quote.paymentMethod === "cash") {
      finalPrice = priceWithFinancingFee * 0.95;
    } else if (quote.paymentMethod === "credit") {
      finalPrice = priceWithFinancingFee * 0.98;
    }
    
    let monthlyPayment = 0;
    const loanAmount = Math.max(0, finalPrice - quote.downPayment);
    
    if (quote.financingOption === "0apr12") {
      monthlyPayment = loanAmount / 12;
    } else if (quote.financingOption === "9.99apr") {
      monthlyPayment = calculateMonthlyPayment(loanAmount, 9.99, quote.loanTermYears);
    }
    
    let commissionPct = 6;
    if (quote.marginPct >= 60) commissionPct = 12;
    else if (quote.marginPct >= 55) commissionPct = 10;
    else if (quote.marginPct >= 50) commissionPct = 8;
    else if (quote.marginPct >= 45) commissionPct = 7;

    setQuote(prev => ({
      ...prev,
      priceSubtotal: subtotal,
      priceWithMargin,
      priceWithFinancingFee,
      finalPrice,
      monthlyPayment,
      commissionPct,
      calc: {
        tearOff, installLabor, valleyLaborMetal, shingleMaterialsCost, underlaymentCost,
        iceCost, starterCost, hipRidgeCost, ridgeVentCost, valleyMetalCost, deckingCost,
        turtleCost, stepFlashingCost, dripCost, coilCost, capCost, gutterCost,
        underlaymentRolls, iceRolls, starterBundles, hrBundles, valleyPieces, dripPieces,
        stepBundles, coilBoxes, capBoxes, hrLF
      }
    }));
  }, [
    quote.squares, quote.pitch, quote.wastePct, quote.stories, quote.layers,
    quote.hipsLF, quote.ridgeLF, quote.valleysLF, quote.flashingLF, quote.dripEdgeLF,
    quote.guttersLF, quote.guttersIncluded, quote.stepFlashingLF, quote.eaves, quote.iceWaterSquares,
    quote.starterLF, quote.existingShingle, quote.newShingleType, quote.decking,
    quote.underlayment, quote.iceWaterType, quote.valleysType, quote.ridgeVent,
    quote.turtleVents, quote.turtleVentCount, quote.upgradedWarranty,
    quote.marginPct, quote.paymentMethod, quote.financingOption,
    quote.loanTermYears, quote.downPayment, quote.leakBarrierSquares
  ]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient-gold">
            King Roofing
          </h1>
          <p className="text-muted-foreground text-lg">Retail Bid Calculator</p>
        </div>

        {/* Customer Section */}
        <Card className="shadow-elevated border-border/50">
          <CardHeader>
            <CardTitle className="text-primary">Customer Information</CardTitle>
            <CardDescription>Optional — enter homeowner info if available</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  value={quote.customerName}
                  onChange={(e) => updateQuote("customerName", e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerPhone">Customer Phone</Label>
                <Input
                  id="customerPhone"
                  type="tel"
                  value={quote.customerPhone}
                  onChange={(e) => updateQuote("customerPhone", e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customerEmail">Customer Email</Label>
              <Input
                id="customerEmail"
                type="email"
                value={quote.customerEmail}
                onChange={(e) => updateQuote("customerEmail", e.target.value)}
                placeholder="john@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                value={quote.address}
                onChange={(e) => updateQuote("address", e.target.value)}
                placeholder="123 Main St"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={quote.city}
                  onChange={(e) => updateQuote("city", e.target.value)}
                  placeholder="Orem"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={quote.state}
                  onChange={(e) => updateQuote("state", e.target.value)}
                  placeholder="UT"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Home Info Section */}
        <Card className="shadow-elevated border-border/50">
          <CardHeader>
            <CardTitle className="text-primary">Home Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="squares">Total Squares *</Label>
                <Input
                  id="squares"
                  type="number"
                  min="1"
                  value={quote.squares || ""}
                  onChange={(e) => updateQuote("squares", Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pitch">Pitch *</Label>
                <Input
                  id="pitch"
                  type="number"
                  min="0"
                  value={quote.pitch || ""}
                  onChange={(e) => updateQuote("pitch", Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wastePct">Waste Factor % *</Label>
                <Input
                  id="wastePct"
                  type="number"
                  min="0"
                  max="100"
                  value={quote.wastePct}
                  onChange={(e) => updateQuote("wastePct", Number(e.target.value))}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stories">Stories *</Label>
                <Select value={quote.stories} onValueChange={(v) => updateQuote("stories", v)}>
                  <SelectTrigger id="stories">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3+">3+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="layers">Layers *</Label>
                <Input
                  id="layers"
                  type="number"
                  min="1"
                  value={quote.layers}
                  onChange={(e) => updateQuote("layers", Number(e.target.value))}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hipsLF">Hips (LF) *</Label>
                <Input
                  id="hipsLF"
                  type="number"
                  min="0"
                  value={quote.hipsLF || ""}
                  onChange={(e) => updateQuote("hipsLF", Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ridgeLF">Ridge (LF) *</Label>
                <Input
                  id="ridgeLF"
                  type="number"
                  min="0"
                  value={quote.ridgeLF || ""}
                  onChange={(e) => updateQuote("ridgeLF", Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valleysLF">Valleys (LF) *</Label>
                <Input
                  id="valleysLF"
                  type="number"
                  min="0"
                  value={quote.valleysLF || ""}
                  onChange={(e) => updateQuote("valleysLF", Number(e.target.value))}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="flashingLF">Flashing (LF) *</Label>
                <Input
                  id="flashingLF"
                  type="number"
                  min="0"
                  value={quote.flashingLF || ""}
                  onChange={(e) => updateQuote("flashingLF", Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dripEdgeLF">Drip Edge (LF) *</Label>
                <Input
                  id="dripEdgeLF"
                  type="number"
                  min="0"
                  value={quote.dripEdgeLF || ""}
                  onChange={(e) => updateQuote("dripEdgeLF", Number(e.target.value))}
                />
              </div>
            </div>

            {/* Gutters with toggle */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Switch
                  id="guttersIncluded"
                  checked={quote.guttersIncluded}
                  onCheckedChange={(checked) => updateQuote("guttersIncluded", checked)}
                />
                <Label htmlFor="guttersIncluded">Include Gutters</Label>
              </div>
              {quote.guttersIncluded && (
                <div className="space-y-2">
                  <Label htmlFor="guttersLF">Gutters (LF)</Label>
                  <Input
                    id="guttersLF"
                    type="number"
                    min="0"
                    value={quote.guttersLF || ""}
                    onChange={(e) => updateQuote("guttersLF", Number(e.target.value))}
                  />
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="leakBarrierSquares">Leak Barrier (Squares) *</Label>
                <Input
                  id="leakBarrierSquares"
                  type="number"
                  min="0"
                  value={quote.leakBarrierSquares || ""}
                  onChange={(e) => updateQuote("leakBarrierSquares", Number(e.target.value))}
                  disabled
                  className="bg-muted cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground">Auto-synced with Squares</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stepFlashingLF">Step Flashing (LF) *</Label>
                <Input
                  id="stepFlashingLF"
                  type="number"
                  min="0"
                  value={quote.stepFlashingLF || ""}
                  onChange={(e) => updateQuote("stepFlashingLF", Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eaves">Eaves (LF) *</Label>
                <Input
                  id="eaves"
                  type="number"
                  min="0"
                  value={quote.eaves || ""}
                  onChange={(e) => updateQuote("eaves", Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="iceWaterSquares">Ice & Water (Squares) *</Label>
                <Input
                  id="iceWaterSquares"
                  type="number"
                  min="0"
                  value={quote.iceWaterSquares || ""}
                  disabled
                  className="bg-muted cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground">Auto: (Eaves × 2) ÷ 60</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="starterLF">Starter (LF) *</Label>
                <Input
                  id="starterLF"
                  type="number"
                  min="0"
                  value={quote.starterLF || ""}
                  onChange={(e) => updateQuote("starterLF", Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="existingShingle">Existing Shingle Type *</Label>
                <Select value={quote.existingShingle} onValueChange={(v) => updateQuote("existingShingle", v)}>
                  <SelectTrigger id="existingShingle">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asphalt Shingle">Asphalt Shingle</SelectItem>
                    <SelectItem value="Woodshake">Woodshake</SelectItem>
                    <SelectItem value="Tile">Tile</SelectItem>
                    <SelectItem value="Stone Coated Steel">Stone Coated Steel</SelectItem>
                    <SelectItem value="Synthetic">Synthetic</SelectItem>
                    <SelectItem value="Metal">Metal</SelectItem>
                    <SelectItem value="TPO">TPO</SelectItem>
                    <SelectItem value="Membrane">Membrane</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Material Selections Section */}
        <Card className="shadow-elevated border-border/50">
          <CardHeader>
            <CardTitle className="text-primary">Material Selections</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newShingleType">New Shingle Type *</Label>
              <Select value={quote.newShingleType} onValueChange={(v) => updateQuote("newShingleType", v)}>
                <SelectTrigger id="newShingleType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GAF Natural Shadow">GAF Natural Shadow</SelectItem>
                  <SelectItem value="GAF HDZ">GAF HDZ</SelectItem>
                  <SelectItem value="GAF UHDZ">GAF UHDZ</SelectItem>
                  <SelectItem value="Woodshake">Woodshake</SelectItem>
                  <SelectItem value="Tile">Tile</SelectItem>
                  <SelectItem value="Stone Coated Steel">Stone Coated Steel</SelectItem>
                  <SelectItem value="Brava">Brava</SelectItem>
                  <SelectItem value="DaVinci">DaVinci</SelectItem>
                  <SelectItem value="Standing Seam Metal">Standing Seam Metal</SelectItem>
                  <SelectItem value="F-Wave">F-Wave</SelectItem>
                  <SelectItem value="TPO">TPO</SelectItem>
                  <SelectItem value="Membrane">Membrane</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="decking">Decking *</Label>
                <Select value={quote.decking} onValueChange={(v) => updateQuote("decking", v)}>
                  <SelectTrigger id="decking">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Replace">Replace</SelectItem>
                    <SelectItem value="No replacement">No replacement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="underlayment">Underlayment *</Label>
                <Select value={quote.underlayment} onValueChange={(v) => updateQuote("underlayment", v)}>
                  <SelectTrigger id="underlayment">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Generic">Generic</SelectItem>
                    <SelectItem value="GAF FeltBuster">GAF FeltBuster</SelectItem>
                    <SelectItem value="High Temp">High Temp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="iceWaterType">Ice & Water Barrier *</Label>
                <Select value={quote.iceWaterType} onValueChange={(v) => updateQuote("iceWaterType", v)}>
                  <SelectTrigger id="iceWaterType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Generic">Generic</SelectItem>
                    <SelectItem value="GAF WeatherWatch">GAF WeatherWatch</SelectItem>
                    <SelectItem value="High Temp Ice & Water">High Temp Ice & Water</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="valleysType">Valleys *</Label>
                <Select value={quote.valleysType} onValueChange={(v) => updateQuote("valleysType", v)}>
                  <SelectTrigger id="valleysType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Shingle">Shingle</SelectItem>
                    <SelectItem value="Metal">Metal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ridgeVent">Ridge Vent *</Label>
                <Select value={quote.ridgeVent} onValueChange={(v) => updateQuote("ridgeVent", v)}>
                  <SelectTrigger id="ridgeVent">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="turtleVents">Turtle Vents *</Label>
                <Select value={quote.turtleVents} onValueChange={(v) => updateQuote("turtleVents", v)}>
                  <SelectTrigger id="turtleVents">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {quote.turtleVents === "Yes" && (
              <div className="space-y-2">
                <Label htmlFor="turtleVentCount">Turtle Vent Count</Label>
                <Input
                  id="turtleVentCount"
                  type="number"
                  min="0"
                  value={quote.turtleVentCount || ""}
                  onChange={(e) => updateQuote("turtleVentCount", Number(e.target.value))}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="upgradedWarranty">Upgraded Warranty</Label>
              <Select value={quote.upgradedWarranty} onValueChange={(v) => updateQuote("upgradedWarranty", v)}>
                <SelectTrigger id="upgradedWarranty">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="Systems Plus">Systems Plus (+$10/sq)</SelectItem>
                  <SelectItem value="Silver Pledge">Silver Pledge (+$15/sq)</SelectItem>
                  <SelectItem value="Golden Pledge">Golden Pledge (+$20/sq)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Controls */}
        <Card className="shadow-elevated border-border/50">
          <CardHeader>
            <CardTitle className="text-primary">Pricing Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>Target Gross Margin %</Label>
                <span className="text-2xl font-bold text-primary">{quote.marginPct}%</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-muted-foreground">Recommended: 50%</span>
                <span className="text-xs text-muted-foreground">Minimum: 40%</span>
              </div>
              <Slider
                value={[quote.marginPct]}
                onValueChange={(v) => updateQuote("marginPct", v[0])}
                min={40}
                max={60}
                step={1}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>40%→6%</span>
                <span>45%→7%</span>
                <span>50%→8%</span>
                <span>55%→10%</span>
                <span>60%→12%</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>Rep Commission %</Label>
                <span className="text-2xl font-bold text-accent">{quote.commissionPct}%</span>
              </div>
              <Slider
                value={[quote.commissionPct]}
                disabled
                min={6}
                max={12}
                step={1}
                className="py-4 opacity-60"
              />
              <p className="text-xs text-muted-foreground">
                Commission automatically calculated based on gross margin
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                <p className="text-sm text-muted-foreground mb-1">Customer Price (with Margin)</p>
                <p className="text-2xl font-bold text-primary">${quote.priceWithMargin.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                {quote.squares > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    ${(quote.priceWithMargin / quote.squares).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / square
                  </p>
                )}
              </div>
              <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
                <p className="text-sm text-muted-foreground mb-1">Price with 6% Financing Fee</p>
                <p className="text-2xl font-bold text-accent">${quote.priceWithFinancingFee.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                {quote.squares > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    ${(quote.priceWithFinancingFee / quote.squares).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / square
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card className="shadow-elevated border-border/50">
          <CardHeader>
            <CardTitle className="text-primary">Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div 
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  quote.paymentMethod === "cash" 
                    ? "border-primary bg-primary/10" 
                    : "border-border/50 hover:border-border"
                }`}
                onClick={() => updateQuote("paymentMethod", "cash")}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={quote.paymentMethod === "cash"}
                    onChange={() => updateQuote("paymentMethod", "cash")}
                    className="h-5 w-5"
                  />
                  <div>
                    <p className="font-semibold">Cash Payment</p>
                    <p className="text-sm text-muted-foreground">5% Discount</p>
                  </div>
                </div>
              </div>
              
              <div 
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  quote.paymentMethod === "credit" 
                    ? "border-primary bg-primary/10" 
                    : "border-border/50 hover:border-border"
                }`}
                onClick={() => updateQuote("paymentMethod", "credit")}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={quote.paymentMethod === "credit"}
                    onChange={() => updateQuote("paymentMethod", "credit")}
                    className="h-5 w-5"
                  />
                  <div>
                    <p className="font-semibold">Credit Card Payment</p>
                    <p className="text-sm text-muted-foreground">2% Discount</p>
                  </div>
                </div>
              </div>
              
              <div 
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  quote.paymentMethod === "financing" 
                    ? "border-primary bg-primary/10" 
                    : "border-border/50 hover:border-border"
                }`}
                onClick={() => updateQuote("paymentMethod", "financing")}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={quote.paymentMethod === "financing"}
                    onChange={() => updateQuote("paymentMethod", "financing")}
                    className="h-5 w-5"
                  />
                  <div>
                    <p className="font-semibold">Financing</p>
                    <p className="text-sm text-muted-foreground">No Discount</p>
                  </div>
                </div>
              </div>
            </div>
            
            {quote.paymentMethod && (
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/30 mt-4">
                <p className="text-sm text-muted-foreground mb-1">Final Price After Discount</p>
                <p className="text-3xl font-bold text-primary">${quote.finalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Financing Options */}
        <Card className="shadow-elevated border-border/50">
          <CardHeader>
            <CardTitle className="text-primary">Financing Options</CardTitle>
            <CardDescription className="text-xs text-muted-foreground italic">
              *Financing options and monthly payment proposals shown here are approximate estimates and are not guaranteed. Final terms are subject to lender approval.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div 
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  quote.financingOption === "none" 
                    ? "border-primary bg-primary/10" 
                    : "border-border/50 hover:border-border"
                }`}
                onClick={() => updateQuote("financingOption", "none")}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="financing"
                    checked={quote.financingOption === "none"}
                    onChange={() => updateQuote("financingOption", "none")}
                    className="h-5 w-5"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">No Financing</p>
                    <p className="text-sm text-muted-foreground">Pay in full</p>
                  </div>
                </div>
              </div>
              
              <div 
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  quote.financingOption === "0apr12" 
                    ? "border-primary bg-primary/10" 
                    : "border-border/50 hover:border-border"
                }`}
                onClick={() => updateQuote("financingOption", "0apr12")}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="financing"
                    checked={quote.financingOption === "0apr12"}
                    onChange={() => updateQuote("financingOption", "0apr12")}
                    className="h-5 w-5"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">0% APR - Same as Cash</p>
                    <p className="text-sm text-muted-foreground">If paid within 12 months</p>
                    {quote.financingOption === "0apr12" && (
                      <div className="mt-3 space-y-2">
                        <div className="space-y-2">
                          <Label htmlFor="downPayment0apr">Down Payment ($)</Label>
                          <Input
                            id="downPayment0apr"
                            type="number"
                            min="0"
                            max={quote.finalPrice}
                            value={quote.downPayment || ""}
                            onChange={(e) => updateQuote("downPayment", Number(e.target.value))}
                            placeholder="0.00"
                          />
                        </div>
                        {quote.finalPrice > 0 && (
                          <div className="p-3 bg-primary/10 rounded-lg">
                            <p className="text-sm text-muted-foreground">Loan Amount: ${(quote.finalPrice - quote.downPayment).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            <p className="text-lg font-bold text-primary mt-1">
                              ${quote.monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/month
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div 
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  quote.financingOption === "9.99apr" 
                    ? "border-primary bg-primary/10" 
                    : "border-border/50 hover:border-border"
                }`}
                onClick={() => updateQuote("financingOption", "9.99apr")}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="financing"
                    checked={quote.financingOption === "9.99apr"}
                    onChange={() => updateQuote("financingOption", "9.99apr")}
                    className="h-5 w-5"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">9.99% APR Financing</p>
                    <p className="text-sm text-muted-foreground">Up to 20 years</p>
                    {quote.financingOption === "9.99apr" && (
                      <div className="mt-3 space-y-2">
                        <div className="space-y-2">
                          <Label htmlFor="downPayment9apr">Down Payment ($)</Label>
                          <Input
                            id="downPayment9apr"
                            type="number"
                            min="0"
                            max={quote.finalPrice}
                            value={quote.downPayment || ""}
                            onChange={(e) => updateQuote("downPayment", Number(e.target.value))}
                            placeholder="0.00"
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <Label>Loan Term: {quote.loanTermYears} years</Label>
                        </div>
                        <Slider
                          value={[quote.loanTermYears]}
                          onValueChange={(v) => updateQuote("loanTermYears", v[0])}
                          min={1}
                          max={20}
                          step={1}
                        />
                        {quote.finalPrice > 0 && (
                          <div className="p-3 bg-primary/10 rounded-lg">
                            <p className="text-sm text-muted-foreground">Loan Amount: ${(quote.finalPrice - quote.downPayment).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            <p className="text-lg font-bold text-primary mt-1">
                              ${quote.monthlyPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/month
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
            </div>
            
            <div className="p-3 bg-muted/50 rounded-lg border border-border/50 mt-4">
              <p className="text-xs text-muted-foreground text-center">
                All financing options include no payments for 90 days. Rates are specific to our preferred lender, <span className="font-semibold">Slice Financing</span>.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
