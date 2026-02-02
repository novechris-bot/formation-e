import { useState, useEffect } from "react";
import { MapPin, Navigation, ArrowRight, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  getUniqueOrigins, 
  getDestinationsFromOrigin,
  findExactRoute,
  HLPRoute 
} from "@/data/hlpRoutes";

interface RouteSelectorProps {
  onRouteSelect: (route: HLPRoute | null) => void;
}

export function RouteSelector({ onRouteSelect }: RouteSelectorProps) {
  const [origin, setOrigin] = useState<string>("Dépôt En Chardon");
  const [destination, setDestination] = useState<string>("");
  const [availableOrigins, setAvailableOrigins] = useState<string[]>([]);
  const [availableDestinations, setAvailableDestinations] = useState<string[]>([]);

  useEffect(() => {
    setAvailableOrigins(getUniqueOrigins());
  }, []);

  useEffect(() => {
    if (origin) {
      const destinations = getDestinationsFromOrigin(origin);
      setAvailableDestinations(destinations);
      setDestination("");
      onRouteSelect(null);
    }
  }, [origin]);

  useEffect(() => {
    if (origin && destination) {
      const route = findExactRoute(origin, destination);
      onRouteSelect(route || null);
    }
  }, [origin, destination]);

  const handleSwap = () => {
    if (destination) {
      const newOrigin = destination;
      const newDestination = origin;
      setOrigin(newOrigin);
      setTimeout(() => {
        const destinations = getDestinationsFromOrigin(newOrigin);
        if (destinations.includes(newDestination)) {
          setDestination(newDestination);
        }
      }, 0);
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-card p-6 animate-fade-in">
      <div className="flex flex-col gap-4">
        {/* Départ */}
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div className="w-0.5 h-8 bg-border mt-2" />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Point de départ
            </label>
            <Select value={origin} onValueChange={setOrigin}>
              <SelectTrigger className="w-full h-12 text-base bg-background border-input hover:border-primary/50 transition-colors">
                <SelectValue placeholder="Sélectionnez un départ" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] bg-popover border-border z-50">
                {availableOrigins.map((loc) => (
                  <SelectItem 
                    key={loc} 
                    value={loc}
                    className="cursor-pointer hover:bg-accent"
                  >
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bouton swap */}
        <div className="flex items-center gap-3 pl-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSwap}
            disabled={!destination}
            className="w-10 h-10 rounded-full border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all"
          >
            <ArrowRight className="w-4 h-4 rotate-90" />
          </Button>
          <span className="text-xs text-muted-foreground">Inverser le trajet</span>
        </div>

        {/* Arrivée */}
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
              <Navigation className="w-5 h-5 text-accent-foreground" />
            </div>
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Destination
            </label>
            <Select 
              value={destination} 
              onValueChange={setDestination}
              disabled={!origin || availableDestinations.length === 0}
            >
              <SelectTrigger className="w-full h-12 text-base bg-background border-input hover:border-primary/50 transition-colors">
                <SelectValue placeholder={
                  !origin 
                    ? "Choisissez d'abord un départ" 
                    : availableDestinations.length === 0 
                      ? "Aucune destination disponible"
                      : "Sélectionnez une destination"
                } />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] bg-popover border-border z-50">
                {availableDestinations.map((loc) => (
                  <SelectItem 
                    key={loc} 
                    value={loc}
                    className="cursor-pointer hover:bg-accent"
                  >
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Compteur de destinations */}
      {origin && availableDestinations.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            <span className="font-semibold text-primary">{availableDestinations.length}</span>
            {" "}destination{availableDestinations.length > 1 ? "s" : ""} disponible{availableDestinations.length > 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
}
