<template>
  <ToolButton :btn="btn" @receive="receive" :position="position">
    <template v-slot:notify-badge>
      <q-badge v-if="notify.list.length>0" color="red" rounded floating>{{ notify.list.length }}</q-badge>
    </template>
  </ToolButton>
</template>


<script setup lang="ts">
import {useQuasar} from "quasar";
import {useNotifyStore} from "@/store/tool/notify";
import {Records, Tool} from "@/components/system-components/model/system";
import {notifyMsg} from "@/components/system-components/tool/notifyTool/notify";
import {getAllNotify} from "@/components/system-components/tool/notifyTool/notifyRequest";
import {onMounted} from "vue";

const $q = useQuasar()
const notify = useNotifyStore()
const props = defineProps<{
  btn: Tool
  position: number
}>()


function receive(data: Records) {
  console.log(data)
  notify.list.push(data)
  notifyMsg(data)
}

onMounted(async () => {

})


</script>


<style scoped>

</style>