import * as z from "zod";
import type { City } from "@/lib/telegram";

const formSchema = z.object({
  lastName: z
    .string()
    .optional()
    .refine((val) => !val || val.trim().length >= 2, {
      message: "Фамилия должна содержать не менее 2 символов.",
    }),
  firstName: z
    .string()
    .min(1, "Имя обязательно для заполнения.")
    .refine((val) => val.trim().length >= 2, {
      message: "Имя должно содержать не менее 2 символов.",
    }),
  middleName: z
    .string()
    .optional()
    .refine((val) => !val || val.trim().length >= 2, {
      message: "Отчество должно содержать не менее 2 символов.",
    }),
  phone: z
    .string()
    .min(1, "Телефон обязателен для заполнения.")
    .refine((val) => val.trim().length >= 10, {
      message: "Пожалуйста, введите действительный номер телефона.",
    }),
  city: z.enum(["spb", "msk"], {
    required_error: "Пожалуйста, выберите город.",
  }),
});

export type ContactFormValues = z.infer<typeof formSchema>;

/**
 * Отправка формы: валидация + POST на внешний endpoint (для static export).
 * Чтобы заявки уходили в Telegram, нужен отдельный бэкенд по URL из NEXT_PUBLIC_FORM_SUBMIT_URL.
 */
export async function submitContactForm(
  values: ContactFormValues
): Promise<{ success: boolean; message?: string }> {
  const validatedFields = formSchema.safeParse(values);

  if (!validatedFields.success) {
    const firstError = Object.values(
      validatedFields.error.flatten().fieldErrors
    )[0]?.[0];
    return {
      success: false,
      message: firstError || "Неверные данные формы.",
    };
  }

  const endpoint = process.env.NEXT_PUBLIC_FORM_SUBMIT_URL;
  if (!endpoint) {
    return {
      success: false,
      message:
        "Отправка заявок на этой версии сайта недоступна. Обратитесь к администратору.",
    };
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validatedFields.data),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        success: false,
        message:
          (data as { message?: string }).message ||
          "Не удалось отправить заявку. Попробуйте позже.",
      };
    }
    return { success: true, message: (data as { message?: string }).message };
  } catch {
    return {
      success: false,
      message: "Произошла ошибка при отправке заявки.",
    };
  }
}
