import { defineStore } from 'pinia'

export const useStepsStore = defineStore('steps', {
  state: () => ({
    stepsStatus: {}  // 存储步骤的完成状态
  }),
  actions: {
    setStepStatus(stepId, status) {
      this.stepsStatus[stepId] = status;
    }
  },
  persist: true,
});
