<template>
  <div class="full-width row reverse">
<!--    <el-button v-if="data.status==NotifyStatus.Read" text type="danger" @click="delMsg(data.id)">
      删除
    </el-button>-->
    <el-button class="read-btn" v-if="data.status==NotifyStatus.UnRead" text type="primary" @click="readMsg(data.id)">
      已读
    </el-button>
  </div>
</template>

<script setup lang="ts">
import {Records} from "@/components/system-components/model/system";
import {NotifyStatus} from "@/components/system-components/model/enum";
import {useNotifyStore} from "@/store/tool/notify";
import {delMsg, readMsg} from "@/components/system-components/tool/notifyTool/notifyutil";

const props = defineProps<{
  data: Records
}>()

const notify = useNotifyStore()


</script>


<style scoped>

</style>