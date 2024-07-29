<script setup>
import { ref, reactive, onMounted, inject, onUnmounted, computed, } from "vue";
import * as echarts from "echarts";

import { useLayoutStore } from "~/stores/layoutstore";
import { storeToRefs } from "pinia";

import { ElDropdown, ElDropdownMenu, ElDropdownItem } from "element-plus";

const handleResize = () => {
  width.value = window.innerWidth;
  isCollapse.value = window.innerWidth < 880;
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    window.location.reload();
  }, 500);
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
  initPie();
  initPie1();
  initBar();


});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  if (chartContainer1.value) {
    echarts.dispose(chartContainer1.value);
  }
  if (chartContainer2.value) {
    echarts.dispose(chartContainer2.value);
  }
  if (chartContainer3.value) {
    echarts.dispose(chartContainer3.value);
  }
});

const format = (percentage) => (percentage === 100 ? 'Full' : `${percentage}%`);
const axios = inject("axios");
const store = useLayoutStore();
const { isCollapse } = storeToRefs(store);
const width = ref(window.innerWidth);
const chartContainer1 = ref(null);
const chartContainer2 = ref(null);
const chartContainer3 = ref(null);
const chartContainerHeatmap = ref(null);
const data = [5, 20, 36, 10, 10, 10, 15]
const total = data.reduce((acc, val) => acc + val, 0);
// 柱状图颜色
const getColorForValue = (value) => {
  const percentage = (value / total) * 100;
  if (percentage < 5) {
    return '#c6e2ff'; // 蓝色
  } else if (percentage < 10) {
    return '#d1edc4'; // 青色
  } else if (percentage < 15) {
    return '#95d475'; // 绿色
  } else if (percentage < 25) {
    return '#eebe77'; // 黄色
  } else if (percentage < 35) {
    return '#f89898'; // 浅红色
  } else {
    return '#c45656'; //红色
  }
};
const PieStyle = computed(() => {
  if (width.value < 1260) return '200%';
  else return '100%';
});

const showPie2 = computed(() => {
  return width.value >= 1260; // 当屏幕宽度大于或等于 768px 时显示
});

const PieMargin = computed(() => {
  if (!showPie2.value) {
    if (isCollapse.value) return `${(width.value - 760) * 0.6}px`
    return `${(width.value - 1000) * 0.6}px`;
  }
  return (width.value > 1400 || width.value < 1260) ? '0px' : `${width.value - 1400}px`;
});
// 初始化第一个饼状图
// 已完成的任务数,未完成任务数
const initPie = () => {
  const myPie = echarts.init(chartContainer1.value);
  const option1 = {
    title: {
      text: '任务完成情况',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        name: '任务分类',
        type: 'pie',
        radius: '50%',

        data: [
          { value: 150, name: '已完成任务' },
          { value: 310, name: '未完成任务' },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  myPie.setOption(option1);
};


// 初始化第二个饼状图
// 已完成步骤数,未完成步骤数
const initPie1 = () => {
  const myPie1 = echarts.init(chartContainer2.value);

  const option2 = {
    title: {
      text: '饼图 2',
      subtext: '数据来源于某处',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },

    series: [
      {
        name: '任务分类',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 200, name: '已完成任务' },
          { value: 150, name: '未完成任务' },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  myPie1.setOption(option2);
};

// 柱状图
// 返回一周中每个日期的任务数量
const initBar = () => {
  const myChart = echarts.init(chartContainer3.value);

  const option = {
    title: {
      text: '周任务数量峰值总览'
    },
    tooltip: {},
    xAxis: {
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {},
    series: [{
      name: '任务数量',
      type: 'bar',
      data: data.map(value => ({
        value,
        itemStyle: { color: getColorForValue(value) }
      }))
    }]
  };

  myChart.setOption(option);
};

</script>

<template>
  <div class="charts-container">
    <el-row :gutter="20">
      <el-col :span="12" style="margin-bottom: 20px;">
        <el-card :style="{ width: PieStyle }">
          <div ref="chartContainer1" class="chart" :style="{ marginLeft: PieMargin }"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card v-if=showPie2>
          <div ref="chartContainer2" class="chart" :style="{ marginLeft: PieMargin }"></div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card v-if=!showPie2 :style="{ width: PieStyle }">
          <div ref="chartContainer2" class="chart" :style="{ marginLeft: PieMargin }"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="24">
        <el-card>
          <div ref="chartContainer3" class="chart" style="width: 100%; height: 400px;"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>

</template>

<style scoped>
.charts-container {
  width: 100%;
}

.chart {
  width: 100%;
  height: 400px;
}

@media (max-width: 2000px) {
  .responsive-col {
    width: 100%;
    display: block;
  }
}
</style>
