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
import {ref, toRaw} from "vue";
import {Stream} from "@/components/system-components/stream/stream";
import {genKnowledge} from "@/components/tool-components/chatGptTool/chatRequest";
import {Result} from "@/components/system-components/model/system";
import fs from "fs";

import {GetHeaders} from "@/plugins/axiosutil";
import fetch from 'node-fetch';
import {set} from "lodash";
import {NodeFetchStream} from "@/components/system-components/stream/node_fetch_stream";

const AbortController = require('abort-controller');
var FormData = require('form-data');
defineExpose({
  beginGen,
  beginGenFile
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
  // stream()
}

async function beginGenFile(name: string, files: any[]) {
  let {response, controller} = await genKnowledgeFile(name, files)
  model.value = true
  // stream()
  setTimeout(() => {
    let stream = new NodeFetchStream(response, controller)
    stream.setHandler((data, status) => {
      console.log(data)
      msgs.value.push(data.msg)
      progress.value = data.percent
      setTimeout(async () => {
        let scrollTarget = scroll.value.getScrollTarget()
        let height = scrollTarget.scrollHeight
        scroll.value.setScrollPosition('vertical', height)
      }, 200)
    })

    stream.setComplete((data, status) => {
      console.log("complete")
      isComplete.value = true
    })

    stream.setEnd((data: Result<any>, status) => {
      if (data.code == 200) {
        isComplete.value = true
        return
      } else {
        isComplete.value = true
        return
      }
    })
    stream.listen()
  }, 200)
}


async function genKnowledgeFile(name, files: any[]) {
  files = toRaw(files)
  let form = new FormData()
  form.append('name', name)
  files.map(item => {
    form.append('files', fs.createReadStream(item.path))
  });
  let controller = new AbortController();
  let response = await fetch('http://localhost:8080/api/chat/knowledge/gen', {
    signal: controller.signal,
    method: 'POST',
    body: form,
    headers: {
      ...GetHeaders(),
      ...form.getHeaders()
    }
  })
  return {
    response: response,
    controller: controller
  }
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

</script>

<style scoped>

</style>