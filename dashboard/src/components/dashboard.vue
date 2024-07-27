<script setup>
import { ref, onMounted, onUnmounted, computed, inject } from "vue";
import { useLayoutStore } from "~/stores/layoutstore";
import { storeToRefs } from "pinia";

// 需要的常量
const axios = inject("axios");
const store = useLayoutStore();
const { isCollapse } = storeToRefs(store);
const format = (percentage) => (percentage === 100 ? "Full" : `${percentage}%`);

// hitokoto
const hitokotoText = ref(":D 获取中...");
const hitokotoUrl = ref("#");
const hitokotoFrom = ref("");

onMounted(() => {
  const fetchData = () => {
    axios
      .get("https://v1.hitokoto.cn")
      .then(({ data }) => {
        hitokotoText.value = data.hitokoto;
        hitokotoFrom.value = data.from;
        hitokotoUrl.value = `https://hitokoto.cn/?uuid=${data.uuid}`;
      })
      .catch((error) => {
        console.error(error);
        hitokotoText.value = "加载失败";
        hitokotoFrom.value = "";
        hitokotoUrl.value = "#";
      });
  };

  fetchData();

  const intervalId = setInterval(fetchData, 600000);

  onMounted(() => {
    clearInterval(intervalId);
  });
});

// 响应式布局

const width = ref(window.innerWidth);

