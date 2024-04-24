<template>
  <q-dialog
      v-model="model"
  >
    <q-card
        flat
        style="width: 50vw;height: 60vh;max-width:100vw;overflow: hidden"
        id="mode_download"
    >
      <div class="fit column">
        <div class="full-width row justify-center" style="padding-top: 10px">
          <q-input dense v-model="text" outlined style="width: 95%">
            <template v-slot:append>
              <q-icon name="jimu-sousuo-2" />
            </template>
          </q-input>
        </div>
        <div class="column" style="flex-grow: 1">
          <q-scroll-area class="fit" :visible="false">
            <q-list class="fit">
              <q-item v-for="(item,index) in ctx.ui.modelList">
                <q-item-section avatar>
                  <q-avatar :icon="'img:'+item.picture"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    <span>{{ item.name }}</span>
                    <span style="margin-left: 5px" class="text-grey-7">{{ item.model }}</span>
                  </q-item-label>
                  <q-item-label v-if="!item.isDownload && item.downloads">
                    <div class="full-width">
                      <q-linear-progress v-if="progressValue==0" size="sm" :indeterminate="progressValue==0"
                                         :value="progressValue"/>
                      <q-linear-progress v-else size="sm" :value="progressValue"/>
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
                    <q-btn v-if="!flag" flat dense icon="jimu-yunxiazai_o" @click="downloadModel(item)"
                           color="primary"/>
                    <q-btn v-else flat dense icon="jimu-guanbi" @click="clean"/>
                  </template>
                </q-item-section>
                <q-item-section avatar v-if="item.isDownload">
                  <div class="fit column justify-center">
                    <q-btn icon="jimu-shanchu" color="red" flat @click="delModel(item)"/>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-scroll-area>
        </div>
      </div>

    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">

import {useChatCtxStore} from "@/components/tool-components/chatGptTool/chat/store/chat_ctx";
import {computed, ref} from "vue";
import {LLmMole, ProgressResponse} from "@/components/tool-components/chatGptTool/chat/model/gpt";
import {GetHeaders} from "@/plugins/axiosutil";
import {ElMessage, ElNotification} from "element-plus";
import {deleteModel} from "@/components/tool-components/chatGptTool/chatRequest";

const model = defineModel({default: false, required: true})
const ctx = useChatCtxStore()
// 只允许单个下载
const flag = ref(false)
const cleanFlag = ref(false)
const progress = ref<ProgressResponse>(null)
const text = ref('')

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

// 取消下载
function clean() {
  cleanFlag.value = true
}


async function downloadModel(item: LLmMole) {
  if (flag.value) return
  flag.value = true
  item.downloads = true
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
  const reader = response.body.getReader()
  const decoder = new TextDecoder('utf-8')
  try {
    while (true) {
      // 检查停止下载
      if (cleanFlag.value) {
        await reader.cancel()
        cleanFlag.value = false
        return
      }
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
            // console.log(parsed)
            // 检查当前的流消息是否完成
            if (parsed.status === 'success') {
              progress.value = parsed
              setTimeout(() => {
                item.isDownload = true;
                flag.value = false
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


async function delModel(item: LLmMole) {
  let result = await deleteModel(item.model)
  if (result.code == 200) {
    ElMessage({
      message: '删除成功',
      plain: true
    })
    item.downloads = false
    item.isDownload = false
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