<template>
  <div v-html="renderedContent"></div>
</template>

<script>
import MarkdownIt from "markdown-it";
import markdownItKatex from "markdown-it-katex";
import "katex/dist/katex.min.css";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";

export default {
  name: "MarkdownRenderer",
  props: {
    content: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      md: new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true,
        highlight: function (str, lang) {
          if (lang && hljs.getLanguage(lang)) {
            return '<pre class="hljs"><code>' +
                hljs.highlight(str, {language: lang}).value +
                '</code></pre>';
          }
          return '<pre class="hljs"><code>' + this.md.utils.escapeHtml(str) + '</code></pre>';
        }
      }).use(markdownItKatex)
    };
  },
  computed: {
    renderedContent() {
      return this.md.render(this.content);
    }
  }
};
</script>
