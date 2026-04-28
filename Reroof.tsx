import QuoteForm from "@/components/QuoteForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Reroof = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="max-w-5xl mx-auto px-4 pt-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
      </div>
      <QuoteForm />
    </div>
  );
};

export default Reroof;
