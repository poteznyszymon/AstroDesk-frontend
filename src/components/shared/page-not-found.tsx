import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const PageNotFound = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background px-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-4xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold tracking-tight">Strona nie została znaleziona</h2>
        <p className="text-muted-foreground text-sm max-w-md">Przepraszamy, ale strona której szukasz nie istnieje lub została przeniesiona.</p>
      </div>
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => window.history.back()}>
          <ArrowLeft className=" h-4 w-4" />
          Wróć
        </Button>
        <Button asChild>
          <Link to="/">
            <Home className="h-4 w-4" />
            Strona główna
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default PageNotFound;
