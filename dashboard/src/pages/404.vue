<template>
  <el-col :offset="9" :sm="12" :lg="6">
    <el-result
      icon="warning"
      title="404"
      sub-title="PAGE NOT FOUND">
      <template #extra>
        <el-button type="primary" @click="$router.push('/')">Back</el-button>
      </template>
    </el-result>
  </el-col>
</template>
