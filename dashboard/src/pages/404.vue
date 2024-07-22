<template>
  <el-col :offset="9" :sm="12" :lg="6">
    <el-result
      icon="warning"
      title="Warning Tip"
      sub-title="Please follow the instructions">
      <template #extra>
        <el-button type="primary" @click="$router.push('/')">Back</el-button>
      </template>
    </el-result>
  </el-col>
</template>
