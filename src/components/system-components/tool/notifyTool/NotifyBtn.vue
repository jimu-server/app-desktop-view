<template>
  <ToolButton :btn="btn" @receive="receive" :position="position">
    <template v-slot:notify-badge>
      <q-badge color="red" rounded  floating>{{ notify.list.length }}</q-badge>
    </template>
  </ToolButton>
</template>


<script setup lang="ts">
import {useQuasar} from "quasar";
import {useNotifyStore} from "@/store/tool/notify";
import {Records, Tool} from "@/components/system-components/model/system";

const $q = useQuasar()
const notify = useNotifyStore()
const props = defineProps<{
  btn: Tool
  position: number
}>()


function receive(data: Records) {

  notify.list.push(data)
}

</script>


<style scoped>

</style>