const handleResize = () => {
  width.value = window.innerWidth;
  isCollapse.value = window.innerWidth < 900;
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

const showCard = computed(() => {
  return width.value >= 768; // 当屏幕宽度大于或等于 768px 时显示
});

// 日历
const cardStyleC = computed(() => {
  if (isCollapse.value) {
    if (width.value < 600) return `${width.value - 100}px`;
    else if (width.value < 768) return `${width.value - 150}px`;
    else if (width.value < 1024) return "90%";
    else return "80%";
  } else {
    if (width.value < 768)
      return `${width.value * 0.6 * (width.value / 768)}px`;
    else if (width.value < 1024) return "90%";
    else return "80%";
  }
});

// 建议
const cardStyleS = computed(() => {
  if (isCollapse.value) {
    if (width.value < 600) return `${width.value - 100}px`;
    else if (width.value < 768) return `${width.value - 150}px`;
    else if (width.value < 1024) return "90%";
    else return "100%";
  } else {
    if (width.value < 768)
      return `${width.value * 0.6 * (width.value / 768)}px`;
    else if (width.value < 1024) return "90%";
    else return "100%";
  }
});

// 数据分析
const cardStyleD = computed(() => {
  if (isCollapse.value) {
    if (width.value < 600) return `${width.value - 100}px`;
    else if (width.value < 768) return `${width.value - 150}px`;
    else if (width.value < 1024) return "90%";
    else return "100%";
  } else {
    if (width.value < 768)
      return `${width.value * 0.6 * (width.value / 768)}px`;
    else if (width.value < 1024) return "90%";
    else return "100%";
  }
});

// 一言
const cardStyleO = computed(() => {
  if (isCollapse.value) {
    if (width.value < 600) return `${width.value - 100}px`;
    else if (width.value < 768) return `${width.value - 150}px`;
    else if (width.value < 1024) return "90%";
    else return "73%";
  } else {
    if (width.value < 768)
      return `${width.value * 0.6 * (width.value / 768)}px`;
    else if (width.value < 1024) return "90%";
    else return "73%";
  }
});
</script>

<template>
  <el-row :gutter="30" :span="16">
    <el-col :span="16">
      <el-card :style="{ width: cardStyleC }" class="calendar">
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

    <el-col :span="8">
      <el-card
        v-if="showCard"
        class="suggestion"
        :style="{ width: cardStyleS }"
        :collapse="isCollapse"
      >
        <template #header>
          <div class="card-header">
            <span>建议</span>
          </div>
        </template>
        <div>
          <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item title="Consistency" name="1">
              <div>1</div>
            </el-collapse-item>
            <el-collapse-item title="Feedback" name="2">
              <div>2</div>
            </el-collapse-item>
            <el-collapse-item title="Efficiency" name="3">
              <div>3</div>
            </el-collapse-item>
            <el-collapse-item title="Controllability" name="4">
              <div>4</div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-card>
    </el-col>
  </el-row>

  <el-row :gutter="30">
    <el-col :span="12">
      <el-card
        class="data-stat"
        :style="{ width: cardStyleD }"
        :collapse="isCollapse"
      >
        <div class="stat-content">
          <div class="stat-title">数据统计</div>
          <el-progress :percentage="50" />
          <el-progress :percentage="100" :format="format" />
          <el-progress :percentage="100" status="success" />
          <el-progress :percentage="100" status="warning" />
          <el-progress :percentage="50" status="exception" />
        </div>
      </el-card>
    </el-col>

    <el-col :span="12">
      <el-card
        v-if="showCard"
        class="hitokoto-part"
        :class="isCollapse ? 'hitokoto-collapsed' : 'hitokoto-expanded'"
        :collapse="isCollapse"
        :style="{ width: cardStyleO }"
      >
        <div id="hitokoto-title">一言</div>
        <div id="hitokoto-text">
          <a :href="hitokotoUrl">{{ hitokotoText }}</a>
        </div>
        <div v-if="hitokotoFrom" id="hitokoto-from" class="flex flex-col">
          ——&ensp;《{{ hitokotoFrom }}》
        </div>
      </el-card>
    </el-col>
  </el-row>

  <!-- 小页面时在下方展示 -->
  <el-row :gutter="30" :span="16">
    <el-col :span="8">
      <el-card
        v-if="!showCard"
        class="suggestion1"
        :style="{ width: cardStyleS }"
        :collapse="isCollapse"
      >
        <template #header>
          <div class="card-header">
            <span>建议</span>
          </div>
        </template>
        <div>
          <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item title="Consistency" name="1">
              <div>1</div>
            </el-collapse-item>
            <el-collapse-item title="Feedback" name="2">
              <div>2</div>
            </el-collapse-item>
            <el-collapse-item title="Efficiency" name="3">
              <div>3</div>
            </el-collapse-item>
            <el-collapse-item title="Controllability" name="4">
              <div>4</div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-card>
    </el-col>
  </el-row>

  <!-- 小页面时在下方展示 -->
  <el-row>
    <el-col :span="12">
      <el-card
        v-if="!showCard"
        class="hitokoto-part"
        :class="isCollapse ? 'hitokoto-collapsed1' : 'hitokoto-expanded1'"
        :collapse="isCollapse"
        :style="{ width: cardStyleO }"
      >
        <div id="hitokoto-title">一言</div>
        <div id="hitokoto-text">
          <a :href="hitokotoUrl">{{ hitokotoText }}</a>
        </div>
        <div v-if="hitokotoFrom" id="hitokoto-from" class="flex flex-col">
          ——&ensp;《{{ hitokotoFrom }}》
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<style scoped>
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
  font-size: 45px;
  margin-top: -5%;
  letter-spacing: -5px;
  position: absolute;
  top: 12.5%;
  left: 17.5%;
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

.is-selected {
  color: #1989fa;
}

.collapse-btn {
  border: none;
  margin: 10px 0 0 8px;
  position: relative;
}

.el-aside {
  transition: width 0.3s ease;
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
  margin: 0px auto 0 30px;
  height: 470px;
}

.suggestion {
  margin: 0px auto;
  height: 470px;
}

.data-stat {
  margin: 15px auto 0 30px;
  /* 增加上边距 */
  height: 250px;
}

.hitokoto-expanded {
  margin: 15px 0 0 auto;
  /* 增加上边距 */
  height: 250px;
}

.hitokoto-collapsed {
  margin: 15px 0 0 auto;
  /* 增加上边距 */
  height: 250px;
}
/* 缩小时重新生成的格式 */
.suggestion1 {
  margin: 50px 0 0 30px;
  height: 450px;
}
.hitokoto-expanded1 {
  margin: 50px 0 0 30px;
  /* 增加上边距 */
  height: 250px;
}

.hitokoto-collapsed1 {
  margin: 50px 0 0 30px;
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
  max-width: 600px;
}

:deep(.el-calendar-table .el-calendar-day) {
  height: 55px;
}

.animate__animated.animate__fadeInDown {
  --animate-duration: 2s;
}
</style>
