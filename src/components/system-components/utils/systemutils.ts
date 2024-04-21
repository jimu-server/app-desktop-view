import data from "@/assets/icons/iconfont.json"

export function IsEmpty(value: any): boolean {
    return Object.keys(value).length == 0
}

export function format_date(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
}

export function debounce(fn: Function, delay: number) {
    let timer = null;
    return function (...args: any) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}


export function formatTime(timeStamp) {
    let date = new Date(timeStamp);
    let value = date.toLocaleString()
    return getTimestampDifference(value);
}

export function getTimestampDifference(value): string {
    let now = new Date();
    let sendTime = new Date(value);
    let differenceInMilliseconds = sendTime.getTime() - now.getTime();

    // 对未来时间的处理
    if (differenceInMilliseconds > 0) {
        if (differenceInMilliseconds < 60000) {
            return "片刻后";
        }
        if (differenceInMilliseconds < 3600000) {
            return Math.floor(differenceInMilliseconds / 60000) + "分钟后";
        }
        if (differenceInMilliseconds < 86400000) {
            return Math.floor(differenceInMilliseconds / 3600000) + "小时后";
        }
        if (differenceInMilliseconds < 604800000) {
            return Math.floor(differenceInMilliseconds / 86400000) + "天后";
        }
        if (differenceInMilliseconds < 2592000000) {
            return Math.floor(differenceInMilliseconds / 604800000) + "周后";
        }
        if (differenceInMilliseconds < 31536000000) {
            return Math.floor(differenceInMilliseconds / 2592000000) + "月后";
        }
        return Math.floor(differenceInMilliseconds / 31536000000) + "年后";
    }

    // 对过去时间的处理
    differenceInMilliseconds = -differenceInMilliseconds; // 转为正值以简化计算
    if (differenceInMilliseconds < 60000) {
        return "刚刚";
    }
    if (differenceInMilliseconds < 3600000) {
        return Math.floor(differenceInMilliseconds / 60000) + "分钟前";
    }
    if (differenceInMilliseconds < 86400000) {
        return Math.floor(differenceInMilliseconds / 3600000) + "小时前";
    }
    if (differenceInMilliseconds < 604800000) {
        return Math.floor(differenceInMilliseconds / 86400000) + "天前";
    }
    if (differenceInMilliseconds < 2592000000) {
        return Math.floor(differenceInMilliseconds / 604800000) + "周前";
    }
    if (differenceInMilliseconds < 31536000000) {
        return Math.floor(differenceInMilliseconds / 2592000000) + "月前";
    }
    return Math.floor(differenceInMilliseconds / 31536000000) + "年前";
}


/*
* @description: 加载系统图标
* */
export function getIcon() {
    let arr = []
    let prefix = 'icon iconfont ' + data.css_prefix_text
    data.glyphs.forEach(item => {
        arr.push({
            name: item.name,
            q_icon: item.font_class,
            el_icon: prefix + item.font_class,
            class: data.css_prefix_text + item.font_class
        })
    })
    return arr
}

