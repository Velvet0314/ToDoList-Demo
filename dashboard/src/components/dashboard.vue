<script setup>
import { ref, onMounted ,inject } from "vue";
import { useLayoutStore } from "~/stores/layoutstore";
import { storeToRefs } from "pinia";
const axios = inject("axios");

const store = useLayoutStore();
const { isCollapse } = storeToRefs(store);

const format = (percentage) => (percentage === 100 ? "Full" : `${percentage}%`);

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

  const intervalId = setInterval(fetchData, 60000);

  onMounted(() => {
    clearInterval(intervalId);
  });
});
</script>

<template>
  <el-row :gutter="30" :span="16">
    <el-col :span="16">
      <el-card class="calendar">
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
        class="suggestion"
        :style="{ width: isCollapse ? '400px' : '350px' }"
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
  <el-row :gutter="30" :span="8">
    <el-card
      class="data-stat"
      :style="{ width: isCollapse ? '900px' : '770px' }"
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
    <el-card
      class="hitokoto-part"
      :class="isCollapse ? 'hitokoto-collapsed' : 'hitokoto-expanded'"
      :collapse="isCollapse"
    >
      <div id="hitokoto-title">一言</div>
      <div id="hitokoto-text">
        <a :href="hitokotoUrl">{{ hitokotoText }}</a>
      </div>
      <div v-if="hitokotoFrom" id="hitokoto-from" class="flex flex-col">
        ——&ensp;《{{ hitokotoFrom }}》
      </div>
    </el-card>
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
  margin: 10px 0 0 20px;
}
.suggestion {
  margin: 10px 20px auto auto;
  height: 490px;
}
.data-stat {
  margin: 30px 0 0 35px;
  height: 250px;
}
.hitokoto-expanded {
  width: 350px;
  margin: 30px 0 0 40px;
  height: 250px;
}

.hitokoto-collapsed {
  width: 400px;
  margin: 30px 0 0 60px;
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
