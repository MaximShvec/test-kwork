

export type City = 'spb' | 'msk';

interface TelegramMessage {
  firstName: string;
  lastName?: string;
  middleName?: string;
  phone: string;
  city: City;
}


function getBotConfig(city: City) {
  if (city === 'spb') {
    return {
      token: process.env.TELEGRAM_BOT_TOKEN_SPB,
      chatId: process.env.TELEGRAM_CHAT_ID_SPB,
    };
  } else {
    return {
      token: process.env.TELEGRAM_BOT_TOKEN_MSK,
      chatId: process.env.TELEGRAM_CHAT_ID_MSK,
    };
  }
}


function formatMessage(data: TelegramMessage): string {
  const cityName = data.city === 'spb' ? 'Санкт-Петербург' : 'Москва';
  const fullName = [data.lastName, data.firstName, data.middleName]
    .filter(Boolean)
    .join(' ');

  return `🔔 Новая заявка на сборку мебели

📍 Город: ${cityName}
👤 ФИО: ${fullName}
📱 Телефон: ${data.phone}

⏰ Дата: ${new Date().toLocaleString('ru-RU')}`;
}


export async function sendToTelegram(
  data: TelegramMessage
): Promise<{ success: boolean; error?: string }> {
  try {
    const config = getBotConfig(data.city);

    if (!config.token || !config.chatId) {
      console.error(`Telegram config missing for ${data.city}`);
      return {
        success: false,
        error: `Не настроен Telegram бот для города ${data.city}`,
      };
    }

    const message = formatMessage(data);
    const url = `https://api.telegram.org/bot${config.token}/sendMessage`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: config.chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
      console.error('Telegram API error:', result);
      return {
        success: false,
        error: result.description || 'Ошибка отправки в Telegram',
      };
    }

    console.log(`✅ Заявка отправлена в Telegram (${data.city})`);
    return { success: true };
  } catch (error) {
    console.error('Error sending to Telegram:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Неизвестная ошибка',
    };
  }
}
