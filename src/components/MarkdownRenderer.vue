<template>
  <div v-html="renderedContent"></div>
</template>


<script>
import MarkdownIt from "markdown-it";
import markdownItKatex from "@vscode/markdown-it-katex";
import hljs from "highlight.js";
import "highlight.js/styles/github.css"; // 你可以换成其他主题，比如 atom-one-dark.css

export default {
  name: "MarkdownRenderer",
  props: {
    content: String
  },
  computed: {
    renderedContent() {
      const md = new MarkdownIt({
        highlight: function (str, lang) {
          if (lang && hljs.getLanguage(lang)) {
            return `<pre class="hljs"><code>${
                hljs.highlight(str, {language: lang, ignoreIllegals: true}).value
            }</code></pre>`;
          }
          return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
        }
      })
      md.use(markdownItKatex, {throwOnError: false, errorColor: " #cc0000"})
      return md.render(this.content);
    }
  }
};
</script>