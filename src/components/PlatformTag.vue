<template>
  <span
    class="platform-tag"
    :class="platformClass"
    @click="handleClick"
    :title="clickable ? `点击访问 ${platformName}` : ''"
  >
    <i :class="iconClass" v-if="showIcon"></i>
    {{ platformName }}
    <i class="el-icon-top-right" v-if="clickable"></i>
  </span>
</template>

<script>
export default {
  name: 'PlatformTag',
  props: {
    // 平台名称
    platform: {
      type: String,
      required: true,
      validator: (value) => {
        return ['leetcode', 'luogu', 'codeforces', 'AtCoder', 'NowCoder', 'HDU', 'POJ'].includes(value);
      }
    },
    // 是否可点击跳转
    clickable: {
      type: Boolean,
      default: true
    },
    // 是否显示图标
    showIcon: {
      type: Boolean,
      default: false
    },
    // 自定义跳转链接（可选）
    customUrl: {
      type: String,
      default: ''
    },
    // 尺寸大小
    size: {
      type: String,
      default: 'medium',
      validator: (value) => {
        return ['small', 'medium', 'large'].includes(value);
      }
    }
  },
  computed: {
    platformName() {
      // 统一平台名称显示
      const nameMap = {
        'LeetCode': 'LeetCode',
        'Luogu': '洛谷',
        'Codeforces': 'Codeforces',
        'AtCoder': 'AtCoder',
        'NowCoder': '牛客',
        'HDU': 'HDU',
        'POJ': 'POJ'
      };
      return nameMap[this.platform] || this.platform;
    },
    platformClass() {
      return [
        this.platform.toLowerCase(),
        this.size,
        {
          'clickable': this.clickable,
          'with-icon': this.showIcon
        }
      ];
    },
    iconClass() {
      // 为不同平台设置图标
      const iconMap = {
        'LeetCode': 'el-icon-cpu',
        'Luogu': 'el-icon-trophy',
        'Codeforces': 'el-icon-data-analysis',
        'AtCoder': 'el-icon-medal',
        'NowCoder': 'el-icon-school',
        'HDU': 'el-icon-collection',
        'POJ': 'el-icon-notebook-1'
      };
      return iconMap[this.platform] || 'el-icon-link';
    },
    platformUrl() {
      if (this.customUrl) {
        return this.customUrl;
      }

      // 默认的平台首页链接
      const urlMap = {
        'LeetCode': 'https://leetcode.cn/',
        'Luogu': 'https://www.luogu.com.cn/',
        'Codeforces': 'https://codeforces.com/',
        'AtCoder': 'https://atcoder.jp/',
        'NowCoder': 'https://www.nowcoder.com/',
        'HDU': 'https://acm.hdu.edu.cn/',
        'POJ': 'http://poj.org/'
      };
      return urlMap[this.platform] || '#';
    }
  },
  methods: {
    handleClick() {
      if (!this.clickable) return;

      this.$emit('click', {
        platform: this.platform,
        url: this.platformUrl
      });

      // 默认行为：在新窗口打开链接
      if (this.platformUrl && this.platformUrl !== '#') {
        window.open(this.platformUrl, '_blank');
      }
    }
  }
}
</script>

<style scoped>
.platform-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
  user-select: none;
}

/* 尺寸样式 */
.platform-tag.small {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 8px;
}

.platform-tag.medium {
  font-size: 12px;
  padding: 4px 8px;
}

.platform-tag.large {
  font-size: 14px;
  padding: 6px 12px;
  border-radius: 16px;
}

/* 可点击样式 */
.platform-tag.clickable {
  cursor: pointer;
}

.platform-tag.clickable:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* 带图标样式 */
.platform-tag.with-icon {
  gap: 6px;
}

.external-link-icon {
  font-size: 10px;
  opacity: 0.7;
}

/* 平台特定样式 */
.platform-tag.leetcode {
  background: linear-gradient(135deg, #FFA116 0%, #FF8C00 100%);
  color: white;
}

.platform-tag.leetcode:hover {
  background: linear-gradient(135deg, #FF8C00 0%, #FF7700 100%);
}

.platform-tag.luogu {
  background: linear-gradient(135deg, #0E90FF 0%, #1E90FF 100%);
  color: white;
}

.platform-tag.luogu:hover {
  background: linear-gradient(135deg, #1E90FF 0%, #4169E1 100%);
}

.platform-tag.codeforces {
  background: linear-gradient(135deg, #FF4757 0%, #FF3742 100%);
  color: white;
}

.platform-tag.codeforces:hover {
  background: linear-gradient(135deg, #FF3742 0%, #FF2D2D 100%);
}

.platform-tag.atcoder {
  background: linear-gradient(135deg, #3742FA 0%, #2F3BF0 100%);
  color: white;
}

.platform-tag.atcoder:hover {
  background: linear-gradient(135deg, #2F3BF0 0%, #2834E5 100%);
}

.platform-tag.nowcoder {
  background: linear-gradient(135deg, #2ED573 0%, #1DD1A1 100%);
  color: white;
}

.platform-tag.nowcoder:hover {
  background: linear-gradient(135deg, #1DD1A1 0%, #10C896 100%);
}

.platform-tag.hdu {
  background: linear-gradient(135deg, #5F27CD 0%, #4834D4 100%);
  color: white;
}

.platform-tag.hdu:hover {
  background: linear-gradient(135deg, #4834D4 0%, #3B2BCA 100%);
}

.platform-tag.poj {
  background: linear-gradient(135deg, #747D8C 0%, #57606F 100%);
  color: white;
}

.platform-tag.poj:hover {
  background: linear-gradient(135deg, #57606F 0%, #4A5568 100%);
}

/* 禁用状态样式 */
.platform-tag:not(.clickable) {
  opacity: 0.8;
}

/* 暗色主题适配 */
@media (prefers-color-scheme: dark) {
  .platform-tag {
    box-shadow: 0 1px 3px rgba(255, 255, 255, 0.1);
  }

  .platform-tag.clickable:hover {
    box-shadow: 0 2px 8px rgba(255, 255, 255, 0.2);
  }
}
</style>
