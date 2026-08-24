import { HfInference } from '@huggingface/inference';
import { NextResponse } from 'next/server';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

const SYSTEM_PROMPT = `You are a helpful, expert AI research assistant embedded inside BenchAtlas, an open platform for tracking LLM benchmarks and capabilities.
Your goal is to answer user questions about research papers, machine learning benchmarks, LLM performance, and general AI topics.
Keep your answers concise, accurate, and formatted clearly in markdown.
If you don't know the answer, admit it politely.
Do not hallucinate benchmark scores.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.HUGGINGFACE_API_KEY) {
      return NextResponse.json(
        { error: 'Hugging Face API key not configured. Please add HUGGINGFACE_API_KEY to your .env.local file.' },
        { status: 500 }
      );
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    // Fold the system prompt into the first user message to avoid 400 errors
    // with models that don't support the 'system' role natively (like Mistral).
    const formattedMessages = messages.map((m: any, index: number) => {
      let content = m.content;
      if (index === 0 && m.role === 'user') {
        content = `${SYSTEM_PROMPT}\n\nUser Question:\n${content}`;
      }
      return {
        role: m.role === 'user' ? 'user' : 'assistant',
        content: content
      };
    });

    // Using a fast, free conversational model hosted on Hugging Face Inference API
    const response = await hf.chatCompletion({
      model: 'Qwen/Qwen2.5-72B-Instruct',
      messages: formattedMessages,
      max_tokens: 512,
      temperature: 0.7,
    });

    const reply = response.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during chat completion.' },
      { status: 500 }
    );
  }
}
