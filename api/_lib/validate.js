export const SESSION_TYPES = ['in-person', 'online'];
export const PREFERRED_TIMES = ['any', 'morning', 'afternoon', 'evening'];
export const STATUSES = ['new', 'contacted', 'scheduled', 'closed'];

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

function toLatinDigits(str) {
  return str
    .replace(/[۰-۹]/g, (d) => PERSIAN_DIGITS.indexOf(d))
    .replace(/[٠-٩]/g, (d) => ARABIC_DIGITS.indexOf(d));
}

// Accepts 09xxxxxxxxx, +989xxxxxxxxx, 00989xxxxxxxxx and 11-digit landlines (e.g. 021xxxxxxxx).
export function normalizePhone(raw) {
  let phone = toLatinDigits(String(raw ?? '')).replace(/[\s\-()]/g, '');
  if (phone.startsWith('+98')) phone = '0' + phone.slice(3);
  else if (phone.startsWith('0098')) phone = '0' + phone.slice(4);
  return /^0\d{10}$/.test(phone) ? phone : null;
}

function cleanText(value, maxLength) {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, maxLength);
}

export function validateRequest(body) {
  const errors = {};
  const data = {
    name: cleanText(body.name, 80),
    phone: normalizePhone(body.phone),
    therapistId: /^[a-z0-9-]{1,64}$/.test(body.therapistId ?? '') ? body.therapistId : null,
    sessionType: SESSION_TYPES.includes(body.sessionType) ? body.sessionType : null,
    preferredTime: PREFERRED_TIMES.includes(body.preferredTime) ? body.preferredTime : null,
    message: cleanText(body.message, 1000) || null,
  };

  if (data.name.length < 2) errors.name = 'لطفاً نام خود را وارد کنید.';
  if (!data.phone) errors.phone = 'شماره تماس معتبر نیست. نمونه: ۰۹۱۲۳۴۵۶۷۸۹';
  if (!data.sessionType) errors.sessionType = 'نوع جلسه را انتخاب کنید.';
  if (!data.preferredTime) errors.preferredTime = 'زمان مناسب را انتخاب کنید.';
  if (body.consent !== true) errors.consent = 'برای ثبت درخواست، تأیید این گزینه لازم است.';

  return { data, errors };
}
