export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }
  
  try {
    const { messages, temperature = 0.7, max_tokens = 300 } = req.body;
    
    // Простой fallback ответ
    const lastMessage = messages?.[messages.length - 1]?.content || '';
    
    const responses = [
      `В мире снов вы видите: "${lastMessage.substring(0, 30)}...". Вы чувствуете магию вокруг. Что вы хотите сделать? 1. Исследовать дальше 2. Осмотреться 3. Искать подсказки`,
      `"${lastMessage.substring(0, 40)}..." - интересный выбор. Вы можете: 1. Исследовать лес 2. Проверить инвентарь 3. Отдохнуть`,
      `В ответ на ваше действие "${lastMessage.substring(0, 30)}..." мир снов отвечает загадкой. Продолжайте ваше путешествие! 1. Разгадать загадку 2. Игнорировать 3. Записать в дневник`
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return res.status(200).json({
      choices: [{
        message: {
          content: randomResponse
        }
      }]
    });
    
  } catch (error) {
    console.error('LLM Proxy error:', error);
    
    return res.status(200).json({
      choices: [{
        message: {
          content: `Я временно недоступен (ошибка: ${error.message}). Но игра продолжается! Вы можете: 1. Исследовать мир 2. Проверить инвентарь 3. Отдохнуть`
        }
      }]
    });
  }
}
