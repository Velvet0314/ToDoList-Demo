<script setup>
import { Menu as IconMenu, Setting, Fold } from "@element-plus/icons-vue";
import {
  Delete,
  Edit,
  Search,
  Share,
  Upload,
  More,
} from "@element-plus/icons-vue";
import { ref, reactive, onMounted, inject, onUnmounted, computed } from "vue";
import { ElDropdown, ElDropdownMenu, ElDropdownItem } from "element-plus";
import { storeToRefs } from "pinia";
import { ElButton, ElPopover, ElDatePicker } from "element-plus";

import { useLayoutStore } from "~/stores/layoutstore";
import { useTokenStore } from "~/stores/tokenstore";
import { useStepsStore } from "~/stores/stepstore";
import { useTaskCheckStore } from "~/stores/taskcheckstore";
import { useTaskStarStore } from "~/stores/taskstarstore";
import { useTaskSelectStore } from "~/stores/taskselectstore";

const axios = inject("axios");
const store = useLayoutStore();
const stepsStore = useStepsStore();
const taskStarStore = useTaskStarStore();
const taskCheckStore = useTaskCheckStore();
const taskSelectStore = useTaskSelectStore();
const { isCollapse } = storeToRefs(store);
const inputSearch = ref("");
const tasksList = reactive([]);

// 页面大小小于一定大小时自动收缩侧边栏
const handleResize = () => {
  width.value = window.innerWidth;
  // 当宽度小于 900px 时，设置为收缩状态
  if (width.value < 950) {
    isCollapse.value = true;
  } else if (width.value >= 950 && width.value <= 1000) {
    isCollapse.value = false;
  }
};

const width = ref(window.innerWidth);

const showCard = computed(() => {
  return width.value >= 950; // 当屏幕宽度大于或等于 800px 时显示
});

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

const cardStyleList = computed(() => {
  if (width.value < 950) {
    return "450%";
  }
  if (!showDetailCard.value && !showEditCard.value) {
    return "400%";
  } else if (showDetailCard.value && !showEditCard.value) {
    return "100%";
  } else {
    return "100%";
  }
});

const cardStyleDetail = computed(() => {
  if (!showDetailCard.value && !showEditCard.value) {
    return "0px";
  } else if (showDetailCard.value && !showEditCard.value) {
    return "230%";
  } else {
    return "100%";
  }
});

const cardStyleEdit = computed(() => {
  if (!showDetailCard.value && !showEditCard.value) {
    return "0px";
  } else if (showDetailCard.value && !showEditCard.value) {
    return "0px";
  } else {
    return "100%";
  }
});

const cardStyleTask = computed(() => {
  if (!showDetailCard.value && !showEditCard.value) return "0px";
  else return "100%";
});

const inputStyle = computed(() => {
  return width.value < 1024 ? "50%" : "75%";
});

const showEditCard = ref(false); // 用于控制编辑卡片的显示
const showDetailCard = ref(true);

// 核心功能

