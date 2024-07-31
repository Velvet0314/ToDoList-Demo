import { defineStore } from "pinia";

export const useTaskStarStore = defineStore("task", {
  state: () => ({
    tasks: [], // 任务id数组
    stars: {}, // 存储每个任务的星标状态
  }),
  actions: {
    toggleStar(taskId) {
      if (!this.tasks.includes(taskId)) {
        this.tasks.push(taskId);
        this.stars[taskId] = false;
      }
      this.stars[taskId] = !this.stars[taskId];
    },
  },
  persist: true,
});
