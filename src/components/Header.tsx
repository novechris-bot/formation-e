import { Bus, Map, Info } from "lucide-react";
import { routeStats } from "@/data/hlpRoutes";

export function Header() {
  return (
    <header className="gradient-header text-primary-foreground">
      <div className="container mx-auto px-4 py-6">
        {/* Logo et titre */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center">
            <Bus className="w-7 h-7" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">
              HLP Navigator
            </h1>
            <p className="text-sm text-primary-foreground/80">
              Livret des Hauts-le-Pied • TPG
            </p>
          </div>
        </div>
        
        {/* Statistiques */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg px-3 py-2 text-center">
            <p className="text-2xl font-display font-bold">{routeStats.total}</p>
            <p className="text-xs text-primary-foreground/70">Parcours</p>
          </div>
          <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg px-3 py-2 text-center">
            <p className="text-2xl font-display font-bold">{routeStats.sorties}</p>
            <p className="text-xs text-primary-foreground/70">Sorties</p>
          </div>
          <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg px-3 py-2 text-center">
            <p className="text-2xl font-display font-bold">{routeStats.rentrees}</p>
            <p className="text-xs text-primary-foreground/70">Rentrées</p>
          </div>
        </div>

        {/* Date de validité */}
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-primary-foreground/70">
          <Info className="w-4 h-4" />
          <span>Valide à partir du 14 décembre 2025</span>
        </div>
      </div>
    </header>
  );
}