const kindChoose = (kind) => {
  showDetailCard.value = true; // 显示详情界面

  const tokenStore = useTokenStore();
  const token = tokenStore.token;
  switch (kind) {
    case 1:
      {
        axios
          .get("/task/getTodayTask", {
            headers: {
              Authorization: token,
            },
          })
          .then((response) => {
            console.log(response.data.info);
            let taskArray = [];
            taskArray = response.data.info;
            tasksList.splice(0, tasksList.length);
            for (let i = 0; i < taskArray.length; i++) {
              tasksList.push(taskArray[i]);
            }
            taskSelectStore.setKind(1);
          });
      }
      break;

    case 2:
      {
        axios
          .get("/task/getAllTasks", {
            headers: {
              Authorization: token,
            },
          })
          .then((response) => {
            console.log(response.data.info);
            let taskArray = [];
            taskArray = response.data.info;
            tasksList.splice(0, tasksList.length);

            for (let i = 0; i < taskArray.length; i++) {
              tasksList.push(taskArray[i]);
            }
            taskSelectStore.setKind(2);
          });
      }
      break;

    case 3:
      {
        axios
          .get("/task/getAllUnfinishedTasks", {
            headers: {
              Authorization: token,
            },
          })
          .then((response) => {
            console.log(response.data.info);
            let taskArray = [];
            taskArray = response.data.info;
            tasksList.splice(0, tasksList.length);

            for (let i = 0; i < taskArray.length; i++) {
              tasksList.push(taskArray[i]);
            }
            taskSelectStore.setKind(3);
          });
      }
      break;

    case 4:
      {
        axios
          .get("/task/getAllFinishedTasks", {
            headers: {
              Authorization: token,
            },
          })
          .then((response) => {
            console.log(response.data.info);
            let taskArray = [];
            taskArray = response.data.info;
            tasksList.splice(0, tasksList.length);

            for (let i = 0; i < taskArray.length; i++) {
              tasksList.push(taskArray[i]);
            }
            taskSelectStore.setKind(4);
          });
      }
      break;

    case 5:
      {
        axios
          .get("/task/getAllFavourTasks", {
            headers: {
              Authorization: token,
            },
          })
          .then((response) => {
            console.log(response.data.info);
            let taskArray = [];
            taskArray = response.data.info;
            tasksList.splice(0, tasksList.length);

            for (let i = 0; i < taskArray.length; i++) {
              tasksList.push(taskArray[i]);
            }
            taskSelectStore.setKind(5);
          });
      }
      break;
    default:
      {
      }
      break;
  }
};

const addNewTask = async () => {
  tasksList.splice(0, tasksList.length);
  // 获取token,通过验证
  const tokenStore = useTokenStore();
  const token = tokenStore.token;
  console.log(token);

  // 前端发送请求
  try {
    await axios
      .post("/task/add", tasksList, {
        headers: {
          Authorization: token,
        },
      })
      // 处理后端返回的值
      .then((response) => {
        let taskArray = [];
        taskArray = response.data.info;
        for (let i = 0; i < taskArray.length; i++) {
          tasksList.push(taskArray[i]);
        }
        console.log(tasksList);
        // console.log(tasksList[0]); // 输出第一个任务
        // console.log(tasksList[0].task_name); // 输出第一个任务的名称
      });

    // 获取当前新增的任务
    // tasksList.id = infoArray[infoArray.length - 1].id;
    // console.log(tasksList.id);
  } catch (error) {}
};

const deleteTask = async (task, kind) => {
  const tokenStore = useTokenStore();
  const token = tokenStore.token;
  console.log(token);
  tasksList.splice(0, tasksList.length);
  try {
    // 发送删除请求到后端，这里假设后端提供了一个删除任务的API
    await axios
      .put(
        `/task/deleteTask?id=${encodeURIComponent(task.id)}`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        switch (kind) {
          case 1:
            {
              axios
                .get("/task/getTodayTask", {
                  headers: {
                    Authorization: token,
                  },
                })
                .then((response) => {
                  console.log(response.data.info);
                  let taskArray = [];
                  taskArray = response.data.info;
                  for (let i = 0; i < taskArray.length; i++) {
                    tasksList.push(taskArray[i]);
                  }
                });
            }
            break;

          case 2:
            {
              axios
                .get("/task/getAllTasks", {
                  headers: {
                    Authorization: token,
                  },
                })
                .then((response) => {
                  console.log(response.data.info);
                  let taskArray = [];
                  taskArray = response.data.info;
                  tasksList.splice(0, tasksList.length);

                  for (let i = 0; i < taskArray.length; i++) {
                    tasksList.push(taskArray[i]);
                  }
                });
            }
            break;

          case 3:
            {
              axios
                .get("/task/getAllUnfinishedTasks", {
                  headers: {
                    Authorization: token,
                  },
                })
                .then((response) => {
                  console.log(response.data.info);
                  let taskArray = [];
                  taskArray = response.data.info;
                  tasksList.splice(0, tasksList.length);

                  for (let i = 0; i < taskArray.length; i++) {
                    tasksList.push(taskArray[i]);
                  }
                });
            }
            break;

          case 4:
            {
              axios
                .get("/task/getAllFinishedTasks", {
                  headers: {
                    Authorization: token,
                  },
                })
                .then((response) => {
                  console.log(response.data.info);
                  let taskArray = [];
                  taskArray = response.data.info;
                  tasksList.splice(0, tasksList.length);

                  for (let i = 0; i < taskArray.length; i++) {
                    tasksList.push(taskArray[i]);
                  }
                });
            }
            break;

          case 5:
            {
              axios
                .get("/task/getAllFavourTasks", {
                  headers: {
                    Authorization: token,
                  },
                })
                .then((response) => {
                  console.log(response.data.info);
                  let taskArray = [];
                  taskArray = response.data.info;
                  tasksList.splice(0, tasksList.length);

                  for (let i = 0; i < taskArray.length; i++) {
                    tasksList.push(taskArray[i]);
                  }
                });
            }
            break;
          default:
            {
            }
            break;
        }
      });
  } catch (error) {
    console.error("Failed to delete task", error);
  }
};

