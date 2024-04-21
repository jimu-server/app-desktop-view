import {Plugin} from '@ckeditor/ckeditor5-core';
import FileBlockCardCardUI
    from "@/components/system-components/tool/chatGptTool/chat/editor/editor_plugins/FileBlockPlugin/FileBlockCardCardUI";
import FileBlockCardEditing
    from "@/components/system-components/tool/chatGptTool/chat/editor/editor_plugins/FileBlockPlugin/FileBlockCardEditing";



export default class FileBlockCard extends Plugin {
    static get requires() {
        return [FileBlockCardCardUI, FileBlockCardEditing];
    }
}
