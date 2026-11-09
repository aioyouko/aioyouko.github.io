# Resources 设备目录维护

## 当前排版

Resources 首页采用四个纯文字分类卡片，点击进入独立子页面：

- `/resources/synthesis-crystal-growth`：合成、晶体生长与样品制备。
- `/resources/structure-thermal-analysis`：结构与热分析。
- `/resources/electrical-thermal-transport`：电学与热输运。
- `/resources/optical-characterization`：光学表征。

子页面统一使用逐行设备清单。桌面左侧是设备名称，右侧是用途；手机上下排列。28 个设备条目均保留，并按同一结构展示。

设备分类、名称、用途和顺序集中在 `app/data/equipment.ts`。

## 照片

按用户要求，已删除 Resources 中的全部设备参考图片、封面、图片署名及图片布局，页面不保留空白图片占位。后续等待用户提供课题组实拍照片，再按照片比例安排独立的图片区域；图片与文字应保持正常文档流，避免固定高度或绝对定位造成相互覆盖。

先前外部参考照片不再包含在网站公开资源中。来源记录仅留在 `content-reference/equipment-photos/` 作为维护历史，不参与页面展示。

## 更新与发布

`resourceBasePath` 在本地原版为空，GitHub 演示版为 `/kanatzidis-demo`。两个工程的内容文件需要同步，并保留各自前缀。

保存后可在本地预览。GitHub 演示版按既有 README 重新构建后发布；四个分类子页面继续支持静态导出。