const selectedTask = ref(null); // 选中的任务
const selectedTaskSteps = reactive([]); // 选中的任务的所有步骤

const taskDetail = async (task) => {
  showEditCard.value = true; // 显示编辑界面
  selectedTask.value = task; // 设置选中的任务
  console.log(selectedTask.value);
  const tokenStore = useTokenStore();
  const token = tokenStore.token;
  console.log(token);

  try {
    await axios
      .post(
        "/step/getAllStep",
        { task_id: task.id },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        selectedTaskSteps.values = response.data.info;
        console.log(selectedTaskSteps.values);
      });
  } catch (error) {}
};

const saveTaskName = async () => {
  const tokenStore = useTokenStore();
  const token = tokenStore.token;
  console.log(token);

  console.log(selectedTaskSteps.values);
  console.log(selectedTask.value);
  try {
    await axios
      .put("/task/updateTask", selectedTask.value, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        console.log(response.data);
        if (!response.data.code) {
          // 在本地任务列表中找到并更新任务
          const index = tasksList.findIndex(
            (task) => task.id === selectedTask.value.id
          );
          if (index !== -1) {
            tasksList[index] = { ...tasksList[index], ...selectedTask.value };
          }
          console.log("Task updated successfully in the local list.");
        } else {
          console.error(
            "Failed to update task on server: ",
            response.data.message
          );
        }
      });
  } catch (error) {}
};

const saveSteps = async () => {
  const tokenStore = useTokenStore();
  const token = tokenStore.token;
  console.log(token);

  try {
    await axios
      .put("/step/updateStep", selectedTaskSteps.values, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        console.log(response.data);
      });
  } catch (error) {}
};

