<script setup>
const format = (percentage) => (percentage === 100 ? 'Full' : `${percentage}%`);

</script>
<template>
  <div class="demo-progress">
    <el-progress type="circle" :percentage="0" />
    <el-progress type="circle" :percentage="25" />
    <el-progress type="circle" :percentage="100" status="success" />
    <el-progress type="circle" :percentage="70" status="warning" />
    <el-progress type="circle" :percentage="50" status="exception" />
  </div>
  <div class="demo-progress">
    <el-progress :percentage="50" :indeterminate="true" />
    <el-progress :percentage="100" :format="format" :indeterminate="true" />
    <el-progress
      :percentage="100"
      status="success"
      :indeterminate="true"
      :duration="5"
    />
    <el-progress
      :percentage="100"
      status="warning"
      :indeterminate="true"
      :duration="1"
    />
    <el-progress :percentage="50" status="exception" :indeterminate="true" />
  </div>
</template>

<style scoped>
.demo-progress .el-progress--circle {
  margin-right: 15px;
  margin-bottom: 50px;
}
.demo-progress .el-progress--line {
    margin-bottom: 15px;
    max-width: 600px;
}
</style>