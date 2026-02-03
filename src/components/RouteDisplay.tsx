import { HLPRoute } from "@/data/hlpRoutes";
import { 
  ArrowRight, 
  ChevronRight, 
  Info, 
  AlertCircle,
  Bus,
  MapPin,
  Flag,
  CornerDownRight,
  MoveRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Import des images de direction (nouvelles icônes de panneaux routiers)
import iconGauche from "@/assets/Tourner_a_gauche.png";
import iconDroite from "@/assets/Tourner_a_droite.png";
import iconDroit from "@/assets/Tout_droit.png";
import iconGiratoire from "@/assets/Giratoire.png";

interface RouteDisplayProps {
  route: HLPRoute | null;
}

const categoryLabels: Record<string, { label: string; color: string }> = {
  'sortie': { label: 'Sortie de dépôt', color: 'bg-success text-success-foreground' },
  'rentree': { label: 'Rentrée au dépôt', color: 'bg-primary text-primary-foreground' },
  'inter-ligne': { label: 'Déplacement inter-lignes', color: 'bg-accent text-accent-foreground' },
};

// Fonction pour détecter le type de direction dans une étape
function getDirectionType(text: string): 'left' | 'right' | 'roundabout' | 'straight' | 'uturn' | 'none' {
  const lowerText = text.toLowerCase();
  
  // Détection giratoire/rond-point
  if (lowerText.includes('giratoire') || lowerText.includes('rond-point') || lowerText.includes('roundabout')) {
    return 'roundabout';
  }
  
  // Détection demi-tour
  if (lowerText.includes('1/2 tour') || lowerText.includes('demi-tour') || lowerText.includes('demi tour') || lowerText.includes('faire demi-tour')) {
    return 'uturn';
  }
  
  // Détection à gauche
  if (lowerText.includes('à gauche') || lowerText.includes('tourner à gauche') || lowerText.includes('partir à gauche') || lowerText.includes('prendre à gauche')) {
    return 'left';
  }
  
  // Détection à droite
  if (lowerText.includes('à droite') || lowerText.includes('tourner à droite') || lowerText.includes('descendre à droite') || lowerText.includes('prendre à droite')) {
    return 'right';
  }
  
  // Détection tout droit
  if (lowerText.includes('tout droit') || lowerText.includes('continuer') || lowerText.includes('poursuivre')) {
    return 'straight';
  }
  
  return 'none';
}

// Composant pour l'image de direction avec animation
function DirectionImage({ type, size = "sm", animate = false, delay = 0 }: { 
  type: 'left' | 'right' | 'roundabout' | 'straight' | 'uturn' | 'none', 
  size?: "sm" | "md" | "lg",
  animate?: boolean,
  delay?: number
}) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10"
  };

  const animationClass = animate 
    ? "animate-bounce-in opacity-0" 
    : "";

  const style = animate ? { animationDelay: `${delay}ms`, animationFillMode: 'forwards' } : {};

  switch (type) {
    case 'left':
      return <img src={iconGauche} alt="Tourner à gauche" className={`${sizeClasses[size]} ${animationClass}`} style={style} />;
    case 'right':
      return <img src={iconDroite} alt="Tourner à droite" className={`${sizeClasses[size]} ${animationClass}`} style={style} />;
    case 'roundabout':
      return <img src={iconGiratoire} alt="Giratoire" className={`${sizeClasses[size]} ${animationClass}`} style={style} />;
    case 'straight':
      return <img src={iconDroit} alt="Tout droit" className={`${sizeClasses[size]} ${animationClass}`} style={style} />;
    case 'uturn':
      return <img src={iconGauche} alt="Demi-tour" className={`${sizeClasses[size]} rotate-180 ${animationClass}`} style={style} />;
    default:
      return null;
  }
}

// Composant pour l'icône de direction avec label
function DirectionIcon({ type }: { type: 'left' | 'right' | 'roundabout' | 'straight' | 'uturn' | 'none' }) {
  const labels = {
    left: "Gauche",
    right: "Droite", 
    roundabout: "Giratoire",
    straight: "Tout droit",
    uturn: "Demi-tour",
    none: ""
  };

  if (type === 'none') return null;

  return (
    <div className="flex items-center gap-1">
      <DirectionImage type={type} size="sm" />
      <span className="text-xs font-medium">{labels[type]}</span>
    </div>
  );
}

// Fonction pour formater le texte avec mise en évidence des directions et images
function formatStepText(text: string, images: { gauche: string; droite: string; droit: string; giratoire: string }): React.ReactNode {
  // On retourne le texte tel quel mais avec les parties importantes en gras via HTML
  return <span dangerouslySetInnerHTML={{ __html: highlightDirections(text, images) }} />;
}

