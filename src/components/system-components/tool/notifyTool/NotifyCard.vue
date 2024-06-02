<template>
  <q-card flat bordered class="notify">
    <div class="column ellipsis">
      <q-bar class="bg-transparent" style="padding: 0">
        <div>
          <q-icon size="25px" :name="icon" :color="color"/>
        </div>
        <div class="ellipsis">
          {{ data.title }}
          <q-badge v-if="status!=''" rounded floating color="primary"/>
        </div>
        <q-space/>
        <q-btn flat icon="jimu-gengduo_shu-2" style="width: 20px">
          <q-menu>
            <q-list dense style="padding: 0">
              <menu-item text="标记已读"/>
              <menu-item icon="jimu-shanchu" text="删除"/>
            </q-list>
          </q-menu>
        </q-btn>
      </q-bar>
      <div class="ellipsis" style="flex-grow: 1;padding: 5px">
        <component :is="data.template" :data="data.param"/>
      </div>
      <div class="notify-footer full-width row reverse">
        <div class="text-grey-8" style="font-size: 10px">
          {{ formatDateWithTimezone(data.updateTime) }}
        </div>
      </div>
    </div>

  </q-card>
</template>


<script setup lang="ts">
import {Records} from "@/components/system-components/model/system";
import {ref} from "vue";
import {NotifyMsgType, NotifyStatus} from "@/components/system-components/model/menu";

const props = defineProps<{
  data: Records
}>()

const icon = ref('')
const color = ref('')
const status = ref('')
switch (props.data.msgType) {
  case NotifyMsgType.Info:
    icon.value = 'jimu-info-fill'
    color.value = 'primary'
    break
  case NotifyMsgType.Success:
    icon.value = 'jimu-success_fill'
    color.value = 'positive'
    break
  case NotifyMsgType.Warning:
    icon.value = 'jimu-warring_shape'
    color.value = 'warning'
    break
  case NotifyMsgType.Error:
    icon.value = 'jimu-error-fill'
    color.value = 'negative'
    break
  case 4:
}
switch (props.data.status) {
  case NotifyStatus.Read:
    status.value = ''
    break
  case NotifyStatus.UnRead:
    status.value = 'primary'
    break
}

function formatDateWithTimezone(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Shanghai'
  }).format(date).replace(',', '');
}
</script>


<style scoped>
.notify {
  margin-bottom: 5px;
}
</style>