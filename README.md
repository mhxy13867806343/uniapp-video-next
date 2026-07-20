# v-videos (uniapp-video-next) 🎬

<p align="center">
  <b>基于 Vue 3 + TypeScript 的高性能、轻量级、跨平台 uni-app 自定义视频播放器组件</b>
</p>

<p align="center">
  <a href="./README.en-US.md">English Document</a> | 中文文档
</p>

---

## ✨ 特性

- 🚀 **Vue 3 Composition API & TypeScript**：模块化 Composables 拆分，提供完备的类型声明与类型推导。
- 🔴 **直播源模式支持 (Live Streaming Support)**：支持 `:is-live="true"` 模式，自动隐藏总时长与进度条，提供动态脉冲 `LIVE` 状态 Tag 标识（支持自定义 `:live-text`）。
- 💬 **高性能弹幕引擎 (Danmaku Engine)**：
  - 平滑动画、自动轨道排版。
  - 支持弹幕显示区域、不透明度、字体大小、弹幕速度自定义调整。
  - 内置 Emoji 表情盘与多彩弹幕选择器。
- 📺 **多清晰度无缝切换**：支持多档清晰度（如 1080P, 720P, 480P, 自动），切换时自动记录并恢复播放进度。
- ⚡ **海量自定义 Action 面板**：支持传入自定义操作列表（2 项、10 项、20+ 项网格扩展），带有点击回调代理 `@moreactionclick`。
- 🚀 **播放倍速配置与选择**：支持自定义倍速列表 `:rates="[0.5, 0.75, 1.0, 1.25, 1.5, 2.0]"`，支持实例方法切换。
- ⏳ **网络 Loading 加载浮层**：自动与手动支持卡顿缓冲状态浮层 `:loading`、`:loading-text` 与 `:loading-icon`。
- 🎨 **CSS 变量与灵活主题**：基于 CSS Custom Properties (`--vp-*`)，轻松定制色彩、阴影、圆角与毛玻璃面板样式。
- 📱 **全平台兼容 (Cross-Platform)**：适配 H5、微信小程序 (WeChat Mini Program)、App (iOS / Android) 及 鸿蒙 (HarmonyOS)。
- 👆 **触控手势支持**：进度条平滑拖拽预览、音量调节面板与滑块手势。

---

## 📦 安装与快速上手

### 1. 引用组件

直接在页面中引入 `v-videos` 组件：

```vue
<template>
  <view class="container">
    <v-videos
      ref="playerRef"
      :src="videoSrc"
      title="uni-app 视频播放演示"
      :custom-controls="true"
      :is-live="false"
      :qualities="qualities"
      :danmus="danmus"
      :more-actions="moreActions"
      @play="onPlay"
      @timeupdate="onTimeUpdate"
      @moreactionclick="onMoreActionClick"
    />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VVideos, {
  defaultDanmus,
  defaultQualities,
  defaultMoreActions,
  defaultRates,
  formatTime,
  type MoreActionItem,
} from '@/components/v-videos'

const playerRef = ref<InstanceType<typeof VVideos> | null>(null)
const videoSrc = ref('https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/2minute-demo.mp4')

// 直接复用预设配置，也可自定义传入
const qualities = defaultQualities
const danmus = defaultDanmus
const moreActions = defaultMoreActions
const rates = defaultRates

function onPlay() {
  console.log('开始播放')
}

function onTimeUpdate(payload: { currentTime: number; duration: number }) {
  console.log('当前进度：', formatTime(payload.currentTime))
}

function onMoreActionClick(payload: { item: MoreActionItem; index: number; key: string }) {
  console.log('点击更多操作：', payload.item.label)
}
</script>
```

---

## ⚙️ 属性声明 (Props)

| 属性名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `src` | `string` | **必填** | 视频播放资源地址 |
| `poster` | `string` | `""` | 视频封面图片地址 |
| `autoplay` | `boolean` | `false` | 是否自动播放 |
| `loop` | `boolean` | `false` | 是否循环播放 |
| `muted` | `boolean` | `false` | 是否静音 |
| `controls` | `boolean` | `true` | 是否显示原生控件（`customControls` 为 true 时建议关） |
| `customControls`| `boolean` | `false` | 是否启用自定义控制层 UI |
| `objectFit` | `"contain" \| "fill" \| "cover"` | `"contain"` | 视频同比例缩放模式 |
| `initialTime` | `number` | `0` | 初始播放位置（秒） |
| `showCenterPlayBtn` | `boolean` | `true` | 是否显示居中大播放/暂停按钮（图片 2 & 3，支持自定义图标） |
| `showProgressBar` | `boolean` | `true` | 是否显示底栏播放进度条（图片 4，支持显隐与样式自定义） |
| `progressColor` | `string` | `""` | 进度条高亮已播放颜色（如 `#22c55e`、`#3b82f6`） |
| `progressTrackColor` | `string` | `""` | 进度条未播放轨道颜色（如 `rgba(255,255,255,0.2)`） |
| `progressThumbColor` | `string` | `""` | 进度条拖拽滑块 Dot 颜色（如 `#ffffff`） |
| `progressHeight` | `string` | `""` | 进度条高度（如 `4rpx`、`6rpx`、`12rpx`） |
| `showDanmakuBtn` | `boolean` | `true` | 是否显示弹幕总开关按钮 |
| `showDanmakuSettingBtn` | `boolean` | `true` | 是否显示弹幕设置按钮 |
| `showSendInput` | `boolean` | `true` | 是否显示“发个弹幕吧～”输入框 |
| `showQualityBtn` | `boolean` | `true` | 是否显示清晰度切换按钮 |
| `showRateBtn` | `boolean` | `true` | 是否显示播放倍速按钮 |
| `showEpisodesBtn` | `boolean` | `true` | 是否显示剧集选集按钮 |
| `showVolumeBtn` | `boolean` | `true` | 是否显示音量调节按钮 |
| `showLoopBtn` | `boolean` | `true` | 是否显示循环播放按钮 |
| `showFullscreenBtn` | `boolean` | `true` | 是否显示全屏按钮 |
| `showMoreBtn` | `boolean` | `true` | 是否显示“更多”操作按钮 (`•••`) |
| `moreActions` | `MoreActionItem[]` | 默认2项 | 自定义“更多”操作面板列表（支持传入 2、10、20+ 项菜单） |
| `episodes` | `EpisodeItem[]` | `[]` | 电视剧/长视频剧集选集列表（支持 1~34+ 集网格与列表） |
| `currentEpisode` | `number` | `0` | 当前选中剧集的索引 index |
| `rates` | `number[]` | `[0.5, 0.75, 1.0, 1.25, 1.5, 2.0]` | 可选播放倍速选项列表 |
| `rate` | `number` | `1.0` | 初始播放倍速 |
| `loading` | `boolean` | `false` | 是否处于缓冲/卡顿加载状态（为 true 时展示加载浮层） |
| `loadingText` | `string` | `"加载中..."` | 加载状态提示文字 |
| `loadingIcon` | `string` | `""` | 自定义加载图标（支持 Unicode / 文本 / 图片 URL） |
| `qualities` | `QualityItem[]` | `[]` | 清晰度切换列表 |
| `danmus` | `DanmuItem[]` | `[]` | 初始弹幕列表 |
| `icons` | `Partial<Record<IconKey, string>>` | `{}` | 自定义控制条图标（支持 Unicode/文本或图片 URL） |
| `platformConfig` | `VideoPlatformConfig` | `{}` | 针对不同平台 (H5 / 微信小程序 / App) 的差异化配置 |

