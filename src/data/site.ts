/**
 * Site metadata — single source of truth
 */
export const site = {
  title: '橘子的皮',
  titleEn: 'Orange Peel',
  description: '人生苦短，还是要打工还是要打工打工打工',
  descriptionEn: 'Life is short, and I still have to work, work, work.',
  url: 'https://zlfyuan.github.io',
  author: 'zlfyuan',
  avatar: '/img/avatar.png',
  avatarAlt: '头像',
  email: 'mailto:741136856@qq.com',
  socials: {
    github: 'https://github.com/zlfyuan',
    gitee: 'https://gitee.com/zlfmayun',
    juejin: 'https://juejin.cn/user/zlfyuan',
    rss: '/zh-CN/rss.xml',
  },
  beian: {
    text: '赣ICP备2023012875号',
    url: 'https://beian.miit.gov.cn/',
  },
  founded: 2024,
} as const;

export type Site = typeof site;
