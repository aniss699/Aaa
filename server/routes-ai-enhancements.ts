
/**
 * Routes pour les services d'enrichissement IA
 * Toutes activables par feature flags
 */

import { FastifyInstance } from 'fastify';
import { z } from 'zod';

// Schémas de validation
const normalizeSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(10),
  category: z.string().optional()
});

const generateSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(10),
  category: z.string()
});

const questionSchema = z.object({
  brief: z.object({
    title: z.string(),
    description: z.string(),
    structured: z.object({}).optional()
  }),
  answers: z.record(z.any()).optional(),
  max_questions: z.number().min(1).max(10).default(5)
});

export async function registerAIEnhancementRoutes(fastify: FastifyInstance) {
  
  // POST /api/ai/normalize - Normalisation de brief
  fastify.post('/api/ai/normalize', async (request, reply) => {
    if (process.env.ENABLE_NORMALIZE !== 'true') {
      return reply.status(503).send({ error: 'Service non activé' });
    }

    try {
      const data = normalizeSchema.parse(request.body);
      
      const response = await fetch('http://localhost:8001/normalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(5000)
      });

      if (!response.ok) {
        throw new Error(`ML service error: ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        data: result,
        features_used: ['normalize']
      };

    } catch (error) {
      fastify.log.error('Normalize error:', error);
      
      // Fallback simple
      const { title, description } = request.body as any;
      return {
        success: false,
        data: {
          title_std: title,
          summary_std: description.substring(0, 200),
          completeness_score: Math.min(description.length * 2, 100),
          missing_info: description.length < 50 ? ['Description plus détaillée'] : []
        },
        fallback: true
      };
    }
  });

  // POST /api/ai/generate - Génération de variantes
  fastify.post('/api/ai/generate', async (request, reply) => {
    if (process.env.ENABLE_GENERATOR !== 'true') {
      return reply.status(503).send({ error: 'Service non activé' });
    }

    try {
      const data = generateSchema.parse(request.body);
      
      const response = await fetch('http://localhost:8001/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(8000)
      });

      if (!response.ok) {
        throw new Error(`ML service error: ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        data: result,
        features_used: ['generator']
      };

    } catch (error) {
      fastify.log.error('Generate error:', error);
      
      // Fallback simple
      const { title, description } = request.body as any;
      return {
        success: false,
        data: {
          variants: [
            {
              type: 'clair',
              title: title,
              description: description,
              explanation: 'Version originale (service IA indisponible)'
            }
          ]
        },
        fallback: true
      };
    }
  });

  // POST /api/ai/questions - Questions adaptatives
  fastify.post('/api/ai/questions', async (request, reply) => {
    if (process.env.ENABLE_QUESTIONER !== 'true') {
      return reply.status(503).send({ error: 'Service non activé' });
    }

    try {
      const data = questionSchema.parse(request.body);
      
      const response = await fetch('http://localhost:8001/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(3000)
      });

      if (!response.ok) {
        throw new Error(`ML service error: ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        data: result,
        features_used: ['questioner']
      };

    } catch (error) {
      fastify.log.error('Questions error:', error);
      
      // Fallback avec questions génériques
      return {
        success: false,
        data: {
          questions: [
            {
              text: "Quel est votre budget approximatif ?",
              type: "choice",
              options: ["< 500€", "500-1500€", "1500-5000€", "> 5000€"]
            },
            {
              text: "Dans quels délais souhaitez-vous la livraison ?",
              type: "choice", 
              options: ["Urgent", "1-2 semaines", "1 mois", "Flexible"]
            }
          ],
          completion_gain: {
            current_score: 60,
            potential_score: 80
          }
        },
        fallback: true
      };
    }
  });

  // GET /api/ai/health - Status des services IA
  fastify.get('/api/ai/health', async (request, reply) => {
    const features = {
      normalize: process.env.ENABLE_NORMALIZE === 'true',
      generator: process.env.ENABLE_GENERATOR === 'true',
      questioner: process.env.ENABLE_QUESTIONER === 'true',
      pricer: process.env.ENABLE_PRICER === 'true'
    };

    // Test connectivité ML service
    let mlServiceHealth = false;
    try {
      const response = await fetch('http://localhost:8001/health', {
        signal: AbortSignal.timeout(2000)
      });
      mlServiceHealth = response.ok;
    } catch (error) {
      // ML service down
    }

    return {
      features_enabled: features,
      ml_service_available: mlServiceHealth,
      timestamp: new Date().toISOString()
    };
  });
}
