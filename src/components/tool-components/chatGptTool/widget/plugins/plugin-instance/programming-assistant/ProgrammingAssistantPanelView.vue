<template>
  <q-card
      style="width: 25vw;height: 15vh"
      class="column"
  >
    <div class="fit column" style="padding: 5px">
      <div class="full-width">
        助手偏好
      </div>
      <div class="programming-assistant">
        <q-scroll-area class="fit">
          <q-chip
              v-for="item in plugin.ctx.programming.list"
              v-model:selected="item.selected"
              square
              outline
              :icon="item.icon"
              :label="item.name"
          />
        </q-scroll-area>
      </div>
    </div>

  </q-card>
</template>

<script setup lang="ts">
import {reactive} from "vue";
import {useAiPluginStore} from "@/components/tool-components/chatGptTool/store/plugin";

const props = defineProps<{
  data: any
}>()
const desert = reactive({
  Icecream: false,
  Eclair: true,
  Cupcake: false,
  Gingerbread: false
})

const plugin = useAiPluginStore()

</script>


<style scoped>
.programming-assistant {
  flex-grow: 1;
}
</style>