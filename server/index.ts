
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '5000', 10);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist/public')));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AppelsPro API is running' });
});

// Mock AI endpoints pour tester
app.post('/api/ai/analyze-bid', (req, res) => {
  const { projectData, bidData } = req.body;
  
  const mockAnalysis = {
    score: Math.floor(Math.random() * 100),
    priceAnalysis: {
      competitiveness: Math.floor(Math.random() * 100),
      marketPosition: 'competitive'
    },
    riskAssessment: {
      technical: Math.floor(Math.random() * 100),
      timeline: Math.floor(Math.random() * 100),
      budget: Math.floor(Math.random() * 100)
    },
    recommendations: [
      'Considérez ajuster le prix de 5-10%',
      'Mettez en avant votre expérience similaire',
      'Proposez un délai plus précis'
    ]
  };
  
  res.json(mockAnalysis);
});

app.post('/api/ai/match-missions', (req, res) => {
  const { providerProfile } = req.body;
  
  const mockMatches = [
    {
      id: 1,
      title: 'Développement d\'application mobile',
      matchScore: 85,
      reasons: ['Compétences React Native', 'Expérience mobile', 'Localisation proche']
    },
    {
      id: 2,
      title: 'Site web e-commerce',
      matchScore: 72,
      reasons: ['Stack technique compatible', 'Budget aligné']
    }
  ];
  
  res.json(mockMatches);
});

app.post('/api/ai/predict-revenue', (req, res) => {
  const { missionData, providerData } = req.body;
  
  const mockPrediction = {
    estimatedRevenue: Math.floor(Math.random() * 10000) + 2000,
    confidence: Math.floor(Math.random() * 40) + 60,
    factors: [
      'Historique de prix similaires',
      'Complexité du projet',
      'Demande du marché'
    ]
  };
  
  res.json(mockPrediction);
});

app.post('/api/ai/detect-dumping', (req, res) => {
  const { bidData } = req.body;
  
  const mockDetection = {
    isDumping: Math.random() > 0.7,
    confidenceLevel: Math.floor(Math.random() * 50) + 50,
    reasons: Math.random() > 0.5 ? [
      'Prix 40% en dessous de la moyenne marché',
      'Pattern inhabituel dans les enchères'
    ] : [],
    recommendedMinPrice: Math.floor(Math.random() * 2000) + 1000
  };
  
  res.json(mockDetection);
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  try {
    const indexPath = path.join(__dirname, '../dist/public/index.html');
    res.sendFile(indexPath);
  } catch (error) {
    console.error('Error serving index.html:', error);
    res.status(500).send('<!DOCTYPE html><html><body><h1>AppelsPro Loading...</h1><script>window.location.reload()</script></body></html>');
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 AppelsPro server running on http://0.0.0.0:${port}`);
  console.log(`📱 Frontend: http://0.0.0.0:${port}`);
  console.log(`🔧 API Health: http://0.0.0.0:${port}/api/health`);
}).on('error', (err) => {
  console.error('❌ Server failed to start:', err.message);
  process.exit(1);
});
