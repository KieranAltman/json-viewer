## ADDED Requirements

### Requirement: 输入防抖

编辑器内容变化后，系统 SHALL 等待 300ms 无新输入后再触发 JSON 解析，避免每次击键都执行解析。

#### Scenario: 连续输入时不解析

- **WHEN** 用户在编辑器中连续输入字符，间隔小于 300ms
- **THEN** 不触发任何解析操作

#### Scenario: 停顿后触发解析

- **WHEN** 用户停止输入超过 300ms
- **THEN** 系统将当前编辑器文本提交给 Web Worker 进行解析

### Requirement: Web Worker 异步解析

JSON 解析 SHALL 在 Web Worker 线程中执行，主线程不执行 `JSON.parse`。Worker SHALL 接收 JSON 文本字符串，返回解析结果或错误信息。

#### Scenario: 解析成功

- **WHEN** Worker 收到合法 JSON 文本
- **THEN** Worker 返回 `{ ok: true, data: <parsed object> }` 消息到主线程

#### Scenario: 解析失败

- **WHEN** Worker 收到非法 JSON 文本
- **THEN** Worker 返回 `{ ok: false, error: <error message> }` 消息到主线程

### Requirement: 主线程不阻塞

在 Worker 执行解析期间，主线程 SHALL 保持响应。用户 SHALL 能继续在编辑器中输入、滚动页面、操作工具栏。

#### Scenario: 大 JSON 解析时界面不冻结

- **WHEN** 用户粘贴一个 5MB 的 JSON 文本
- **THEN** 编辑器和页面在解析期间保持可交互状态

### Requirement: 解析结果更新树视图

当 Worker 返回解析成功的结果时，系统 SHALL 将解析后的数据传递给右侧 `JsonViewer` 组件进行渲染。

#### Scenario: 成功解析后更新右侧

- **WHEN** Worker 返回解析成功的结果
- **THEN** 右侧 JsonViewer 显示最新的树形结构

### Requirement: 解析错误反馈到编辑器

当 Worker 返回解析失败的结果时，系统 SHALL 在编辑器中标记错误位置，并在右侧面板显示错误提示（保留上一次有效的解析结果，或显示空状态）。

#### Scenario: 解析失败时标记错误

- **WHEN** Worker 返回解析错误
- **THEN** 编辑器在错误位置显示标记，右侧面板显示错误提示信息

#### Scenario: 保留上次有效结果

- **WHEN** 编辑器内容从有效 JSON 变为无效 JSON
- **THEN** 右侧面板保留上一次有效的树形结构，同时显示错误提示
