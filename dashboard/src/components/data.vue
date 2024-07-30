<script setup>
import {
  ref,
  onMounted,
  onUnmounted,
  computed,
  inject,
  watch,
  reactive,
} from "vue";
import * as echarts from "echarts";
import { useTokenStore } from "~/stores/tokenstore";
import { useLayoutStore } from "~/stores/layoutstore";
import { storeToRefs } from "pinia";
import { toRaw } from "vue";
import getTaskStats from "~/api/getTaskStats";
import { ElStatistic } from "element-plus";
import { TransitionPresets, useTransition } from "@vueuse/core";

const axios = inject("axios");
const store = useLayoutStore();
const { isCollapse } = storeToRefs(store);
const width = ref(window.innerWidth);

const taskStats = ref({});

const chartContainer1 = ref(null);
const chartContainer2 = ref(null);
const chartContainer3 = ref(null);
const chartContainer4 = ref(null);
const tokenStore = useTokenStore();

const weekValue = reactive([]);
const data = [1, 2, 3, 3, 4, 5, 6];
const total = data.reduce((acc, val) => acc + val, 0);
const showCard = computed(() => {
  return width.value >= 880; // 当屏幕宽度大于或等于 768px 时显示
});
const PieStyle = computed(() => {
  if (width.value > 880) return "100%";
  else return "250%";
});

const getColorForValue = (value) => {
  const percentage = (value / total) * 100;
  if (percentage < 5) {
    return "#c6e2ff"; // 蓝色
  } else if (percentage < 10) {
    return "#d1edc4"; // 青色
  } else if (percentage < 15) {
    return "#95d475"; // 绿色
  } else if (percentage < 25) {
    return "#eebe77"; // 黄色
  } else if (percentage < 35) {
    return "#f89898"; // 浅红色
  } else {
    return "#c45656"; // 红色
  }
};

const handleResize = () => {
  width.value = window.innerWidth;
  isCollapse.value = window.innerWidth < 880;
  updateCharts();
};

