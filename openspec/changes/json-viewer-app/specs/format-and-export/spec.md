## ADDED Requirements

### Requirement: 一键格式化

左侧工具栏 SHALL 提供「格式化」按钮。点击后 SHALL 将编辑器中的 JSON 文本以 2 空格缩进进行美化格式化（`JSON.stringify(data, null, 2)`）。仅当 JSON 合法时按钮可用。

#### Scenario: 格式化压缩的 JSON

- **WHEN** 编辑器中有合法但压缩的 JSON（如 `{"a":1,"b":2}`），用户点击「格式化」
- **THEN** 编辑器内容被替换为格式化后的文本，缩进 2 空格

#### Scenario: JSON 不合法时按钮不可用

- **WHEN** 编辑器中的 JSON 存在语法错误
- **THEN** 「格式化」按钮显示为禁用状态

### Requirement: 一键压缩

左侧工具栏 SHALL 提供「压缩」按钮。点击后 SHALL 将编辑器中的 JSON 文本压缩为单行（`JSON.stringify(data)`）。仅当 JSON 合法时按钮可用。

#### Scenario: 压缩格式化的 JSON

- **WHEN** 编辑器中有格式化的合法 JSON，用户点击「压缩」
- **THEN** 编辑器内容被替换为单行压缩文本

### Requirement: 复制到剪贴板

工具栏 SHALL 提供「复制」按钮。点击后 SHALL 将当前编辑器中的文本复制到系统剪贴板，并显示复制成功的视觉反馈（如图标变为勾号，1.5 秒后恢复）。

#### Scenario: 复制 JSON 文本

- **WHEN** 用户点击「复制」按钮
- **THEN** 编辑器中的文本被写入剪贴板，按钮显示成功反馈

### Requirement: 下载为文件

工具栏 SHALL 提供「下载」按钮。点击后 SHALL 将编辑器中的文本下载为 `.json` 文件。文件名 SHALL 默认为 `data.json`。

#### Scenario: 下载 JSON 文件

- **WHEN** 用户点击「下载」按钮
- **THEN** 浏览器触发文件下载，文件名为 `data.json`，内容为编辑器中的文本