function highlightDirections(text: string, images: { gauche: string; droite: string; droit: string; giratoire: string }): string {
  let result = text;
  
  const imgStyle = 'width: 20px; height: 20px; display: inline-block; vertical-align: middle; margin-right: 4px;';
  const rotateStyle = 'width: 20px; height: 20px; display: inline-block; vertical-align: middle; margin-right: 4px; transform: rotate(180deg);';
  
  // Remplacer les patterns par des spans avec images
  const replacements: [RegExp, string][] = [
    [/(tourner à gauche)/gi, `<span class="text-primary font-semibold inline-flex items-center"><img src="${images.gauche}" alt="←" style="${imgStyle}"/>$1</span>`],
    [/(partir à gauche)/gi, `<span class="text-primary font-semibold inline-flex items-center"><img src="${images.gauche}" alt="←" style="${imgStyle}"/>$1</span>`],
    [/(prendre à gauche)/gi, `<span class="text-primary font-semibold inline-flex items-center"><img src="${images.gauche}" alt="←" style="${imgStyle}"/>$1</span>`],
    [/(à gauche)(?![a-zA-Z])/gi, `<span class="text-primary font-semibold inline-flex items-center"><img src="${images.gauche}" alt="←" style="${imgStyle}"/>$1</span>`],
    [/(tourner à droite)/gi, `<span class="text-primary font-semibold inline-flex items-center"><img src="${images.droite}" alt="→" style="${imgStyle}"/>$1</span>`],
    [/(descendre à droite)/gi, `<span class="text-primary font-semibold inline-flex items-center"><img src="${images.droite}" alt="→" style="${imgStyle}"/>$1</span>`],
    [/(prendre à droite)/gi, `<span class="text-primary font-semibold inline-flex items-center"><img src="${images.droite}" alt="→" style="${imgStyle}"/>$1</span>`],
    [/(à droite)(?![a-zA-Z])/gi, `<span class="text-primary font-semibold inline-flex items-center"><img src="${images.droite}" alt="→" style="${imgStyle}"/>$1</span>`],
    [/(au giratoire|giratoire)/gi, `<span class="font-semibold inline-flex items-center"><img src="${images.giratoire}" alt="↻" style="${imgStyle}"/>$1</span>`],
    [/(rond-point)/gi, `<span class="font-semibold inline-flex items-center"><img src="${images.giratoire}" alt="↻" style="${imgStyle}"/>$1</span>`],
    [/(1\/2 tour)/gi, `<span class="text-warning font-semibold inline-flex items-center"><img src="${images.gauche}" alt="↩" style="${rotateStyle}"/>$1</span>`],
    [/(demi-tour|demi tour|faire demi-tour)/gi, `<span class="text-warning font-semibold inline-flex items-center"><img src="${images.gauche}" alt="↩" style="${rotateStyle}"/>$1</span>`],
    [/(continuer tout droit|tout droit)/gi, `<span class="text-muted-foreground font-medium inline-flex items-center"><img src="${images.droit}" alt="↑" style="${imgStyle}"/>$1</span>`],
  ];
  
  for (const [pattern, replacement] of replacements) {
    result = result.replace(pattern, replacement);
  }
  
  return result;
}

