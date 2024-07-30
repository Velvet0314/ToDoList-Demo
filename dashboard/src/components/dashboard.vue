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
  return { width: width.value >= 1024 ? '100%' : '160%', marginRight: '20px' };
});

// 建议
const cardStyleS = computed(() => {
  return { width: '100%', marginRight: '20px' };
});

// 数据分析
const cardStyleD = computed(() => {
  return { width: width.value >= 1024 ? '100%' : '160%', marginRight: '20px' };
});

// 一言
const cardStyleO = computed(() => {
  return { width: '100%', marginRight: '20px' };
});
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
          <el-card v-if="showCard" class="suggestion" :style="cardStyleS" :collapse="isCollapse">
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
        <el-col :span="15">
          <el-card class="data-stat" :style="cardStyleD" :collapse="isCollapse">
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

        <el-col :span="9">
          <el-card v-if="showCard" class="hitokoto-part"
            :class="isCollapse ? 'hitokoto-collapsed' : 'hitokoto-expanded'" :collapse="isCollapse" :style="cardStyleO">
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
        <el-col :span="23" :style="{ marginRight: 'auto' }">
          <el-card v-if="!showCard" class="suggestion1" :style="cardStyleS" :collapse="isCollapse">
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
        <el-col :span="23">
          <el-card v-if="!showCard" class="hitokoto-part"
            :class="isCollapse ? 'hitokoto-collapsed1' : 'hitokoto-expanded1'" :collapse="isCollapse"
            :style="cardStyleO">
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
    </div>
  </transition>
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

.el-calendar-day>p {
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