# 组会排期维护

## 日常改哪一份

- localhost:3000 预览：`kanatzidis-modern/app/data/meetings.json`。
- 个人 GitHub Pages 发布版：`github-pages-demo/demo-source/app/data/meetings.json`。
- 两份排期目前相同，但属于两个独立工程，修改时需要同步。不要直接编辑生成的 `github-pages-demo/kanatzidis-demo/` 网页。

## 新一轮报告顺序

在 `group` 数组末尾添加下一轮日期，保留已有条目即可。日历、月份选择、当月列表、完整排期都会从同一组数据生成，无须重新排版。每个日期保留一条记录，同一天的报告人用 `/` 分隔。

```json
{
  "date": "2027-01-11",
  "location": "Tech K242",
  "presenters": "Presenter A/Presenter B"
}
```

上面仅为格式示例，并非已确认的排期。日期支持 `YYYY-MM-DD`，也兼容现有的 `January 11, 2027` 格式。

一般组会默认 3:00 PM；例外时间可显式增加 `"time": "10:00 AM"`。停会时将 `presenters` 写为 `No Meeting`，`location` 写停会原因。不要猜测未确认的日期：等确认后再录入。原始资料中未确认的冬季假日记录保留在 `unresolved`。

`joint` 是历史联合组会，网页直接展示完整的紧凑列表，不折叠。当前日期按 America/Chicago 自动计算；没有录入排期的月份会显示“未发布会议”。

## 更新后的发布

本地保存后刷新即可预览。个人网站需要在 `github-pages-demo/demo-source` 重新运行 `npm run build`，然后按项目 README 的 GitHub Pages 流程发布。日历本身不需要数据库或日历服务。

## 学校服务器迁移

现有 GitHub Pages 版使用 Next.js 静态导出。若学校提供普通静态网页托管，上传生成的 HTML、CSS、JavaScript、图片和字体即可；源码工程本身不能直接当网页上传。

当前演示版固定使用 `/kanatzidis-demo` 前缀。迁到例如 `/kanatzidis/` 时，先调整 `next.config.ts` 的 `basePath`，并检查页面、样式和组件里写死的 `/kanatzidis-demo/` 链接与资源路径，再重新导出。只有改配置是不够的。不要靠搬动文件夹来改变前缀。

需要向学校 IT 确认：托管平台是静态网页空间还是 WordPress/Cascade、最终网址和目录、上传权限、是否支持目录的 index.html，以及原 calendar.html 等旧网址的重定向。NUSites 的 WordPress 平台不能直接运行整个现有 Next.js 工程，需要移植内容/主题或选择静态网页空间。

官方说明：
- https://www.northwestern.edu/web-resources/website-guidelines/establishing-a-new-site/
- https://nextjs.org/docs/app/guides/static-exports
