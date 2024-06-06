<template>
  <ToolButton :btn="btn" @receive="receive" :position="position">
    <template v-slot:notify-badge>
      <q-badge v-if="notify.getStatus==NotifyToolStatusType.UnReadNotify" color="red" rounded floating>
        {{ notify.unread }}
      </q-badge>
      <q-badge v-else-if="notify.getStatus==NotifyToolStatusType.ReadAllNotify" color="primary" rounded floating/>
    </template>
  </ToolButton>
</template>


<script setup lang="ts">
import {useQuasar} from "quasar";
import {useNotifyStore} from "@/store/tool/notify";
import {Records, Tool} from "@/components/system-components/model/system";

import {onMounted} from "vue";
import {NotifyToolStatusType} from "@/components/system-components/model/enum";
import {notifyMsg} from "@/components/system-tool/notifyTool/notify";

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