export function RouteDisplay({ route }: RouteDisplayProps) {
  if (!route) {
    return (
      <div className="bg-card rounded-xl shadow-card p-8 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
          <MapPin className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-display font-semibold text-foreground mb-2">
          Sélectionnez un itinéraire
        </h3>
        <p className="text-muted-foreground text-sm">
          Choisissez un point de départ et une destination pour voir l'itinéraire détaillé.
        </p>
      </div>
    );
  }

  const category = categoryLabels[route.category] || { 
    label: route.category, 
    color: 'bg-secondary text-secondary-foreground' 
  };

  return (
    <div className="bg-card rounded-xl shadow-card overflow-hidden animate-fade-in">
      {/* En-tête avec catégorie */}
      <div className="gradient-primary p-4">
        <div className="flex items-center justify-between">
          <Badge className={`${category.color} font-medium`}>
            {category.label}
          </Badge>
          {route.lineInfo && (
            <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-0">
              <Bus className="w-3 h-3 mr-1" />
              {route.lineInfo}
            </Badge>
          )}
        </div>
        
        {/* Trajet résumé */}
        <div className="mt-4 flex items-center gap-3 text-primary-foreground">
          <div className="flex-1 min-w-0">
            <p className="text-xs opacity-80 mb-1">Départ</p>
            <p className="font-display font-semibold text-lg truncate">{route.origin}</p>
          </div>
          <ArrowRight className="w-6 h-6 flex-shrink-0 opacity-80" />
          <div className="flex-1 min-w-0 text-right">
            <p className="text-xs opacity-80 mb-1">Arrivée</p>
            <p className="font-display font-semibold text-lg truncate">{route.destination}</p>
          </div>
        </div>
      </div>

      {/* Légende des symboles avec images */}
      <div className="px-4 py-3 bg-muted/50 border-b border-border">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <span className="text-muted-foreground font-medium">Légende:</span>
          <span className="flex items-center gap-1.5">
            <img src={iconGauche} alt="Gauche" className="w-6 h-6 animate-bounce-in" style={{ animationDelay: '100ms' }} /> Gauche
          </span>
          <span className="flex items-center gap-1.5">
            <img src={iconDroite} alt="Droite" className="w-6 h-6 animate-bounce-in" style={{ animationDelay: '200ms' }} /> Droite
          </span>
          <span className="flex items-center gap-1.5">
            <img src={iconGiratoire} alt="Giratoire" className="w-6 h-6 animate-bounce-in" style={{ animationDelay: '300ms' }} /> Giratoire
          </span>
          <span className="flex items-center gap-1.5">
            <img src={iconGauche} alt="Demi-tour" className="w-6 h-6 rotate-180 animate-bounce-in" style={{ animationDelay: '400ms' }} /> Demi-tour
          </span>
          <span className="flex items-center gap-1.5">
            <img src={iconDroit} alt="Tout droit" className="w-6 h-6 animate-bounce-in" style={{ animationDelay: '500ms' }} /> Tout droit
          </span>
        </div>
      </div>

      {/* Itinéraire détaillé */}
      <div className="p-4">
        <h4 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
          <CornerDownRight className="w-4 h-4 text-primary" />
          Itinéraire détaillé
        </h4>
        
        <div className="space-y-0 relative">
          {/* Ligne de connexion */}
          <div className="absolute left-[15px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary/20" />
          
          {route.itinerary.map((step, index) => {
            const isFirst = index === 0;
            const isLast = index === route.itinerary.length - 1;
            const directionType = getDirectionType(step.direction);
            
            // Déterminer l'icône à afficher
            const getStepIcon = () => {
              if (isFirst) return <MapPin className="w-4 h-4" />;
              if (isLast) return <Flag className="w-4 h-4 text-accent-foreground" />;
              
              if (directionType !== 'none') {
                return <DirectionImage type={directionType} size="md" animate={true} delay={index * 80} />;
              }
              return <MoveRight className="w-4 h-4 text-muted-foreground" />;
            };
            
            // Déterminer la couleur du cercle
            const getCircleColor = () => {
              if (isFirst) return 'bg-primary text-primary-foreground';
              if (isLast) return 'bg-accent';
              
              switch (directionType) {
                case 'left':
                case 'right':
                  return 'bg-primary/20 text-primary';
                case 'roundabout':
                  return 'bg-accent/50';
                case 'uturn':
                  return 'bg-warning/20';
                default:
                  return 'bg-secondary';
              }
            };
            
            return (
              <div 
                key={index} 
                className="flex items-start gap-3 relative animate-slide-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Indicateur de point */}
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10
                  ${getCircleColor()}
                `}>
                  {getStepIcon()}
                </div>
                
                {/* Texte de l'étape */}
                <div className={`
                  py-2 px-3 rounded-lg flex-1 min-w-0 my-1
                  ${isFirst || isLast ? 'bg-accent/50 font-medium' : 'hover:bg-muted/50'}
                  transition-colors
                `}>
                  <p className={`text-sm ${isFirst || isLast ? 'text-foreground' : 'text-foreground/80'}`}>
                    {formatStepText(step.direction, { gauche: iconGauche, droite: iconDroite, droit: iconDroit, giratoire: iconGiratoire })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Nombre d'étapes */}
        <div className="mt-4 pt-4 border-t border-border flex items-center justify-center gap-2">
          <Badge variant="secondary" className="font-normal">
            {route.itinerary.length} étapes
          </Badge>
        </div>
      </div>

      {/* Notes et remarques */}
      {(route.notes || route.depot) && (
        <Accordion type="single" collapsible className="border-t border-border">
          {route.notes && (
            <AccordionItem value="notes" className="border-0">
              <AccordionTrigger className="px-4 py-3 text-sm hover:no-underline hover:bg-muted/50">
                <span className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-primary" />
                  Remarques et alternatives
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="bg-accent/30 rounded-lg p-3 text-sm text-muted-foreground">
                  <AlertCircle className="w-4 h-4 inline mr-2 text-primary" />
                  {route.notes}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
          
          {route.depot && (
            <AccordionItem value="depot" className="border-0 border-t border-border">
              <AccordionTrigger className="px-4 py-3 text-sm hover:no-underline hover:bg-muted/50">
                <span className="flex items-center gap-2">
                  <Bus className="w-4 h-4 text-primary" />
                  Dépôt associé
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <Badge variant="outline" className="font-normal">
                  {route.depot}
                </Badge>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      )}
    </div>
  );
}
