<template>
  <view class="demo-page">
    <view class="demo-header">
      <text class="demo-title">⚙️ 控制条按键自由显隐配置测试</text>
      <text class="demo-desc">默认全为 true，可任意指定独立按键隐藏或显示，即时响应控制条布局。</text>
    </view>

    <!-- 播放器区域 -->
    <view class="player-wrapper">
      <v-videos
        ref="playerRef"
        :src="videoSrc"
        title="控制条按键配置演示"
        :custom-controls="true"
        :qualities="qualities"
        :episodes="episodes"
        :show-danmaku-btn="ctrls.showDanmakuBtn"
        :show-danmaku-setting-btn="ctrls.showDanmakuSettingBtn"
        :show-send-input="ctrls.showSendInput"
        :show-quality-btn="ctrls.showQualityBtn"
        :show-rate-btn="ctrls.showRateBtn"
        :show-episodes-btn="ctrls.showEpisodesBtn"
        :show-volume-btn="ctrls.showVolumeBtn"
        :show-loop-btn="ctrls.showLoopBtn"
        :show-fullscreen-btn="ctrls.showFullscreenBtn"
        :show-more-btn="ctrls.showMoreBtn"
      />
    </view>

    <!-- 快捷全选/反选操作 -->
    <view class="quick-card">
      <text class="quick-card__title">🚀 一键快捷配置</text>
      <view class="quick-btn-group">
        <button class="btn btn--primary" @click="setAll(true)">
          全选显示 (默认全部 true)
        </button>

        <button class="btn btn--outline" @click="setAll(false)">
          全不选 (极简无按键)
        </button>

        <button class="btn btn--purple" @click="presetPureMovie">
          🎬 极简观影模式
        </button>
      </view>
    </view>

    <!-- 独立按键开关矩阵 -->
    <view class="control-card">
      <text class="control-card__title">🎛 独立按键 Switch 开关矩阵</text>
      
      <view class="switch-grid">
        <view v-for="item in switchItems" :key="item.key" class="switch-item">
          <text class="switch-item__label">{{ item.label }}</text>
          <switch
            :checked="ctrls[item.key]"
            color="#22c55e"
            @change="toggleSwitch(item.key)"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import VVideos, { defaultQualities, defaultEpisodes } from '@/components/v-videos'

const playerRef = ref<InstanceType<typeof VVideos> | null>(null)
const videoSrc = ref('https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/2minute-demo.mp4')

const qualities = defaultQualities
const episodes = defaultEpisodes

interface ControlSwitches {
  showDanmakuBtn: boolean
  showDanmakuSettingBtn: boolean
  showSendInput: boolean
  showQualityBtn: boolean
  showRateBtn: boolean
  showEpisodesBtn: boolean
  showVolumeBtn: boolean
  showLoopBtn: boolean
  showFullscreenBtn: boolean
  showMoreBtn: boolean
}

const ctrls = reactive<ControlSwitches>({
  showDanmakuBtn: true,
  showDanmakuSettingBtn: true,
  showSendInput: true,
  showQualityBtn: true,
  showRateBtn: true,
  showEpisodesBtn: true,
  showVolumeBtn: true,
  showLoopBtn: true,
  showFullscreenBtn: true,
  showMoreBtn: true,
})

type ControlKey = keyof ControlSwitches

const switchItems: { key: ControlKey; label: string }[] = [
  { key: 'showDanmakuBtn', label: '弹幕开关 (danmaku)' },
  { key: 'showDanmakuSettingBtn', label: '弹幕设置 (setting)' },
  { key: 'showSendInput', label: '发弹幕输入框 (input)' },
  { key: 'showQualityBtn', label: '清晰度按钮 (quality)' },
  { key: 'showRateBtn', label: '倍速按钮 (rate)' },
  { key: 'showEpisodesBtn', label: '选集按钮 (episodes)' },
  { key: 'showVolumeBtn', label: '音量按钮 (volume)' },
  { key: 'showLoopBtn', label: '循环按钮 (loop)' },
  { key: 'showFullscreenBtn', label: '全屏按钮 (fullscreen)' },
  { key: 'showMoreBtn', label: '更多按钮 (more)' },
]

function toggleSwitch(key: ControlKey) {
  ctrls[key] = !ctrls[key]
}

function setAll(val: boolean) {
  for (const k in ctrls) {
    ctrls[k as ControlKey] = val
  }
}

function presetPureMovie() {
  ctrls.showDanmakuBtn = false
  ctrls.showDanmakuSettingBtn = false
  ctrls.showSendInput = false
  ctrls.showQualityBtn = true
  ctrls.showRateBtn = true
  ctrls.showEpisodesBtn = true
  ctrls.showVolumeBtn = true
  ctrls.showLoopBtn = false
  ctrls.showFullscreenBtn = true
  ctrls.showMoreBtn = false
}
</script>

<style scoped>
.demo-page {
  min-height: 100vh;
  background: #0f1115;
  padding: 32rpx;
  box-sizing: border-box;
}

.demo-header {
  margin-bottom: 24rpx;
}

.demo-title {
  color: #ffffff;
  font-size: 34rpx;
  font-weight: 700;
  display: block;
  margin-bottom: 8rpx;
}

.demo-desc {
  color: #94a3b8;
  font-size: 24rpx;
  line-height: 1.4;
  display: block;
}

.player-wrapper {
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 16rpx 40rpx rgba(0, 0, 0, 0.5);
  margin-bottom: 32rpx;
}

.quick-card {
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 24rpx;
  padding: 24rpx;
  margin-bottom: 32rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.08);
}

.quick-card__title {
  color: #f8fafc;
  font-size: 26rpx;
  font-weight: 600;
  display: block;
  margin-bottom: 16rpx;
}

.quick-btn-group {
  display: flex;
  gap: 12rpx;
  flex-wrap: wrap;
}

.btn {
  font-size: 22rpx;
  padding: 10rpx 24rpx;
  border-radius: 14rpx;
  line-height: 1.5;
}

.btn--primary {
  background: #22c55e;
  color: #ffffff;
}

.btn--outline {
  background: rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
}

.btn--purple {
  background: #a855f7;
  color: #ffffff;
}

.control-card {
  background: rgba(30, 41, 59, 0.7);
  border-radius: 24rpx;
  padding: 28rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.08);
}

.control-card__title {
  color: #f8fafc;
  font-size: 28rpx;
  font-weight: 600;
  display: block;
  margin-bottom: 24rpx;
}

.switch-grid {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}

.switch-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12rpx 16rpx;
  border-radius: 16rpx;
  background: rgba(255, 255, 255, 0.04);
}

.switch-item__label {
  color: #e2e8f0;
  font-size: 24rpx;
}
</style>
