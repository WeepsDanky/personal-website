export const emailConfig = {
  from: 'hi@marksun.co.uk',
  replyTo: process.env.SITE_NOTIFICATION_EMAIL_TO,
  baseUrl:
    process.env.VERCEL_ENV === 'production'
      ? `https://marksun.co.uk`
      : 'http://localhost:3000',
}
