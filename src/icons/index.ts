import SvgIcon from '@/components/SvgIcon/index.vue'; // svg component

export function useIcons(app: any) {
  // register globally
  app.component('SvgIcon', SvgIcon);

  const req = require.context('./svg', false, /\.svg$/);
  const requireAll = (requireContext: any) => requireContext.keys().map(requireContext);
  requireAll(req);
}
