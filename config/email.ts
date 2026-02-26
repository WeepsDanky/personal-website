export const emailConfig = {
  from: 'hi@marksun.net',
  replyTo: process.env.SITE_NOTIFICATION_EMAIL_TO,
  baseUrl:
    process.env.VERCEL_ENV === 'production'
      ? `https://marksun.net`
      : 'http://localhost:3000',
}
