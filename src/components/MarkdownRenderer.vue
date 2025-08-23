<template>
  <div v-html="renderedContent"></div>
</template>


<script>
import MarkdownIt from "markdown-it";
import markdownItKatex from "@vscode/markdown-it-katex";

export default {
  name: "MarkdownRenderer",
  props: {
    content: String
  },
  computed: {
    renderedContent() {
      const md = new MarkdownIt()
      md.use(markdownItKatex)
      return md.render(this.content);
    }
  }
};
</script>