
import React, { useState, useRef } from 'react';
import { X, Plus, Lightbulb, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { normalizeTags, expandSynonyms, suggestKeywords } from '../../../shared/utils/keywords';

interface KeywordsSkillsEditorProps {
  keywords: string[];
  skills: Array<{ name: string; level?: 1|2|3|4|5 }>;
  onKeywordsChange: (keywords: string[]) => void;
  onSkillsChange: (skills: Array<{ name: string; level?: 1|2|3|4|5 }>) => void;
  suggestions?: string[];
  role: 'client' | 'provider';
}

export function KeywordsSkillsEditor({
  keywords,
  skills,
  onKeywordsChange,
  onSkillsChange,
  suggestions = [],
  role
}: KeywordsSkillsEditorProps) {
  const [keywordInput, setKeywordInput] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const commonSuggestions = [
    // Tech
    'développement web', 'react', 'nodejs', 'typescript', 'javascript', 'python', 'php',
    'wordpress', 'design web', 'ui/ux', 'mobile', 'e-commerce',
    // Marketing
    'seo', 'marketing digital', 'réseaux sociaux', 'google ads', 'content marketing',
    // Services
    'conseil', 'formation', 'audit', 'gestion projet', 'stratégie',
    // Métiers
    'plomberie', 'électricité', 'peinture', 'menuiserie', 'ménage', 'jardinage'
  ];

  const addKeyword = (keyword: string) => {
    if (!keyword.trim()) return;
    
    const normalized = normalizeTags([keyword]);
    const newKeywords = [...new Set([...keywords, ...normalized])];
    onKeywordsChange(newKeywords);
    setKeywordInput('');
  };

  const removeKeyword = (keyword: string) => {
    onKeywordsChange(keywords.filter(k => k !== keyword));
  };

  const addSkill = (skillName: string, level: 1|2|3|4|5 = 3) => {
    if (!skillName.trim()) return;
    
    const normalized = normalizeTags([skillName])[0];
    const existingIndex = skills.findIndex(s => s.name === normalized);
    
    if (existingIndex >= 0) {
      // Mettre à jour le niveau si la compétence existe
      const newSkills = [...skills];
      newSkills[existingIndex] = { name: normalized, level };
      onSkillsChange(newSkills);
    } else {
      // Ajouter nouvelle compétence
      onSkillsChange([...skills, { name: normalized, level }]);
    }
    setSkillInput('');
  };

  const removeSkill = (skillName: string) => {
    onSkillsChange(skills.filter(s => s.name !== skillName));
  };

  const updateSkillLevel = (skillName: string, level: 1|2|3|4|5) => {
    const newSkills = skills.map(s => 
      s.name === skillName ? { ...s, level } : s
    );
    onSkillsChange(newSkills);
  };

  const getSkillLevelText = (level?: number) => {
    switch (level) {
      case 1: return 'Débutant';
      case 2: return 'Novice';
      case 3: return 'Intermédiaire';
      case 4: return 'Avancé';
      case 5: return 'Expert';
      default: return 'Non spécifié';
    }
  };

  const getSkillLevelColor = (level?: number) => {
    switch (level) {
      case 1: return 'bg-gray-100 text-gray-800';
      case 2: return 'bg-blue-100 text-blue-800';
      case 3: return 'bg-yellow-100 text-yellow-800';
      case 4: return 'bg-orange-100 text-orange-800';
      case 5: return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSuggestionClick = (suggestion: string, type: 'keyword' | 'skill') => {
    if (type === 'keyword') {
      addKeyword(suggestion);
    } else {
      addSkill(suggestion, 3);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mots-clés Section */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Mots-clés</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSuggestions(!showSuggestions)}
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                Suggestions
              </Button>
            </div>

            {/* Input pour ajouter des mots-clés */}
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                placeholder="Ajouter un mot-clé..."
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addKeyword(keywordInput);
                  }
                }}
              />
              <Button onClick={() => addKeyword(keywordInput)} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Mots-clés actuels */}
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1">
                  {keyword}
                  <button
                    onClick={() => removeKeyword(keyword)}
                    className="ml-2 hover:text-red-500"
                    aria-label={`Supprimer ${keyword}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>

            {/* Suggestions mots-clés */}
            {showSuggestions && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Suggestions populaires :</p>
                <div className="flex flex-wrap gap-2">
                  {commonSuggestions
                    .filter(s => !keywords.includes(s))
                    .slice(0, 10)
                    .map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuggestionClick(suggestion, 'keyword')}
                        className="text-xs"
                      >
                        + {suggestion}
                      </Button>
                    ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Compétences Section (pour prestataires) */}
      {role === 'provider' && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Compétences & Niveaux</h3>

              {/* Input pour ajouter des compétences */}
              <div className="flex gap-2">
                <Input
                  placeholder="Ajouter une compétence..."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill(skillInput);
                    }
                  }}
                />
                <Button onClick={() => addSkill(skillInput)} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Compétences actuelles avec niveaux */}
              <div className="space-y-3">
                {skills.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium">{skill.name}</span>
                      <Badge className={getSkillLevelColor(skill.level)}>
                        {getSkillLevelText(skill.level)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {/* Sélecteur de niveau */}
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <button
                            key={level}
                            onClick={() => updateSkillLevel(skill.name, level as 1|2|3|4|5)}
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                              (skill.level || 3) >= level
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                            }`}
                            aria-label={`Niveau ${level}`}
                          >
                            <Star className="h-3 w-3" />
                          </button>
                        ))}
                      </div>
                      
                      <button
                        onClick={() => removeSkill(skill.name)}
                        className="text-red-500 hover:text-red-700"
                        aria-label={`Supprimer ${skill.name}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Suggestions compétences depuis mots-clés */}
              {keywords.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Ajouter depuis vos mots-clés :</p>
                  <div className="flex flex-wrap gap-2">
                    {keywords
                      .filter(k => !skills.some(s => s.name === k))
                      .slice(0, 8)
                      .map((keyword, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSuggestionClick(keyword, 'skill')}
                          className="text-xs"
                        >
                          + {keyword}
                        </Button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
