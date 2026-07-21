export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(200).send('Aikol Telegram Webhook Active');
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    }

    if (!body || !body.callback_query) {
      return res.status(200).json({ ok: true, note: 'No callback query' });
    }

    const { id: queryId, data, message } = body.callback_query;
    if (!data) return res.status(200).json({ ok: true });

    // Формат callback_data: action_orderId (например: confirm_BK-219, work_OD-1234, done_OD-1234, cancel_BK-219)
    const parts = data.split('_');
    const action = parts[0];
    const orderId = parts.slice(1).join('_');

    let newStatus = '';
    let statusLabel = '';
    let updatedButtons = [];

    if (action === 'confirm') {
      newStatus = 'Подтверждено';
      statusLabel = '✅ ПОДТВЕРЖДЕНО В TELEGRAM';
      updatedButtons = [[ { text: '⚡ В работу', callback_data: `work_${orderId}` } ]];
    } else if (action === 'work') {
      newStatus = 'В работе';
      statusLabel = '⚡ В РАБОТЕ (TELEGRAM)';
      updatedButtons = [[ { text: '✅ Выполнено', callback_data: `done_${orderId}` } ]];
    } else if (action === 'done') {
      newStatus = 'Выполнено';
      statusLabel = '✅ ВЫПОЛНЕНО (TELEGRAM)';
      updatedButtons = []; // Удаляем кнопки после выполнения
    } else if (action === 'cancel') {
      newStatus = 'Отменено';
      statusLabel = '❌ ОТМЕНЕНО В TELEGRAM';
      updatedButtons = []; // Удаляем кнопки после отмены
    }

    // Рабочий ключ Supabase
    const SUPABASE_URL = 'https://matlhjhwsspweqxfwzpw.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hdGxoamh3c3Nwd2VxeGZ3enB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0NjI0NDAsImV4cCI6MjEwMDAzODQ0MH0.Uyso9LTS3qFdFEHQfQh-FHoVExYNMqslu4OeR3B_a2s';

    // 1. Получаем токен бота из Supabase
    let botToken = null;
    try {
      const tgTokenRes = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.tg_config`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      });
      const tgRows = await tgTokenRes.json();
      botToken = tgRows?.[0]?.payload?.token;
    } catch(e) {}

    const activeToken = botToken || '8550144955:AAHtKmX0nzMy5rIkbIHPpFCS9sNP1pzRyJM';

    // 2. Отправляем МГНОВЕННЫЙ отклик Telegram (показывает всплывающее окно)
    if (queryId && activeToken) {
      await fetch(`https://api.telegram.org/bot${activeToken}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callback_query_id: queryId,
          text: `Статус ${orderId || ''}: ${newStatus || 'Изменён'}`,
          show_alert: true
        })
      });
    }

    if (newStatus && orderId) {
      // 3. Получаем текущую запись из Supabase
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

        // 4. Обновляем статус в Supabase
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

      // 5. Редактируем сообщение И КНОПКИ в самом Telegram-чате
      if (activeToken && message) {
        const originalText = message.text || '';
        // Очищаем старые приписки статусов если нажимали несколько раз
        const cleanText = originalText.split('\n\n📌 <b>СТАТУС:')[0];
        const updatedMessageText = cleanText + `\n\n📌 <b>СТАТУС: ${statusLabel}</b>`;

        await fetch(`https://api.telegram.org/bot${activeToken}/editMessageText`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: message.chat.id,
            message_id: message.message_id,
            text: updatedMessageText,
            parse_mode: 'HTML',
            reply_markup: { inline_keyboard: updatedButtons }
          })
        });
      }
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Telegram Webhook error:', error);
    return res.status(200).json({ ok: true, error: String(error) });
  }
}
