export const navigationItems = [
  { href: '/', key: 'home' },
  { href: '/guestbook', key: 'guestbook' },
  { href: '/profile', key: 'profile' },
] as const

export type NavKey = (typeof navigationItems)[number]['key']
