import { useState } from "react";
import { Header } from "@/components/Header";
import { RouteSelector } from "@/components/RouteSelector";
import { RouteDisplay } from "@/components/RouteDisplay";
import { QuickFilters } from "@/components/QuickFilters";
import { HLPRoute, searchRoutes, getUniqueOrigins } from "@/data/hlpRoutes";

type FilterType = 'all' | 'sortie' | 'rentree' | 'inter-ligne';

const Index = () => {
  const [selectedRoute, setSelectedRoute] = useState<HLPRoute | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const handleRouteSelect = (route: HLPRoute | null) => {
    setSelectedRoute(route);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Filtres rapides */}
        <section>
          <QuickFilters 
            activeFilter={activeFilter} 
            onFilterChange={setActiveFilter} 
          />
        </section>

        {/* Sélecteur de parcours */}
        <section>
          <h2 className="font-display font-semibold text-lg text-foreground mb-3">
            Rechercher un itinéraire
          </h2>
          <RouteSelector onRouteSelect={handleRouteSelect} />
        </section>

        {/* Affichage du parcours */}
        <section>
          <h2 className="font-display font-semibold text-lg text-foreground mb-3">
            Détail du parcours
          </h2>
          <RouteDisplay route={selectedRoute} />
        </section>

        {/* Footer */}
        <footer className="pt-6 pb-8 text-center">
          <p className="text-sm text-muted-foreground">
            Application HLP Navigator • Transports Publics Genevois
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Données issues du Livret des HLP - Version 14.12.2025
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
