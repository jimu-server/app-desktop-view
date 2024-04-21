import markdownit from 'markdown-it'
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


const md = markdownit({
    html: true,
    typographer: true,
    breaks: true,
    highlight: function (str, lang) {
        if (lang) {
            try {
                return '<pre class="markdown-code-block"><code>' + Prism.highlight(str, Prism.languages[lang], lang) + '</code></pre>';
            } catch (__) {
            }
        }
        return '<pre class="markdown-code-block"><code>' + Prism.highlight(str, Prism.languages.plain, 'plain') + '</code></pre>';
    }
})

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
