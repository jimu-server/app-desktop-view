<template>
  <main-page>
    <q-splitter
        v-model="splitterModel"
        :limits="[10,40]"
        :style="{height:app.ui.page.height}"
        class="full-width"
    >
      <template v-slot:before>

      </template>

      <template v-slot:after>
        <div class="aieditor fit" style="padding-top: 5px;padding-bottom: 5px">
          <div id="aiEditor-toolbar"></div>
          <div id="aiEditor" ref="divRef"/>
        </div>
      </template>
    </q-splitter>

  </main-page>
</template>

<script setup lang="ts">

import {onMounted, onUnmounted, ref, watch} from "vue";
import "aieditor/dist/style.css"
import {useAppStore} from "@/store/app";
import {useThemeStore} from "@/store/theme";
import {createAiEditor} from "@/components/tool-components/aiEditor/aieditor";
import {DecoupledEditor} from "@ckeditor/ckeditor5-editor-decoupled";

const splitterModel = ref(20)
const divRef = ref<HTMLDivElement>(null)
const app = useAppStore()
const theme = useThemeStore()
let aiEditor: DecoupledEditor = null

onMounted(async () => {
  let editorPanel = divRef.value as HTMLElement;
  // 初始化编辑器
  createAiEditor(editorPanel).then((editor) => {
    const toolbarContainer = document.querySelector('#aiEditor-toolbar');
    toolbarContainer.appendChild(editor.ui.view.toolbar.element);
  }).catch(error => {
    console.error(error);
  });
})

onUnmounted(() => {

})

watch(() => theme.dark, (value) => {
  if (value) {

  }
})
</script>


<style scoped>
#aiEditor {
  flex-grow: 1;
}

</style>

<style>

#aiEditor-toolbar .ck.ck-toolbar.ck-toolbar_grouping.ck-reset_all.ck-rounded-corners{
  border-left-style: none !important;
  border-right-style: none !important;
  border-top-style: none !important;
}

.aieditor .ck.ck-content.ck-editor__editable {
  border: none !important;
  box-shadow: none !important;
}

/* 对编辑器中 p 进行强制换行显示*/
.aieditor .ck.ck-content.ck-editor__editable p {
  padding: 0 !important;
  margin: 0 !important;
  word-break: break-all;
}

.aieditor .ck .ck-widget {
  /*去除编辑器小部件的选中和取消选中的 轮廓变化过度*/
  transition: none;
}

.aieditor .ck .ck-widget:hover {
  outline: none;
}

.aieditor .ck .ck-widget.ck-widget_selected, .ck .ck-widget.ck-widget_selected:hover {
  outline: rgba(37, 32, 32, 0.21) 1px solid !important;
}

</style>