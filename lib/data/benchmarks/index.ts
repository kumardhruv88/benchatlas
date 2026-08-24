import { Benchmark, BenchmarkSummary } from '../../types/benchmark';

import { aime } from './aime';
import { arc_challenge } from './arc-challenge';
import { bfcl } from './bfcl';
import { drop } from './drop';
import { gpqa } from './gpqa';
import { gsm8k } from './gsm8k';
import { hellaswag } from './hellaswag';
import { humaneval_plus } from './humaneval-plus';
import { humaneval } from './humaneval';
import { lcb } from './lcb';
import { mbpp } from './mbpp';
import { minerva_math } from './minerva-math';
import { mmlu } from './mmlu';
import { nq } from './nq';
import { olympiadbench } from './olympiadbench';
import { piqa } from './piqa';
import { realtoxicityprompts } from './realtoxicityprompts';
import { swe_bench } from './swe-bench';
import { triviaqa } from './triviaqa';
import { truthfulqa } from './truthfulqa';
import { webarena } from './webarena';
import { winogrande } from './winogrande';

export const benchmarks: Benchmark[] = [
  aime,
  arc_challenge,
  bfcl,
  drop,
  gpqa,
  gsm8k,
  hellaswag,
  humaneval,
  humaneval_plus,
  lcb,
  mbpp,
  minerva_math,
  mmlu,
  nq,
  olympiadbench,
  piqa,
  realtoxicityprompts,
  swe_bench,
  triviaqa,
  truthfulqa,
  webarena,
  winogrande,
];

export function toBenchmarkSummary(benchmark: Benchmark): BenchmarkSummary {
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
    tags: benchmark.tags,
  };
}

export const benchmarkSummaries: BenchmarkSummary[] = benchmarks.map(toBenchmarkSummary);
