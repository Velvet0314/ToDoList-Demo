import { defineStore } from "pinia";

export const useTaskCheckStore = defineStore("taskCheck", {
  state: () => ({
    taskStatus: {}  // 存储任务的完成状态
  }),
  actions: {
    setTaskStatus(taskId, status) {
      this.taskStatus[taskId] = status;
    }
  },
  persist: true,
});
