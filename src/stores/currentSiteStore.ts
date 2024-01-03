import { defineStore } from 'pinia';

export const useCurrentSiteStore = defineStore('ujcmsCurrentSiteStore', {
  state: () => ({
    currentSiteId: null as number | null,
    currentSite: null as any,
  }),
  actions: {
    getCurrentSiteId() {
      return this.currentSiteId;
    },
    setCurrentSiteId(currentSiteId: number | null) {
      this.currentSiteId = currentSiteId;
    },
  },
  persist: {
    paths: ['currentSiteId'],
    storage: sessionStorage,
  },
});
