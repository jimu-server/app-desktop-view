import {Plugin} from '@ckeditor/ckeditor5-core';
import AutoCompletionUI
    from "@/components/system-components/tool/chatGptTool/chat/editor/editor_plugins/AutoCompletion/AutoCompletionUI";
import AutoCompletionEditing
    from "@/components/system-components/tool/chatGptTool/chat/editor/editor_plugins/AutoCompletion/AutoCompletionEditing";



export default class AutoCompletion extends Plugin {
    static get requires() {
        return [AutoCompletionUI, AutoCompletionEditing];
    }
}
