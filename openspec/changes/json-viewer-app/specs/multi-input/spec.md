## ADDED Requirements

### Requirement: 输入方式 Tab 切换

左侧面板工具栏 SHALL 提供三个 Tab 用于切换输入方式：「编辑」（默认激活）、「文件」、「URL」。同一时间只能有一种激活的输入方式。

#### Scenario: 默认显示编辑 Tab

- **WHEN** 页面加载完成
- **THEN** 「编辑」Tab 处于激活状态，显示 CodeMirror 编辑器

#### Scenario: 切换到文件 Tab

- **WHEN** 用户点击「文件」Tab
- **THEN** 左侧面板切换为文件上传区域，「文件」Tab 高亮

### Requirement: 文本编辑输入

当「编辑」Tab 激活时，SHALL 显示 CodeMirror 编辑器，用户可直接在编辑器中输入或粘贴 JSON 文本。

#### Scenario: 粘贴 JSON 文本

- **WHEN** 用户在编辑器中粘贴一段 JSON 文本
- **THEN** 文本显示在编辑器中，并触发解析流程

### Requirement: 文件拖拽上传

当「文件」Tab 激活时，SHALL 显示文件拖拽区域。用户可通过拖拽 `.json` 文件或点击选择文件来加载 JSON。文件读取完成后 SHALL 自动切换回「编辑」Tab 并将文件内容填入编辑器。

#### Scenario: 拖拽 JSON 文件

- **WHEN** 用户将一个 `.json` 文件拖拽到上传区域
- **THEN** 文件内容被读取并填入编辑器，自动切换回「编辑」Tab，触发解析

#### Scenario: 点击选择文件

- **WHEN** 用户点击上传区域，通过文件选择器选中一个 JSON 文件
- **THEN** 行为与拖拽相同：文件内容填入编辑器并触发解析

#### Scenario: 非 JSON 文件提示

- **WHEN** 用户尝试上传非 `.json` 后缀的文件
- **THEN** 仍然尝试读取内容（因为 JSON 可能使用其他后缀），但如果解析失败则在编辑器中标记错误

### Requirement: URL 加载

当「URL」Tab 激活时，SHALL 显示 URL 输入框和加载按钮。用户输入 URL 后点击加载，系统 SHALL 通过 `fetch` 请求获取 JSON 数据。加载成功后 SHALL 自动切换回「编辑」Tab 并将响应内容填入编辑器。

#### Scenario: 加载有效 URL

- **WHEN** 用户输入一个返回 JSON 的 URL 并点击加载
- **THEN** JSON 内容被获取并填入编辑器，自动切换回「编辑」Tab，触发解析

#### Scenario: URL 加载失败

- **WHEN** URL 请求失败（网络错误或 CORS 限制）
- **THEN** 显示错误提示信息，不切换 Tab

#### Scenario: 加载中状态

- **WHEN** URL 请求正在进行中
- **THEN** 加载按钮显示 loading 状态，禁止重复提交
