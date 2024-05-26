<template>
  <div>
    <q-list dense>
      <q-item dense style="padding: 0" clickable>
        <q-item-section>
          <q-radio size="xs" v-model="shape" val="line"/>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            Line
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";

const shape = ref('')
</script>


<style scoped>

</style>