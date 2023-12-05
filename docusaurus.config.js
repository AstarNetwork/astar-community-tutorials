// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const math = require('remark-math');
const katex = require('rehype-katex');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Astar Community Tutorials',
  tagline: 'ACT is a community-maintained repository of useful information about Astar Network',
  url: 'https://docs.astar.network',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  favicon: 'img/fav.png',
  organizationName: 'AstarNetwork', // Usually your GitHub org/user name.
  projectName: 'astar-community-tutorials', // Usually your repo name.
  plugins: ['docusaurus-plugin-sass'],
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],
  clientModules: [require.resolve('./static/astarAi.js')],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/AstarNetwork/astar-community-tutorials/tree/main/',
          remarkPlugins: [math],
          rehypePlugins: [katex],
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl: 'https://github.com/AstarNetwork/astar-community-tutorials/tree/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.scss'),
        },
      }),
    ],
  ],

  //Enable multilanguage support. Portuguese added as first language
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
    localeConfigs: {
      en: { htmlLang: 'en-US' },
    },
  },
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Astar Community Tutorials',
        logo: {
          alt: 'ACT',
          src: 'img/astar-logo.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'getting-started',
            position: 'left',
            label: 'Site Index',
          },
          {
            type: 'doc',
            docId: 'builder-guides/index',
            position: 'left',
            label: 'Start Building',
          },
          {
            to: 'https://theastarbulletin.news',
            label: 'Medium',
            position: 'left',
          },
          {
            to: 'https://www.youtube.com/channel/UC36JgEF6gqatVSK9xlzzrvQ',
            label: 'Youtube',
            position: 'left',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
          {
            href: 'https://github.com/AstarNetwork/astar-community-tutorials',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'light',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Site Index',
                to: '/docs/getting-started',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Discord',
                href: 'https://discord.gg/astarnetwork',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/AstarNetwork',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: 'https://astar.network/blog',
              },
              {
                label: 'Astar Network GitHub',
                href: 'https://github.com/AstarNetwork',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Astar Developers Hub.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['rust', 'toml', 'solidity'],
      },
    }),
};

module.exports = config;
