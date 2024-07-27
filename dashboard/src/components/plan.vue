<script setup>
import { Menu as IconMenu, Setting, Fold } from "@element-plus/icons-vue";
import { Delete, Edit, Search, Share, Upload } from "@element-plus/icons-vue";
import { ref, reactive, onMounted, inject, onUnmounted, computed } from "vue";
import { useLayoutStore } from "~/stores/layoutstore";
import { storeToRefs } from "pinia";
import { useTokenStore } from "~/stores/tokenstore";
import { ta } from "element-plus/es/locale/index.mjs";

const format = (percentage) => (percentage === 100 ? "Full" : `${percentage}%`);

const axios = inject("axios");
const store = useLayoutStore();
const { isCollapse } = storeToRefs(store);
const selectedContent = ref(null); // 选中的任务

const todayTasks = reactive([]);

// 页面大小小于一定大小时自动收缩侧边栏
const handleResize = () => {
  width.value = window.innerWidth;
  isCollapse.value = window.innerWidth < 800;
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

const showEditCard = ref(false); // 用于控制编辑卡片的显示
const showDetailCard = ref(false);
const tasks = reactive([]); // 用于存储所有任务

const handleItemClick = (task) => {
  showEditCard.value = true; // 显示编辑界面
  selectedContent.value = task; // 设置当前选中的任务
};

const addNewTask = async () => {
  showDetailCard.value = true;
  showEditCard.value = true;

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
        console.log(todayTasks[0]); // 输出第一个任务
        console.log(todayTasks[0].task_name); // 输出第一个任务的名称
      });

    // 获取当前新增的任务
    // todayTasks.id = infoArray[infoArray.length - 1].id;
    // console.log(todayTasks.id);
  } catch (error) {}
};

const handleClose1Click = () => {
  showDetailCard.value = false;
  showEditCard.value = false;
};

const cardStyleDetail = computed(() => {
  if (isCollapse.value) {
    if (width.value < 600) return `${width.value - 100}px`;
    else if (width.value < 1024) return `${width.value - 150}px`;
    else return "100%";
  } else {
    if (width.value < 800)
      return `${width.value * 0.6 * (width.value / 768)}px`;
    else if (width.value < 1024) return "90%";
    else return "100%";
  }
});

const cardStyleList = computed(() => {
  if (isCollapse.value) {
    if (width.value < 600) return `${width.value - 100}px`;
    else if (width.value < 1024) return `${width.value - 150}px`;
    else return "100%";
  } else {
    if (width.value < 800)
      return `${width.value * 0.6 * (width.value / 768)}px`;
    else if (width.value < 1024) return `${width.value - 300}px`;
    else return "100%";
  }
});

const inputStyle = computed(() => {
  return "75%";
});

const firstColSpan = computed(() => {
  if (showDetailCard.value) {
    if (showEditCard.value) return 10;
    else return 12;
  } else {
    return 24;
  }
});

const secondColSpan = computed(() => {
  if (showDetailCard.value) {
    if (showEditCard.value) return 8;
    else return 12;
  } else {
    return 0;
  }
});

const thirdColSpan = computed(() => {
  return showEditCard.value ? 6 : 0;
});

const collapseData = reactive({
  open: true, // 折叠栏是否打开
  title: "新任务", // 折叠栏的标题
  contents: [{ id: Date.now(), value: "" }], // 初始包含一个输入框
});

// 点击下一步添加新的输入框
const addNewInput = (task) => {
  task.contents.push({ id: Date.now(), value: "" });
};

const saveTitle = async () => {
  try {
    await axios.post("/save-title", { title: collapseData.title });
    console.log("Title saved successfully");
  } catch (error) {
    console.error("Failed to save title", error);
  }
};

const saveContent = async (content, task) => {
  try {
    await axios.post("/save-content", { title: task.title, content });
    console.log("Content saved successfully");
    task.detail = content; // 更新本地的详细内容
  } catch (error) {
    console.error("Failed to save content", error);
  }
};
</script>

<template>
  <el-row gutter="30" class="full-height">
    <el-col :span="firstColSpan" class="full-height">
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
              <el-button type="primary" round @click="addNewTask"
                >新增</el-button
              >
            </div>
            <el-collapse-item title="全部" name="1">
              <div @click="handleItemClick(1)">1</div>
            </el-collapse-item>
            <el-collapse-item title="未完成" name="2">
              <div @click="handleItemClick(2)">2</div>
            </el-collapse-item>
            <el-collapse-item title="已完成" name="3">
              <div @click="handleItemClick(3)">3</div>
            </el-collapse-item>
            <el-collapse-item title="重要" name="4">
              <div @click="handleItemClick(4)">4</div>
            </el-collapse-item>
          </el-collapse>
        </el-scrollbar>
      </el-card>
    </el-col>

    <!-- 详细内容 -->
    <el-col :span="secondColSpan" class="full-height">
      <el-card
        v-if="showCard && showDetailCard"
        :style="{ width: cardStyleDetail, height: '100%' }"
      >
        <div class="button-wrapper">
          <el-button type="primary" round @click="handleClose1Click"
            >关闭</el-button
          >
        </div>
        <div v-if="todayTasks.length === 0">
          <el-empty description="暂无内容" />
        </div>
        <div
          v-else
          class="my-10"
          v-for="task in todayTasks"
        >
          {{ task.task_name }}
          <!-- 确保使用正确的属性来显示任务名称 -->
        </div>
      </el-card>
    </el-col>

    <!-- 新开的编辑页面 -->
    <el-col
      v-if="showCard && showEditCard"
      :span="thirdColSpan"
      class="full-height"
    >
      <el-card style="max-height: 88vh; overflow: hidden">
        <el-scrollbar style="max-height: 86vh; overflow-y: auto">
          <el-collapse>
            <el-collapse-item name="1">
              <template #title>
                <el-input
                  placeholder="输入标题"
                  @blur="saveTitle"
                  size="small"
                  class="editable-title my-10"
                />
              </template>
              <div>
                <el-input
                  placeholder="输入内容"
                  @blur="() => saveContent(item.value, selectedContent)"
                />
              </div>
              <el-button @click="() => addNewInput(selectedContent)"
                >下一步</el-button
              >
            </el-collapse-item>
          </el-collapse>
        </el-scrollbar>
      </el-card>
    </el-col>
  </el-row>
</template>

<style scoped>
.full-height {
  height: 100%;
}

.input-button-wrapper {
  display: flex;
  align-items: center;
  gap: 5%;
  /* 调整输入框与按钮之间的间距 */
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
</style>
