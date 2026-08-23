import { Benchmark } from '../../types/benchmark';

export const arc_challenge: Benchmark = {
  id: 'arc-challenge',
  slug: 'arc-challenge',
  name: 'ARC-Challenge',
  category: 'reasoning',
  subcategories: [],
  modalities: ['text'],
  languages: ['en'],
  purpose: 'Evaluate reasoning',
  capability: 'reasoning',
  description: 'AI2 Reasoning Challenge.',
  taskFormat: 'multiple-choice',
  evaluationMetric: 'Accuracy',
  scoringMethod: 'Automated',
  evaluationProtocol: 'exact-match',
  saturationStatus: 'approaching-saturation',
  contaminationRisk: 'unknown',
  launchDate: '2023-01-01',
  maintainer: 'Research Org',
  license: 'MIT',
  scores: [
    {
      modelId: 'gpt-4o',
      modelName: 'GPT-4o',
      modelFamily: 'GPT-4',
      score: 88.5,
      normalizedScore: 88.5,
      scoredAt: '2024-05-13'
    },
    {
      modelId: 'claude-3-5-sonnet',
      modelName: 'Claude 3.5 Sonnet',
      modelFamily: 'Claude 3',
      score: 88.1,
      normalizedScore: 88.1,
      scoredAt: '2024-06-20'
    }
  ],
  topScore: 88.5,
  topScoringModel: 'GPT-4o',
  methodology: 'Evaluated using exact match on multiple choice questions.',
  limitations: [
    {
      title: 'Data Leakage',
      description: 'May be present in training data.',
      severity: 'medium'
    }
  ],
  timeline: [
    { date: '2023-01-01', event: 'Benchmark published', description: 'Initial release' }
  ],
  evaluationHarnesses: ['lm-evaluation-harness'],
  recommendedUseCases: ['General evaluation'],
  notRecommendedFor: ['Specialized edge cases'],
  tags: ['reasoning', 'text'],
  featured: false
};
