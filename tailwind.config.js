/* eslint-disable */
const colors = require('tailwindcss/colors');

module.exports = {
  important: true,
  purge: {
    // enabled: true,
    content: ['./src/**/*.vue'],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: [
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        '"Noto Sans"',
        '"PingFang SC"',
        '"Hiragino Sans GB"',
        '"Microsoft YaHei"',
        '"WenQuanYi Micro Hei"',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
        '"Noto Color Emoji"',
      ],
    },
    screens: {
      // sm: '768px',
      md: '992px',
      // lg: '1200px',
      xl: '1536px',
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: {
        ...colors.coolGray,
        primary: '#303133',
        regular: '#606266',
        secondary: '#909399',
        placeholder: '#C0C4CC',
      },
      primary: {
        DEFAULT: '#409eff',
        light: '#a6cfff',
        lighter: '#ecf5ff',
      },
      success: {
        DEFAULT: '#67c23a',
        light: '#e2f3d7',
        lighter: '#f1f9eb',
      },
      warning: {
        DEFAULT: '#e6a23c',
        light: '#f9ecd7',
        lighter: '#fcf6ec',
      },
      danger: {
        DEFAULT: '#f56c6c',
        light: '#fbe2e2',
        lighter: '#fdf0f0',
      },
      secondary: {
        DEFAULT: '#909399',
        light: '#e9e9eb',
        lighter: '#f4f4f5',
      },
    },
    extend: {
      transitionDuration: {
        // vue 文档中提到，过度效果的时间一般在0.1s-0.4s之间，而0.25s会是一个比较好的值
        // https://v3.vuejs.org/guide/transitions-overview.html#timing
        250: '250ms',
        350: '350ms',
      },
      transitionProperty: {
        width: 'width',
        margin: 'margin',
      },
      // el-menu 展开时最小宽度是 200px
      // el-menu 折叠时宽度是 64px
      width: {
        sidebar: '200px',
        'sidebar-collapse': '64px',
      },
      margin: {
        sidebar: '200px',
        'sidebar-collapse': '64px',
      },
    },
  },
  variants: {
    // extend: {
    //   borderStyle: ['hover'],
    // },
  },
  plugins: [],
  // corePlugins: {
  //   preflight: false,
  // },
};
