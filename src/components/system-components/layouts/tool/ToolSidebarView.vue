<template>
  <div :class="position==ToolLayout.Left?layout_l:layout_r" style="flex: 1;overflow: hidden">
    <div class="full-width ellipsis" style="padding: 5px;overflow: hidden">
      {{ toolCtx.name }}
    </div>
    <div class="full-width" style="flex-grow: 1;overflow: auto">
      <component :is="toolCtx.component" :btn="toolCtx"/>
    </div>
  </div>
</template>
<script setup lang="ts">
import {useToolStore} from "@/store/tool";
import {Tool} from "@/components/system-components/model/system";
import {ToolLayout} from "@/components/system-components/model/menu";
import {ref, watch} from "vue";
import {useThemeStore} from "@/store/theme";


const tool = useToolStore()
const theme = useThemeStore()
const props = defineProps<{
  toolCtx: Tool
  position: ToolLayout
}>()

let layout_l = ref(['fit', 'column', 'l_tool', 'tool_body'])
let layout_r = ref(['fit', 'column', 'r_tool', 'tool_body'])

watch(() => theme.dark, (value) => {
  let byClassName = document.getElementsByClassName('tool_body');
  if (value) {
    for (let i = 0; i < byClassName.length; i++) {
      byClassName[i].setAttribute("theme", "dark")
    }
  } else {
    for (let i = 0; i < byClassName.length; i++) {
      byClassName[i].setAttribute("theme", "light")
    }
  }
})

</script>


<style scoped>
.l_tool {
  border-left: 1px solid rgba(0, 0, 0, 0.12);
}

.r_tool {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}

.l_tool[theme=dark] {
  border-left: 1px solid rgba(0, 0, 0, 0.12);
  border-color: rgba(255, 255, 255, 0.28);
}

.r_tool[theme=dark] {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  border-color: rgba(255, 255, 255, 0.28);
}


</style>