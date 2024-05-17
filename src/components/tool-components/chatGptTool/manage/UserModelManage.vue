<template>
  <q-dialog
      v-model="model"
  >
    <q-card
        flat
        style="width: 50vw;height: 60vh;max-width:100vw;overflow: hidden"
    >
      <div class="fit" id="user-model-manage">
        <div class="column fit">
          <div class="full-width row justify-center" style="padding-top: 10px">
            <q-input dense v-model="text" outlined style="width: 95%">
              <template v-slot:append>
                <q-btn dense flat icon="jimu-xiazai-2" @click="beginDownload"/>
              </template>
            </q-input>
          </div>
          <div class="column" style="flex-grow: 1">
            <q-scroll-area class="fit" :visible="false">
              <q-list class="fit">
                <q-item v-for="(item,index) in ctx.ui.modelList">
                  <q-item-section avatar>
                    <q-avatar :icon="'img:'+'./GPT.png'"/>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>
                      <span>{{ item.name }}</span>
                      <span style="margin-left: 5px" class="text-grey-7">{{ item.model }}</span>
                    </q-item-label>
                    <!--                    <q-item-label v-if="!item.isDownload && item.downloads">
                                          <div class="full-width">
                                            <q-linear-progress v-if="progressValue==0" size="md" :indeterminate="progressValue==0"
                                                               :value="progressValue"/>
                                            <q-linear-progress v-else size="md" :value="progressValue">
                                            </q-linear-progress>
                                          </div>
                                          <div class="full-width ellipsis text-grey-6" style="font-size: 10px;align-content: center">
                                            {{ progressInfo }}
                                          </div>
                                        </q-item-label>-->
                  </q-item-section>
                  <!--                                    <q-item-section avatar>
                                                        <template v-if="item.isDownload">
                                                          <span class="text-grey-7" style="font-size: 10px">以拉取</span>
                                                        </template>
                                                        <template v-else>
                                                          <q-btn v-if="!flag" flat dense icon="jimu-yunxiazai_o" @click="downloadModel(item)"
                                                                 color="primary"/>
                                                          <q-btn v-if="item.downloads" flat dense icon="jimu-guanbi" @click="clean"/>
                                                        </template>
                                                      </q-item-section>-->
                  <q-item-section avatar>
                    <div class="fit column justify-center">
                      <q-btn dense icon="jimu-shanchu" color="red" flat @click="delModel(item)"/>
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-scroll-area>
          </div>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">

import {useGptStore} from "@/components/tool-components/chatGptTool/chat/store/gpt";
import {computed, onMounted, ref} from "vue";
import {
  LLmMole,
  OllamaModelResponse,
  ProgressResponse
} from "@/components/tool-components/chatGptTool/chat/model/model";
import {GetHeaders} from "@/plugins/axiosutil";
import {ElMessage, ElNotification} from "element-plus";
import {deleteModel} from "@/components/tool-components/chatGptTool/chatRequest";
import {useAppStore} from "@/store/app";
import {Stream} from "@/components/system-components/stream/stream";

const ctx = useGptStore()
// 只允许单个下载
const flag = ref(false)
const cleanFlag = ref(false)
const progress = ref<ProgressResponse>(null)
const text = ref('')

const model = defineModel({default: false})
const stream = ref<Stream>()

function beginDownload() {

}

// 计算下载进度
const progressValue = computed(() => {
  if (progress.value == null) {
    return 0
  }
  if (!progress.value.status.startsWith('pulling')) {
    return 0
  }
  // if (!hasOwnProperty(progress.value, 'digest')) {
  //   return 0
  // }
  // if (!hasOwnProperty(progress.value, 'completed')) {
  //   return 0
  // }
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
  stream.value = new Stream(response)
  stream.value.setHandler((data: any, status: number) => {
    progress.value = data
  })
  stream.value.setComplete((data, status) => {
    flag.value = false
    cleanFlag.value = false
    // 重新加载数据
    ctx.GetModelList()
  })
  stream.value.setEnd((data, status) => {
    flag.value = false
  })
  await stream.value.listen()
}


async function delModel(item: OllamaModelResponse) {
  let result = await deleteModel(item.model)
  if (result.code == 200) {
    ElMessage({
      message: '删除成功',
      plain: true,
      appendTo: document.getElementById('mode-manage')
    })
    // 需要根据 当前ui选择的 model 做出修改
    if (item == ctx.ui.currentModel) {
      ctx.ui.currentModel = null
    }
    // 更新聊天可选模型列表
    await ctx.GetModelList()
  }
}


</script>


<style scoped>

</style>
<style>
#mode-manage .q-scrollarea__content.absolute {
  width: 100%;
}
</style>