export type Image = {
    src: string;
    alt?: string;
    caption?: string;
};

export type Link = {
    text: string;
    href: string;
};

export type Hero = {
    title?: string;
    text?: string;
    image?: Image;
    actions?: Link[];
};

export type Subscribe = {
    title?: string;
    text?: string;
    formUrl: string;
};

export type SiteConfig = {
    logo?: Image;
    title: string;
    subtitle?: string;
    description: string;
    image?: Image;
    headerNavLinks?: Link[];
    footerNavLinks?: Link[];
    socialLinks?: Link[];
    hero?: Hero;
    postsPerPage?: number;
};

const siteConfig: SiteConfig = {
    title: 'Curious Techizen',
    subtitle: '',
    description: 'A place for discussing anything tech. Old and new. Experiences and Opinions. Questions and rants. Primarily programming-related, but not exclusively.',
    headerNavLinks: [
        {
            text: 'Home',
            href: '/'
        },
        {
            text: 'Blog',
            href: '/blog'
        },
        {
            text: 'Tags',
            href: '/tags'
        }
    ],
    footerNavLinks: [
        {
            text: 'Based on Dante Astro Theme',
            href: 'https://github.com/JustGoodUI/dante-astro-theme'
        }
    ],
    socialLinks: [
        {
            text: 'Github',
            href: 'https://github.com/curioustechizen'
        },
        {
            text: 'Mastodon',
            href: 'https://androiddev.social/@kiranrao'
        }
    ],
    hero: {
        title: 'Kiran Rao',
        text: "I'm <a class=\"h-card\" href=\"https://kiranrao.in\"><b>Kiran Rao</b></a>, Android and iOS developer, tech enthusiast and serial dabbler. See my open source work on <a href='https://github.com/curioustechizen'>GitHub</a>",
    },
    postsPerPage: 10,
};

export default siteConfig;
