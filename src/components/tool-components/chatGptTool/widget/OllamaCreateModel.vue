<template>
  <q-dialog
      v-model="model"
  >
    <q-card
        flat
        style="width: 50vw;height: 60vh;max-width:100vw;overflow: hidden"
        id="create_mode"
    >
      <div class="fit column" style="padding-left: 5px;padding-right: 5px">
        <div class="full-width row justify-between" style="padding-top: 10px">
          <div class="row ">
            <q-input outlined dense v-model="text" label="模型名"/>
            <div style="margin-left: 10px">
              <q-select outlined v-model="modelSelect" :options="ctx.ui.modelList" dense options-dense
                        option-label="name" option-value="model"
                        dropdown-icon="jimu-xiangxia-2" label="基础模型">
                <template #prepend>
                  <q-icon class="chat-tool-opt" size="25px" :name="'img:'+ctx.ui.currentModel.picture"/>
                </template>
                <template v-slot:selected>
                  <div class="ellipsis">
                    {{ modelSelect.name }}
                  </div>
                </template>
                <template v-slot:option="scope">
                  <!--       展示一下载的模型提供选择         -->
                  <q-item v-bind="scope.itemProps" v-if="scope.opt.isDownload">
                    <q-item-section>
                      <q-item-label> {{ scope.opt.name }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
          </div>
          <div>
            <q-btn outline icon="jimu-Model" color="primary" label="创建" @click="createModel"/>
          </div>
        </div>
        <div class="column" style="flex-grow: 1">
          <div class="column" style="padding-top: 10px">
            <q-editor
                v-model="modelFile"
                placeholder="file content"
                :toolbar="[]"
                style="width: 100%;height: 100%"
            />
          </div>
          <div v-if="flag" style="margin-top: 10px">
            <div class="full-width">
              <q-linear-progress v-if="progressValue==0" size="md" :indeterminate="progressValue==0"
                                 :value="progressValue"/>
              <q-linear-progress v-else size="md" :value="progressValue"/>
            </div>
            <div class="full-width ellipsis text-grey-6" style="font-size: 10px;align-content: center">
              {{ progressInfo }}
            </div>
          </div>
        </div>
      </div>

    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">

import {useGptStore} from "@/components/tool-components/chatGptTool/chat/store/gpt";
import {computed, ref} from "vue";
import {LLmMole, ProgressResponse} from "@/components/tool-components/chatGptTool/chat/model/model";
import {GetHeaders} from "@/plugins/axiosutil";
import {ElMessage, ElNotification} from "element-plus";
import {deleteModel} from "@/components/tool-components/chatGptTool/chatRequest";

const model = defineModel({default: false, required: true})
const ctx = useGptStore()
const modelSelect = ref<LLmMole>(ctx.ui.currentModel)
// 只允许单个下载
const flag = ref(false)
const cleanFlag = ref(false)
const progress = ref<ProgressResponse>(null)
const text = ref('')
const description = ref('')
const modelFile = ref('')

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

// 取消下载
function clean() {
  cleanFlag.value = true
}

function getModelFileText(element: HTMLElement): string {
  let value = ''
  for (let i = 0; i < element.childNodes.length; i++) {
    let el = element.childNodes[i] as HTMLElement
    if (!el) {
      continue
    }
    value += el.innerText + '\n'
  }
  return value
}

async function createModel() {
  if (flag.value) return
  flag.value = true
  let doc = new DOMParser()
  let element = doc.parseFromString(modelFile.value, 'text/html').body
  let modelfile = 'FROM ' + modelSelect.value.model + '\n' + getModelFileText(element)

  let data = {
    baseModel: modelSelect.value.model,
    name: text.value,
    modelfile: modelfile,
    stream: true,
  }
  const response = await fetch('http://localhost:8080/api/chat/model/create', {
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
        flag.value = false
        return
      }
      const {done, value} = await reader.read()
      if (done) {
        flag.value = false
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
            let {code, streamFlag} = streamResponse(parsed);
            if (streamFlag) {
              // 根据业务码处理具体操作 当前默认结束客户端操作
              if (code == 200) {
                setTimeout(() => {
                  flag.value = false
                }, 1000)
                return;
              }
              return
            }
            // console.log(parsed)
            // 检查当前的流消息是否完成
            if (parsed.status === 'success') {
              progress.value = parsed
              setTimeout(() => {
                ElMessage({
                  message: '创建成功',
                  type: 'success',
                  plain: true,
                  appendTo: document.getElementById('create_mode')
                })
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


function hasOwnProperty(obj: object, prop: string) {
  return obj.hasOwnProperty(prop);
}

/*
* @description: 检查当前的流消息的状态,是否出需要客户端退出流读取
* */
function streamResponse(value: any) {
  let code = hasOwnProperty(value, "code");
  let msg = hasOwnProperty(value, "msg");
  let err = hasOwnProperty(value, "data");
  return {
    code: value.code,
    streamFlag: code && msg && err,
  };
}

</script>


<style scoped>

</style>
<style>
#mode_download .q-scrollarea__content.absolute {
  width: 100%;
}
</style>