<template>
  <div class="notify fit column">
    <div class="full-width row reverse" style="padding: 5px">
      <el-link type="primary">
        清空全部消息
      </el-link>
    </div>
    <div class="full-width" style="flex-grow: 1">
      <q-scroll-area class="fit" :visible="false">
        <q-list class="fit" style="padding-right: 5px;padding-left: 5px">
          <template v-for="item in notify.list" :key="item.id">
            <NotifyCard :data="item"/>
          </template>
        </q-list>
      </q-scroll-area>
    </div>
  </div>
</template>

<script setup lang="ts">

import {useNotifyStore} from "@/store/tool/notify";


const notify = useNotifyStore()


</script>


<style scoped>

</style>