<script setup>
import { ref, onMounted, onUnmounted, computed, inject, reactive } from "vue";
import dayjs from "dayjs";
import { Calendar } from "@element-plus/icons-vue";
import { useLayoutStore } from "~/stores/layoutstore";
import { useTokenStore } from "~/stores/tokenstore";
import getTaskStats from "~/api/getTaskStats";
import { storeToRefs } from "pinia";

// 需要的常量
const axios = inject("axios");
const store = useLayoutStore();
const { isCollapse } = storeToRefs(store);
const format = (percentage) => (percentage === 100 ? "Full" : `${percentage}%`);

import { useHitokotoStore } from "~/stores/hitokoto";

const tokenStore = useTokenStore();
const token = tokenStore.token;
const hitokoto = useHitokotoStore();
const suggestionList = reactive([]);

const value2 = ref(dayjs().add(1, "month").startOf("month"));

const countDown = ref("");
const taskStats = ref({});

onMounted(async () => {
  if (!hitokoto.text) {
    hitokoto.fetchData();
  }
  const info = await getTaskStats(tokenStore, axios);
  taskStats.value = info;
  suggestions();
  getLastestTask();
});
const width = ref(window.innerWidth);

const handleResize = () => {
  width.value = window.innerWidth;
  isCollapse.value = window.innerWidth < 1024;
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

const showCard = computed(() => {
  return width.value >= 1024; // 当屏幕宽度大于或等于 768px 时显示
});

// 日历
const cardStyleC = computed(() => {
  return { width: width.value >= 1024 ? "100%" : "160%", marginRight: "20px" };
});

// 建议
const cardStyleS = computed(() => {
  return { width: "100%", marginRight: "20px" };
});

// 数据分析
const cardStyleD = computed(() => {
  return { width: width.value >= 1024 ? "100%" : "160%", marginRight: "20px" };
});

// 一言
const cardStyleO = computed(() => {
  return { width: "100%", marginRight: "20px" };
});

const suggestions = async () => {
  const tokenStore = useTokenStore();
  const token = tokenStore.token;

  try {
    axios
      .get("/task/getAllOrderedTasks", {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        suggestionList.splice(0, suggestionList.length, ...response.data.info);
        console.log(suggestionList);
      });
  } catch (error) {}
};

const getLastestTask = async () => {
  const tokenStore = useTokenStore();
  const token = tokenStore.token;

  try {
    axios
      .get("/task/getEndtime", {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        console.log(response.data.info);
        countDown.value = new Date(response.data.info);
      });
  } catch (error) {}
};
</script>

<template>
  <transition name="custom-animations">
    <div class="animate__animated animate__bounceInLeft">
      <el-row :gutter="30">
        <el-col :span="15">
          <el-card :style="cardStyleC" class="calendar">
            <div class="main-title">我的一天</div>
            <el-calendar>
              <template #date-cell="{ data }">
                <p :class="data.isSelected ? 'is-selected' : ''">
                  {{ data.day.split("-").slice(2).join("-") }}
                  {{ data.isSelected ? "✔️" : "" }}
                </p>
              </template>
            </el-calendar>
          </el-card>
        </el-col>

        <el-col :span="9">
          <el-card
            v-if="showCard"
            class="suggestion"
            :style="cardStyleS"
            :collapse="isCollapse"
          >
            <template #header>
              <div class="card-header">
                <span>建议</span>
              </div>
            </template>
            <el-scrollbar style="max-height: 52.5vh; overflow-y: auto">
              <div
                v-for="task in suggestionList"
                :key="task.id"
                class="w-[100%] cursor-pointer"
                @click="$router.push('/plan')"
              >
                <div style="display: flex; align-items: center">
                  <el-card
                    class="task-card"
                    shadow="hover"
                    :style="{ width: '200%' }"
                  >
                    <div style="font-size: 16px">
                      {{ task.task_name }}
                    </div>
                  </el-card>
                </div>
              </div>
            </el-scrollbar>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="30">
        <el-col :span="15">
          <el-card class="data-stat" :style="cardStyleD" :collapse="isCollapse">
            <div class="stat-content">
              <div class="stat-title" style="margin-bottom: 1.2%">提醒</div>
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: flex-start;
                  margin-bottom: 1.2%;
                "
              >
                <div style="flex: 1; text-align: center">
                  <div
                    style="
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                      margin-top: 3%;
                    "
                  >

                    <div
                      style="
                        display: flex;
                        align-items: center;
                        margin-bottom: 5%;
                        font-size: 16px;
                      "
                    >
                    <el-icon style="margin-right: 4px" :size="18">
                      <Calendar />
                    </el-icon>
                      距最近未完成任务的截至时间还剩
                    </div>
                    <el-countdown
                      format="DD [days] HH:mm:ss"
                      :value="countDown"
                      style="margin-bottom: 5%"
                    ></el-countdown>
                    <div class="countdown-footer">
                      {{ dayjs(countDown).format("YYYY-MM-DD") }}
                    </div>
                  </div>
                </div>
                <div style="flex: 1; text-align: center; margin-top: 0.8%">
                  <div>未完成任务数</div>
                  <div>{{ taskStats.allUnfinishedTasksCount }}</div>
                </div>
                <div style="flex: 1; text-align: center; margin-top: 0.8%">
                  <div style="margin-bottom: 15%">未完成任务平均进度</div>
                  <div>
                    {{
                      (taskStats.avgProcessOfUnfinishedTasks * 100).toFixed(2)
                    }}
                    %
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="9">
          <el-card
            v-if="showCard"
            class="hitokoto-part"
            :class="isCollapse ? 'hitokoto-collapsed' : 'hitokoto-expanded'"
            :collapse="isCollapse"
            :style="cardStyleO"
          >
            <div id="hitokoto-title">一言</div>
            <div id="hitokoto-text">
              <a :href="hitokoto.url">{{ hitokoto.text }}</a>
            </div>
            <div v-if="hitokoto.from" id="hitokoto-from" class="flex flex-col">
              ——&ensp;《{{ hitokoto.from }}》
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 小页面时在下方展示 -->
      <el-row :gutter="30" :span="16">
        <el-col :span="23" :style="{ marginRight: 'auto' }">
          <el-card
            v-if="!showCard"
            class="suggestion1"
            :style="cardStyleS"
            :collapse="isCollapse"
          >
            <template #header>
              <div class="card-header">
                <span>建议</span>
              </div>
            </template>
            <el-scrollbar style="max-height: 52.5vh; overflow-y: auto">
              <div
                v-for="task in suggestionList"
                :key="task.id"
                class="w-[100%] cursor-pointer"
                @click="$router.push('/plan')"
              >
                <div style="display: flex; align-items: center">
                  <el-card
                    class="task-card"
                    shadow="hover"
                    :style="{ width: '200%' }"
                  >
                    <div style="font-size: 16px">
                      {{ task.task_name }}
                    </div>
                  </el-card>
                </div>
              </div>
            </el-scrollbar>
          </el-card>
        </el-col>
      </el-row>

      <!-- 小页面时在下方展示 -->
      <el-row>
        <el-col :span="23">
          <el-card
            v-if="!showCard"
            class="hitokoto-part"
            :class="isCollapse ? 'hitokoto-collapsed1' : 'hitokoto-expanded1'"
            :collapse="isCollapse"
            :style="cardStyleO"
          >
            <div id="hitokoto-title">一言</div>
            <div id="hitokoto-text">
              <a :href="hitokoto.url">{{ hitokoto.text }}</a>
            </div>
            <div v-if="hitokoto.from" id="hitokoto-from" class="flex flex-col">
              ——&ensp;《{{ hitokoto.from }}》
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </transition>
</template>

<style scoped>
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

.hitokoto-part {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 100%;
}

#hitokoto-title {
  font-family: "hito-font";
  font-size: 300%;
  margin-top: 0%;
  letter-spacing: -5px;
  position: absolute;
  top: 7%;
  left: 12.5%;
  transform: translateX(-50%);
}