const addNewStep = async () => {
  const tokenStore = useTokenStore();
  const token = tokenStore.token;
  console.log(token);

  // 准备新步骤的基本信息
  const newStep = {
    sequence: selectedTaskSteps.values.length + 1, // 假设 sequence 是基于数组长度
    content: "", // 初始内容为空
  };

  try {
    // 直接在添加后获取新步骤列表，以确保数据的完整性和正确性
    const addResponse = await axios.post(
      `/step/addNewStep?task_id=${encodeURIComponent(selectedTask.value.id)}`,
      newStep,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    console.log("Step added response:", addResponse.data);

    // 重新获取所有步骤，确保列表完整性
    const allStepsResponse = await axios.post(
      "/step/getAllStep",
      { task_id: selectedTask.value.id },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (allStepsResponse.data.info) {
      selectedTaskSteps.values = allStepsResponse.data.info; // 更新步骤列表
      console.log("Updated steps:", selectedTaskSteps.values);
    }
  } catch (error) {
    console.error("Error adding new step:", error);
  }
};

const deleteStep = async (step) => {
  const tokenStore = useTokenStore();
  const token = tokenStore.token;
  console.log(token);

  console.log(step.id);
  try {
    await axios
      .put(
        `/step/deleteStep?step_id=${encodeURIComponent(step.id)}`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        // console.log(response.data.info);
        selectedTaskSteps.values = response.data.info;
        console.log(selectedTaskSteps);
      });
  } catch (error) {}
};

const stepCompletedOrNot = async (step) => {
  const tokenStore = useTokenStore();
  const token = tokenStore.token;
  try {
    const response = await axios.put(
      `/step/finishStep?step_id=${encodeURIComponent(step.id)}`,
      {},
      {
        headers: {
          Authorization: token,
        },
      }
    );
    selectedTaskSteps.values = response.data.info;
    console.log(selectedTaskSteps.values);
  } catch (error) {
    console.error("Failed to update step status:", error);
  }
};

const taskFavourOrNot = async (task) => {
  const tokenStore = useTokenStore();
  const token = tokenStore.token;

  try {
    const response = await axios.put(
      `/task/favourTask?task_id=${encodeURIComponent(task.id)}`,
      {},
      {
        headers: {
          Authorization: token,
        },
      }
    );
    console.log(response.data);
    taskStarStore.toggleStar(task.id);
  } catch (error) {
    console.error("Failed to update task favour status:", error);
  }
};

const taskCompleteOrNot = async (task) => {
  const tokenStore = useTokenStore();
  const token = tokenStore.token;

  try {
    const response = await axios.put(
      `/task/finishTask?task_id=${encodeURIComponent(task.id)}`,
      {},
      {
        headers: {
          Authorization: token,
        },
      }
    );
    selectedTaskSteps.values = response.data.info;
    console.log(selectedTaskSteps.values);
  } catch (error) {
    console.error("Failed to update task favour status:", error);
  }
};

const taskSearch = async (text) => {
  const tokenStore = useTokenStore();
  const token = tokenStore.token;
  console.log(text);
  try {
    axios
      .post(
        "/task/search",
        { taskName: text },
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((response) => {
        console.log(response.data.info);
        let taskArray = [];
        taskArray = response.data.info;
        tasksList.splice(0, tasksList.length);

        for (let i = 0; i < taskArray.length; i++) {
          tasksList.push(taskArray[i]);
        }
      });
  } catch (error) {}
};

const shortcuts = [
  {
    text: "今日",
    value: new Date(),
  },
  {
    text: "明日",
    value: () => {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      return date;
    },
  },
  {
    text: "一周后",
    value: () => {
      const date = new Date();
      date.setDate(date.getDate() + 7);
      return date;
    },
  },
];

const setEndTime = async (task) => {
  const tokenStore = useTokenStore();
  const token = tokenStore.token;
  await taskDetail(task);
  try {
    await axios
      .put("/task/updateTask", task, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        console.log(response.data);
        if (!response.data.code) {
          // 在本地任务列表中找到并更新任务
          const index = tasksList.findIndex(
            (task) => task.id === selectedTask.value.id
          );
          if (index !== -1) {
            tasksList[index] = { ...tasksList[index], ...selectedTask.value };
          }
          console.log("Task updated successfully in the local list.");
        } else {
          console.error(
            "Failed to update task on server: ",
            response.data.message
          );
        }
      });
  } catch (error) {}
};
</script>

<template>
  <el-row gutter="30" class="full-height">
    <el-col :span="6" class="full-height">
      <el-card
        :style="{ width: cardStyleList, height: '100%' }"
        class="full-height animate__animated animate__fadeInLeft"
      >
        <el-scrollbar class="content">
          <el-collapse v-model="activeNames" @change="handleChange">
            <div class="input-button-wrapper">
              <el-input
                v-model="inputSearch"
                :style="{ width: inputStyle }"
                placeholder="请输入任务名称"
                @keyup.enter="taskSearch(inputSearch)"
              >
                <template #prefix>
                  <el-icon class="el-input__icon">
                    <search />
                  </el-icon>
                </template>
              </el-input>
            </div>
            <div class="cards-wrapper">
              <el-card
                class="task-card cursor-pointer animate__animated animate__fadeInLeft"
                shadow="hover"
              >
                <div @click="kindChoose(1)">我的一天</div>
              </el-card>
              <el-card
                class="task-card cursor-pointer animate__animated animate__fadeInLeft"
                shadow="hover"
              >
                <div @click="kindChoose(2)">全部</div>
              </el-card>
              <el-card
                class="task-card cursor-pointer animate__animated animate__fadeInLeft"
                shadow="hover"
              >
                <div @click="kindChoose(3)">未完成</div>
              </el-card>
              <el-card
                class="task-card cursor-pointer animate__animated animate__fadeInLeft"
                shadow="hover"
              >
                <div @click="kindChoose(4)">已完成</div>
              </el-card>
              <el-card
                class="task-card cursor-pointer animate__animated animate__fadeInLeft"
                shadow="hover"
              >
                <div @click="kindChoose(5)">重要</div>
              </el-card>
            </div>
          </el-collapse>
        </el-scrollbar>
      </el-card>
    </el-col>

    <!-- 详细内容 -->
    <el-col v-if="showCard && showDetailCard" :span="8" class="full-height">
      <el-card
        :style="{ width: cardStyleDetail, height: '100%' }"
        style="max-height: 88vh; overflow: hidden"
        class="animate__animated animate__fadeInLeft"
      >
        <div class="button-wrapper">
          <el-button round @click="addNewTask"
            ><el-icon> <Plus /> </el-icon
          ></el-button>
          <el-button :icon="Edit" round @click="showEditCard = true">
          </el-button>
          <el-button
            round
            @click="(showDetailCard = false), (showEditCard = false)"
            ><el-icon> <CloseBold /> </el-icon
          ></el-button>
        </div>
        <el-scrollbar style="max-height: 86vh; overflow-y: auto">
          <div
            class="my-10 task-item w-[100%] animate__animated animate__fadeInLeft"
            v-for="task in tasksList"
            :key="task.id"
          >
            <div style="display: flex; align-items: center">
              <el-card
                class="task-card"
                :style="{ width: cardStyleTask, height: '100%' }"
                @click="taskDetail(task)"
                shadow="hover"
              >
                <div style="font-size: 16px">
                  {{ task.task_name }}
                </div>
                <div class="flex">
                  <el-date-picker
                    v-model="task.end_time"
                    type="date"
                    placeholder="设置截止时间"
                    :shortcuts="shortcuts"
                    @change="setEndTime(task)"
                  />
                </div>
              </el-card>
              <el-dropdown
                trigger="click"
                placement="bottom-end"
                class="w-auto"
              >
                <el-button
                  type="text"
                  icon="MoreFilled"
                  style="border: none; box-shadow: none; margin-left: 10px"
                ></el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click.native="markAsCompleted(task)"
                      >标记为已完成</el-dropdown-item
                    >
                    <el-dropdown-item @click.native="markAsCompleted(task)"
                      >标记为重要</el-dropdown-item
                    >
                    <el-dropdown-item
                      divided
                      @click.native="deleteTask(task, taskSelectStore.kind)"
                      >删除任务</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </el-scrollbar>
      </el-card>
    </el-col>

    <!-- 新开的编辑页面 -->
    <el-col v-if="showCard && showEditCard" :span="10" class="full-height">
      <el-card
        :style="{ width: cardStyleEdit }"
        class="animate__animated animate__fadeInLeft"
      >
        <div class="button-wrapper">
          <el-button round @click="showEditCard = !showEditCard"
            ><el-icon> <CloseBold /> </el-icon
          ></el-button>
        </div>
        <el-scrollbar style="max-height: 86vh; overflow-y: auto">
          <el-collapse>
            <el-collapse-item name="1">
              <template #title>
                <el-input
                  placeholder="输入标题"
                  v-model="selectedTask.task_name"
                  @input="saveTaskName"
                  style="font-size: 18px"
                  class="editable-title my-10"
                >
                  <template #prefix>
                    <el-checkbox
                      :model-value="taskCheckStore.taskStatus[selectedTask.id]"
                      @update:model-value="
                        (newStatus) =>
                          taskCheckStore.setTaskStatus(
                            selectedTask.id,
                            newStatus
                          )
                      "
                      @change="taskCompleteOrNot(selectedTask)"
                      size="large"
                    />
                  </template>
                </el-input>
                <el-icon
                  @click.stop="taskFavourOrNot(selectedTask)"
                  :style="{
                    cursor: 'pointer',
                    border: 'none',
                    boxShadow: 'none',
                    padding: '0',
                    width: '28px',
                    height: '28px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }"
                  class="star-icon"
                >
                  <template v-if="taskStarStore.stars[selectedTask.id]">
                    <StarFilled style="color: gold" />
                  </template>
                  <template v-else>
                    <Star style="width: 18px; height: 18px" />
                  </template>
                </el-icon>
              </template>
              <div
                v-for="step in selectedTaskSteps.values"
                :key="step.sequence"
              >
                <el-input
                  placeholder="输入内容"
                  v-model="step.content"
                  @input="saveSteps"
                >
                  <template #prefix>
                    <el-checkbox
                      :model-value="stepsStore.stepsStatus[step.id]"
                      @update:model-value="
                        (newStatus) =>
                          stepsStore.setStepStatus(step.id, newStatus)
                      "
                      size="large"
                      @change="stepCompletedOrNot(step)"
                    />
                  </template>
                  <template #append>
                    <el-dropdown placement="bottom-end">
                      <el-button
                        type="text"
                        icon="MoreFilled"
                        style="border: none; box-shadow: none"
                      >
                      </el-button>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item
                            @click.native="markAsCompleted(step)"
                            >标记为已完成</el-dropdown-item
                          >
                          <el-dropdown-item
                            divided
                            @click.native="deleteStep(step)"
                            >删除步骤</el-dropdown-item
                          >
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                  </template>
                </el-input>
              </div>
              <el-button
                @click="addNewStep"
                style="margin-top: 10%; border: none"
                ><el-icon> <Plus /> </el-icon
                ><span style="margin-left: 8px">下一步</span></el-button
              >
            </el-collapse-item>
          </el-collapse>
        </el-scrollbar>
      </el-card>
    </el-col>
  </el-row>
</template>

<style scoped>
:deep(.el-input-group__append) {
  padding: 0;
}

.step-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  /* 根据需要调整间隔 */
}

