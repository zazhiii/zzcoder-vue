<template>
  <div class="markdown-editor">
    <div class="split-view">
      <!-- 编辑器部分 -->
      <div class="split-left">
        <div class="editor-toolbar">
          <span class="toolbar-title">
            <i class="el-icon-edit"></i> 编辑器
          </span>
          <div class="toolbar-buttons">
            <!-- 基础格式 -->
            <el-button-group size="mini">
              <el-button @click="insertMarkdown('**粗体**')" title="粗体" size="mini">粗体</el-button>
              <el-button @click="insertMarkdown('*斜体*')" title="斜体" size="mini"> 斜体</el-button>
              <el-button @click="insertMarkdown('`code`')" title="行内代码" size="mini">行内代码</el-button>
              <el-button @click="insertMarkdown('# ')" title="标题" size="mini">H1</el-button>
              <el-button @click="insertMarkdown('## ')" title="标题" size="mini">H2</el-button>
              <el-button @click="insertMarkdown('### ')" title="子标题" size="mini">H3</el-button>
              <el-button @click="insertMarkdown('\n- ')" title="列表" size="mini">列表</el-button>
              <el-button @click="insertMarkdown('\n> ')" title="引用" size="mini">引用</el-button>
              <el-button @click="insertMarkdown('[链接](URL)')" title="链接" size="mini">链接</el-button>
              <el-button @click="insertCodeBlock" title="代码块" size="mini">代码块</el-button>
              <el-button @click="insertMarkdown('$公式$')" title="内联公式" size="mini">内联公式</el-button>
              <el-button @click="insertMathBlock" title="公式块" size="mini">公式块</el-button>
            </el-button-group>
          </div>
        </div>

        <div class="textarea-container">
          <el-input
              ref="textarea"
              type="textarea"
              v-model="content"
              :placeholder="placeholder"
              :autosize="{minRows: 18, maxRows: 18}"
              @input="handleInput"
              @keydown.tab.prevent="handleTab"
          ></el-input>
        </div>
      </div>

      <!-- 预览部分 -->
      <div class="split-right">
        <div class="preview-header">
          <i class="el-icon-view"></i> 实时预览
          <div class="preview-actions">
            <el-button size="mini" @click="copyMarkdown" title="复制Markdown">
              <i class="el-icon-document-copy"></i>
            </el-button>
            <el-button size="mini" @click="downloadMarkdown" title="下载Markdown">
              <i class="el-icon-download"></i>
            </el-button>
          </div>
        </div>

        <div class="preview-content">
          <div v-if="content.trim()" class="markdown-preview">
            <markdown-renderer :content="content"></markdown-renderer>
          </div>
          <div v-else class="empty-preview">
            <i class="el-icon-document"></i>
            <p>在左侧编辑器中输入Markdown内容</p>
            <p class="tip">支持标准Markdown语法和LaTeX数学公式</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MarkdownRenderer from '@/components/MarkdownRenderer.vue';

