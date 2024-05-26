<template>
  <div class="fit">
    <ElMenuTree :menus="tree"/>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {Router, Tool, Tree} from "@/components/system-components/model/system";
import {useToolStore} from "@/store/tool";
import MenuLabel from "@/components/system-components/tool/manageTool/menu/MenuLabel.vue";

const init = ref()
const props = defineProps<{
  btn: Tool
}>()

const tool = useToolStore()

const tree = ref<Tree<Router>[]>(tool.buttons_router[props.btn.id])
console.log(tree.value)

</script>


<style scoped>

</style>
<style>
.el-menu{
  border-style: none !important;
}
</style>