.step-options-button {
  cursor: pointer;
}

.task-item {
  padding: 10px;
  /* 添加内边距使得布局更加美观 */
  border-bottom: 1px solid #ccc;
  /* 添加分隔线 */
  transition: background-color 0.3s;
  /* 平滑过渡效果 */
  cursor: pointer;
  margin-bottom: 5px;
}

.full-height {
  height: 100%;
}

.input-button-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.button-wrapper {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  /* 调整按钮之间的间距 */
}

:deep(.el-input__wrapper) {
  box-shadow: none;
  border: none;
  /* border-bottom: 1.75px solid #cccccc; */
  border-radius: 0px;
}

.detailCard {
  margin-left: -100px;
}

.editCard {
  margin-right: auto;
}

.button-wrapper {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-bottom: 18px;
  /* 调整按钮之间的间距 */
}

.add-button {
  margin-left: auto;
}

.button-container {
  text-align: right;
  /* 使内容靠右对齐 */
}

.input-button-wrapper {
  margin-bottom: 20px;
  /* 设置输入框和卡片之间的间隔 */
}

.cards-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  /* 设置卡片之间的间隔 */
}

.task-card {
  height: 60px;
  /* 设置每个卡片的高度 */
  backdrop-filter: blur(5px);
  /* 添加背景虚化效果 */
  background-color: rgba(255, 255, 255, 0.5);
  /* 需要设置背景颜色，并带有透明度 */
  border: 1px solid rgba(255, 255, 255, 0.3);
  /* 可选，增加一个边框使效果更明显 */
}

.task-card:hover {
  background-color: #e4e7ed;
  /* 鼠标悬停时的背景颜色 */
}

.half-height {
  height: 50%;
}

.star-icon {
  font-size: 24px;
  width: auto;
  margin-right: 10px;
}
</style>
