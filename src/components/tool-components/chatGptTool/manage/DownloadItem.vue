<template>
  <q-item>
    <q-item-section avatar>
      <q-spinner-audio
          color="primary"
          size="20px"
      />
    </q-item-section>
    <q-item-section>
      <q-item-label>
        <q-linear-progress v-if="progressValue==0" indeterminate size="10px"
                           rounded/>
        <q-linear-progress v-else size="10px" rounded :value="progressValue"/>
      </q-item-label>
      <q-item-section>
        {{ progressInfo }}
      </q-item-section>
    </q-item-section>
    <q-item-section avatar>
      <q-btn dense flat label="取消" @click="clean"/>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import {OllamaDownload, ProgressResponse} from "@/components/tool-components/chatGptTool/chat/model/model";
import {computed, onMounted, ref} from "vue";
import {Stream} from "@/components/system-components/stream/stream";
import {GetHeaders} from "@/plugins/axiosutil";
import {Result} from "@/components/system-components/model/system";
import {useGptStore} from "@/components/tool-components/chatGptTool/chat/store/gpt";

const props = defineProps<{
  item: OllamaDownload
}>()

const progress = ref<ProgressResponse>()
const ctx = useGptStore()

// 计算下载进度
const progressValue = computed(() => {
  if (progress.value == null) {
    return 0
  }
  if (!progress.value.status.startsWith('pulling')) {
    return 0
  }
  if (!hasOwnProperty(progress.value, 'digest')) {
    return 0
  }
  if (!hasOwnProperty(progress.value, 'completed')) {
    return 0
  }
  if (progress.value.status == 'success') {
    return 0.99
  }
  if (progress.value.completed == progress.value.total) {
    return 1
  }
  return progress.value.completed / progress.value.total
})


// 显示下载信息
const progressInfo = computed(() => {
  if (progress.value == null) {
    return '等待..'
  }
  if (progress.value.status == 'success') {
    return '拉取完成'
  }
  if (!progress.value.digest) {
    return progress.value.status
  }
  return progress.value.status + progress.value.digest
})

function hasOwnProperty(obj: object, prop: string) {
  return obj.hasOwnProperty(prop);
}

// 取消下载
function clean() {
  cleanFlag.value = true
}

onMounted(async () => {
  // 开始下载数据
  let data = {
    name: props.item.model,
    model: props.item.model,
    stream: true,
  }
  const response = await fetch('http://localhost:8080/api/chat/model/pull', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...GetHeaders()
    },
    body: JSON.stringify(data),
  });
  let stream = new Stream(response)

  stream.setHandler((data, status) => {
    progress.value = data
  })

  stream.setComplete((data, status) => {
    console.log("complete")
    // 删除
    let findIndex = ctx.ui.downloadModelList.findIndex(item => item.model == props.item.model);
    if (findIndex != -1) {
      ctx.ui.downloadModelList.splice(findIndex, 1)
    }
  })

  stream.setEnd((data: Result<any>, status) => {
    if (data.code == 200) {

      return
    } else {

      return
    }
  })
  await stream.listen()

})

</script>


<style scoped>

</style>