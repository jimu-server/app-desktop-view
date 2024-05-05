<template>
  <q-dialog
      v-model="model"
      persistent
  >
    <q-card
        style="width: 40vw; height: 50vh;overflow: hidden"
    >
      <div class="fit column" style="padding: 10px">
        <div class="full-width row" style="flex-grow: 1">
          <div class="fit column">
            <q-item>
              <q-item-section>
                <q-linear-progress v-if="progress==0" indeterminate rounded size="15px"/>
                <q-linear-progress v-else rounded size="15px" :value="progress"/>
              </q-item-section>
              <q-item-section avatar>
                <q-btn v-if="!isComplete" outline dense color="red" icon="jimu-daochu1024-16" @click="stopGen"/>
                <q-btn v-else outline dense color="primary" label="完成" @click="complete"/>
              </q-item-section>
            </q-item>
            <q-item style="flex-grow: 1">
              <q-item-section>
                <q-scroll-area ref="scroll" class="fit">
                  <div v-for="msg in msgs">
                    {{ msg }}
                  </div>
                </q-scroll-area>
              </q-item-section>
            </q-item>
          </div>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>


<script setup lang="ts">
import {ref} from "vue";
import {hasOwnProperty} from "@/components/system-components/utils/systemutils";
import {Stream} from "@/components/system-components/stream/stream";
import {genKnowledge} from "@/components/tool-components/chatGptTool/chatRequest";
import {Result} from "@/components/system-components/model/system";

defineExpose({
  beginGen,
})

const model = defineModel({default: false, required: false})
const progress = ref(0)
const response = ref<Response | null>(null)
const isComplete = ref(false)
const msgs = ref<string[]>([])
const load = ref<Stream>()
const scroll = ref()

function stopGen() {
  if (load.value != null) {
    load.value.Stop()
  }
  msgs.value = []
  model.value = false
  isComplete.value = false
}

function complete() {
  msgs.value = []
  model.value = false
  isComplete.value = false
}

async function beginGen(name: string, files: string[]) {
  response.value = await genKnowledge(name, files)
  model.value = true
  stream()
}

function stream() {
  setTimeout(async () => {
    load.value = new Stream(response.value)
    load.value.setHandler((data, status) => {
      msgs.value.push(data.msg)
      progress.value = data.percent
      setTimeout(async () => {
        let scrollTarget = scroll.value.getScrollTarget()
        let height = scrollTarget.scrollHeight
        scroll.value.setScrollPosition('vertical', height)
      }, 200)
    })

    load.value.setComplete((data, status) => {
      console.log("complete")
      isComplete.value = true
    })

    load.value.setEnd((data: Result<any>, status) => {
      if (data.code == 200) {
        isComplete.value = true
        return
      } else {
        isComplete.value = true
        return
      }
    })
    await load.value.listen()
  }, 200)
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