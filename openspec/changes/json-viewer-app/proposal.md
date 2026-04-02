## Why

当前项目只有一个空白的脚手架页面。需要构建核心功能——一个在线 JSON Viewer 工具，面向开发者的**数据探索**和 **JSON 格式化**场景。开发者经常需要处理大型 API 响应或配置文件，需要一个高效、不卡顿的工具来查看和格式化 JSON 数据。

## What Changes

将空白首页改造为功能完整的 JSON Viewer 应用：

- 新增左右分栏布局，中间分割线可拖拽调节
- 左侧集成 CodeMirror 6 编辑器，支持三种 JSON 输入方式（文本编辑、文件拖拽、URL 加载）
- 右侧接入现有 `JsonViewer` 组件展示解析后的树形结构
- 新增 Web Worker 异步解析管线，配合 debounce 避免大 JSON 阻塞主线程
- 新增格式化/压缩切换和导出功能（复制到剪贴板、下载文件）

## Capabilities

### New Capabilities

- `split-panel-layout`: 可拖拽调节的左右分栏布局，页面顶部标题栏和全局设置，各面板独立工具栏
- `json-editor`: 基于 CodeMirror 6 的 JSON 编辑器，提供语法高亮、行号、错误标记、JSON lint
- `multi-input`: 三种输入方式——文本编辑（默认）、文件拖拽上传、URL 加载，通过 Tab 切换
- `async-json-parsing`: debounce + Web Worker 异步 JSON 解析管线，解析成功更新树视图，失败则在编辑器标记错误行
- `format-and-export`: 一键格式化/压缩 JSON 文本，导出支持复制到剪贴板和下载为 .json 文件

### Modified Capabilities

无。项目无现有 spec。

## Impact

**新增依赖**：

- `codemirror`、`@codemirror/lang-json` 等 CodeMirror 6 相关包

**受影响文件**：

- `app/page.tsx` — 从空白页改造为主应用页面
- `app/globals.css` — 可能需要新增分栏和编辑器相关样式

**新增文件**：

- `components/json-editor.tsx` — CodeMirror 编辑器封装
- `components/editor-toolbar.tsx` — 左侧面板工具栏
- `lib/json-worker.ts` — Web Worker 解析脚本
- `hooks/use-json-parser.ts` — 解析逻辑 hook

**现有组件**：

- `components/json-viewer.tsx` — 直接复用，无需修改

