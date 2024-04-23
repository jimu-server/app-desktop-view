<template>
  <q-dialog
      v-model="model"
  >
    <q-card
        class="fit"
        style="width: 70vw;height: 65vh;max-width:100vw;"
    >
      <div class="fit column" style="overflow: hidden;">
        <q-splitter
            v-model="splitterModel"
            :limits="splitterModelLimit"
            style="overflow: hidden"
            class="fit"
        >

          <template v-slot:before>
            <div class="fit" style="overflow: hidden">

            </div>
          </template>

          <template v-slot:after>
            <div>

            </div>
          </template>

        </q-splitter>
      </div>
    </q-card>

  </q-dialog>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";

const model = defineModel({default: false, required: true})
const splitterModel = ref(10)
const splitterModelLimit = ref([10, 10])

watch(() => model.value, (value) => {
  if (value) {

  } else {

  }
})
</script>


<style scoped>

</style>