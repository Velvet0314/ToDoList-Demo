<script setup>
import { ref } from "vue";
import { Menu as IconMenu, Setting, Fold } from "@element-plus/icons-vue";
import { useLayoutStore } from "~/stores/layoutstore";
import { storeToRefs } from "pinia";

const store = useLayoutStore();
const { isCollapse } = storeToRefs(store);
const { toggleCollapse } = store;

const handleSelect = (key, keyPath) => {
  console.log(key, keyPath);
};

const handleOpen = (key, keyPath) => {
  console.log(key, keyPath);
};
const handleClose = (key, keyPath) => {
  console.log(key, keyPath);
};

const format = (percentage) => (percentage === 100 ? "Full" : `${percentage}%`);
</script>

<template>
  <el-container class="animate__animated animate__fadeIn">
    <el-header style="height: 60px; text-align: right; font-size: 12px">
      <el-menu
        :default-active="activeIndex"
        mode="horizontal"
        :ellipsis="false"
        @select="handleSelect"
        class="nav-bar"
        router="true"
      >
        <el-menu-item>
          <el-icon size="100"><ElementPlus /></el-icon>
        </el-menu-item>
        <div class="flex-grow" />
        <el-sub-menu :teleported="true">
          <template #title>
            <el-avatar
              src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            />
          </template>
          <el-menu-item index="settings">
            <el-icon><Setting /></el-icon><span>设置</span>
          </el-menu-item>
          <el-menu-item index="login">
            <el-icon><User /></el-icon><span>登出</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-header>
    <el-container>
      <el-aside
        :width="isCollapse ? '64px' : '250px'"
        :collapse="isCollapse"
        style="
          height: calc(100vh - 60px);
          overflow-y: auto;
          margin-top: 60px;
          position: fixed;
        "
      >
        <el-button
          class="collapse-btn"
          @click="toggleCollapse"
          v-model="isCollapse"
        >
          <el-icon size="18">
            <Fold />
          </el-icon>
        </el-button>
        <el-menu
          default-active="2"
          class="sidebar-collaspe"
          :collapse="isCollapse"
          @open="handleOpen"
          @close="handleClose"
          router="true"
        >
          <el-menu-item index="dashboard">
            <el-icon>
              <Calendar />
            </el-icon>
            <template #title>
              <span>首页</span>
            </template>
          </el-menu-item>
          <el-menu-item index="plan">
            <el-icon><icon-menu /></el-icon>
            <template #title>计划</template>
          </el-menu-item>
          <el-menu-item index="data">
            <el-icon><Histogram /></el-icon>
            <template #title>数据</template>
          </el-menu-item>
          <el-menu-item index="settings">
            <el-icon><User /></el-icon>
            <template #title>用户中心</template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main :class="isCollapse ? 'main-collapsed' : 'main-expanded'">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style>
.el-menu--horizontal .el-menu .el-menu-item,
.el-menu--horizontal .el-menu .el-sub-menu__title {
  margin: 5px auto;
}
</style>
<style scoped>
.is-selected {
  color: #1989fa;
}
.main-expanded {
  margin-left: 250px;
  margin-top: 60px;
  overflow-y: auto;
  height: calc(100vh - 60px);
  position: relative;
  transition: margin-left 0.3s ease;
}
.main-collapsed {
  margin-left: 50px;
  margin-top: 60px;
  overflow-y: auto;
  height: calc(100vh - 60px);
  position: relative;
  transition: margin-left 0.3s ease;
}
.flex-grow {
  flex-grow: 1;
}
.collapse-btn {
  border: none;
  margin: 10px 0 0 8px;
  position: relative;
}
.el-header {
  transition: width 0.3s ease;
  position: fixed;
  width: 100%;
  z-index: 1000;
}
.el-aside {
  transition: width 0.3s ease;
}
.el-main {
  overflow-y: scroll;
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
  margin: 30px 0 0 45px;
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
