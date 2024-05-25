<template>
  <el-menu style="user-select: none">
    <template v-for="item in menus">
      <ElSubMenuLabel v-if="item.children.length>0" :menu="item"/>
      <ElMenuLabel v-else :menu="item"/>
    </template>
  </el-menu>
</template>
<script setup lang="ts">
import {Router, Tree} from "@/components/system-components/model/system";
import ElSubMenuLabel from "@/components/system-components/tool/manageTool/menu/ElSubMenuLabel.vue";

const props = defineProps<{
  menus: Tree<Router>[]
}>()
</script>


<style scoped>

</style>