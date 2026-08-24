import type { Metadata, Viewport } from 'next';
import '../styles/globals.css';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { ChatWidget } from '@/components/ui/ChatWidget';

export const metadata: Metadata = {
  title: {
    default: 'BenchAtlas — LLM Benchmark Intelligence Platform',
    template: '%s · BenchAtlas',
  },
  description:
    'Discover, compare, and understand LLM benchmarks. A research-grade platform covering evaluation methodology, model scores, saturation analysis, and benchmark history across all capability domains.',
  keywords: [
    'LLM benchmarks',
    'AI evaluation',
    'language model comparison',
    'MMLU',
    'HumanEval',
    'benchmark methodology',
    'AI leaderboard',
    'model evaluation',
  ],
  authors: [{ name: 'BenchAtlas' }],
  creator: 'BenchAtlas',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://benchtlas.io',
    siteName: 'BenchAtlas',
    title: 'BenchAtlas — LLM Benchmark Intelligence Platform',
    description:
      'Research-grade platform for discovering, comparing, and understanding LLM evaluation benchmarks.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BenchAtlas — LLM Benchmark Intelligence Platform',
    description: 'Research-grade LLM benchmark discovery and comparison.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#fafaf8',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body>
        <Navigation />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
