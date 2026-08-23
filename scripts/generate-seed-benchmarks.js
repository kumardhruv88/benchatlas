const fs = require('fs');
const path = require('path');

const BENCHMARKS = [
  // Coding
  { slug: 'mbpp', name: 'MBPP', description: 'Mostly Basic Python Problems.', category: 'coding', modality: 'text', language: 'en', capability: 'reasoning' },
  { slug: 'swe-bench', name: 'SWE-bench', description: 'Software Engineering problems from real GitHub issues.', category: 'coding', modality: 'text', language: 'en', capability: 'reasoning' },
  { slug: 'lcb', name: 'LiveCodeBench', description: 'Live coding contest problems.', category: 'coding', modality: 'text', language: 'en', capability: 'reasoning' },
  { slug: 'humaneval-plus', name: 'HumanEval+', description: 'Extended HumanEval with rigorous test cases.', category: 'coding', modality: 'text', language: 'en', capability: 'reasoning' },
  
  // Math
  { slug: 'gsm8k', name: 'GSM8K', description: 'Grade School Math 8K.', category: 'mathematics', modality: 'text', language: 'en', capability: 'reasoning' },
  { slug: 'aime', name: 'AIME', description: 'American Invitational Mathematics Examination problems.', category: 'mathematics', modality: 'text', language: 'en', capability: 'reasoning' },
  { slug: 'olympiadbench', name: 'OlympiadBench', description: 'Olympiad-level mathematics and physics problems.', category: 'mathematics', modality: 'text', language: 'en', capability: 'reasoning' },
  { slug: 'minerva-math', name: 'Minerva Math', description: 'STEM mathematical reasoning problems.', category: 'mathematics', modality: 'text', language: 'en', capability: 'reasoning' },

  // Reasoning / Logic
  { slug: 'arc-challenge', name: 'ARC-Challenge', description: 'AI2 Reasoning Challenge.', category: 'reasoning', modality: 'text', language: 'en', capability: 'reasoning' },
  { slug: 'winogrande', name: 'WinoGrande', description: 'Large-scale pronoun resolution and commonsense reasoning.', category: 'reasoning', modality: 'text', language: 'en', capability: 'reasoning' },
  { slug: 'piqa', name: 'PIQA', description: 'Physical Interaction Question Answering.', category: 'reasoning', modality: 'text', language: 'en', capability: 'reasoning' },
  { slug: 'hellaswag', name: 'HellaSwag', description: 'Commonsense NLI.', category: 'reasoning', modality: 'text', language: 'en', capability: 'reasoning' },
  { slug: 'drop', name: 'DROP', description: 'Discrete Reasoning Over Paragraphs.', category: 'reasoning', modality: 'text', language: 'en', capability: 'reasoning' },
  { slug: 'gpqa', name: 'GPQA', description: 'Google-Proof Q&A.', category: 'knowledge', modality: 'text', language: 'en', capability: 'knowledge' },
  { slug: 'triviaqa', name: 'TriviaQA', description: 'Reading comprehension dataset.', category: 'knowledge', modality: 'text', language: 'en', capability: 'knowledge' },
  { slug: 'nq', name: 'Natural Questions', description: 'Google search queries.', category: 'knowledge', modality: 'text', language: 'en', capability: 'knowledge' },
  { slug: 'truthfulqa', name: 'TruthfulQA', description: 'Measuring how models mimic human falsehoods.', category: 'safety-alignment', modality: 'text', language: 'en', capability: 'alignment' },
  { slug: 'realtoxicityprompts', name: 'RealToxicityPrompts', description: 'Evaluating Neural Toxic Degeneration.', category: 'safety-alignment', modality: 'text', language: 'en', capability: 'alignment' },
  { slug: 'bfcl', name: 'Berkeley Function Calling Leaderboard', description: 'Evaluating LLM Tool Use capabilities.', category: 'agentic-tool-use', modality: 'text', language: 'en', capability: 'agentic' },
  { slug: 'webarena', name: 'WebArena', description: 'A realistic web environment.', category: 'agentic-tool-use', modality: 'text', language: 'en', capability: 'agentic' },
];

const DIR = path.join(__dirname, '../lib/data/benchmarks');

if (!fs.existsSync(DIR)) {
  fs.mkdirSync(DIR, { recursive: true });
}

BENCHMARKS.forEach(b => {
  const filePath = path.join(DIR, b.slug + '.ts');
  if (fs.existsSync(filePath)) return; // Don't overwrite existing
  
  const content = `import { Benchmark } from '../../types/benchmark';

export const ${b.slug.replace(/-/g, '_')}: Benchmark = {
  id: '${b.slug}',
  slug: '${b.slug}',
  name: '${b.name}',
  category: '${b.category}',
  subcategories: [],
  modalities: ['${b.modality}'],
  languages: ['${b.language}'],
  purpose: 'Evaluate ${b.capability}',
  capability: '${b.capability}',
  description: '${b.description}',
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
  tags: ['${b.category}', '${b.modality}'],
  featured: false
};
`;
  fs.writeFileSync(filePath, content);
});

// Update index.ts
const files = fs.readdirSync(DIR).filter(f => f.endsWith('.ts') && f !== 'index.ts');
let indexContent = `import { Benchmark, BenchmarkSummary } from '../../types/benchmark';\n\n`;

files.forEach(f => {
  const name = f.replace('.ts', '');
  const importName = name.replace(/-/g, '_');
  indexContent += `import { ${importName} } from './${name}';\n`;
});

indexContent += `\nexport const benchmarks: Benchmark[] = [\n`;
files.forEach(f => {
  const name = f.replace('.ts', '');
  const importName = name.replace(/-/g, '_');
  indexContent += `  ${importName},\n`;
});
indexContent += `];\n\n`;

indexContent += `export function toBenchmarkSummary(benchmark: Benchmark): BenchmarkSummary {
  return {
    id: benchmark.id,
    slug: benchmark.slug,
    name: benchmark.name,
    abbreviation: benchmark.abbreviation,
    category: benchmark.category,
    subcategories: benchmark.subcategories,
    purpose: benchmark.purpose,
    saturationStatus: benchmark.saturationStatus,
    contaminationRisk: benchmark.contaminationRisk,
    datasetSizeLabel: benchmark.datasetSizeLabel,
    taskFormat: benchmark.taskFormat,
    humanBaseline: benchmark.humanBaseline,
    topScore: benchmark.topScore,
    topScoringModel: benchmark.topScoringModel,
    launchDate: benchmark.launchDate,
    modalities: benchmark.modalities,
    languages: benchmark.languages,
    evaluationMetric: benchmark.evaluationMetric,
    featured: benchmark.featured,
    tags: benchmark.tags
  };
}

export const benchmarkSummaries: BenchmarkSummary[] = benchmarks.map(toBenchmarkSummary);
`;

fs.writeFileSync(path.join(DIR, 'index.ts'), indexContent);
console.log('Seed data generation complete.');
