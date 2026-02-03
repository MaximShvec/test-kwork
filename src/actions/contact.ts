'use server';

import * as z from 'zod';
import { sendToTelegram, type City } from '@/lib/telegram';


const formSchema = z.object({
  lastName: z.string().optional().refine(val => !val || (val.trim().length >= 2), {
    message: 'Фамилия должна содержать не менее 2 символов.'
  }),
  firstName: z.string()
    .min(1, 'Имя обязательно для заполнения.')
    .refine(val => val.trim().length >= 2, {
      message: 'Имя должно содержать не менее 2 символов.'
    }),
  middleName: z.string().optional().refine(val => !val || (val.trim().length >= 2), {
    message: 'Отчество должно содержать не менее 2 символов.'
  }),
  phone: z.string()
    .min(1, 'Телефон обязателен для заполнения.')
    .refine(val => val.trim().length >= 10, {
      message: 'Пожалуйста, введите действительный номер телефона.'
    }),
  city: z.enum(['spb', 'msk'], {
    required_error: 'Пожалуйста, выберите город.',
  }),
});

type ContactFormValues = z.infer<typeof formSchema>;

export async function submitContactForm(
  values: ContactFormValues
): Promise<{ success: boolean; message?: string }> {
  const validatedFields = formSchema.safeParse(values);

  if (!validatedFields.success) {
    console.error('Validation failed:', validatedFields.error.flatten().fieldErrors);
    const firstError = Object.values(validatedFields.error.flatten().fieldErrors)[0]?.[0];
    return { success: false, message: firstError || 'Неверные данные формы.' };
  }

  const { lastName, firstName, middleName, phone, city } = validatedFields.data;

  console.log('Получена заявка на сборку мебели:');
  console.log('Город:', city);
  console.log('Фамилия:', lastName);
  console.log('Имя:', firstName);
  console.log('Отчество:', middleName);
  console.log('Телефон:', phone);

  try {
    const result = await sendToTelegram({
      firstName,
      lastName,
      middleName,
      phone,
      city: city as City,
    });

    if (!result.success) {
      console.error('Telegram error:', result.error);
      return { 
        success: false, 
        message: 'Не удалось отправить заявку. Попробуйте позже.' 
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Error processing contact form:', error);
    return { 
      success: false, 
      message: 'Произошла ошибка при отправке заявки.' 
    };
  }
}
