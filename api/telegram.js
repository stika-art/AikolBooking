export default async function handler(req, res) {
  // Настройка CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(200).send('Aikol Telegram Webhook Endpoint Active');
  }

  try {
    const body = req.body;
    if (!body || !body.callback_query) {
      return res.status(200).json({ ok: true });
    }

    const { id: queryId, data, message } = body.callback_query;
    if (!data) return res.status(200).json({ ok: true });

    // Формат: action_orderId (например: confirm_BK-1234, work_RQ-5678, done_OD-9012, cancel_BK-1234)
    const parts = data.split('_');
    const action = parts[0];
    const orderId = parts.slice(1).join('_');

    let newStatus = '';
    let statusLabel = '';

    if (action === 'confirm') {
      newStatus = 'Подтверждено';
      statusLabel = '✅ ПОДТВЕРЖДЕНО В TELEGRAM';
    } else if (action === 'work') {
      newStatus = 'В работе';
      statusLabel = '⚡ В РАБОТЕ (TELEGRAM)';
    } else if (action === 'done') {
      newStatus = 'Выполнено';
      statusLabel = '✅ ВЫПОЛНЕНО (TELEGRAM)';
    } else if (action === 'cancel') {
      newStatus = 'Отменено';
      statusLabel = '❌ ОТМЕНЕНО В TELEGRAM';
    }

    if (newStatus && orderId) {
      const SUPABASE_URL = 'https://matlhjhwsspweqxfwzpw.supabase.co';
      const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hdGxoamh3c3B3ZXF4Znd6cHciLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc4NDQ2MjQ0MCwiZXhwIjoyMTAwMDM4NDQwfQ.Uyso9LTS3qFdFEHQfQh-FHoVExYNMqslu4OeR3B_a2s';

      // 1. Получаем текущий заказ из Supabase
      const getRes = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${orderId}`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      });
      const rows = await getRes.json();
      if (rows && rows.length > 0) {
        const orderRow = rows[0];
        const updatedPayload = { ...orderRow.payload, status: newStatus };

        // 2. Обновляем статус и payload в Supabase
        await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${orderId}`, {
          method: 'PATCH',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            status: newStatus,
            payload: updatedPayload
          })
        });
      }

      // 3. Получаем токен бота из Supabase
      const tgTokenRes = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.tg_config`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      });
      const tgRows = await tgTokenRes.json();
      const botToken = tgRows?.[0]?.payload?.token;

      if (botToken) {
        // Уведомление администратора в всплывающем окне Telegram
        await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            callback_query_id: queryId,
            text: `Статус ${orderId} изменён: ${newStatus}`,
            show_alert: false
          })
        });

        // Обновление текста сообщения в Telegram-чате
        const originalText = message.text || '';
        const updatedMessageText = originalText + `\n\n📌 <b>СТАТУС: ${statusLabel}</b>`;
        await fetch(`https://api.telegram.org/bot${botToken}/editMessageText`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: message.chat.id,
            message_id: message.message_id,
            text: updatedMessageText,
            parse_mode: 'HTML'
          })
        });
      }
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Telegram Webhook error:', error);
    return res.status(200).json({ ok: true });
  }
}
