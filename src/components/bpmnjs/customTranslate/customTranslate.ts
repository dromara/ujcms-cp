// https://github.com/bpmn-io/bpmn-js-examples/blob/master/i18n/app/customTranslate/customTranslate.js
import translations from './translations';

export default function customTranslate(template: string, replacements: Record<string, string>) {
  replacements = replacements || {};

  // Translate
  template = translations[template] || template;

  // Replace
  return template.replace(/{([^}]+)}/g, function (_, key) {
    return replacements[key] || '{' + key + '}';
  });
}
