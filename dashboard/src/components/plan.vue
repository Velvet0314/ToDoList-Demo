<script setup>
import { Menu as IconMenu, Setting, Fold } from "@element-plus/icons-vue";
</script>

<template>
  <el-row>
    <el-col :lg="24">
      <el-scrollbar class="content">
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
      </el-scrollbar>
    </el-col>
  </el-row>
</template>
<style scoped></style>
