import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Wrench } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-3xl w-full space-y-10 text-center">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <img
            src="/King-Roofing-Logo-Black.png"
            alt="King Roofing"
            className="h-24 object-contain invert brightness-200"
          />
          <p className="text-muted-foreground text-lg tracking-wide">
            Select a calculator to get started
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card
            className="cursor-pointer border-border hover:border-primary/60 transition-all duration-300 hover:shadow-[var(--shadow-gold)] group"
            onClick={() => navigate("/reroof")}
          >
            <CardContent className="flex flex-col items-center justify-center gap-4 p-10">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Home className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">Re-Roof</h2>
              <p className="text-muted-foreground text-sm">
                Full roof replacement estimate with material selections, financing, and pricing controls.
              </p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer border-border hover:border-primary/60 transition-all duration-300 hover:shadow-[var(--shadow-gold)] group"
            onClick={() => navigate("/repairs")}
          >
            <CardContent className="flex flex-col items-center justify-center gap-4 p-10">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Wrench className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">Rejuvenation & Repairs</h2>
              <p className="text-muted-foreground text-sm">
                Roof rejuvenation pricing and itemized repair estimates with automatic markup.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