const getPieOptions = () => {
  const doneTasknum = taskStats.value.allFinishedTasksCount;
  const undoneTasknum =
    taskStats.value.allTasksCount - taskStats.value.allFinishedTasksCount;
  return {
    title: {
      text: "任务完成情况",
      left: "center",
    },
    tooltip: {
      trigger: "item",
    },
    series: [
      {
        name: "任务分类",
        type: "pie",
        radius: "50%",
        data: [
          { value: doneTasknum, name: "已完成任务" },
          { value: undoneTasknum, name: "未完成任务" },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };
};

const updatePieChart = () => {
  const chart =
    echarts.getInstanceByDom(chartContainer1.value) ||
    echarts.init(chartContainer1.value);
  chart.setOption(getPieOptions(), true);
};

const getRadarOptions = () => {
  const avgDonerate_task = taskStats.value.avgProcessOfUnfinishedTasks;
  const stepCompletionRate = taskStats.value.stepCompletionRate;
  const taskCompletionRate = taskStats.value.taskCompletionRate;
  return {
    title: {
      text: "任务统计",
      left: "center",
    },
    tooltip: {},
    legend: {
      data: ["Rates"],
      top: "bottom",
    },
    radar: {
      center: ["50%", "55%"],
      indicator: [
        { name: "任务完成率", max: 1 },
        { name: "未完成任务平均进度", max: 1 },
        { name: "步骤完成率", max: 1 },
      ],
    },
    series: [
      {
        name: "任务完成情况",
        type: "radar",
        data: [
          {
            value: [taskCompletionRate, avgDonerate_task, stepCompletionRate],
            name: "Rate",
            itemStyle: { color: "#1eb84a" },
            areaStyle: { color: "rgba(140, 255, 152, 0.7)" },
          },
        ],
      },
    ],
  };
};

const updateRadarChart1 = () => {
  const chart =
    echarts.getInstanceByDom(chartContainer2.value) ||
    echarts.init(chartContainer2.value);
  chart.setOption(getRadarOptions(), true);
};

const updateRadarChart2 = () => {
  const chart =
    echarts.getInstanceByDom(chartContainer4.value) ||
    echarts.init(chartContainer4.value);
  chart.setOption(getRadarOptions(), true);
};

const getBarOptions = () => {
  const weekData = toRaw(weekValue); // 使用 toRaw 获取非响应性数据
  console.log(weekData);
  return {
    title: {
      text: "周任务数量峰值总览",
    },
    tooltip: {},
    xAxis: {
      data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    },
    yAxis: {
      type: "value",
      min: 0,
      max: "dataMax",
    },
    series: [
      {
        name: "任务数量",
        type: "bar",
        data: weekData.map((value) => ({
          value,
          itemStyle: { color: getColorForValue(value) },
        })),
      },
    ],
  };
};

const updateBarChart = () => {
  const chart =
    echarts.getInstanceByDom(chartContainer3.value) ||
    echarts.init(chartContainer3.value);
  chart.setOption(getBarOptions(), true); // 使用 true 来清除之前的配置
};


const updateCharts = () => {
  [chartContainer1, chartContainer2, chartContainer3, chartContainer4].forEach(
    (containerRef) => {
      if (containerRef.value) {
        const myChart = echarts.getInstanceByDom(containerRef.value);
        if (myChart) {
          myChart.resize();
        }
      }
    }
  );
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  [chartContainer1, chartContainer2, chartContainer3, chartContainer4].forEach(
    (containerRef) => {
      if (containerRef.value) {
        const myChart = echarts.getInstanceByDom(containerRef.value);
        if (myChart) {
          echarts.dispose(myChart);
        }
      }
    }
  );
});

const getTasksByWeek = async () => {
  const tokenStore = useTokenStore();
  const token = tokenStore.token;

  try {
    axios
      .get("/task/getTaskCountByWeek", {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        console.log(response.data.info);
        const values = Object.values(response.data.info);

        weekValue.splice(0, weekValue.length, ...values); // 替换现有数据以触发更新
        console.log("Updated weekValue:", toRaw(weekValue));
        updateBarChart(); // 确保这里更新图表
      });
  } catch (error) {}
};

// 初始化源数据和输出动画数据
const sourceAllTasks = ref(0);
const outputAllTasks = useTransition(sourceAllTasks, {
  duration: 1500,
  transition: TransitionPresets.ease,
});

const sourceAllDoneTasks = ref(0);
const outputAllDoneTasks = useTransition(sourceAllDoneTasks, {
  duration: 1500,
  transition: TransitionPresets.ease,
});

const sourceAllSteps = ref(0);
const outputAllSteps = useTransition(sourceAllSteps, {
  duration: 1500,
  transition: TransitionPresets.ease,
});

const sourceAllDoneSteps = ref(0);
const outputAllDoneSteps = useTransition(sourceAllDoneSteps, {
  duration: 1500,
  transition: TransitionPresets.ease,
});

onMounted(async () => {
  const info = await getTaskStats(tokenStore, axios);
  taskStats.value = info;
  await getTasksByWeek();
  updateBarChart();
  updatePieChart();
  updateRadarChart1();
  updateRadarChart2();
  updateBarChart();
  setTimeout(() => {
    sourceAllTasks.value = taskStats.value.allTasksCount;
    sourceAllDoneTasks.value = taskStats.value.allFinishedTasksCount;
    sourceAllSteps.value = taskStats.value.allStepsCount;
    sourceAllDoneSteps.value = taskStats.value.allFinishedStepsCount;
  }, 500);
});
</script>

<template>
  <el-card style="margin-bottom: 20px">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="never" style="border: none">
          <el-statistic title="总任务数" :value="outputAllTasks" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never" style="border: none">
          <el-statistic title="任务完成数" :value="outputAllDoneTasks" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never" style="border: none">
          <el-statistic title="总步骤数" :value="outputAllSteps" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never" style="border: none">
          <el-statistic title="步骤完成数" :value="outputAllDoneSteps" />
        </el-card>
      </el-col>
    </el-row>
  </el-card>
  <div class="charts-container">
    <el-row :gutter="20" style="margin-bottom: 20px">
      <el-col :span="10">
        <el-card :style="{ width: PieStyle, 'margin-right': 'auto' }">
          <div ref="chartContainer1" class="chart"></div>
        </el-card>
      </el-col>

      <el-col v-show="showCard" :span="14">
        <el-card>
          <div ref="chartContainer2" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-bottom: 20px">
      <el-col v-show="!showCard" :span="24">
        <el-card>
          <div
            ref="chartContainer4"
            class="chart"
            style="width: 100%; height: 400px"
          ></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-bottom: 20px">
      <el-col :span="24">
        <el-card>
          <div
            ref="chartContainer3"
            class="chart"
            style="width: 100%; height: 400px"
          ></div>
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
</style>
