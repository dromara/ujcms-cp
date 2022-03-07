import defaultSettings from '@/settings';
import i18n from '@/i18n';

const title = defaultSettings.title || 'UJCMS';

export default function getPageTitle(pageTitle: string | undefined): string {
  if (pageTitle) {
    const {
      global: { t },
    } = i18n;
    return `${t(pageTitle)} - ${title}`;
  }
  return `${title}`;
}
