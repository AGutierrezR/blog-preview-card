/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')
const postcss = require('postcss')
const postcssJs = require('postcss-js')

const {
  colors,
  fontSize,
  fontFamily,
  spacing,
} = require('./src/css-utils/process-tokens.cjs')

module.exports = {
  content: ['./*.html', './src/main.js'],
  theme: {
    colors,
    fontSize,
    fontFamily,
    fontWeight: {
      normal: 400,
      bold: 700,
      black: 800,
    },
    backgroundColor: ({ theme }) => theme('colors'),
    textColor: ({ theme }) => theme('colors'),
    margin: ({ theme }) => ({
      auto: 'auto',
      ...theme('spacing'),
    }),
    padding: ({ theme }) => theme('spacing'),
    extend: {
      spacing
    }
  },
  plugins: [
    plugin(function ({ addComponents, config }) {
      let result = ''

      const currentConfig = config()

      const groups = [
        { key: 'colors', prefix: 'color' },
        { key: 'spacing', prefix: 'space' },
        { key: 'fontSize', prefix: 'size' },
        { key: 'fontFamily', prefix: 'font' },
      ]

      groups.forEach(({ key, prefix }) => {
        const group = currentConfig.theme[key]

        if (!group) {
          return
        }

        if (key === 'spacing') {
          Object.keys(group).forEach((key) => {
            if (!(key in spacing)) {
              return
            }

            result += `--${prefix}-${key}: ${group[key]};`
          })
        } else {
          Object.keys(group).forEach((key) => {
            result += `--${prefix}-${key}: ${group[key]};`
          })
        }
      })

      addComponents({
        ':root': postcssJs.objectify(postcss.parse(result)),
      })
    }),
  ],
}

