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
- 💬 **高性能弹幕引擎 (Danmaku Engine)**：
  - 平滑动画、自动轨道排版。
  - 支持弹幕显示区域、不透明度、字体大小、弹幕速度自定义调整。
  - 内置 Emoji 表情盘与多彩弹幕选择器。
- 📺 **多清晰度无缝切换**：支持多档清晰度（如 1080P, 720P, 480P, 自动），切换时自动记录并恢复播放进度。
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
      :custom-controls="true"
      :qualities="qualities"
      :danmus="danmus"
      @play="onPlay"
      @timeupdate="onTimeUpdate"
    />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VVideos, {
  type QualityItem,
  type DanmuItem,
} from '@/components/v-videos'

const playerRef = ref<InstanceType<typeof VVideos> | null>(null)
const videoSrc = ref('https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/2minute-demo.mp4')

const qualities: QualityItem[] = [
  { label: '1080P 原画', url: 'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/2minute-demo.mp4' },
  { label: '720P 超清', url: 'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/2minute-demo.mp4' },
  { label: '480P 清晰', url: 'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/2minute-demo.mp4' },
]

const danmus: DanmuItem[] = [
  { text: '前排围观！', time: 1, color: '#ffffff' },
  { text: 'uni-app 跨平台真香', time: 3, color: '#22c55e' },
  { text: '弹幕来喽～～～', time: 5, color: '#f59e0b' },
]

function onPlay() {
  console.log('开始播放')
}

function onTimeUpdate(payload: { currentTime: number; duration: number }) {
  console.log('当前进度：', payload.currentTime)
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
| `title` | `string` | `""` | 视频标题（全屏/顶部 Header 展示） |
| `showMoreBtn` | `boolean` | `true` | 是否在控制条显示“更多”按钮 (`•••`) |
| `moreActions` | `MoreActionItem[]` | 默认2项 | 自定义“更多”操作面板列表（支持传入 2、10、20+ 项菜单） |
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
src/components/v-videos/
├── v-videos.vue                     # SFC 视图模板与逻辑入口
├── index.ts                         # 模块导出统一入口
├── types.ts                         # 完备的 TypeScript 接口声明
├── styles/                          # CSS 独立样式目录
│   ├── vars.css                     # CSS 自定义变量主题定义
│   ├── common.css                   # 公共重复 CSS 样式类
│   └── video-player.css             # 播放器组件主样式表
└── composables/                     # TS 核心逻辑模块化抽离
    ├── useVideoPlayer.ts            # 主 Hook 装配与调度
    ├── useVideoControls.ts         # 播放状态、清晰度与 VideoContext
    ├── useDanmaku.ts               # 弹幕动画引擎与弹幕设置
    ├── useVideoGestures.ts         # 进度条与滑块触摸手势
    ├── useVideoEvents.ts           # 视频原生 DOM/小程序事件句柄
    └── useVideoOptions.ts          # 参数合并与图标配置
```

---

## 📄 License

[MIT](./LICENSE)
