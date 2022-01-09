import { reactive, readonly } from 'vue';
import Cookies from 'js-cookie';

export interface AppState {
  sidebar: boolean;
}

const SIDEBAR_KEY = 'ujcms-sidebar';
const state = reactive<AppState>({ sidebar: !(Cookies.get(SIDEBAR_KEY) === '0') });

export const appState = readonly(state);
export const setSidebar = (sidebar: boolean) => {
  Cookies.set(SIDEBAR_KEY, sidebar ? '1' : '0');
  state.sidebar = sidebar;
};
export const closeSidebar = () => setSidebar(false);
export const toggleSidebar = () => setSidebar(!state.sidebar);
