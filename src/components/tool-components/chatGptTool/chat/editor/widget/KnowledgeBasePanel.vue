<template>
  <div id="knowledge">
    <q-icon size="20px" class="edit-tool-option" name="jimu-zhishi">
      <q-tooltip :offset="[0, 0]">
        知识库
      </q-tooltip>
    </q-icon>
    <q-menu
        id="knowledge-menu"
        anchor="top start" self="bottom start"
        transition-show="scale"
        transition-hide="scale"
        style="overflow: hidden"
    >
      <div style="width: 500px;height: 200px;overflow: hidden;padding: 5px;">
        <div class="fit column">
          <div class="full-width row justify-between" style="height: 32px">
            <div class="hull-height column justify-center" style="flex: 1;height: 32px">
              <ScrollX class="fit">
                <div class="fit column justify-center" style="height: 32px">
                  <q-breadcrumbs gutter="none" class="full-width">
                    <q-breadcrumbs-el label="Home"/>
                    <q-breadcrumbs-el label="Components"/>
                    <q-breadcrumbs-el label="Breadcrumbs"/>
                    <q-breadcrumbs-el label="Breadcrumbs"/>
                    <q-breadcrumbs-el label="Breadcrumbs"/>
                    <q-breadcrumbs-el label="Breadcrumbs"/>
                    <q-breadcrumbs-el label="Breadcrumbs"/>
                  </q-breadcrumbs>
                </div>
              </ScrollX>
            </div>
            <div class="row">
              <q-btn dense flat icon="jimu-tianjiawenjianjia"/>
              <q-btn dense flat icon="jimu-tianjiawenjian"/>
            </div>
          </div>
          <div class="full-width column" style="flex-grow: 1">
            <q-scroll-area class="fit" :visible="false">
              <FileUI v-for="i in 20"/>
            </q-scroll-area>
          </div>
        </div>

      </div>
    </q-menu>
  </div>
</template>
<script setup lang="ts">
import ScrollX from "@/components/tool-components/chatGptTool/chat/editor/widget/ScrollX.vue";

</script>


<style scoped>

</style>
<style>
#knowledge-menu .q-breadcrumbs .flex.items-center.justify-start {
  flex-wrap: nowrap !important;
}

</style>