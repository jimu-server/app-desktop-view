import {defineStore} from "pinia";
import {Records} from "@/components/system-components/model/system";
import {NotifyStatus, NotifyToolStatusType} from "@/components/system-components/model/enum";


export const useNotifyStore = defineStore('notify', {
    state: () => {
        return {
            list: [] as Records[],
            unread: 0,
        }
    },
    persist: true,
    getters: {
        getStatus() {
            this.unread = 0
            this.list.forEach(item => {
                if (item.status === NotifyStatus.UnRead) this.unread++
            })
            if (this.unread == 0 && this.list.length > 0) {
                return NotifyToolStatusType.ReadAllNotify
            } else if (this.unread > 0) {
                return NotifyToolStatusType.UnReadNotify
            } else {
                return NotifyToolStatusType.NoNotify
            }
        }
    },
    actions: {}
})