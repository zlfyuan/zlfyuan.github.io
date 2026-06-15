/**
 * Primary navigation — labels resolved via i18n keys
 */
export const navItems = [
  { key: 'nav.home', href: '/', label: '首页' },
  { key: 'nav.blog', href: '/blog/', label: '博客' },
  { key: 'nav.projects', href: '/projects/', label: '项目' },
  { key: 'nav.about', href: '/about/', label: '关于' },
  { key: 'nav.guestbook', href: '/guestbook/', label: '留言' },
] as const;

export type NavItem = (typeof navItems)[number];
