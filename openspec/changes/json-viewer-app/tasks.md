## 1. 项目依赖安装

- [x] 1.1 安装 CodeMirror 6 核心包及 JSON 语言支持（`codemirror`、`@codemirror/lang-json`、`@codemirror/lint`）
- [x] 1.2 验证 `lucide-react` 已安装（JsonViewer 依赖），如缺少则安装

## 2. Web Worker 异步解析管线

- [x] 2.1 创建 `lib/json-worker.ts`：接收 JSON 文本字符串，执行 `JSON.parse`，返回 `{ ok, data }` 或 `{ ok, error }` 消息
- [x] 2.2 创建 `hooks/use-json-parser.ts`：封装 Worker 实例化、debounce 300ms、消息通信、解析状态管理（loading/success/error），导出 `{ parsedData, error, isLoading }` 等状态

## 3. 分栏布局

- [x] 3.1 改造 `app/page.tsx`：实现左右分栏布局，全屏高度（`100svh`），默认各占 50%
- [x] 3.2 实现可拖拽分割线组件：鼠标拖拽调节面板宽度，hover/拖拽视觉反馈，最小宽度 20% 限制
- [x] 3.3 添加页面顶部标题栏：显示"JSON Viewer"标题和全局主题切换按钮

## 4. CodeMirror 编辑器

- [x] 4.1 创建 `components/json-editor.tsx`：封装 CodeMirror 6 实例，配置 JSON 语法高亮、行号显示、基础主题
- [x] 4.2 实现编辑器内容变化回调：通过 `onChange` 将文本传递给父组件，触发解析流程
- [x] 4.3 实现 JSON 错误标记：根据解析错误信息在编辑器中标记错误行（红色波浪线/行高亮 + gutter 错误图标）
- [x] 4.4 实现编辑器自适应尺寸：监听面板宽度变化，自动调整 CodeMirror 尺寸

## 5. 多输入方式

- [x] 5.1 创建 `components/editor-toolbar.tsx`：左侧面板工具栏，包含输入方式 Tab 切换（编辑/文件/URL）
- [x] 5.2 实现文件拖拽上传区域：拖拽或点击选择 `.json` 文件，读取内容后自动填入编辑器并切回编辑 Tab
- [x] 5.3 实现 URL 加载面板：URL 输入框 + 加载按钮，fetch 获取 JSON，处理 loading/error 状态，成功后填入编辑器

## 6. 格式化与导出

- [x] 6.1 在左侧工具栏添加「格式化」按钮：将编辑器 JSON 以 2 空格缩进美化，JSON 无效时禁用
- [x] 6.2 在左侧工具栏添加「压缩」按钮：将编辑器 JSON 压缩为单行，JSON 无效时禁用
- [x] 6.3 在左侧工具栏添加「复制」按钮：将编辑器文本复制到剪贴板，显示成功反馈（图标变勾号 1.5s）
- [x] 6.4 在左侧工具栏添加「下载」按钮：将编辑器文本下载为 `data.json` 文件

## 7. 页面集成

- [x] 7.1 在 `app/page.tsx` 中组装所有组件：左侧（编辑器工具栏 + 编辑器/文件上传/URL 面板），右侧（JsonViewer）
- [x] 7.2 连接数据流：编辑器文本 → useJsonParser hook → parsedData 传给 JsonViewer，error 传给编辑器错误标记
- [x] 7.3 处理空状态和首次加载：编辑器为空时右侧显示空状态提示，解析出错时保留上次有效结果
- [x] 7.4 暗色/亮色模式适配：确保编辑器和整体布局在 dark/light 模式下表现正常
