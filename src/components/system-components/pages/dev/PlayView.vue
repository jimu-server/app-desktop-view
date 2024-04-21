<template>
  <el-card class="box-card">
    <el-radio-group v-model="value">
      <el-radio value="10" size="large" border>10</el-radio>
      <el-radio value="20" size="large" border>20</el-radio>
    </el-radio-group>

  </el-card>
</template>

<script setup lang="ts">
import {ref} from "vue";

const value = ref()
</script>

<style scoped>
.box-card {
  width: 500px;
  height: 300px;
}
</style>
