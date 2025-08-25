
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';

interface BriefEnhancerProps {
  briefData: {
    title: string;
    description: string;
    category?: string;
  };
  onEnhancementComplete?: (enhancements: any) => void;
}

export function BriefEnhancer({ briefData, onEnhancementComplete }: BriefEnhancerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [enhancements, setEnhancements] = useState<any>(null);
  const [selectedVariant, setSelectedVariant] = useState<string>('clair');
  
  // Feature flags (simulés côté client)
  const features = {
    normalize: process.env.NEXT_PUBLIC_ENABLE_NORMALIZE === 'true',
    generator: process.env.NEXT_PUBLIC_ENABLE_GENERATOR === 'true',
    questioner: process.env.NEXT_PUBLIC_ENABLE_QUESTIONER === 'true'
  };
  
  const hasAnyFeature = Object.values(features).some(Boolean);
  
  if (!hasAnyFeature) {
    return null; // Masque si aucune feature activée
  }

  const handleAnalyze = async () => {
    setIsLoading(true);
    
    try {
      const promises = [];
      
      // Normalisation
      if (features.normalize) {
        promises.push(
          fetch('/api/ai/normalize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(briefData)
          }).then(r => r.json()).then(data => ({ type: 'normalize', data }))
        );
      }
      
      // Génération
      if (features.generator) {
        promises.push(
          fetch('/api/ai/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(briefData)
          }).then(r => r.json()).then(data => ({ type: 'generate', data }))
        );
      }
      
      // Questions
      if (features.questioner) {
        promises.push(
          fetch('/api/ai/questions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ brief: briefData, answers: {} })
          }).then(r => r.json()).then(data => ({ type: 'questions', data }))
        );
      }
      
      const results = await Promise.allSettled(promises);
      
      // Agrège les résultats
      const enhancementData: any = {};
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          const { type, data } = result.value;
          enhancementData[type] = data;
        }
      });
      
      setEnhancements(enhancementData);
      onEnhancementComplete?.(enhancementData);
      
    } catch (error) {
      console.error('Enhancement error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCompletenessColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Analyse IA de votre annonce
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!enhancements ? (
          <div className="text-center">
            <Button 
              onClick={handleAnalyze} 
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                'Analyser et optimiser'
              )}
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Notre IA va analyser votre annonce et proposer des améliorations
            </p>
          </div>
        ) : (
          <Tabs defaultValue="analysis" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="analysis">Analyse</TabsTrigger>
              <TabsTrigger value="variants">Variantes</TabsTrigger>
              <TabsTrigger value="questions">Questions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="analysis" className="space-y-4">
              {enhancements.normalize && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Score de complétude</h4>
                    <Badge variant="outline" className={getCompletenessColor(enhancements.normalize.data.completeness_score)}>
                      {enhancements.normalize.data.completeness_score}/100
                    </Badge>
                  </div>
                  
                  {enhancements.normalize.data.missing_info?.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium mb-2">Informations manquantes :</h5>
                      <ul className="text-sm space-y-1">
                        {enhancements.normalize.data.missing_info.map((info: string, idx: number) => (
                          <li key={idx} className="flex items-center gap-2">
                            <AlertCircle className="h-3 w-3 text-yellow-500" />
                            {info}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {enhancements.normalize.data.skills_std?.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium mb-2">Compétences détectées :</h5>
                      <div className="flex flex-wrap gap-1">
                        {enhancements.normalize.data.skills_std.map((skill: string, idx: number) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="variants" className="space-y-4">
              {enhancements.generate?.data?.variants && (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    {enhancements.generate.data.variants.map((variant: any) => (
                      <Button
                        key={variant.type}
                        variant={selectedVariant === variant.type ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedVariant(variant.type)}
                      >
                        {variant.type.charAt(0).toUpperCase() + variant.type.slice(1)}
                      </Button>
                    ))}
                  </div>
                  
                  {enhancements.generate.data.variants
                    .filter((v: any) => v.type === selectedVariant)
                    .map((variant: any, idx: number) => (
                      <Card key={idx}>
                        <CardContent className="pt-4">
                          <h4 className="font-medium mb-2">{variant.title}</h4>
                          <p className="text-sm whitespace-pre-line mb-3">{variant.description}</p>
                          <p className="text-xs text-muted-foreground">{variant.explanation}</p>
                          <div className="flex justify-between items-center mt-3">
                            <Badge variant="outline">Appeal: {variant.estimated_appeal}/10</Badge>
                            <Button size="sm" variant="outline">
                              Utiliser cette version
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="questions" className="space-y-4">
              {enhancements.questions?.data?.questions && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Questions pour améliorer votre annonce</h4>
                    <Badge variant="outline">
                      +{enhancements.questions.data.completion_gain?.potential_score - enhancements.questions.data.completion_gain?.current_score || 0} points
                    </Badge>
                  </div>
                  
                  {enhancements.questions.data.questions.map((question: any, idx: number) => (
                    <Card key={idx}>
                      <CardContent className="pt-4">
                        <h5 className="text-sm font-medium mb-2">{question.text}</h5>
                        {question.type === 'choice' && question.options && (
                          <div className="grid grid-cols-2 gap-2">
                            {question.options.map((option: string, optIdx: number) => (
                              <Button key={optIdx} variant="outline" size="sm">
                                {option}
                              </Button>
                            ))}
                          </div>
                        )}
                        <Badge variant="secondary" className="mt-2 text-xs">
                          {question.category}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
