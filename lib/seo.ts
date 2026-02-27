export const seo = {
  title: '马克孙 | 物理学生,创始人,开发者',
  description:
    '帝国理工物理系在读，顺便造 AI Agent。这里记录我对 AI 的思考，偶尔也聊吉他、插画和游戏。',
  url: new URL(
    process.env.NODE_ENV === 'production'
      ? 'https://marksun.net'
      : 'http://localhost:3000'
  ),
} as const
