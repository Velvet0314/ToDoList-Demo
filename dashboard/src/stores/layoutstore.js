import { defineStore } from "pinia";

export const useLayoutStore = defineStore("layout", {
  state: () => {
    return {
      isCollapse: false,
    };
  },
  actions: {
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
  },
});
