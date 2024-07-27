<script setup>
import { ref, reactive, onMounted, inject, onUnmounted, computed } from "vue";
import { useLayoutStore } from "~/stores/layoutstore";
import { storeToRefs } from "pinia";

const format = (percentage) => (percentage === 100 ? 'Full' : `${percentage}%`);

const axios = inject("axios");

// 页面大小小于一定大小时自动收缩侧边栏
const handleResize = () => {
  width.value = window.innerWidth;
  isCollapse.value = window.innerWidth < 768;
};

const store = useLayoutStore();
const { isCollapse } = storeToRefs(store);

const width = ref(window.innerWidth);

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});


const circleSize = computed(() => {
  // if (isCollapse.value) {
  //   if (width.value < 600) return `${width.value * 0.6 * (width.value / 768)}`;
  //   else if (width.value < 768) return `${width.value * 0.6 * (width.value / 768)}`;
  //   else if (width.value < 1024) return `${width.value * 0.6 * (width.value / 768)}`;
  //   else return `${width.value * 0.6 * (width.value / 768)}`;
  // } else {
  //   if (width.value < 768) return `${width.value * 0.6 * (width.value / 768)}`;
  //   else if (width.value < 1024) return `${width.value * 0.6 * (width.value / 768)}`;
  //   else return `${width.value * 0.6 * (width.value / 768)}`;
  // }
  if (width.value < 600) return `${(width.value)/4}`;
  else if (width.value < 768) return `${(width.value)/4.5}`;
  else if (width.value < 1024) return `${(width.value)/4}`;
  else return `${(width.value-800)/5 }`;
});

const StylePro = computed(() => {
  if (isCollapse.value) {
    if (width.value < 600) return `${width.value - 100}px`;
    else if (width.value < 768) return `${width.value - 150}px`;
    else if (width.value < 1024) return '90%';
    else return '100%';
  } else {
    if (width.value < 768) return `${width.value * 0.6 * (width.value / 768)}px`;
    else if (width.value < 1024) return '90%';
    else return '100%';
  }
});
</script>

<template>
   <el-row>
    <el-col :span="6">
      <el-statistic title="Daily active users" :value="268500" />
    </el-col>
    <el-col :span="6">
      <el-statistic :value="138">
        <template #title>
          <div style="display: inline-flex; align-items: center">
            Ratio of men to women
            <el-icon style="margin-left: 4px" :size="12">
              <Male />
            </el-icon>
          </div>
        </template>
        <template #suffix>/100</template>
      </el-statistic>
    </el-col>
    <el-col :span="6">
      <el-statistic title="Total Transactions" :value="outputValue" />
    </el-col>
    <el-col :span="6">
      <el-statistic title="Feedback number" :value="562">
        <template #suffix>
          <el-icon style="vertical-align: -0.125em">
            <ChatLineRound />
          </el-icon>
        </template>
      </el-statistic>
    </el-col>
  </el-row>
  <el-row :gutter="30" :span="24" class="row-spacing">
    <el-col >
      <div v-if="1" class="demo-progress" :style="{ width: StylePro }">
        <el-progress v-if="1" type="circle" :percentage="0" :width="circleSize"/>
        <el-progress v-if="1" type="circle" :percentage="25" :width="circleSize"/>
        <el-progress v-if="1" type="circle" :percentage="100" status="success" :width="circleSize"/>
        <el-progress v-if="1" type="circle" :percentage="70" status="warning" :width="circleSize"/>
        <el-progress v-if="1" type="circle" :percentage="50" status="exception" :width="circleSize"/>
      </div>
    </el-col>
  </el-row>
  <el-row :gutter="30" :span="24" class="row-spacing">
    <el-col :span="12">
      <div v-if="1" class="demo-progress">
        <el-progress class="progress-bar" :percentage="50" :indeterminate="true" />
        <el-progress class="progress-bar" :percentage="100" :format="format" :indeterminate="true" />
        <el-progress class="progress-bar" :percentage="100" status="success" :indeterminate="true" :duration="5" />
        <el-progress class="progress-bar" :percentage="100" status="warning" :indeterminate="true" :duration="1" />
        <el-progress class="progress-bar" :percentage="50" status="exception" :indeterminate="true" />
      </div>
    </el-col>
  </el-row>
</template>

<style scoped>
.demo-progress {
 
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
}

.demo-progress .el-progress--circle {
  margin: 50px;
  width: 150px; /* 调整这个值以改变圆形进度条的大小 */
  height: 150px; /* 调整这个值以改变圆形进度条的大小 */
}

.demo-progress .progress-bar {
  margin-bottom: 20px; /* 调整这个值以改变条形进度条之间的间距 */
}

.row-spacing {
  margin-bottom: 50px; /* 调整这个值以设置行之间的间距 */
}
</style>
