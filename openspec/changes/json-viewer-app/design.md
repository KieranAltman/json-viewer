## Design Summary

在线 JSON Viewer 工具，采用左右分栏布局：左侧为 CodeMirror 6 代码编辑器，支持文本编辑、文件拖拽和 URL 加载三种输入方式；右侧使用现有的 `JsonViewer` 组件以经典缩进树形风格展示 JSON 结构。

MVP 聚焦两大核心功能：**格式化/压缩切换**和**导出**（复制到剪贴板 + 文件下载）。搜索过滤、路径复制、展开/折叠等能力由现有 `JsonViewer` 组件免费提供。

为应对大 JSON 文件的性能挑战，数据流采用 **debounce（300ms）+ Web Worker** 异步解析架构，确保主线程不被阻塞。

## Agreed Approach

**左侧编辑器：CodeMirror 6 + 多输入方式**

- CodeMirror 6 作为代码编辑器，提供语法高亮、行号、错误标记、JSON lint
- 三种输入方式通过 Tab 切换：文本编辑（默认）、文件拖拽上传、URL 加载
- 格式化/压缩操作按钮放在左侧面板的独立工具栏

**右侧展示：现有 JsonViewer 组件**

- 经典缩进树形风格（类似 VS Code / Chrome DevTools）
- 组件内置：搜索过滤、路径复制、展开/折叠控制、JSON 复制、65 种主题
- 右侧工具栏由 JsonViewer 组件自身提供

**布局方案：各面板独立工具栏**

- 页面顶部仅放应用标题和全局设置（主题切换）
- 左右面板各有自己的工具栏，功能就近放置
- 中间分割线可拖拽调节面板宽度

**数据流架构：debounce + Web Worker**

```
用户输入文本
    │
    ├─ 每次击键 → 更新编辑器状态（即时响应）
    │
    └─ debounce 300ms → 提交给 Web Worker
                              │
                         Worker 线程执行 JSON.parse()
                              │
                    ┌─────────┴──────────┐
                    │                    │
               成功：返回解析结果     失败：返回错误信息
                    │                    │
                    ▼                    ▼
              更新 JsonViewer       编辑器标记错误行
```

**组件拆分**


| 组件                              | 职责                          |
| ------------------------------- | --------------------------- |
| `app/page.tsx`                  | 主页面，管理全局状态（JSON 文本、解析结果、错误） |
| `components/json-editor.tsx`    | 左侧 CodeMirror 6 编辑器封装       |
| `components/editor-toolbar.tsx` | 左侧工具栏（输入方式切换 + 格式化/压缩）      |
| `components/json-viewer.tsx`    | 右侧树形展示（已有）                  |
| `lib/json-worker.ts`            | Web Worker，负责 JSON 解析       |
| `hooks/use-json-parser.ts`      | 封装 debounce + Worker 通信逻辑   |


## Key Decisions

1. **树形风格**：经典缩进树形，紧凑高效，开发者最熟悉
2. **使用场景**：数据探索 + 格式化工具，需处理大型 JSON 文件
3. **编辑器**：CodeMirror 6，在功能丰富度和包体积之间取得最佳平衡（~130KB gzip）
4. **输入方式**：文本编辑 + 文件拖拽 + URL 加载，三种方式覆盖主要场景
5. **MVP 核心功能**：格式化/压缩切换 + 导出（复制/下载），其余由 JsonViewer 内置
6. **性能策略**：debounce 300ms + Web Worker 异步解析，虚拟化渲染留给 v2
7. **工具栏布局**：各面板独立工具栏，功能就近放置，天然适配 JsonViewer 内置工具栏
8. **右侧组件**：复用现有 `components/json-viewer.tsx`，无需从零实现

## Open Questions

1. **主题联动**：左侧 CodeMirror 和右侧 JsonViewer 是否需要使用相同主题配色？
2. **URL 加载安全**：从 URL 加载 JSON 时，是否需要通过后端代理以避免 CORS 问题？还是仅支持允许跨域的 URL？
3. **最大文件限制**：是否需要设置 JSON 文件大小上限（如 10MB）并给出提示？

