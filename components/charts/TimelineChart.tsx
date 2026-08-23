'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from 'recharts';
import styles from './TimelineChart.module.css';

interface TimelineEvent {
  date: string;
  event: string;
  description?: string;
  score?: number;
  modelId?: string;
}

interface TimelineChartProps {
  data: TimelineEvent[];
  height?: number;
}

export function TimelineChart({ data, height = 250 }: TimelineChartProps) {
  // Sort data chronologically
  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Filter out events without scores if we only want to plot score progression
  const pointsWithScores = sortedData.filter(d => d.score !== undefined);
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const eventData = payload[0].payload as TimelineEvent;
      return (
        <div className={styles.tooltip}>
          <p className={styles.tooltip_date}>{new Date(eventData.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</p>
          <p className={styles.tooltip_event}>{eventData.event}</p>
          {eventData.description && <p className={styles.tooltip_desc}>{eventData.description}</p>}
          {eventData.score !== undefined && (
            <p className={styles.tooltip_score}>Score: <strong>{eventData.score}</strong></p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.chart_container} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={sortedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
          <XAxis
            dataKey="date"
            tickFormatter={(tick) => new Date(tick).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickMargin={10}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            hide={pointsWithScores.length === 0} // hide Y axis if no scores to plot
          />
          <Tooltip content={<CustomTooltip />} />
          
          {pointsWithScores.length > 0 ? (
            <Line
              type="monotone"
              dataKey="score"
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={{ r: 4, fill: 'var(--color-surface)', stroke: 'var(--color-primary)', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: 'var(--color-primary)', stroke: 'var(--color-surface)', strokeWidth: 2 }}
            />
          ) : (
            // If no scores, just plot events on a flat timeline (y=0)
            <Line
              type="step"
              dataKey={() => 0} // Dummy line
              stroke="var(--color-border-hover)"
              strokeWidth={2}
              dot={{ r: 4, fill: 'var(--color-surface)', stroke: 'var(--color-border-hover)', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: 'var(--color-text-primary)', stroke: 'var(--color-surface)', strokeWidth: 2 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
