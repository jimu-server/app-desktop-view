<template>
  <div class="fit column" style="padding: 5px">
    <div class="file-selector full-width">
      <el-select
          v-model="data"
          value-key="path"
          :teleported="false"
      >
        <el-option v-for="item in list"
                   :key="item.path"
                   :value="item">
          <div class="fit row">
            <div class="select-icon">
              <el-icon>
                <span class="iconfont jimu-wenjianjia1"></span>
              </el-icon>
            </div>
            <div style="margin-left: 5px">
              {{ item.path }}
            </div>
          </div>
        </el-option>
        <template #label>
          <div class="fit row">
            <div class="select-icon">
              <el-icon>
                <span class="iconfont jimu-wenjianjia1"></span>
              </el-icon>
            </div>
            <div style="margin-left: 5px">
              {{ data.path }}
            </div>
          </div>
        </template>
      </el-select>
    </div>
    <div class="file-view">
      <q-scroll-area class="fit">
        <el-tree
            ref="tree"
            :data="treeData"
            :props="fileProps"
            lazy
            show-checkbox
            :load="getChildren"
        >
          <template #default="{node,data}">
            <div class="fit row">
              <div class="select-icon column justify-center">
                <!--                <el-icon>
                                  <span :class="'iconfont '+getFileIcon(data)"></span>
                                </el-icon>-->
                <q-icon :name="getFileIcon(data)"/>
              </div>
              <div class=" column justify-center" style="margin-left: 5px">
                {{ getFileName(data) }}
              </div>
            </div>
          </template>
        </el-tree>
      </q-scroll-area>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {useElectronStore} from "@/store/electron";

const electron = useElectronStore()
const tree = ref()
const data = ref<FileTree>()
const list = ref<FileTree[]>([])
const treeData = ref<FileTree[]>([])

defineExpose({
  getFiles,
})

const props = defineProps({
  // 文件类型过滤器
  filter: {
    type: Array,
    default: ['docx']
  }
})


interface FileTree {
  path: string
  name: string
  isDirectory: boolean
  parentPath: string
  children?: FileTree[]
}

const fileProps = {
  label: function (data, node) {
    let name = data.name;
    let endsWith = name.endsWith(".url");
    if (endsWith) {
      name = name.substring(0, name.length - 4)
    }
    endsWith = name.endsWith(".lnk");
    if (endsWith) {
      name = name.substring(0, name.length - 4)
    }
    return name
  },
  isLeaf: function (data, node) {
    return !data.isDirectory;
  },
  disabled: function (data, node) {
    if (data.isDirectory) {
      return true;
    }
    return false;
  },
  children: 'children',
}

function getChildren(node, resolve, reject) {
  setTimeout(async () => {
    let data = node.data;
    let newVar = []
    if (data.path && data.name) {
      let fullPath = data.path + "\\" + data.name
      console.log(fullPath)
      newVar = await electron.getChildPath(fullPath);
      newVar = newVar.filter(item => {
        return fileFilter(item);
      })
    }
    resolve(newVar)
  }, 200)

}

function getFileIcon(data: FileTree) {
  if (data.isDirectory) {
    return 'jimu-wenjianjia1'
  }
  if (data.name.endsWith(".docx") || data.name.endsWith(".doc")) {
    return 'img:public/file-icon/docx1.png'
  }
  if (data.name.endsWith(".xlsx")) {
    return 'img:public/file-icon/xlsx.png'
  }
  return 'jimu-wenjian'
}

function getFileName(data) {
  let name = data.name;
  let endsWith = name.endsWith(".url");
  if (endsWith) {
    name = name.substring(0, name.length - 4)
  }
  endsWith = name.endsWith(".lnk");
  if (endsWith) {
    name = name.substring(0, name.length - 4)
  }
  return name
}

function getFiles() {
  let nodes = tree.value.getCheckedNodes();
  return nodes.map((item: any) => {
    console.log(item)
    return {
      name: item.name,
      path: item.path + "\\" + item.name
    }
  });
}

function fileFilter(item: FileTree) {
  if (item.isDirectory) {
    return true;
  }
  let suffix
  let number = item.name.lastIndexOf(".");
  if (number !== -1) {
    suffix = item.name.substring(number + 1, item.name.length)
    return props.filter.includes(suffix)
  }
  return false;
}


watch(data, async (val: FileTree) => {
  // 根据根目录加载当前目录下的子内容
  treeData.value = await electron.getChildPath(val.path)
  treeData.value = treeData.value.filter((item: FileTree) => {
    return fileFilter(item);
  })
})

onMounted(async () => {
  // 打开文件选择器,初始化选择器数据 默认初始化为用户桌面
  let desktopPath = await electron.getDesktopPath();
  if (desktopPath != "") {
    list.value = [
      {
        name: "Desktop",
        path: desktopPath,
        parentPath: desktopPath,
        isDirectory: true,
        children: []
      }
    ]
    data.value = list.value[0]
  }
})
</script>

<style scoped>
.system-file-select-dialog {
  width: 35vw !important;
  height: 50vh !important;
}

.close-btn:hover {
  background-color: red;
  color: white;
}

.file-selector {
  margin-top: 5px;
}

.file-view {
  flex-grow: 1 !important;
  margin-top: 5px;
  border: 1px solid rgba(204, 204, 204, 0.62);
  border-radius: 5px;
}


.file-footer {
  height: 30px;
}
</style>
<style>

</style>