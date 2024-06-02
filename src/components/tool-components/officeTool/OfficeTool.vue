<template>
  <main-page>
    <q-splitter
        v-model="splitterModel"
        :limits="[10,40]"
        class="fit"
    >
      <template v-slot:before>

      </template>

      <template v-slot:after>
        <div class="fit" style="padding-top: 5px;padding-bottom: 5px">
          <div id="office" class="fit" style="flex-grow: 1">

          </div>
        </div>
      </template>
    </q-splitter>
  </main-page>
</template>

<script setup lang="ts">
import "@univerjs/design/lib/index.css";
import "@univerjs/ui/lib/index.css";
import "@univerjs/docs-ui/lib/index.css";

import {Univer} from "@univerjs/core";
import {defaultTheme} from "@univerjs/design";

import {UniverFormulaEnginePlugin} from "@univerjs/engine-formula";
import {UniverRenderEnginePlugin} from "@univerjs/engine-render";

import {UniverUIPlugin} from "@univerjs/ui";

import {UniverDocsPlugin} from "@univerjs/docs";
import {UniverDocsUIPlugin} from "@univerjs/docs-ui";

import { UniverSheetsPlugin } from "@univerjs/sheets";
import { UniverSheetsFormulaPlugin } from "@univerjs/sheets-formula";
import { UniverSheetsUIPlugin } from "@univerjs/sheets-ui";

import {LocaleType, Tools, UniverInstanceType} from '@univerjs/core'
import {zhCN as DesignZhCN} from '@univerjs/design';
import {zhCN as DocsUIZhCN} from '@univerjs/docs-ui';
import {zhCN as SheetsZhCN} from '@univerjs/sheets';
import {zhCN as SheetsUIZhCN} from '@univerjs/sheets-ui';
import {zhCN as UIZhCN} from '@univerjs/ui';
import {onMounted, ref} from "vue";
import {useAppStore} from "@/store/app";
import {useThemeStore} from "@/store/theme";

const splitterModel = ref(20)
const divRef = ref<HTMLDivElement>(null)
const app = useAppStore()
const theme = useThemeStore()


onMounted(() => {
  setTimeout(() => {
    const univer = new Univer({
      theme: defaultTheme,
      locale: LocaleType.ZH_CN,
      locales: {
        [LocaleType.ZH_CN]: Tools.deepMerge(
            DesignZhCN,
            DocsUIZhCN,
            SheetsZhCN,
            SheetsUIZhCN,
            UIZhCN
        ),
      },
    });

    univer.registerPlugin(UniverRenderEnginePlugin);
    univer.registerPlugin(UniverFormulaEnginePlugin);

    univer.registerPlugin(UniverUIPlugin, {
      container: 'office',
    });

    univer.registerPlugin(UniverDocsPlugin, {
      hasScroll: false,
    });
    univer.registerPlugin(UniverDocsUIPlugin);

    univer.registerPlugin(UniverSheetsPlugin);
    univer.registerPlugin(UniverSheetsUIPlugin);
    univer.registerPlugin(UniverSheetsFormulaPlugin);

    univer.createUnit(UniverInstanceType.UNIVER_SHEET, {});
  }, 2000)

})
</script>


<style scoped>

</style>