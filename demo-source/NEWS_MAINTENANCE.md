# News 更新说明

## 日常更新

- 新闻统一在 `app/data/news.ts` 中维护：标题、摘要、分类、报道链接和 `publishedOn`（YYYY-MM-DD）。
- `publishedOn` 使用原始报道／公告日期。奖项年份写进标题；不要用奖项年份代替报道日期。
- 首页最近三条和 News 时间线都自动按日期倒序排列，年份导航自动生成。
- 给重要条目添加 `featuredOrder` 即可加入 Awards & honors 轮播，数字越小越靠前；普通新闻无需此字段。
- 轮播和时间线共用 `app/data/news-images.ts` 中的照片、替代文字与来源署名。加入轮播前请确保对应 slug 的照片资料完整。
- 轮播每 7 秒切换，支持前后翻页、圆点跳转、方向键、播放／暂停。悬停、离开可视区域或切到其他标签页会暂时暂停；键盘进入内容或手动选择后停止自动播放，按 Play 可恢复。系统“减少动态效果”开启时默认静止。
- 无确切日期的毕业公告仍保留在 Group announcements 中，不为其虚构日期。

## 当前日期依据（2026-09-15 核对）

| 新闻 | 原始报道日期 | 来源 |
| --- | --- | --- |
| 固态钙钛矿太阳能电池 Viewpoint | 2026-03-26 | https://pubs.acs.org/doi/10.1021/acsenergylett.6c00236 （Published Online） |
| ETH Zurich 荣誉博士 | 2025-11-22 | https://chemistry.northwestern.edu/about/news/2025/kanatzidis-ethzurich.html |
| 2026 William H. Nichols Medal | 2025-10-01 | Argonne 新闻稿的 Newswise 发布日期：https://www.newswise.com/articles/channels/materials-science/?page=39 。奖项年份为 2026，公告发布于 2025。 |
| Albert Einstein World Award | 2025-07-16 | https://chemistry.northwestern.edu/about/news/2025/kanatzidis-wcc-albert-einstein-award.html |
| National Academy of Sciences | 2024-05-02 | https://news.northwestern.edu/stories/2024/05/mercouri-kanatzidis-and-aaron-naber-elected-to-national-academy-of-sciences/ |
| Kanatzidisite 命名 | 2023-07-03 | https://news.northwestern.edu/stories/2023/07/new-mineral-kanatzidisite-named-after-mercouri-kanatzidis |
| American Academy of Arts and Sciences | 2023-04-21 | https://news.weinberg.northwestern.edu/2023/04/21/mercouri-kanatzidis-has-been-elected-member-of-the-american-academy-of-arts-and-sciences/ |

## 两套源文件

本地预览位于 `kanatzidis-modern`；GitHub Pages 源文件位于 `github-pages-demo/demo-source`，内链保留 /kanatzidis-demo 前缀。此次已同步两套源文件并重建静态网页。
