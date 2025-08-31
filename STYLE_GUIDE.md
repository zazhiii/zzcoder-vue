# 样式系统使用指南

## 概述

本项目已经集成了完整的样式重置和通用样式系统，包括：

1. **CSS Reset** (`src/styles/reset.css`) - 重置浏览器默认样式
2. **全局样式** (`src/styles/global.css`) - CSS变量和工具类

## 文件说明

### reset.css
- 基于现代 CSS Reset 最佳实践
- 解决浏览器兼容性问题
- 提供一致的基础样式
- 包含无障碍访问优化

### global.css
- CSS 变量定义（颜色、间距、字体等）
- 工具类（布局、文本、间距等）
- 通用动画
- 响应式断点

## CSS 变量使用

```css
/* 在组件中使用CSS变量 */
.my-component {
  color: var(--primary-color);
  background: var(--background-base);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-base);
  box-shadow: var(--shadow-light);
  transition: var(--transition-base);
}
```

## 工具类使用示例

```vue
<template>
  <!-- 布局 -->
  <div class="flex items-center justify-between p-md">
    
    <!-- 文本样式 -->
    <h1 class="text-xl font-bold text-primary">标题</h1>
    
    <!-- 按钮 -->
    <button class="px-lg py-sm rounded shadow transition cursor-pointer">
      按钮
    </button>
    
    <!-- 卡片 -->
    <div class="bg-white rounded-lg shadow p-lg m-md">
      <p class="text-regular mb-sm">内容</p>
    </div>
    
  </div>
</template>
```

## 主要工具类

### 布局
- `flex`, `flex-col`, `flex-wrap`
- `items-center`, `items-start`, `items-end`
- `justify-center`, `justify-between`, `justify-around`

### 间距
- `p-{size}` - padding (xs, sm, md, lg, xl, xxl)
- `m-{size}` - margin
- `px-{size}`, `py-{size}` - 水平/垂直内边距
- `mx-{size}`, `my-{size}` - 水平/垂直外边距

### 文本
- `text-{size}` - 字体大小 (xs, sm, md, lg, xl, xxl, xxxl)
- `text-{color}` - 文本颜色 (primary, regular, secondary, placeholder)
- `font-{weight}` - 字体粗细 (light, normal, medium, semibold, bold)
- `text-{align}` - 文本对齐 (left, center, right)

### 圆角和阴影
- `rounded`, `rounded-sm`, `rounded-lg`, `rounded-full`
- `shadow`, `shadow-light`, `shadow-dark`, `shadow-none`

### 动画
- `transition`, `transition-fast`, `transition-slow`
- `animate-fadeIn`, `animate-slideInUp`, `animate-bounce`

## 颜色系统

### 主色调
- `--primary-color`: #667eea (主色)
- `--secondary-color`: #764ba2 (辅色)

### 功能色彩
- `--success-color`: #67c23a (成功)
- `--warning-color`: #e6a23c (警告)
- `--danger-color`: #f56c6c (危险)
- `--info-color`: #909399 (信息)

### 文本色彩
- `--text-primary`: #303133 (主要文本)
- `--text-regular`: #606266 (常规文本)
- `--text-secondary`: #909399 (次要文本)
- `--text-placeholder`: #c0c4cc (占位文本)

## 响应式设计

```vue
<template>
  <!-- 在小屏幕隐藏，在大屏幕显示 -->
  <div class="hidden md:block">桌面端内容</div>
  
  <!-- 在小屏幕显示，在大屏幕隐藏 -->
  <div class="block md:hidden">移动端内容</div>
  
  <!-- 响应式文本对齐 -->
  <div class="text-left sm:text-center">响应式文本</div>
</template>
```

## 最佳实践

1. **优先使用工具类**：对于常见样式，优先使用工具类而不是自定义CSS
2. **使用CSS变量**：保持颜色和间距的一致性
3. **响应式设计**：使用响应式工具类适配不同屏幕
4. **语义化命名**：自定义样式使用语义化的类名
5. **避免内联样式**：除非特殊情况，避免使用内联样式

## 组件样式示例

```vue
<template>
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">卡片标题</h3>
    </div>
    <div class="card-body">
      <p class="card-text">卡片内容</p>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: var(--background-white);
  border-radius: var(--border-radius-base);
  box-shadow: var(--shadow-light);
  transition: var(--transition-base);
}

.card:hover {
  box-shadow: var(--shadow-base);
  transform: translateY(-2px);
}

.card-header {
  padding: var(--spacing-lg) var(--spacing-lg) var(--spacing-md);
  border-bottom: 1px solid var(--border-extra-light);
}

.card-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.card-body {
  padding: var(--spacing-md) var(--spacing-lg) var(--spacing-lg);
}

.card-text {
  color: var(--text-regular);
  line-height: 1.6;
  margin: 0;
}
</style>
```

## 注意事项

1. **样式优先级**：工具类具有较高的优先级，可能需要使用 `!important` 覆盖
2. **文件引入顺序**：reset.css 必须在其他样式之前引入
3. **浏览器支持**：CSS变量需要IE11+支持，对于老旧浏览器可能需要fallback
4. **性能考虑**：避免过度使用工具类，对于复杂组件建议使用组件级样式

通过这套样式系统，您可以快速构建一致、美观的用户界面！