#hitokoto-text {
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "hito-font";
  line-height: 30px;
  font-size: 28px;
  letter-spacing: -2px;
  margin: 20px 5px 5px 5px;
  width: 100%;
}

#hitokoto-from {
  font-family: "hito-font";
  font-size: 26px;
  letter-spacing: -2px;
  text-align: right;
  width: 100%;
}

.el-calendar-day > p {
  font-size: 13px;
}

:deep(.suggestion > .el-card__body) {
  padding-top: 5px;
}

:deep(.el-collapse) {
  border-top: none;
}

:deep(.sidebar-collaspe:not(.el-menu--collapse)) {
  width: 250px;
}

:deep(.el-collapse-item__header) {
  border-bottom: none;
}

:deep(.el-collapse-item__wrap) {
  border-bottom: none;
}

:deep(.el-collapse-item__content) {
  padding-bottom: 10px;
}

:deep(.el-calendar__body) {
  padding: 12px 20px 20px;
}

.calendar {
  margin-bottom: 30px;
  margin-right: 100px;
  height: 550px;
}

.suggestion {
  margin-bottom: 30px;
  margin-right: 100px;
  height: 550px;
}

.data-stat {
  margin-bottom: 30px;
  margin-right: 100px;
  /* 增加上边距 */
  height: 250px;
}

.hitokoto-expanded {
  margin-bottom: 30px;
  margin-right: 100px;
  /* 增加上边距 */
  height: 250px;
}

.hitokoto-collapsed {
  margin-bottom: 30px;
  margin-right: 100px;
  /* 增加上边距 */
  height: 250px;
}

/* 缩小时重新生成的格式 */
.suggestion1 {
  margin-bottom: 30px;
  margin-right: 100px;
  height: 450px;
}

.hitokoto-expanded1 {
  margin-bottom: 30px;
  margin-right: 100px;
  /* 增加上边距 */
  height: 250px;
}

.hitokoto-collapsed1 {
  margin-bottom: 30px;
  /* 增加上边距 */
  height: 250px;
}

.card-header {
  font-size: 20px;
}

.main-title {
  margin: 5px auto;
  padding: 0 0 0 20px;
  font-size: 20px;
  overflow: auto;
}

.stat-title {
  font-size: 18px;
  margin-bottom: 15px;
}

.stat-content .el-progress--line {
  margin-bottom: 15px;
}

:deep(.el-calendar-table .el-calendar-day) {
  height: 55px;
}
</style>
