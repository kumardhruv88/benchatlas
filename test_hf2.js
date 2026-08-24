import { HfInference } from '@huggingface/inference';
import fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf-8');
let token = '';
envFile.split('\n').forEach(line => {
  if (line.startsWith('HUGGINGFACE_API_KEY=')) {
    token = line.split('=')[1].replace(/"/g, '').trim();
  }
});

const hf = new HfInference(token);

async function main() {
  try {
    const response = await hf.chatCompletion({
      model: 'microsoft/Phi-3-mini-4k-instruct',
      messages: [{ role: 'user', content: 'hello' }],
      max_tokens: 512,
    });
    console.log("Success:", response.choices[0].message.content);
  } catch (error) {
    console.error("Error occurred:", error.message);
    if (error.response) {
      console.error(await error.response.text());
    }
  }
}

main();
