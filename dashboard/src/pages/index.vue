<script setup>
import { ref } from "vue";
import { Menu as IconMenu, Message, Setting } from "@element-plus/icons-vue";
</script>

<template>
  <el-container class="animate__animated animate__fadeIn">
    <el-header style="text-align: right; font-size: 12px">
      <el-menu
        :default-active="activeIndex"
        mode="horizontal"
        :ellipsis="false"
        @select="handleSelect"
      >
        <el-menu-item index="0">
          <el-icon><ElementPlus /></el-icon>
        </el-menu-item>
        <div class="flex-grow" />
        <el-menu-item index="1">Processing Center</el-menu-item>
        <el-sub-menu index="2">
          <template #title>Workspace</template>
          <el-menu-item index="2-1">item one</el-menu-item>
          <el-menu-item index="2-2">item two</el-menu-item>
          <el-menu-item index="2-3">item three</el-menu-item>
          <el-sub-menu index="2-4">
            <template #title>item four</template>
            <el-menu-item index="2-4-1">item one</el-menu-item>
            <el-menu-item index="2-4-2">item two</el-menu-item>
            <el-menu-item index="2-4-3">item three</el-menu-item>
          </el-sub-menu>
        </el-sub-menu>
      </el-menu>
    </el-header>
    <el-container style="height: 100%">
      <el-aside width="250px">
        <el-scrollbar>
          <el-menu :default-openeds="['1', '3']">
            <el-sub-menu index="1">
              <template #title>
                <el-icon><message /></el-icon>Navigator One
              </template>
              <el-menu-item-group>
                <template #title>Group 1</template>
                <el-menu-item index="1-1">Option 1</el-menu-item>
                <el-menu-item index="1-2">Option 2</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="Group 2">
                <el-menu-item index="1-3">Option 3</el-menu-item>
              </el-menu-item-group>
              <el-sub-menu index="1-4">
                <template #title>Option4</template>
                <el-menu-item index="1-4-1">Option 4-1</el-menu-item>
              </el-sub-menu>
            </el-sub-menu>
            <el-sub-menu index="2">
              <template #title>
                <el-icon><icon-menu /></el-icon>Navigator Two
              </template>
              <el-menu-item-group>
                <template #title>Group 1</template>
                <el-menu-item index="2-1">Option 1</el-menu-item>
                <el-menu-item index="2-2">Option 2</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="Group 2">
                <el-menu-item index="2-3">Option 3</el-menu-item>
              </el-menu-item-group>
              <el-sub-menu index="2-4">
                <template #title>Option 4</template>
                <el-menu-item index="2-4-1">Option 4-1</el-menu-item>
              </el-sub-menu>
            </el-sub-menu>
            <el-sub-menu index="3">
              <template #title>
                <el-icon><setting /></el-icon>Navigator Three
              </template>
              <el-menu-item-group>
                <template #title>Group 1</template>
                <el-menu-item index="3-1">Option 1</el-menu-item>
                <el-menu-item index="3-2">Option 2</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="Group 2">
                <el-menu-item index="3-3">Option 3</el-menu-item>
              </el-menu-item-group>
              <el-sub-menu index="3-4">
                <template #title>Option 4</template>
                <el-menu-item index="3-4-1">Option 4-1</el-menu-item>
              </el-sub-menu>
            </el-sub-menu>
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <el-main>
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
            <el-card class="suggestion">
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
          <el-card class="data-stat">
            text
          </el-card>
          <el-card class="hitoki">
            text
          </el-card>
        </el-row>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.is-selected {
  color: #1989fa;
}
.el-menu {
  border-right: none;
}
.el-calendar-day > p {
  font-size: 14px;
}
:deep(.suggestion > .el-card__body) {
  padding-top: 5px;
}
:deep(.el-collapse) {
  border-top: none;
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
  width: 350px;
  height: 540px;
}
.data-stat {
  margin: 20px 0 0 35px;
  width: 780px;
  height: 200px;
}
.hitoki {
  margin: 20px 0 0 45px;
  width: 350px;
  height: 200px;
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
:deep(.el-calendar-table .el-calendar-day) {
  height: 65px;
}
.animate__animated.animate__fadeInDown {
  --animate-duration: 2s;
}
</style>
