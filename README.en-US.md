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
- 🔴 **Live Streaming Support**: Built-in `:is-live="true"` mode, automatically hiding duration & progress bar, displaying a pulsing live status badge (Customizable via `:live-text`).
- 💬 **High-Performance Danmaku Engine**:
  - Smooth CSS animation with collision-free track scheduling.
  - Custom settings for display area, opacity, font size, and scrolling speed.
  - Built-in Emoji picker and color palette for bullet comments.
- 📺 **Seamless Quality Switching**: Multi-grade resolution support (e.g. 1080P, 720P, 480P, Auto) with automatic playback position recovery upon switching.
- ⚡ **Extensible Custom Actions Panel**: Grid action panel supporting 2, 10, or 20+ custom menu items with `@moreactionclick` callback delegation.
- 🚀 **Configurable Speed Rates**: Configurable speed list via `:rates="[0.5, 0.75, 1.0, 1.25, 1.5, 2.0]"` and component API `playbackRate()`.
- ⏳ **Buffering & Loading Overlay**: Automatic and manual loading overlay state `:loading`, `:loading-text`, and `:loading-icon`.
- 🎨 **CSS Variables & Custom Themes**: Driven by CSS Custom Properties (`--vp-*`) for effortless customization of colors, shadows, radius, and glassmorphism panel styles.
- 📱 **Cross-Platform Compatibility**: Fully tested across H5, WeChat Mini Program, App (iOS / Android), and HarmonyOS.
- 👆 **Intuitive Touch Gestures**: Smooth progress bar scrubbing preview, volume adjustment panel, and slider touch gestures.

---

## 🌐 Online Live Demo & Build

- **🚀 GitHub Pages Live H5 Demo**: [https://mhxy13867806343.github.io/uniapp-video-next/](https://mhxy13867806343.github.io/uniapp-video-next/)
- **💻 Run Local H5 Development Server**:
  ```bash
  npm run dev:h5
  ```
- **📦 Build H5 Production Bundle (Outputs to dist/build/h5)**:
  ```bash
  npm run build:h5
  ```

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
      title="uni-app Video Demo"
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

// Use built-in preset configurations or customize your own
const qualities = defaultQualities
const danmus = defaultDanmus
const moreActions = defaultMoreActions
const rates = defaultRates

function onPlay() {
  console.log('Video started')
}

function onTimeUpdate(payload: { currentTime: number; duration: number }) {
  console.log('Current time:', formatTime(payload.currentTime))
}

function onMoreActionClick(payload: { item: MoreActionItem; index: number; key: string }) {
  console.log('More action clicked:', payload.item.label)
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
| `showCenterPlayBtn` | `boolean` | `true` | Show center Play/Pause overlay button (Image 2 & 3, customizable) |
| `showProgressBar` | `boolean` | `true` | Show bottom progress bar track (Image 4, customizable) |
| `progressColor` | `string` | `""` | Played active track color (e.g. `#22c55e`, `#3b82f6`) |
| `progressTrackColor` | `string` | `""` | Unplayed track background color (e.g. `rgba(255,255,255,0.2)`) |
| `progressThumbColor` | `string` | `""` | Progress thumb dot color (e.g. `#ffffff`) |
| `progressHeight` | `string` | `""` | Progress bar track height (e.g. `4rpx`, `6rpx`, `12rpx`) |
| `showDanmakuBtn` | `boolean` | `true` | Show danmaku master toggle button |
| `showDanmakuSettingBtn` | `boolean` | `true` | Show danmaku settings button |
| `showSendInput` | `boolean` | `true` | Show send danmaku input entry |
| `showQualityBtn` | `boolean` | `true` | Show video resolution quality button |
| `showRateBtn` | `boolean` | `true` | Show playback speed rate button |
| `showEpisodesBtn` | `boolean` | `true` | Show episode selection button |
| `showVolumeBtn` | `boolean` | `true` | Show volume adjustment button |
| `showLoopBtn` | `boolean` | `true` | Show loop playback button |
| `showFullscreenBtn` | `boolean` | `true` | Show fullscreen toggle button |
| `showMoreBtn` | `boolean` | `true` | Show "More" action button (`•••`) |
| `moreActions` | `MoreActionItem[]` | Default 2 items | Custom More actions list (Supports 2, 10, 20+ items) |
| `episodes` | `EpisodeItem[]` | `[]` | Episode selection list (Supports 1~34+ episode grid) |
| `currentEpisode` | `number` | `0` | Active episode index |
| `rates` | `number[]` | `[0.5, 0.75, 1.0, 1.25, 1.5, 2.0]` | Configurable playback speed rate options |
| `rate` | `number` | `1.0` | Initial playback speed rate |
| `loading` | `boolean` | `false` | Network buffering / loading state (displays overlay when true) |
| `loadingText` | `string` | `"加载中..."` | Loading overlay text indicator |
| `loadingIcon` | `string` | `""` | Custom loading icon (Unicode / Text / Image URL) |
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
| `episodechange`| `{ index: number; item: EpisodeItem }` | Triggered when active episode changes |
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

// Change playback speed rate
playerRef.value?.playbackRate(1.5)
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
src/
├── components/v-videos/             # v-videos Core Component
│   ├── v-videos.vue                 # SFC template & component script entry
│   ├── index.ts                         # Unified module exports
│   ├── types.ts                         # TypeScript interface & type definitions
│   ├── config.ts                        # Presets configuration & formatTime helper
│   ├── styles/                          # Stylesheets directory
│   │   ├── vars.css                 # Theme & CSS variables
│   │   ├── common.css               # Extracted reusable CSS utilities
│   │   └── video-player.css         # Main player stylesheet
│   └── composables/                 # Business logic composables
│       ├── useVideoPlayer.ts        # Master orchestrator composable
│       ├── useVideoControls.ts     # Playback state, quality, speed rate & VideoContext
│       ├── useDanmaku.ts           # Danmaku animation engine & settings
│       ├── useVideoGestures.ts     # Progress track & slider touch gestures
│       ├── useVideoEvents.ts       # Native video event handlers
│       └── useVideoOptions.ts      # Options merging & icons configuration
└── pages/                           # Pages & Feature Testing Hub
    ├── index/index.vue              # Main Navigation Hub & Basic Demo
    ├── demo-live/demo-live.vue      # Live Stream Testing Page
    ├── demo-more/demo-more.vue      # Custom More Actions Panel Testing Page
    ├── demo-rate/demo-rate.vue      # Playback Speed Rate Testing Page
    └── demo-loading/demo-loading.vue# Network Loading State Testing Page
```

---

## 📄 License

[MIT](./LICENSE)