---

## 🔔 事件声明 (Emits)

| 事件名 | 参数 | 说明 |
| :--- | :--- | :--- |
| `play` | `-` | 视频开始/恢复播放时触发 |
| `pause` | `-` | 视频暂停时触发 |
| `ended` | `-` | 视频播放结束时触发 |
| `timeupdate` | `{ currentTime: number; duration: number }` | 播放进度更新时触发 |
| `qualitychange`| `{ index: number; label: string }` | 切换清晰度时触发 |
| `ratechange` | `{ rate: number }` | 切换播放倍速时触发 |
| `episodechange`| `{ index: number; item: EpisodeItem }` | 切换剧集选集时触发 |
| `senddanmu` | `DanmuItem` | 用户发送弹幕时触发 |
| `moreactionclick` | `{ item: MoreActionItem; index: number; key: string }` | 点击更多面板项时触发 |
| `fullscreenchange` | `{ fullScreen: boolean }` | 全屏状态切换时触发 |

---

## 🛠 组件方法 (Exposed Methods)

通过 `ref` 可以调用组件暴露的原生与高级控制方法：

```ts
const playerRef = ref<InstanceType<typeof VVideos> | null>(null)

// 调用播放
playerRef.value?.play()

// 调用暂停
playerRef.value?.pause()

// 跳转进度（秒）
playerRef.value?.seek(30)

// 发送实时弹幕
playerRef.value?.sendDanmu({ text: '动态发送弹幕', color: '#ff0000' })

// 切换弹幕开关
playerRef.value?.toggleDanmaku()

// 切换清晰度
playerRef.value?.selectQuality(0)

// 切换倍速
playerRef.value?.playbackRate(1.5)
```

---

## 🎨 样式定制 (CSS Variables)

组件使用 CSS 变量进行主题定制，你可以在项目全局或页面样式中进行覆盖：

```css
.video-player {
  --vp-primary-color: #22c55e;        /* 主色调 */
  --vp-primary-gradient: linear-gradient(135deg, #22c55e, #16a34a);
  --vp-bg-black: #000000;              /* 背景底色 */
  --vp-panel-bg: rgba(15, 23, 42, 0.9);/* 面板背景色 */
  --vp-radius-xl: 24rpx;               /* 圆角尺寸 */
}
```

---

## 📂 项目文件结构

```
src/
├── components/v-videos/             # v-videos 播放器核心组件
│   ├── v-videos.vue                 # SFC 视图模板与逻辑入口
│   ├── index.ts                     # 模块导出统一入口
│   ├── types.ts                     # 完备的 TypeScript 接口声明
│   ├── config.ts                    # 预设配置与 formatTime 工具函数
│   ├── styles/                      # CSS 独立样式目录
│   │   ├── vars.css                 # CSS 自定义变量主题定义
│   │   ├── common.css               # 公共重复 CSS 样式类
│   │   └── video-player.css         # 播放器组件主样式表
│   └── composables/                 # TS 核心逻辑模块化抽离
│       ├── useVideoPlayer.ts        # 主 Hook 装配与调度
│       ├── useVideoControls.ts     # 播放状态、清晰度、倍速与 VideoContext
│       ├── useDanmaku.ts           # 弹幕动画引擎与弹幕设置
│       ├── useVideoGestures.ts     # 进度条与滑块触摸手势
│       ├── useVideoEvents.ts       # 视频原生 DOM/小程序事件句柄
│       └── useVideoOptions.ts      # 参数合并与图标配置
└── pages/                           # 页面与功能测试中心
    ├── index/index.vue              # 导航主页面与基础演示
    ├── demo-live/demo-live.vue      # 直播源功能测试页面
    ├── demo-more/demo-more.vue      # 更多操作面板测试页面
    ├── demo-rate/demo-rate.vue      # 播放倍速切换测试页面
    └── demo-loading/demo-loading.vue# 网络 Loading 状态测试页面
```

---

## 📄 License

[MIT](./LICENSE)
