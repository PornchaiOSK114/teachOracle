import type { Locale } from './i18n';
export type DownloadError = { error?: string; code?: string; retryAfterSeconds?: number; attemptsLeft?: number; limit?: number };

/** Pure UI formatter, without delivery credentials or server dependencies. */
export function downloadError(data: DownloadError, locale: Locale, fallback: string): string {
  if (locale === 'th') return data.error ?? fallback;
  const wait = data.retryAfterSeconds == null ? 'Please try again later.' : `Try again in ${data.retryAfterSeconds} seconds.`;
  switch (data.code) {
    case 'invalid_request': return 'The request is invalid. Please check your details.';
    case 'invalid_email': return 'Enter a valid email address.';
    case 'invalid_code_format': return 'Enter the six-digit code from your email.';
    case 'purchase_not_found': return 'No order was found for these details. Check your purchase email, or contact pornchai.krong@gmail.com.';
    case 'otp_cooldown': return `A code was sent recently. ${wait}`;
    case 'otp_hourly': return `Too many code requests. ${wait}`;
    case 'otp_locked': return `Code verification is temporarily locked after too many incorrect attempts. ${wait}`;
    case 'otp_expired': return 'The code has expired. Request a new code.';
    case 'otp_no_code': return 'There is no active code, or it has already been used. Request a new code.';
    case 'otp_wrong': return `The code is incorrect.${data.attemptsLeft == null ? '' : ` Attempts remaining: ${data.attemptsLeft}.`}`;
    case 'email_failed': return 'The email could not be sent. Try again, or contact pornchai.krong@gmail.com.';
    case 'grant_expired': return 'Your verification has expired. Request a new code. This attempt has not used a download.';
    case 'session_expired': return 'This link has expired. Go to downloads and request a verification code.';
    case 'wrong_owner': return 'This order does not belong to the email you verified.';
    case 'payment_pending': return 'Payment has not been confirmed. Please wait before downloading.';
    case 'quota_exhausted': return `Your download allowance${data.limit == null ? '' : ` of ${data.limit}`} has been used. Contact pornchai.krong@gmail.com if you need another download.`;
    case 'file_failed': return 'The file could not be prepared. This download allowance has been restored. Try again, or contact pornchai.krong@gmail.com with your order reference.';
    case 'product_missing': return 'The product could not be found. Contact pornchai.krong@gmail.com.';
    default: return fallback;
  }
}
