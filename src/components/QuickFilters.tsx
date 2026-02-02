import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, LogIn, ArrowLeftRight, Sparkles } from "lucide-react";

type FilterType = 'all' | 'sortie' | 'rentree' | 'inter-ligne';

interface QuickFiltersProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const filters: { id: FilterType; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'Tous', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'sortie', label: 'Sorties', icon: <LogOut className="w-4 h-4" /> },
  { id: 'rentree', label: 'Rentrées', icon: <LogIn className="w-4 h-4" /> },
  { id: 'inter-ligne', label: 'Inter-lignes', icon: <ArrowLeftRight className="w-4 h-4" /> },
];

export function QuickFilters({ activeFilter, onFilterChange }: QuickFiltersProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
      {filters.map((filter) => (
        <Button
          key={filter.id}
          variant={activeFilter === filter.id ? "default" : "secondary"}
          size="sm"
          onClick={() => onFilterChange(filter.id)}
          className={`
            flex-shrink-0 gap-1.5 transition-all
            ${activeFilter === filter.id 
              ? 'shadow-orange' 
              : 'hover:bg-accent'
            }
          `}
        >
          {filter.icon}
          {filter.label}
        </Button>
      ))}
    </div>
  );
}
