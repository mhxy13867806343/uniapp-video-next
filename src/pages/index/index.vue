<template>
  <view class="page">
    <view class="header">
      <text class="header__title">终极跨平台解决方案</text>
      <text class="header__subtitle">uni-app 官方介绍视频 · 自定义播放器</text>
    </view>
    <view class="player-card">
      <v-videos
        ref="playerRef"
        :src="videoSrc"
        title="uni-app 官方介绍视频"
        :custom-controls="true"
        :qualities="qualities"
        :danmus="danmus"
        :more-actions="moreActions"
        :platform-config="platformConfig"
        @play="onPlay"
        @pause="onPause"
        @ended="onEnded"
        @timeupdate="onTimeUpdate"
        @moreactionclick="onMoreActionClick"
      />
      <view class="player-card__meta">
        <text class="player-card__status">{{ status }}</text>
        <text class="player-card__progress">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VVideos, {
  defaultMoreActions,
  defaultQualities,
  defaultDanmus,
  formatTime,
  type VideoPlatformConfig,
  type MoreActionItem,
} from '@/components/v-videos'

const playerRef = ref<InstanceType<typeof VVideos> | null>(null)
const videoSrc = ref('https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/2minute-demo.mp4')

const qualities = defaultQualities
const danmus = defaultDanmus
const moreActions = defaultMoreActions

function onMoreActionClick(payload: { item: MoreActionItem; index: number; key: string }) {
  uni.showToast({
    title: `点击了: ${payload.item.label}`,
    icon: 'none',
  })
}

const platformConfig: VideoPlatformConfig = {
  h5: {
    objectFit: 'contain',
    showLoading: true,
  },
  'mp-weixin': {
    showMuteBtn: true,
    playBtnPosition: 'center',
    enablePlayGesture: true,
    showCastingButton: true,
    title: '微信小程序视频',
  },
  app: {
    objectFit: 'cover',
    vslideGesture: true,
    direction: 90,
  },
}

const status = ref('未播放')
const currentTime = ref(0)
const duration = ref(0)

function onPlay() {
  status.value = '播放中'
}
function onPause() {
  status.value = '已暂停'
}
function onEnded() {
  status.value = '已结束'
}
function onTimeUpdate(payload: { currentTime: number; duration: number }) {
  currentTime.value = payload.currentTime
  duration.value = payload.duration
}
</script>
</script>

<style>
page {
  background: #0f1115;
}

.page {
  min-height: 100vh;
  padding: 48rpx 32rpx;
  box-sizing: border-box;
}

.header {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  margin-bottom: 36rpx;
}

.header__title {
  font-size: 40rpx;
  font-weight: 700;
  color: #f5f6f8;
}

.header__subtitle {
  font-size: 24rpx;
  color: #8b90a0;
}

.player-card {
  background: #181b22;
  border-radius: 28rpx;
  padding: 16rpx;
  box-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.4);
}

.player-card__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 12rpx 8rpx;
}

.player-card__status {
  font-size: 26rpx;
  color: #22c55e;
}

.player-card__progress {
  font-size: 24rpx;
  color: #8b90a0;
  font-variant-numeric: tabular-nums;
}
</style>
