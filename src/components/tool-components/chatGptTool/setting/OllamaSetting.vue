<template>
  <div class="fit column" style="padding: 5px">
    <q-input v-model="set.setting.url">
      <template #prepend>
        <q-icon name="jimu-24gl-network" />
      </template>
    </q-input>
  </div>
</template>

<script setup lang="ts">
import {AppSetting} from "@/components/system-components/model/system";

const props = defineProps<{
  set: AppSetting
}>()
</script>


<style scoped>

</style>