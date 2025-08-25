
const request = require('supertest');


const request = require('supertest');
const { app } = require('./index');

describe('Mission Creation Routes', () => {
  let server;
  
  beforeAll(() => {
    server = app.listen(0);
  });
  
  afterAll(() => {
    server.close();
  });

  describe('GET /api/missions', () => {
    it('should return missions list', async () => {
      const response = await request(server).get('/api/missions');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/missions routing', () => {
    it('should create mission and return valid ID for redirection', async () => {
      const missionData = {
        title: 'Test Mission',
        description: 'Test description for routing',
        category: 'développement',
        budget_min: 2000,
        budget_max: 5000
      };

      const response = await request(server)
        .post('/api/missions')
        .set('Idempotency-Key', 'test-routing-001')
        .send(missionData)
        .expect(201);

      expect(response.body.id).toBeDefined();
      expect(response.body.status).toBe('PUBLISHED');
      
      // Vérifier que la mission peut être récupérée
      const getResponse = await request(server)
        .get(`/api/missions/${response.body.id}`)
        .expect(200);
      
      expect(getResponse.body.mission.title).toBe(missionData.title);
    });
  });

  describe('POST /api/ai/missions/suggest', () => {
    it('should generate AI suggestions for simple brief', async () => {
      const briefData = {
        title: 'Peinture salon',
        description: 'Peindre murs 40 m², 2 couches satin',
        category: 'travaux',
        budget_min: 60000,
        budget_max: 120000
      };

      const response = await request(server)
        .post('/api/ai/missions/suggest')
        .send(briefData)
        .expect(200);

      expect(response.body.suggestion).toBeDefined();
      expect(response.body.suggestion.price_suggested_min).toBeGreaterThan(0);
      expect(response.body.suggestion.missing_info).toBeInstanceOf(Array);
      expect(response.body.suggestion.brief_quality_score).toBeGreaterThan(0);
      expect(response.body.scores).toBeDefined();
      expect(response.body.scores.quality).toBeGreaterThan(0);
    });

    it('should return 422 for invalid data', async () => {
      const response = await request(server)
        .post('/api/ai/missions/suggest')
        .send({ title: 'aa' }) // Too short
        .expect(422);

      expect(response.body.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('POST /api/missions', () => {
    it('should create mission successfully', async () => {
      const missionData = {
        title: 'Peinture salon (amélioré)',
        description: 'Projet de peinture détaillé avec spécifications techniques...',
        category: 'travaux',
        budget_min: 70000,
        budget_max: 120000,
        deadline_ts: '2025-10-01',
        geo_required: false
      };

      const response = await request(server)
        .post('/api/missions')
        .set('Idempotency-Key', 'mission-test-001')
        .send(missionData)
        .expect(201);

      expect(response.body.id).toBeDefined();
      expect(response.body.status).toBe('PUBLISHED');
    });

    it('should handle budget validation error', async () => {
      const invalidData = {
        title: 'Test mission',
        description: 'Test description',
        category: 'travaux',
        budget_min: 5000,
        budget_max: 3000 // Max < Min
      };

      const response = await request(server)
        .post('/api/missions')
        .send(invalidData)
        .expect(422);

      expect(response.body.field).toBe('budget_max');
      expect(response.body.message).toContain('supérieur');
    });

    it('should handle idempotency correctly', async () => {
      const missionData = {
        title: 'Test idempotency',
        description: 'Test idempotency description',
        category: 'services',
        budget_min: 1000,
        budget_max: 2000
      };

      const idempotencyKey = 'mission-idempotent-001';

      // Premier appel
      const response1 = await request(server)
        .post('/api/missions')
        .set('Idempotency-Key', idempotencyKey)
        .send(missionData)
        .expect(201);

      // Deuxième appel avec même clé
      const response2 = await request(server)
        .post('/api/missions')
        .set('Idempotency-Key', idempotencyKey)
        .send(missionData)
        .expect(201);

      expect(response1.body.id).toBe(response2.body.id);
    });
  });

  describe('GET /api/admin/diagnostics', () => {
    it('should return system diagnostics', async () => {
      const response = await request(server)
        .get('/api/admin/diagnostics')
        .expect(200);

      expect(response.body.routes_ok).toBe(true);
      expect(response.body.forms_ok).toBe(true);
      expect(response.body.db_ok).toBe(true);
      expect(response.body.migrations_applied).toBeInstanceOf(Array);
      expect(response.body.stats).toBeDefined();
    });
  });
});

describe('AI Improvement Integration', () => {
  it('should create mission with applied AI suggestions', async () => {
    // 1. Générer suggestions
    const briefData = {
      title: 'Site e-commerce',
      description: 'Création d\'un site de vente en ligne',
      category: 'développement'
    };

    const suggestResponse = await request(server)
      .post('/api/ai/missions/suggest')
      .send(briefData)
      .expect(200);

    // 2. Créer mission avec suggestions appliquées
    const missionData = {
      ...briefData,
      budget_min: 5000,
      budget_max: 15000,
      applied_ai_suggestion: {
        applied_settings: {
          text: true,
          budget: 'med',
          delay: true
        },
        suggestion: suggestResponse.body.suggestion
      }
    };

    const createResponse = await request(server)
      .post('/api/missions')
      .set('Idempotency-Key', 'mission-ai-test-001')
      .send(missionData)
      .expect(201);

    expect(createResponse.body.validation.infos).toContain('Suggestions IA appliquées avec succès');
  });
});
