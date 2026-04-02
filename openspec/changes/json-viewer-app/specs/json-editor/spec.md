## ADDED Requirements

### Requirement: CodeMirror 6 编辑器集成

左侧面板 SHALL 集成 CodeMirror 6 编辑器，提供专业的 JSON 编辑体验。编辑器 SHALL 填满左侧面板的全部可用空间（工具栏下方）。

#### Scenario: 编辑器初始化

- **WHEN** 页面加载完成
- **THEN** 左侧面板展示一个可交互的 CodeMirror 6 编辑器实例

### Requirement: JSON 语法高亮

编辑器 SHALL 对 JSON 内容进行语法高亮，至少区分以下 token 类型：字符串、数字、布尔值、null、键名、标点符号（括号/冒号/逗号）。

#### Scenario: 语法高亮渲染

- **WHEN** 用户在编辑器中输入合法 JSON 文本
- **THEN** 不同类型的 token 以不同颜色高亮显示

### Requirement: 行号显示

编辑器 SHALL 在左侧显示行号（gutter），方便用户定位内容。

#### Scenario: 行号随内容更新

- **WHEN** 用户输入多行 JSON 文本
- **THEN** 每一行左侧显示对应的行号

### Requirement: JSON 错误标记

当编辑器中的 JSON 文本存在语法错误时，SHALL 在错误所在行进行视觉标记（如红色波浪下划线或行高亮），并在 gutter 区域显示错误图标。

#### Scenario: 语法错误标记

- **WHEN** 用户输入的 JSON 缺少闭合括号（如 `{"name": "test"`）
- **THEN** 编辑器在错误位置显示红色标记，gutter 显示错误图标

#### Scenario: 错误修复后清除标记

- **WHEN** 用户修复了 JSON 语法错误
- **THEN** 错误标记和图标立即消失

### Requirement: 编辑器自适应尺寸

编辑器 SHALL 随面板尺寸变化（如分割线拖拽）自动调整自身大小，不出现溢出或空白。

#### Scenario: 面板调节后编辑器自适应

- **WHEN** 用户拖拽分割线改变左侧面板宽度
- **THEN** 编辑器宽度同步调整，内容自动换行或出现水平滚动条
