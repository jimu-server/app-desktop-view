<template>
  <ToolButton :btn="btn" @receive="receive">
    <template v-slot:notify-badge>
      <q-badge color="red" rounded  floating>{{ notify.list.length }}</q-badge>
    </template>
  </ToolButton>
</template>


<script setup lang="ts">
import {useQuasar} from "quasar";
import {useNotifyStore} from "@/store/tool/notify";
import {Records, Tool} from "@/model/system";

const $q = useQuasar()
const notify = useNotifyStore()
const props = defineProps<{
  btn: Tool
}>()


function receive(data: Records) {
  console.log(data)
  $q.notify({
    type: 'success',
    message: data.text,
    multiLine: true,
    actions: [
      {
        label: '关闭',
        color: 'white', handler: () => {

        }
      }
    ]
  })
  notify.list.push(data)
}

</script>


<style scoped>

</style>