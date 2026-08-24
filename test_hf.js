import fs from 'fs';

async function main() {
  const envFile = fs.readFileSync('.env.local', 'utf-8');
  let token = '';
  envFile.split('\n').forEach(line => {
    if (line.startsWith('HUGGINGFACE_API_KEY=')) {
      token = line.split('=')[1].replace(/"/g, '').trim();
    }
  });

  console.log("Token starts with:", token.substring(0, 5));

  const response = await fetch('https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'meta-llama/Meta-Llama-3-8B-Instruct',
      messages: [{ role: 'user', content: 'hello' }],
      max_tokens: 512,
    })
  });
  
  const text = await response.text();
  console.log("Status:", response.status);
  console.log("Response:", text);
}

main();
