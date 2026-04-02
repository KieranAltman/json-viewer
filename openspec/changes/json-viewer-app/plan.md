# JSON Viewer 实现计划

> **For agentic workers:** Use superpowers:subagent-driven-development
> to implement this plan task-by-task.

**Goal:** 构建一个在线 JSON Viewer 工具，左侧 CodeMirror 6 编辑器输入 JSON，右侧树形展示解析结果。

**Architecture:** 左右分栏布局，左侧 CodeMirror 6 编辑器封装为独立组件，右侧复用现有 `JsonViewer` 组件。数据流通过 debounce + Web Worker 异步解析，主线程无阻塞。页面状态集中在 `app/page.tsx` 管理。

**Tech Stack:** Next.js 16、React 19、CodeMirror 6、Tailwind CSS 4、shadcn/ui (radix-luma)、Web Worker、TypeScript

---

## Task 1: 项目依赖安装

- [ ] **Step 1:** 运行 `bun add codemirror @codemirror/lang-json @codemirror/lint @codemirror/view @codemirror/state @codemirror/language` 安装 CodeMirror 6 核心包
- [ ] **Step 2:** 运行 `bun list lucide-react` 确认已安装；如缺少则运行 `bun add lucide-react`
- [ ] **Step 3:** 运行 `bun run typecheck` 确认无类型错误

**提交点:** `chore: add codemirror 6 dependencies`

---

## Task 2: Web Worker 异步解析管线

- [ ] **Step 1:** 创建 `lib/json-worker.ts`，实现 `self.onmessage` 监听器：接收字符串，`JSON.parse` 后 `postMessage` 返回 `{ ok: true, data }` 或 `{ ok: false, error: string }`
- [ ] **Step 2:** 创建 `hooks/use-json-parser.ts`：
  - 使用 `useRef` 持有 Worker 实例，`useEffect` 中初始化 `new Worker(new URL('../lib/json-worker.ts', import.meta.url))`
  - 实现 `parse(text: string)` 方法，内置 300ms debounce（`setTimeout` + cleanup）
  - 管理状态：`parsedData: JsonValue | null`、`error: string | null`、`isLoading: boolean`
  - Worker `onmessage` 回调中更新状态
  - 组件卸载时 `worker.terminate()`
- [ ] **Step 3:** 导出 hook 接口 `{ parsedData, error, isLoading, parse }`
- [ ] **Step 4:** 在 `app/page.tsx` 中临时引入 hook，用 `console.log` 验证解析流程正常

**提交点:** `feat: add web worker json parsing pipeline`

---

## Task 3: 分栏布局

- [ ] **Step 1:** 改造 `app/page.tsx`：
  - 最外层 `div` 设置 `h-svh flex flex-col`
  - 顶部标题栏：`header` 元素，包含 "JSON Viewer" 文字和暗色模式切换按钮（使用 `next-themes` 的 `useTheme`）
  - 内容区域：`div` 设置 `flex flex-1 overflow-hidden`，包含左面板、分割线、右面板
- [ ] **Step 2:** 创建分割线逻辑（可在 `page.tsx` 内实现或独立 hook `hooks/use-resize.ts`）：
  - `useState` 管理 `leftWidth`（百分比，默认 50）
  - 分割线 `div`：宽 4px，`cursor-col-resize`，hover 时背景色变化
  - `onMouseDown` 启动拖拽 → `document` 上监听 `mousemove`/`mouseup`
  - `mousemove` 中计算新宽度百分比，clamp 到 20-80 范围
  - `mouseup` 时移除监听器
- [ ] **Step 3:** 左面板 `div` 使用 `style={{ width: leftWidth + '%' }}`，右面板使用 `flex-1`
- [ ] **Step 4:** 验证布局在不同屏幕宽度下正常渲染，分割线可拖拽

**提交点:** `feat: add resizable split panel layout`

---

## Task 4: CodeMirror 编辑器

- [ ] **Step 1:** 创建 `components/json-editor.tsx`：
  - `"use client"` 指令
  - Props: `value: string`、`onChange: (value: string) => void`、`error?: { line: number; message: string } | null`、`className?: string`
  - `useRef<HTMLDivElement>` 作为编辑器容器
  - `useEffect` 中初始化 `EditorView`，配置扩展：`json()` 语言、`lineNumbers()`、`basicSetup`（或按需选择模块）
  - 通过 `EditorView.updateListener` 监听文档变化，调用 `onChange`
- [ ] **Step 2:** 实现暗色/亮色主题：
  - 检测当前 `next-themes` 主题（通过 prop 或 context）
  - 创建 CodeMirror dark/light 主题配置（`EditorView.theme`），匹配项目整体风格
