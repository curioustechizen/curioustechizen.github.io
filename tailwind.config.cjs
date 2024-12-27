const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
    darkMode: 'class',
    theme: {
        fontFamily: {
            sans: ['Inter', ...defaultTheme.fontFamily.sans],
            serif: ['Newsreader', ...defaultTheme.fontFamily.serif]
        },
        extend: {
            textColor: {
                main: 'rgb(var(--color-text-main) / <alpha-value>)'
            },
            backgroundColor: {
                main: 'rgb(var(--color-bg-main) / <alpha-value>)',
                muted: 'rgb(var(--color-bg-muted) / <alpha-value>)'
            },
            borderColor: {
                main: 'rgb(var(--color-border-main) / <alpha-value>)'
            },
            textDecorationColor: {
                main: 'rgb(var(--color-bg-muted)'
            },
            typography: (theme) => ({
                dante: {
                    css: {
                        '--tw-prose-body': theme('textColor.main / 100%'),
                        '--tw-prose-headings': theme('textColor.main / 100%'),
                        '--tw-prose-lead': theme('textColor.main / 100%'),
                        '--tw-prose-links': theme('textColor.main / 100%'),
                        '--tw-prose-bold': theme('textColor.main / 100%'),
                        '--tw-prose-counters': theme('textColor.main / 100%'),
                        '--tw-prose-bullets': theme('textColor.main / 100%'),
                        '--tw-prose-hr': theme('borderColor.main / 100%'),
                        '--tw-prose-quotes': theme('textColor.main / 60%'),
                        '--tw-prose-quote-borders': theme('borderColor.main / 100%'),
                        '--tw-prose-captions': theme('textColor.main / 100%'),
                        '--tw-prose-code': theme('textColor.main / 100%'),
                        '--tw-prose-pre-code': theme('colors.zinc.100'),
                        '--tw-prose-pre-bg': theme('colors.zinc.800'),
                        '--tw-prose-th-borders': theme('borderColor.main / 100%'),
                        '--tw-prose-td-borders': theme('borderColor.main / 100%'),
                        '--tw-prose-blockquote-borders': theme('backgroundColor.muted / 100%')
                    }
                },
                DEFAULT: {
                    css: {
                        a: {
                            fontWeight: 'normal',
                            textDecoration: 'underline',
                            textDecorationStyle: 'dashed',
                            textDecorationThickness: '1px',
                            textUnderlineOffset: '2px',
                            textDecorationColor: theme('backgroundColor.muted / 100%'),
                            '&:hover': {
                                textDecorationStyle: 'solid'
                            }
                        },
                        'h1,h2,h3,h4,h5,h6': {
                            fontFamily: theme('fontFamily.serif'),
                            fontWeight: 500
                        },
                        blockquote: {
                            quotes: 'none',
                            border: 0,
                            fontFamily: theme('fontFamily.serif'),
                            fontSize: '1.2125em',
                            fontStyle: 'italic',
                            fontWeight: 'normal',
                            lineHeight: 1.3,
                            borderLeft: "4px solid var(--tw-prose-blockquote-borders)",
                            '@media (min-width: theme("screens.sm"))': {
                                fontSize: '1.2em',
                                lineHeight: 1.3,
                            }
                        },

                    }
                },
                lg: {
                    css: {
                        blockquote: {
                            paddingLeft: 24,
                        }
                    }
                }
            })
        }
    },
    plugins: [
        require('@tailwindcss/typography'),
        function ({ addVariant }) {
            addVariant(
                "prose-inline-code",
                '&.prose :where(:not(pre)>code):not(:where([class~="not-prose"] *))',
            );
        },
    ]
};
