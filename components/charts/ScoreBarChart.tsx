'use client';

import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import styles from './ScoreBarChart.module.css';

interface ScoreData {
  modelName: string;
  score: number;
  [key: string]: any;
}

interface ScoreBarChartProps {
  data: ScoreData[];
  yAxisLabel?: string;
  height?: number;
  highlightModel?: string;
}

export function ScoreBarChart({
  data,
  yAxisLabel = 'Score',
  height = 300,
  highlightModel,
}: ScoreBarChartProps) {
  // Sort data descending by score
  const sortedData = [...data].sort((a, b) => b.score - a.score);

  return (
    <div className={styles.chart_container} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={sortedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
          <XAxis
            dataKey="modelName"
            angle={-45}
            textAnchor="end"
            interval={0}
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
            tickMargin={10}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', fill: 'var(--color-text-tertiary)', fontSize: 12 }}
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            domain={[0, 100]}
          />
          <Tooltip
            cursor={{ fill: 'var(--color-surface-2)' }}
            contentStyle={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-md)',
              color: 'var(--color-text-primary)'
            }}
          />
          <Bar dataKey="score" radius={[4, 4, 0, 0]} maxBarSize={60}>
            {sortedData.map((entry, index) => (
              <Cell
                key={`cell-\${index}`}
                fill={entry.modelName === highlightModel ? 'var(--color-primary)' : 'var(--color-border-hover)'}
              />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
