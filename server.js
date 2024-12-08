require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Generate Reply Endpoint
app.post('/generate-reply', async (req, res) => {
  const { nickname, rating, menu, review } = req.body;

  // System Instruction: Assistant 행동 방침
  const systemInstruction = `
  너는 고객 응대 전문가로서 음식 배달 가게의 사장님이 고객 리뷰에 답글을 작성할 수 있도록 돕는 역할을 합니다.
  모든 답변은 반드시 한국어로 작성되어야 하며, 다음 규칙을 따르세요:
  1. 리뷰에 대해 진심으로 감사하며 고객의 의견에 공감.
  2. 긍정적 피드백에 대해 칭찬과 감사를 표현하고, 부정적 피드백에 대해서는 개선 의지와 사과를 전달.
  3. '방문' 대신 '주문'을 사용.
  4. 구체적 피드백에 맞춘 개인화된 답변을 작성.
  5. 영어 단어 또는 문장이 포함되면 안 되며, 오직 **한국어로만** 작성.
  `;

  // 사용자 요청에 대한 Prompt
  const prompt = `
  다음은 고객의 리뷰 정보입니다. 이 정보를 바탕으로 사장님이 고객에게 답글을 작성할 수 있도록 도와주세요.
  반드시 **한국어로 작성**하며, 영어 단어가 포함되지 않도록 주의하세요.

  - 별명: ${nickname}
  - 별점: ${rating}점
  - 메뉴: ${menu}
  - 리뷰: ${review}
  `;

  console.log(`Making API call with prompt: ${prompt}`);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // OpenAI 모델 설정
        messages: [
          { role: 'system', content: systemInstruction }, // 시스템 역할 추가
          { role: 'user', content: prompt }, // 사용자 요청
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    console.log(`API response: ${JSON.stringify(data, null, 2)}`);

    // 성공적인 응답 확인 및 반환
    if (data.choices && data.choices[0].message && data.choices[0].message.content) {
      const reply = data.choices[0].message.content.trim();
      console.log(`Generated Reply: ${reply}`);
      res.json({ reply });
    } else {
      console.error('답변 생성 실패:', data);
      res.status(500).json({ error: '답변 생성 실패' });
    }
  } catch (error) {
    console.error('API 호출 오류:', error);
    res.status(500).json({ error: '서버 에러 발생' });
  }
});

// 서버 실행
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
