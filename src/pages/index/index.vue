<template>
  <view class="page">
    <view class="header">
      <text class="header__title">v-videos 终极跨平台视频播放器</text>
      <text class="header__subtitle">Vue 3 + TypeScript · 预设功能与特性测试中心</text>
    </view>

    <!-- 基础播放器演示 -->
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

    <!-- 功能专项测试页面入口卡片网络 -->
    <view class="nav-section">
      <text class="nav-section__title">🧪 专项功能测试页面入口</text>

      <view class="nav-grid">
        <view class="nav-card" @click="navigateTo('/pages/demo-controls/demo-controls')">
          <view class="nav-card__icon-wrap nav-card__icon-wrap--green">
            <text class="nav-card__icon">⚙️</text>
          </view>
          <view class="nav-card__info">
            <text class="nav-card__title">控制条按键自由显隐配置</text>
            <text class="nav-card__desc">独立开/关 10 个控制条按钮，默认全为 true</text>
          </view>
          <text class="nav-card__arrow">→</text>
        </view>

        <view class="nav-card" @click="navigateTo('/pages/demo-episodes/demo-episodes')">
          <view class="nav-card__icon-wrap nav-card__icon-wrap--blue">
            <text class="nav-card__icon">📺</text>
          </view>
          <view class="nav-card__info">
            <text class="nav-card__title">选集 / 剧集功能测试</text>
            <text class="nav-card__desc">episodes / VIP 标识 / 1~34 集切集网格</text>
          </view>
          <text class="nav-card__arrow">→</text>
        </view>

        <view class="nav-card" @click="navigateTo('/pages/demo-live/demo-live')">
          <view class="nav-card__icon-wrap nav-card__icon-wrap--red">
            <text class="nav-card__icon">🔴</text>
          </view>
          <view class="nav-card__info">
            <text class="nav-card__title">直播源功能测试</text>
            <text class="nav-card__desc">isLive / liveText / 脉冲直播 Tag</text>
          </view>
          <text class="nav-card__arrow">→</text>
        </view>

        <view class="nav-card" @click="navigateTo('/pages/demo-more/demo-more')">
          <view class="nav-card__icon-wrap nav-card__icon-wrap--purple">
            <text class="nav-card__icon">⚡</text>
          </view>
          <view class="nav-card__info">
            <text class="nav-card__title">更多操作面板测试</text>
            <text class="nav-card__desc">moreActions / 2~20项菜单 / 点击代理</text>
          </view>
          <text class="nav-card__arrow">→</text>
        </view>

        <view class="nav-card" @click="navigateTo('/pages/demo-rate/demo-rate')">
          <view class="nav-card__icon-wrap nav-card__icon-wrap--green">
            <text class="nav-card__icon">🚀</text>
          </view>
          <view class="nav-card__info">
            <text class="nav-card__title">播放倍速切换测试</text>
            <text class="nav-card__desc">rates / rate / 0.5x~3.0x / API 调用</text>
          </view>
          <text class="nav-card__arrow">→</text>
        </view>

        <view class="nav-card" @click="navigateTo('/pages/demo-loading/demo-loading')">
          <view class="nav-card__icon-wrap nav-card__icon-wrap--amber">
            <text class="nav-card__icon">⏳</text>
          </view>
          <view class="nav-card__info">
            <text class="nav-card__title">网络 Loading 测试</text>
            <text class="nav-card__desc">loading / loadingText / 自定义图标</text>
          </view>
          <text class="nav-card__arrow">→</text>
        </view>
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

function navigateTo(url: string) {
  uni.navigateTo({ url })
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

<style scoped>
page {
  background: #0f1115;
}

.page {
  min-height: 100vh;
  padding: 40rpx 32rpx;
  box-sizing: border-box;
}

.header {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  margin-bottom: 36rpx;
}

.header__title {
  font-size: 38rpx;
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
  margin-bottom: 40rpx;
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

.nav-section {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.nav-section__title {
  color: #f8fafc;
  font-size: 28rpx;
  font-weight: 600;
  padding-left: 8rpx;
}

.nav-grid {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.nav-card {
  display: flex;
  align-items: center;
  padding: 24rpx;
  border-radius: 24rpx;
  background: rgba(30, 41, 59, 0.6);
  border: 1rpx solid rgba(255, 255, 255, 0.08);
  transition: background 0.15s ease;
}

.nav-card:active {
  background: rgba(30, 41, 59, 0.9);
}

.nav-card__icon-wrap {
  width: 72rpx;
  height: 72rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}

.nav-card__icon-wrap--red {
  background: rgba(239, 68, 68, 0.15);
}

.nav-card__icon-wrap--blue {
  background: rgba(59, 130, 246, 0.15);
}

.nav-card__icon-wrap--purple {
  background: rgba(168, 85, 247, 0.15);
}

.nav-card__icon-wrap--green {
  background: rgba(16, 185, 129, 0.15);
}

.nav-card__icon-wrap--amber {
  background: rgba(245, 158, 11, 0.15);
}

.nav-card__icon {
  font-size: 34rpx;
}

.nav-card__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.nav-card__title {
  color: #f1f5f9;
  font-size: 28rpx;
  font-weight: 600;
}

.nav-card__desc {
  color: #64748b;
  font-size: 22rpx;
}

.nav-card__arrow {
  color: #475569;
  font-size: 32rpx;
  font-weight: 600;
}
</style>
