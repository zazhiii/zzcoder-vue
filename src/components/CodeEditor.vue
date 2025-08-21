<template>
  <div ref="editor" class="code-editor" :style="{ height: height + 'px' }"></div>
</template>

<script>
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/clike/clike.js";   // C/C++
import "codemirror/mode/python/python.js"; // Python
import "codemirror/mode/javascript/javascript.js"; // JS

export default {
  name: "CodeEditor",
  props: {
    value: String,
    language: {
      type: String,
      default: "cpp"
    },
    height: Number
  },
  mounted() {
    this.editor = CodeMirror(this.$refs.editor, {
      value: this.value || "",
      mode: this.mapLanguage(this.language),
      theme: "dracula",
      lineNumbers: true,
      autoCloseBrackets: true,
      matchBrackets: true,
      autoResize: true
    });

    // 设置高度
    this.editor.setSize("100%", `${this.height}px`);

    this.editor.on("change", () => {
      this.$emit("input", this.editor.getValue());
    });
  },
  methods: {
    mapLanguage(lang) {
      switch (lang) {
        case "cpp": return "text/x-c++src";
        case "java": return "text/x-java";
        case "python": return "text/x-python";
        case "js": return "javascript";
        default: return "text/plain";
      }
    }
  }
};
</script>

<style>
.code-editor {
  border: 2px solid #ddd;
}
</style>
