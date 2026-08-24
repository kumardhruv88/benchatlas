import fs from 'fs';

async function main() {
  const envFile = fs.readFileSync('.env.local', 'utf-8');
  let token = '';
  envFile.split('\n').forEach(line => {
    if (line.startsWith('HUGGINGFACE_API_KEY=')) {
      token = line.split('=')[1].replace(/"/g, '').trim();
    }
  });

  const response = await fetch('https://router.huggingface.co/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'Qwen/Qwen2.5-72B-Instruct',
      messages: [{ role: 'user', content: 'what is machine learning' }],
      max_tokens: 512,
    })
  });
  
  const text = await response.text();
  console.log("Status:", response.status);
  console.log("Response:", text);
}

main();
