<template>
  <q-dialog
      v-model="model"
      no-backdrop-dismiss
      no-shake
      allow-focus-outside
  >
    <q-card
        class="fit column"
        style="width: 70vw;height: 65vh;max-width:100vw;"
    >
      <div class="full-width row justify-between" style="height: 40px">
        <div class="full-height" style="align-content: center;padding-left: 10px">
          设置
        </div>
        <div class="full-height">
          <q-btn :ripple="false" class="setting-close-btn" flat square icon="jimu-guanbi-2"
                 style="height:100%;width: 40px" @click="model=false"/>
        </div>
      </div>
      <div class="full-width column setting-box" style="overflow: hidden;flex-grow: 1;">
        <q-splitter
            v-model="splitterModel"
            :limits="splitterModelLimit"
            style="overflow: hidden"
            class="fit"
        >
          <template v-slot:before>
            <div class="fit" style="overflow: hidden">
              <SettingItemList v-model:tab="tab" :list="list"/>
            </div>
          </template>

          <template v-slot:after>
            <div class="fit" style="overflow: hidden">
              <q-scroll-area class="fit" :visible="false">
                <SettingView v-model:tab="tab" :list="list"/>
              </q-scroll-area>
            </div>
          </template>
        </q-splitter>
      </div>
      <div class="full-width row reverse" style="height: 60px">
        <div class="full-height column justify-center" style="margin-right: 20px">
          <q-btn :ripple="false" dense label="应 用" style="width: 60px"/>
        </div>

        <div class="full-height column justify-center" style="margin-right: 20px">
          <q-btn :ripple="false" dense label="取 消" style="width: 60px"/>
        </div>

        <div class="full-height column justify-center" style="margin-right: 20px">
          <q-btn :ripple="false" dense color="primary" label="保 存" style="width: 60px"/>
        </div>
      </div>
    </q-card>

  </q-dialog>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import {AppSetting} from "@/components/system-components/model/system";

const model = defineModel({default: false, required: true})
const splitterModel = ref(15)
const splitterModelLimit = ref([15, 15])
const text = ref("")
const tab = ref("mails")
const list = ref<AppSetting[]>([
  {
    id: "1",
    name: "账号设置",
    value: "UserInfoSetting",
  },
  {
    id: "2",
    name: "Ollama",
    value: "OllamaSetting",
  }
])


function init() {

}

watch(() => model.value, (value) => {
  if (value) {
    init()
  } else {

  }
})
</script>


<style scoped>
.setting-close-btn:hover {
  color: white;
  background-color: red;
  border-top-right-radius: 1px;
  border-color: red;
}

.setting-box {
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: rgba(0, 0, 0, 0.12);

  border-top-style: solid;
  border-top-width: 1px;
  border-top-color: rgba(0, 0, 0, 0.12);
}
</style>