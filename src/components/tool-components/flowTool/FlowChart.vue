<template>
  <main-page>
    <q-splitter
        v-model="splitterModel"
        :limits="[20,40]"
        :style="{height:app.ui.page.height}"
        class="full-width"
    >
      <template v-slot:before>
        <q-splitter
            v-model="splitterModel2"
            :limits="[20,80]"
            horizontal
            class="fit"
        >
          <template v-slot:before>
            <!--     文件列表       -->
          </template>
          <template v-slot:after>
            <NodeElement/>
          </template>
        </q-splitter>
      </template>
      <template v-slot:after>
        <ProcessCanvas/>
      </template>
    </q-splitter>
  </main-page>
</template>

<script setup lang="ts">
import {markRaw, onMounted, ref} from 'vue'
import NodeElement from "@/components/tool-components/flowTool/NodeElement.vue";
import RectangleNode from "@/components/tool-components/flowTool/node/RectangleNode.vue";
import {useAppStore} from "@/store/app";
import {useFlowStore} from "@/components/tool-components/flowTool/store/flow";

const app = useAppStore()
const flow = useFlowStore()
const splitterModel = ref(20)
const splitterModel2 = ref(20)

flow.data = [1]
const nodeType = {
  rectangle: markRaw(RectangleNode)
}

onMounted(() => {

})
</script>


<style scoped>

</style>