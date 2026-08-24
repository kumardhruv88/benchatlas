'use client';

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ModelRadarChartProps {
  modelA: {
    id: string;
    name: string;
    color: string;
  };
  modelB?: {
    id: string;
    name: string;
    color: string;
  };
  data: {
    category: string;
    [modelId: string]: number | string;
  }[];
  height?: number;
}

export function ModelRadarChart({ modelA, modelB, data, height = 400 }: ModelRadarChartProps) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="var(--color-border)" />
          <PolarAngleAxis 
            dataKey="category" 
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 12, fontWeight: 500 }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]} 
            tick={{ fill: 'var(--color-text-tertiary)', fontSize: 10 }}
            stroke="var(--color-border-subtle)"
          />
          <Radar
            name={modelA.name}
            dataKey={modelA.id}
            stroke={modelA.color}
            fill={modelA.color}
            fillOpacity={0.4}
          />
          {modelB && (
            <Radar
              name={modelB.name}
              dataKey={modelB.id}
              stroke={modelB.color}
              fill={modelB.color}
              fillOpacity={0.4}
            />
          )}
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--color-surface)', 
              borderColor: 'var(--color-border-strong)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
            }}
            itemStyle={{ color: 'var(--color-text-primary)' }}
          />
          <Legend wrapperStyle={{ fontSize: 'var(--text-sm)', paddingTop: '20px' }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
