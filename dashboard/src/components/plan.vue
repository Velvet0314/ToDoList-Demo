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
import { useLayoutStore } from "~/stores/layoutstore";
import { storeToRefs } from "pinia";
import { useTokenStore } from "~/stores/tokenstore";
import { ElDropdown, ElDropdownMenu, ElDropdownItem } from "element-plus";

const format = (percentage) => (percentage === 100 ? "Full" : `${percentage}%`);

const axios = inject("axios");
const store = useLayoutStore();
const { isCollapse } = storeToRefs(store);
const input = ref('');
const todayTasks = reactive([]);

// 页面大小小于一定大小时自动收缩侧边栏
const handleResize = () => {
  width.value = window.innerWidth;
  // 当宽度小于 900px 时，设置为收缩状态
  if (width.value < 900) {
    isCollapse.value = true;
  } else if (width.value >= 900 && width.value <= 950) {
    isCollapse.value = false;
  }
};

const width = ref(window.innerWidth);

const showCard = computed(() => {
  return width.value >= 1024; // 当屏幕宽度大于或等于 800px 时显示
});

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

const handleItemClick = (task) => {
  showDetailCard.value = true; // 显示详情界面
};

const showEditCard = ref(false); // 用于控制编辑卡片的显示
const showDetailCard = ref(true);

const getAllTodayTask = async () => {
  const tokenStore = useTokenStore(); // 确保获取最新的 token
  const token = tokenStore.token;

  axios
    .get("/task/getTodayTask", {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => {
      console.log(response.data.info);
      let taskArray = response.data.info;

      // 清空当前任务列表，避免重复添加
      todayTasks.splice(0, todayTasks.length);

      // 填充任务列表
      for (let i = 0; i < taskArray.length; i++) {
        todayTasks.push(taskArray[i]);
      }

      // 根据任务列表的内容决定是否显示详情卡片
      showDetailCard.value = true;
    })
    .catch((error) => {
      console.error("Failed to fetch today's tasks:", error);
    });
};

onMounted(() => {
  getAllTodayTask(); // 调用函数获取今天的任务
});

const addNewTask = async () => {
  todayTasks.splice(0, todayTasks.length);
  // 获取token,通过验证
  const tokenStore = useTokenStore();
  const token = tokenStore.token;
  console.log(token);

  // 前端发送请求
  try {
    await axios
      .post("/task/add", todayTasks, {
        headers: {
          Authorization: token,
        },
      })
      // 处理后端返回的值
      .then((response) => {
        let taskArray = [];
        taskArray = response.data.info;
        for (let i = 0; i < taskArray.length; i++) {
          todayTasks.push(taskArray[i]);
        }
        console.log(todayTasks);
        // console.log(todayTasks[0]); // 输出第一个任务
        // console.log(todayTasks[0].task_name); // 输出第一个任务的名称
      });

    // 获取当前新增的任务
    // todayTasks.id = infoArray[infoArray.length - 1].id;
    // console.log(todayTasks.id);
  } catch (error) {}
};

const deteleTask = async (task, kind) => {
  const tokenStore = useTokenStore();
  const token = tokenStore.token;
  console.log(token);
  todayTasks.splice(0, todayTasks.length);
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
          case 5:
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
                    todayTasks.push(taskArray[i]);
                  }
                });
            }
            break;

          case 4:
            {
            }
            break;

          case 3:
            {
            }
            break;

          case 2:
            {
            }
            break;

          case 1:
            {
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

const cardStyleList = computed(() => {
  if (width.value < 900) {
    return isCollapse.value ? "450%" : "200px"; // 收缩时宽度为 500px，展开时为 100%
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

const inputStyle = computed(() => {
  return width.value < 1024 ? "50%" : "75%";
});

const selectedTask = ref(null); // 选中的任务
const selectedContent = reactive([]); // 选中的任务

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
        selectedContent.values = response.data.info;
        console.log(selectedContent.values);
      });
  } catch (error) {}
};

const saveTaskName = async () => {
  const tokenStore = useTokenStore();
  const token = tokenStore.token;
  console.log(token);

  try {
    await axios
      .put("/task/updateTask", selectedTask.value, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        // console.log(response.data);
      });
  } catch (error) {}
};

const saveSteps = async () => {
  const tokenStore = useTokenStore();
  const token = tokenStore.token;
  console.log(token);

  try {
    await axios
      .put("/step/updateStep", selectedContent.values, {
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
    sequence: selectedContent.values.length + 1, // 假设 sequence 是基于数组长度
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
      selectedContent.values = allStepsResponse.data.info; // 更新步骤列表
      console.log("Updated steps:", selectedContent.values);
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
        console.log(response);
      });
  } catch (error) {}
};
</script>

<template>
  <el-row gutter="30" class="full-height">
    <el-col :span="6" class="full-height">
      <el-card
        :style="{ width: cardStyleList, height: '100%' }"
        class="full-height"
      >
        <el-scrollbar class="content">
          <el-collapse v-model="activeNames" @change="handleChange">
            <div class="input-button-wrapper">
              <el-input
                v-model="input"
                :style="{ width: inputStyle }"
                placeholder="请输入"
              />
            </div>
            <div class="cards-wrapper">
              <el-card class="task-card cursor-pointer" shadow="hover">
                <div @click="handleItemClick(1)">全部</div>
              </el-card>
              <el-card class="task-card cursor-pointer" shadow="hover">
                <div @click="handleItemClick(2)">未完成</div>
              </el-card>
              <el-card class="task-card cursor-pointer" shadow="hover">
                <div @click="handleItemClick(3)">已完成</div>
              </el-card>
              <el-card class="task-card cursor-pointer" shadow="hover">
                <div @click="handleItemClick(4)">重要</div>
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
            class="my-10 task-item"
            v-for="task in todayTasks"
            :key="task.id"
          >
            <el-dropdown trigger="contextmenu" placement="bottom-start">
              <div class="w-[100%]" @click="taskDetail(task)">
                {{ task.task_name }}
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>标记为重要</el-dropdown-item>
                  <el-dropdown-item>标记为已完成</el-dropdown-item>
                  <el-dropdown-item divided @click.native="deteleTask(task, 5)">
                    删除任务
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-scrollbar>
      </el-card>
    </el-col>

    <!-- 新开的编辑页面 -->
    <el-col v-if="showCard && showEditCard" :span="10" class="full-height">
      <el-card :style="{ width: cardStyleEdit }">
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
                  @blur="saveTaskName"
                  size="small"
                  class="editable-title my-10"
                />
              </template>
              <div v-for="step in selectedContent.values" :key="step.sequence">
                <el-input
                  placeholder="输入内容"
                  v-model="step.content"
                  @blur="saveSteps"
                >
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
              <el-button type="primary" @click="addNewStep">下一步</el-button>
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
  gap: 10px; /* 根据需要调整间隔 */
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
}

.task-item:hover {
  background-color: #cccccc;
  /* 悬浮时的背景颜色 */
  cursor: pointer;
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
  margin-bottom: 20px; /* 设置输入框和卡片之间的间隔 */
}

.cards-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px; /* 设置卡片之间的间隔 */
}

.task-card {
  height: 60px; /* 设置每个卡片的高度 */
  backdrop-filter: blur(5px); /* 添加背景虚化效果 */
  background-color: rgba(
    255,
    255,
    255,
    0.5
  ); /* 需要设置背景颜色，并带有透明度 */
  border: 1px solid rgba(255, 255, 255, 0.3); /* 可选，增加一个边框使效果更明显 */
}
.task-card:hover {
  background-color: #e4e7ed; /* 鼠标悬停时的背景颜色 */
}
</style>
