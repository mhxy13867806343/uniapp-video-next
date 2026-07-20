# v-videos (uniapp-video-next) 🎬

<p align="center">
  <b>High-Performance, Lightweight, Cross-Platform Custom Video Player for uni-app Powered by Vue 3 & TypeScript</b>
</p>

<p align="center">
  English Document | <a href="./README.md">中文文档</a>
</p>

---

## ✨ Features

- 🚀 **Vue 3 Composition API & TypeScript**: Fully modularized with Composables, offering complete type declarations and automatic type inference.
- 💬 **High-Performance Danmaku Engine**:
  - Smooth CSS animation with collision-free track scheduling.
  - Custom settings for display area, opacity, font size, and scrolling speed.
  - Built-in Emoji picker and color palette for bullet comments.
- 📺 **Seamless Quality Switching**: Multi-grade resolution support (e.g. 1080P, 720P, 480P, Auto) with automatic playback position recovery upon switching.
- 🎨 **CSS Variables & Custom Themes**: Driven by CSS Custom Properties (`--vp-*`) for effortless customization of colors, shadows, radius, and glassmorphism panel styles.
- 📱 **Cross-Platform Compatibility**: Fully tested across H5, WeChat Mini Program, App (iOS / Android), and HarmonyOS.
- 👆 **Intuitive Touch Gestures**: Smooth progress bar scrubbing preview, volume adjustment panel, and slider touch gestures.

---

## 📦 Getting Started

### 1. Basic Usage

Import and use the `v-videos` component directly in your pages:

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
  { label: '1080P Original', url: 'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/2minute-demo.mp4' },
  { label: '720P HD', url: 'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/2minute-demo.mp4' },
  { label: '480P SD', url: 'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/2minute-demo.mp4' },
]

const danmus: DanmuItem[] = [
  { text: 'Awesome video!', time: 1, color: '#ffffff' },
  { text: 'uni-app is fantastic', time: 3, color: '#22c55e' },
  { text: 'Danmaku incoming!', time: 5, color: '#f59e0b' },
]

function onPlay() {
  console.log('Video started')
}

function onTimeUpdate(payload: { currentTime: number; duration: number }) {
  console.log('Current time:', payload.currentTime)
}
</script>
```

---

## ⚙️ Component Props

| Prop Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `src` | `string` | **Required** | Video source URL |
| `poster` | `string` | `""` | Video poster image URL |
| `autoplay` | `boolean` | `false` | Enable autoplay |
| `loop` | `boolean` | `false` | Enable looping |
| `muted` | `boolean` | `false` | Enable mute |
| `controls` | `boolean` | `true` | Show native controls (Set to false when `customControls` is true) |
| `customControls`| `boolean` | `false` | Enable custom control layer UI |
| `objectFit` | `"contain" \| "fill" \| "cover"` | `"contain"` | Video fitting mode |
| `initialTime` | `number` | `0` | Initial playback start time (seconds) |
| `title` | `string` | `""` | Video title (displayed on Top Header in Fullscreen) |
| `showMoreBtn` | `boolean` | `true` | Show "More" action button (`•••`) in control bar |
| `moreActions` | `MoreActionItem[]` | Default 2 items | Custom More actions list (Supports 2, 10, 20+ items) |
| `rates` | `number[]` | `[0.5, 0.75, 1.0, 1.25, 1.5, 2.0]` | Configurable playback speed rate options |
| `rate` | `number` | `1.0` | Initial playback speed rate |
| `qualities` | `QualityItem[]` | `[]` | List of video resolution qualities |
| `danmus` | `DanmuItem[]` | `[]` | Initial list of danmaku bullet comments |
| `icons` | `Partial<Record<IconKey, string>>` | `{}` | Custom control icons (Text/Unicode or Image URL) |
| `platformConfig` | `VideoPlatformConfig` | `{}` | Platform-specific overrides (H5 / WeChat Mini Program / App) |

---

## 🔔 Component Emits

| Event Name | Payload | Description |
| :--- | :--- | :--- |
| `play` | `-` | Triggered when video starts/resumes playing |
| `pause` | `-` | Triggered when video pauses |
| `ended` | `-` | Triggered when video reaches the end |
| `timeupdate` | `{ currentTime: number; duration: number }` | Triggered on time update |
| `qualitychange`| `{ index: number; label: string }` | Triggered when video resolution changes |
| `ratechange` | `{ rate: number }` | Triggered when playback speed rate changes |
| `senddanmu` | `DanmuItem` | Triggered when user submits a new danmaku |
| `moreactionclick` | `{ item: MoreActionItem; index: number; key: string }` | Triggered when user clicks a More Action item |
| `fullscreenchange` | `{ fullScreen: boolean }` | Triggered on fullscreen toggle |

---

## 🛠 Component Exposed Methods

Interact with the player using component `ref`:

```ts
const playerRef = ref<InstanceType<typeof VVideos> | null>(null)

// Play video
playerRef.value?.play()

// Pause video
playerRef.value?.pause()

// Seek to target position (seconds)
playerRef.value?.seek(30)

// Send live danmaku
playerRef.value?.sendDanmu({ text: 'Live bullet comment', color: '#ff0000' })

// Toggle danmaku layer visibility
playerRef.value?.toggleDanmaku()

// Select resolution quality
playerRef.value?.selectQuality(0)
```

---

## 🎨 Styling & CSS Variables

Customize player theme variables globally or within scoped page styles:

```css
.video-player {
  --vp-primary-color: #22c55e;        /* Primary accent color */
  --vp-primary-gradient: linear-gradient(135deg, #22c55e, #16a34a);
  --vp-bg-black: #000000;              /* Player background */
  --vp-panel-bg: rgba(15, 23, 42, 0.9);/* Overlay panel background */
  --vp-radius-xl: 24rpx;               /* Panel border radius */
}
```

---

## 📂 Directory Structure

```
src/components/v-videos/
├── v-videos.vue                     # SFC template & component script entry
├── index.ts                         # Unified module exports
├── types.ts                         # TypeScript interface & type definitions
├── styles/                          # Stylesheets directory
│   ├── vars.css                     # Theme & CSS variables
│   ├── common.css                   # Extracted reusable CSS utilities
│   └── video-player.css             # Main player stylesheet
└── composables/                     # Business logic composables
    ├── useVideoPlayer.ts            # Master orchestrator composable
    ├── useVideoControls.ts         # Playback state, quality & VideoContext API
    ├── useDanmaku.ts               # Danmaku animation engine & settings
    ├── useVideoGestures.ts         # Progress track & slider touch gestures
    ├── useVideoEvents.ts           # Native video event handlers
    └── useVideoOptions.ts          # Options merging & icons configuration
```

---

## 📄 License

[MIT](./LICENSE)
