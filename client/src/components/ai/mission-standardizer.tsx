
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { FileText, Zap, CheckCircle, AlertCircle, Copy, Edit3 } from 'lucide-react';

interface StandardizationResult {
  score: number;
  standardizedText: string;
  improvements: string[];
  issues: string[];
  suggestions: string[];
  structure: {
    title: string;
    context: string;
    deliverables: string[];
    skills: string[];
    budget: string;
    timeline: string;
    criteria: string[];
  };
}

interface MissionStandardizerProps {
  onOptimizedTextGenerated?: (optimizedText: string) => void;
  showApplyButton?: boolean;
  initialText?: string;
}

export function MissionStandardizer({ 
  onOptimizedTextGenerated, 
  showApplyButton = false, 
  initialText = '' 
}: MissionStandardizerProps) {
  const [originalText, setOriginalText] = useState(initialText);
  const [result, setResult] = useState<StandardizationResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const analyzeAndStandardize = () => {
    setIsProcessing(true);

    // Simulation de l'analyse IA
    setTimeout(() => {
      const mockResult: StandardizationResult = {
        score: 85,
        standardizedText: generateStandardizedText(originalText),
        improvements: [
          "Structure professionnelle ajoutée",
          "Livrables clarifiés et détaillés",
          "Compétences techniques spécifiées",
          "Budget et délais précisés",
          "Critères de sélection définis"
        ],
        issues: [
          "Description trop vague dans l'original",
          "Budget non mentionné",
          "Délais absents"
        ],
        suggestions: [
          "Ajouter des exemples visuels",
          "Préciser la méthodologie souhaitée",
          "Inclure les modalités de paiement"
        ],
        structure: {
          title: extractTitle(originalText),
          context: extractContext(originalText),
          deliverables: extractDeliverables(originalText),
          skills: extractSkills(originalText),
          budget: extractBudget(originalText),
          timeline: extractTimeline(originalText),
          criteria: extractCriteria(originalText)
        }
      };

      setResult(mockResult);
      setIsProcessing(false);
    }, 2000);
  };

  const generateStandardizedText = (text: string): string => {
    const title = extractTitle(text) || "Développement de solution digitale";
    const context = extractContext(text) || "Nous recherchons un prestataire qualifié pour développer une solution adaptée à nos besoins.";
    
    return `
**Projet : ${title}**

**Contexte et objectifs :**
${context}

**Livrables attendus :**
• Solution complète et fonctionnelle
• Code source documenté
• Tests unitaires et d'intégration
• Documentation technique
• Formation utilisateur si nécessaire

**Compétences techniques requises :**
• Maîtrise des technologies web modernes
• Expérience en développement full-stack
• Connaissance des bonnes pratiques de sécurité
• Capacité à travailler en méthodologie agile

**Budget et modalités :**
• Budget indicatif : À définir selon proposition
• Paiement en plusieurs tranches selon avancement
• Facturation possible en régie ou au forfait

**Critères de sélection :**
• Portfolio de projets similaires
• Références clients vérifiables
• Méthode de travail et communication
• Disponibilité et réactivité
• Rapport qualité/prix

**Délais :**
• Délai souhaité : À convenir
• Livraison par phases possible
• Suivi régulier de l'avancement

**Modalités de candidature :**
• Présentation de votre approche
• Exemples de réalisations similaires
• Planning prévisionnel
• Devis détaillé
    `.trim();
  };

  const extractTitle = (text: string): string => {
    // Logic d'extraction du titre basée sur l'IA
    if (text.toLowerCase().includes('site web') || text.toLowerCase().includes('site internet')) {
      return "Développement de site web";
    }
    if (text.toLowerCase().includes('application') || text.toLowerCase().includes('app')) {
      return "Développement d'application";
    }
    if (text.toLowerCase().includes('e-commerce') || text.toLowerCase().includes('boutique')) {
      return "Création de boutique en ligne";
    }
    return "Projet de développement";
  };

  const extractContext = (text: string): string => {
    return text.length > 50 ? text : "Contexte à préciser avec le client.";
  };

  const extractDeliverables = (text: string): string[] => {
    const deliverables = [];
    if (text.toLowerCase().includes('site')) deliverables.push("Site web responsive");
    if (text.toLowerCase().includes('mobile') || text.toLowerCase().includes('app')) deliverables.push("Application mobile");
    if (text.toLowerCase().includes('admin')) deliverables.push("Interface d'administration");
    return deliverables.length > 0 ? deliverables : ["Livrable principal à définir"];
  };

  const extractSkills = (text: string): string[] => {
    const skills = [];
    if (text.toLowerCase().includes('react')) skills.push("React.js");
    if (text.toLowerCase().includes('node')) skills.push("Node.js");
    if (text.toLowerCase().includes('php')) skills.push("PHP");
    if (text.toLowerCase().includes('python')) skills.push("Python");
    return skills.length > 0 ? skills : ["Compétences web générales"];
  };

  const extractBudget = (text: string): string => {
    const budgetMatch = text.match(/(\d+)\s*€/);
    return budgetMatch ? `${budgetMatch[1]}€` : "À définir";
  };

  const extractTimeline = (text: string): string => {
    if (text.toLowerCase().includes('urgent')) return "Urgent - 2 semaines";
    if (text.toLowerCase().includes('rapidement')) return "Rapide - 1 mois";
    return "À convenir";
  };

  const extractCriteria = (text: string): string[] => {
    return ["Expérience prouvée", "Portfolio pertinent", "Disponibilité"];
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.standardizedText);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            Standardiseur d'Annonces IA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Annonce originale du client</Label>
            <Textarea
              placeholder="Collez ici l'annonce brute du client à standardiser..."
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </div>

          <Button 
            onClick={analyzeAndStandardize} 
            disabled={!originalText || isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Standardisation en cours...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Standardiser avec l'IA
              </div>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Annonce Standardisée
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Qualité:</span>
                  <Badge variant={result.score > 80 ? "default" : "secondary"}>
                    {result.score}%
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border">
                <pre className="text-sm whitespace-pre-wrap font-sans">{result.standardizedText}</pre>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copier
                </Button>
                <Button variant="outline" size="sm">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Éditer
                </Button>
                {showApplyButton && onOptimizedTextGenerated && (
                  <Button 
                    size="sm" 
                    onClick={() => onOptimizedTextGenerated(result.standardizedText)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Appliquer à ma mission
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-5 h-5" />
                  Améliorations Appliquées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      {improvement}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <AlertCircle className="w-5 h-5" />
                  Problèmes Détectés
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.issues.map((issue, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      {issue}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Score de Qualité de l'Annonce</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Score global</span>
                  <span>{result.score}%</span>
                </div>
                <Progress value={result.score} className="h-3" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium">Structure: 95%</div>
                  <div className="font-medium">Clarté: 80%</div>
                  <div className="font-medium">Complétude: 85%</div>
                </div>
                <div>
                  <div className="font-medium">Professionnalisme: 90%</div>
                  <div className="font-medium">Détails techniques: 75%</div>
                  <div className="font-medium">Critères sélection: 85%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