export default {
  name: 'MarkdownEditor',
  components: {MarkdownRenderer},
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '在此编写 Markdown 内容...\n\n支持的语法：\n- **粗体** *斜体* ~~删除线~~\n- # 标题\n- - 列表\n- [链接](URL)\n- `代码`\n- > 引用\n- $数学公式$\n- $$块级公式$$'
    },
    height: {
      type: [String, Number],
      default: 500
    }
  },
  data() {
    return {
      content: this.value
    }
  },
  watch: {
    value(newVal) {
      if (newVal !== this.content) {
        this.content = newVal;
      }
    },
    content(newVal) {
      this.$emit('input', newVal);
      this.$emit('change', newVal);
    }
  },
  computed: {
    editorHeight() {
      return typeof this.height === 'number' ? `${this.height}px` : this.height;
    }
  },
  methods: {
    // 插入Markdown语法
    insertMarkdown(text) {
      const textarea = this.$refs.textarea.$refs.textarea;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = this.content;

      // 如果选中了文本，包装选中的内容
      if (start !== end) {
        const selectedText = value.substring(start, end);
        // 对于格式化文本，包装选中内容
        if (text.includes('**') || text.includes('*') || text.includes('`') || text.includes('~~')) {
          const wrapper = text.replace(/[^*`~]/g, '');
          this.content = value.substring(0, start) + wrapper + selectedText + wrapper + value.substring(end);
          this.$nextTick(() => {
            textarea.focus();
            textarea.setSelectionRange(start + wrapper.length, start + wrapper.length + selectedText.length);
          });
          return;
        }
      }

      this.content = value.substring(0, start) + text + value.substring(end);

      this.$nextTick(() => {
        textarea.focus();
        const newPos = start + text.length;
        textarea.setSelectionRange(newPos, newPos);
      });
    },

    // 插入代码块
    insertCodeBlock() {
      const codeBlock = '\n```javascript\n// 在这里编写代码\n```\n';
      this.insertMarkdown(codeBlock);
    },

    // 插入数学公式块
    insertMathBlock() {
      const mathBlock = '\n$$\n\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}\n$$\n';
      this.insertMarkdown(mathBlock);
    },

    // 插入表格
    insertTable() {
      const table = '\n| 表头1 | 表头2 | 表头3 |\n|-------|-------|-------|\n| 内容1 | 内容2 | 内容3 |\n| 内容4 | 内容5 | 内容6 |\n';
      this.insertMarkdown(table);
    },

    // 处理Tab键缩进
    handleTab(event) {
      const textarea = event.target;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = this.content;

      // 插入两个空格作为缩进
      this.content = value.substring(0, start) + '  ' + value.substring(end);

      this.$nextTick(() => {
        textarea.setSelectionRange(start + 2, start + 2);
      });
    },

    // 处理输入事件
    handleInput(value) {
      this.content = value;
    },

    // 清空内容
    clearContent() {
      this.$confirm('确定要清空所有内容吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.content = '';
        this.$refs.textarea.$refs.textarea.focus();
      });
    },

    // 复制Markdown内容
    copyMarkdown() {
      if (!this.content.trim()) {
        this.$message.warning('没有内容可复制');
        return;
      }

      // 创建临时文本区域
      const textarea = document.createElement('textarea');
      textarea.value = this.content;
      document.body.appendChild(textarea);
      textarea.select();

      try {
        document.execCommand('copy');
        this.$message.success('Markdown内容已复制到剪贴板');
      } catch (err) {
        this.$message.error('复制失败');
      }

      document.body.removeChild(textarea);
    },

    // 下载Markdown文件
    downloadMarkdown() {
      if (!this.content.trim()) {
        this.$message.warning('没有内容可下载');
        return;
      }

      const blob = new Blob([this.content], {type: 'text/markdown;charset=utf-8'});
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `markdown_${new Date().getTime()}.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      this.$message.success('Markdown文件已下载');
    },

    // 获取内容
    getContent() {
      return this.content;
    },

    // 设置内容
    setContent(content) {
      this.content = content;
    },

    // 插入内容到光标位置
    insertAtCursor(text) {
      this.insertMarkdown(text);
    },

    // 聚焦编辑器
    focus() {
      this.$refs.textarea.$refs.textarea.focus();
    }
  }
}
</script>

<style scoped>
.markdown-editor {
  width: 100%;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}

.split-view {
  display: flex;
  height: v-bind(editorHeight);
  min-height: 400px;
}

.split-left, .split-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.split-left {
  border-right: 1px solid #ebeef5;
}

.split-right {
  background: #fafafa;
}

/* 工具栏样式 */
.editor-toolbar {
  background: #f5f7fa;
  padding: 8px 12px;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  min-height: 41px;
  flex-wrap: wrap;
  gap: 8px;
}

.toolbar-title {
  font-weight: 500;
  color: #606266;
  display: flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
}

.toolbar-buttons {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}

/* 编辑器容器 */
.textarea-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.textarea-container .el-textarea {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.textarea-container .el-textarea__inner {
  flex: 1;
  height: auto !important;
  min-height: 200px !important;
  resize: none !important;
  border: none;
  border-radius: 0;
  outline: none;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.6;
  padding: 15px;
}

/* 预览区域 */
.preview-header {
  background: #f5f7fa;
  padding: 8px 12px;
  border-bottom: 1px solid #ebeef5;
  font-weight: 500;
  color: #606266;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5px;
  flex-shrink: 0;
  min-height: 41px;
}

.preview-actions {
  display: flex;
  gap: 4px;
}

.preview-content {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  min-height: 0;
  background: white;
}

.markdown-preview {
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  word-break: break-word;
}

.empty-preview {
  text-align: center;
  color: #909399;
  padding: 60px 20px;
}

.empty-preview i {
  font-size: 48px;
  margin-bottom: 16px;
  display: block;
  color: #c0c4cc;
}

.empty-preview p {
  margin: 8px 0;
  font-size: 14px;
}

.empty-preview .tip {
  font-size: 12px;
  color: #c0c4cc;
}

/* 滚动条美化 */
.preview-content::-webkit-scrollbar {
  width: 6px;
}

.preview-content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.preview-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.preview-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .split-view {
    flex-direction: column;
    height: auto;
  }

  .split-left, .split-right {
    border: none;
    border-bottom: 1px solid #ebeef5;
  }

  .split-left {
    min-height: 300px;
  }

  .split-right {
    min-height: 250px;
  }

  .editor-toolbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .toolbar-buttons {
    width: 100%;
    justify-content: center;
  }
}

/* 小屏幕下隐藏部分按钮文字 */
@media (max-width: 576px) {
  .toolbar-buttons .el-button span {
    display: none;
  }
}
</style>
