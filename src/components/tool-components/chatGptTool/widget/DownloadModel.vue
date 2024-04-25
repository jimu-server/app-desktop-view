<template>
  <q-dialog
      v-model="model"
  >
    <q-card
        style="width: 50vw;height: 60vh;max-width:100vw;overflow: hidden"
        id="mode_download"
    >
      <div class="fit column">
        <q-scroll-area class="fit" :visible="false">
          <q-list class="fit">
            <q-item v-for="(item,index) in ctx.ui.modelList" clickable>
              <q-item-section avatar>
                <q-avatar :icon="'img:'+item.picture"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  <span>{{ item.name }}</span>
                  <span style="margin-left: 5px" class="text-grey-7">{{ item.model }}</span>
                </q-item-label>
                <q-item-label v-if="!item.isDownload">
                  <div class="full-width">
                    <q-linear-progress size="sm" :value="progressValue"/>
                  </div>
                  <div class="full-width ellipsis text-grey-6" style="font-size: 10px;align-content: center">
                    {{ progressInfo }}
                  </div>
                </q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <template v-if="item.isDownload">
                  <span class="text-grey-7" style="font-size: 10px">以拉取</span>
                </template>
                <template v-else>
                  <q-icon name="jimu-yunxiazai_o" @click="downloadModel(item)"/>
                </template>
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">

import {useGptStore} from "@/components/tool-components/chatGptTool/chat/store/gpt";
import {computed, ref} from "vue";
import {LLmMole, ProgressResponse} from "@/components/tool-components/chatGptTool/chat/model/model";
import {GetHeaders} from "@/plugins/axiosutil";
import {ElNotification} from "element-plus";

const model = defineModel({default: false, required: true})
const ctx = useGptStore()

const progress = ref<ProgressResponse>(null)

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
  return progress.value.status + progress.value.digest
})


async function downloadModel(item: LLmMole) {
  let data = {
    name: item.model,
    model: item.model,
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

  item.downloads = []

  const reader = response.body.getReader()
  const decoder = new TextDecoder('utf-8')
  try {
    while (true) {
      const {done, value} = await reader.read()
      if (done) {
        break
      }
      let decodedData = decoder.decode(value);
      let accumulatedData = ""; // Accumulate chunks of data here
      accumulatedData += decodedData;
      accumulatedData.split('\n').forEach(line => {
        if (line) {
          try {
            let parsed = JSON.parse(line);
            // 检查当前的流消息是否出现错误
            if (checkError(parsed)) {
              return false;
            }
            console.log(parsed)
            // 检查当前的流消息是否完成
            if (parsed.status === 'success') {
              progress.value = parsed
              setTimeout(() => {
                item.isDownload = true;
              }, 2000)
              return
            }
            progress.value = parsed
          } catch (error) {
            console.error("Error parsing JSON:", error);
            console.error(line)
          }
        }
      });
    }
  } catch (e) {

  }
}


function hasOwnProperty(obj: object, prop: string) {
  return obj.hasOwnProperty(prop);
}

function checkError(value) {
  let code = hasOwnProperty(value, "code");
  let msg = hasOwnProperty(value, "msg");
  let err = hasOwnProperty(value, "data");
  if (code && msg && err) {
    if (value.code != 200) {
      ElNotification({
        title: '系统消息',
        message: value.msg,
        type: 'error'
      })
      return true;
    }
  }
  return false;
}

</script>


<style scoped>

</style>
<style>
#mode_download .q-scrollarea__content.absolute {
  width: 100%;
}
</style>