- [ ] **Step 3:** 实现错误标记：
  - 当 `error` prop 变化时，使用 `@codemirror/lint` 的 `setDiagnostics` 在错误行显示红色标记
  - 使用 `lintGutter()` 在 gutter 显示错误图标
- [ ] **Step 4:** 实现 `setValue` 方法（通过 `useImperativeHandle` 或 ref 回调），供外部设置编辑器内容（用于文件上传和 URL 加载场景）
- [ ] **Step 5:** 使用 `EditorView.requestMeasure` 或 `ResizeObserver` 实现容器尺寸变化时自动重新布局

**提交点:** `feat: add codemirror json editor component`

---

## Task 5: 多输入方式

- [ ] **Step 1:** 创建 `components/editor-toolbar.tsx`：
  - Props: `activeTab`、`onTabChange`、`onFormat`、`onMinify`、`onCopy`、`onDownload`、`isValidJson: boolean`
  - 渲染三个 Tab 按钮（编辑/文件/URL），使用 `data-active` 属性或 className 标记激活状态
  - 右侧放置操作按钮（格式化、压缩、复制、下载），使用 lucide-react 图标
- [ ] **Step 2:** 在 `app/page.tsx` 中：
  - `useState<'edit' | 'file' | 'url'>` 管理当前 Tab
  - 根据 Tab 值条件渲染左面板内容：编辑器 / 文件上传区 / URL 输入
- [ ] **Step 3:** 创建文件上传区域组件（可内联在 page 或独立组件）：
  - 拖拽区域：`onDragOver`（阻止默认）、`onDrop`（读取 `e.dataTransfer.files[0]`）
  - 点击上传：隐藏 `<input type="file" accept=".json,application/json">`，点击区域触发
  - `FileReader.readAsText` 读取文件内容
  - 读取完成后：调用编辑器 `setValue`，切换 Tab 回 `'edit'`，触发解析
- [ ] **Step 4:** 创建 URL 加载面板：
  - `<input>` 输入 URL + `<button>` 加载
  - 点击后 `fetch(url)` → `response.text()` → 填入编辑器 → 切回编辑 Tab
  - 处理 loading 状态（按钮显示 spinner、禁用重复点击）
  - 处理错误（toast 或内联提示）

**提交点:** `feat: add multi-input support (text/file/url)`

---

## Task 6: 格式化与导出

- [ ] **Step 1:** 实现 `onFormat` 回调：`JSON.stringify(JSON.parse(text), null, 2)` → 更新编辑器内容
- [ ] **Step 2:** 实现 `onMinify` 回调：`JSON.stringify(JSON.parse(text))` → 更新编辑器内容
- [ ] **Step 3:** 实现 `onCopy` 回调：`navigator.clipboard.writeText(text)` → 按钮图标切换为 `Check` 1.5 秒后恢复
- [ ] **Step 4:** 实现 `onDownload` 回调：创建 `Blob` → `URL.createObjectURL` → 触发 `<a>` 下载 `data.json`
- [ ] **Step 5:** 在工具栏中将格式化/压缩按钮设置为 `disabled={!isValidJson}`

**提交点:** `feat: add format, minify, copy, and download actions`

---

## Task 7: 页面集成与收尾

- [ ] **Step 1:** 在 `app/page.tsx` 中组装完整数据流：
  - `useState` 管理 `jsonText`（编辑器文本）
  - `useJsonParser` hook 接收 `jsonText`
  - `parsedData` 传给右侧 `<JsonViewer data={parsedData} />`
  - `error` 传给左侧 `<JsonEditor error={error} />`
- [ ] **Step 2:** 处理空状态：
  - 编辑器为空时，右侧显示占位提示（如"在左侧输入或粘贴 JSON 数据"）
  - 可提供示例 JSON 按钮，点击后填入示例数据
- [ ] **Step 3:** 实现错误保留逻辑：
  - 在 `useJsonParser` 中维护 `lastValidData`
  - 解析失败时右侧继续显示 `lastValidData`，同时显示错误提示条
- [ ] **Step 4:** 暗色模式适配：
  - 确认 CodeMirror 主题跟随系统 dark/light 切换
  - 确认分割线、工具栏、状态栏在两种模式下视觉正确
- [ ] **Step 5:** 运行 `bun run build` 确认生产构建无报错
- [ ] **Step 6:** 运行 `bun run lint` + `bun run typecheck` 确认代码质量

**提交点:** `feat: integrate all components and finalize json viewer`
