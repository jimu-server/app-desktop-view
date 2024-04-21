<template>
  <div class="fit">
    <q-list>
      <MenuLabel v-for="item in tree" :item="item"/>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {Menu, Tool, Tree} from "@/model/system";
import {useToolStore} from "@/store/tool";
import MenuLabel from "@/components/system-components/tool/manageTool/menu/MenuLabel.vue";

const init = ref()
const props = defineProps<{
  btn: Tool
}>()

const tool = useToolStore()

const tree = ref<Tree<Menu>[]>(tool.buttons_router[props.btn.id])
console.log(tree.value)

</script>


<style scoped>

</style>