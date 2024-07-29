import { defineStore } from "pinia";

export const useTaskSelectStore = defineStore("taskSelect", {
  state: () => {
    kind: ''
  },
  actions: {
    setKind(kind) {
        this.kind = kind;
    },
  },
  persist: true,
});
