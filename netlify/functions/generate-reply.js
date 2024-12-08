const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: 'OK',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const data = JSON.parse(event.body);
    const { nickname, rating, menu, review } = data;

    if (!nickname || !rating || !menu || !review) {
      console.error('Missing required fields:', { nickname, rating, menu, review });
      return {
        statusCode: 400,
        body: JSON.stringify({ error: '모든 필드를 입력해주세요.' }),
      };
    }

    const messages = [
      { role: 'system', content: '고객 리뷰에 대한 적절한 답변을 생성하세요.' },
      {
        role: 'user',
        content: `고객 별명: ${nickname}\n별점: ${rating}\n메뉴: ${menu}\n리뷰 내용: ${review}\n\n위 정보를 바탕으로 답글을 작성해 주세요.`,
      },
    ];

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // 사용하고자 하는 OpenAI 모델
        messages: messages,
        max_tokens: 500,
        temperature: 0.4,
      }),
    });

    const result = await openaiResponse.json();

    if (!result.choices || result.choices.length === 0) {
      console.error('OpenAI 응답 없음:', result);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: '답글을 생성할 수 없습니다.' }),
      };
    }

    const reply = result.choices[0].message.content.trim();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ reply }),
    };
  } catch (error) {
    console.error('Function Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: '답글 생성 중 문제가 발생했습니다.' }),
    };
  }
};
