import { defineStore } from "pinia";

export const useTaskCheckStore = defineStore("taskCheck", {
  state: () => ({
    tasks: [], // 任务id数组
    complete: {}, // 存储每个任务的完成状态
  }),
  actions: {
    toggleComplete(taskId) {
      // 检查任务ID是否已存在于tasks数组中
      if (!this.tasks.includes(taskId)) {
        this.tasks.push(taskId); // 添加任务ID到数组
        this.complete[taskId] = false; // 初始化该任务的完成状态为false
      } else {
        this.complete[taskId] = !this.complete[taskId]; // 切换现有任务的完成状态
      }
    },
  },
  persist: true,
});
