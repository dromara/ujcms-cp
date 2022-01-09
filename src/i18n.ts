import { createI18n } from 'vue-i18n';
import elEn from 'element-plus/lib/locale/lang/en';
import elZhCn from 'element-plus/lib/locale/lang/zh-cn';
import { getCookieLocale } from '@/utils/common';
import en from './locales/en';
import zhCn from './locales/zh-cn';

const messages = {
  [elEn.name]: {
    el: elEn.el,
    ...en,
  },
  [elZhCn.name]: {
    el: elZhCn.el,
    ...zhCn,
  },
};

export function getLanguage() {
  const chooseLanguage = getCookieLocale();
  if (chooseLanguage) return chooseLanguage;
  return process.env.VUE_APP_I18N_LOCALE || 'zh-cn';
}

// vue-cli-plugin-i18n 生成的代码，可以自动读取 ./locales 目录下的json文件。
// function loadLocaleMessages(): LocaleMessages<VueMessageType> {
//   const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i);
//   const messages: LocaleMessages<VueMessageType> = {};
//   locales.keys().forEach((key) => {
//     const matched = key.match(/([A-Za-z0-9-_]+)\./i);
//     if (matched && matched.length > 1) {
//       const locale = matched[1];
//       messages[locale] = locales(key).default;
//     }
//   });
//   return messages;
// }

export default createI18n({
  legacy: false,
  locale: getLanguage(),
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'zh-cn',
  globalInjection: true,
  messages,
});
