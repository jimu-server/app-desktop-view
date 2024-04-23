import markdownit from 'markdown-it'
import {escapeHtml} from 'markdown-it/lib/common/utils.mjs'
import Prism from 'prismjs';
import MarkdownItMark from 'markdown-it-mark'
import MarkdownItSub from 'markdown-it-sub'
import MarkdownItSup from 'markdown-it-sup'
// import MarkdownItEmoji from 'markdown-it-emoji'
import MarkdownItTestgen from 'markdown-it-testgen'
import MarkdownItIns from 'markdown-it-ins'
import MarkdownItContainer from 'markdown-it-container'
import MarkdownItAddr from 'markdown-it-abbr'
import MarkdownItFootnote from 'markdown-it-footnote'
import {useThemeStore} from "@/store/theme";
import pinia from "@/pinia";


const md = markdownit({
    html: true,
    typographer: true,
    breaks: true,
    highlight: function (str, lang) {
        const theme = useThemeStore(pinia)
        if (lang) {
            try {

                if (theme.dark) {
                    return '<pre class="markdown-code-block" theme="dark"><code>' + Prism.highlight(str, Prism.languages[lang], lang) + '</code></pre>';
                }
                return '<pre class="markdown-code-block"><code>' + Prism.highlight(str, Prism.languages[lang], lang) + '</code></pre>';
            } catch (__) {
            }
        }
        if (theme.dark) {
            return '<pre class="markdown-code-block" theme="dark"><code>' +Prism.highlight(str, Prism.languages.plain, 'plain') + '</code></pre>';
        }
        return '<pre class="markdown-code-block"><code>' + Prism.highlight(str, Prism.languages.plain, 'plain') + '</code></pre>';
    }
})

/*
* @description: 覆盖原来的内联代码规则,接入判断当前主题,动态写入dark 属性
* */
md.renderer.rules.code_inline = (tokens, idx, options, env, slf) => {
    const theme = useThemeStore(pinia)
    const token = tokens[idx]
    if (theme.dark) {
        return '<code theme="dark"' + slf.renderAttrs(token) + '>' + escapeHtml(token.content) + '</code>'
    }
    return '<code' + slf.renderAttrs(token) + '>' + escapeHtml(token.content) + '</code>'
}


md.use(MarkdownItMark)
md.use(MarkdownItSub)
md.use(MarkdownItSup)
// md.use(MarkdownItEmoji)
// md.use(MarkdownItTestgen)
md.use(MarkdownItIns)
md.use(MarkdownItContainer)
md.use(MarkdownItAddr)
md.use(MarkdownItFootnote)

export default md
