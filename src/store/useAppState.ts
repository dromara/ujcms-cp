import { reactive, readonly } from 'vue';
import Cookies from 'js-cookie';

export interface AppState {
  sidebar: boolean;
}

const SIDEBAR_KEY = 'ujcms-sidebar';
const state = reactive<AppState>({ sidebar: !(Cookies.get(SIDEBAR_KEY) === '0') });

export const appState = readonly(state);
export const setSidebar = (sidebar: boolean): void => {
  Cookies.set(SIDEBAR_KEY, sidebar ? '1' : '0');
  state.sidebar = sidebar;
};
export const closeSidebar = (): void => setSidebar(false);
export const toggleSidebar = (): void => setSidebar(!state.sidebar);
