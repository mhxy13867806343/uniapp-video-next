<template>
  <view class="demo-page">
    <view class="demo-header">
      <text class="demo-title">🚀 播放倍速功能测试 (rates / rate)</text>
      <text class="demo-desc">测试 rates 可选倍速列表、rate 初始倍速、@ratechange 事件及实例 api playbackRate()。</text>
    </view>

    <!-- 播放器区域 -->
    <view class="player-wrapper">
      <v-videos
        ref="playerRef"
        :src="videoSrc"
        title="播放倍速功能演示"
        :custom-controls="true"
        :rates="currentRates"
        :rate="currentRate"
        @ratechange="onRateChange"
      />
    </view>

    <!-- 控制面板区域 -->
    <view class="control-card">
      <text class="control-card__title">🎛 倍速操控与 API 测试</text>
      
      <view class="control-group">
        <text class="control-label">可选倍速配置列表 (:rates)：</text>
        <view class="btn-group">
          <button
            class="btn"
            :class="{ 'btn--active': ratePresetIndex === 0 }"
            @click="setRatesPreset(0)"
          >
            标准 (0.5x~2.0x)
          </button>
          <button
            class="btn"
            :class="{ 'btn--active': ratePresetIndex === 1 }"
            @click="setRatesPreset(1)"
          >
            极速 (1.0x~3.0x)
          </button>
        </view>
      </view>

      <view class="control-group">
        <text class="control-label">API 实例调用 (.playbackRate)：</text>
        <view class="btn-group">
          <button
            v-for="r in currentRates"
            :key="r"
            class="btn btn--api"
            @click="callApiPlaybackRate(r)"
          >
            设置 {{ r }}x
          </button>
        </view>
      </view>
    </view>

    <!-- 事件日志区 -->
    <view class="log-card">
      <text class="log-card__title">🔔 倍速回调事件 (@ratechange)</text>
      <scroll-view class="log-list" scroll-y>
        <view v-for="(log, i) in logs" :key="i" class="log-item">
          <text class="log-time">{{ log.time }}</text>
          <text class="log-text">{{ log.text }}</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VVideos, { defaultRates } from '@/components/v-videos'

const playerRef = ref<InstanceType<typeof VVideos> | null>(null)
const videoSrc = ref('https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/2minute-demo.mp4')

const ratePresets = [
  [0.5, 0.75, 1.0, 1.25, 1.5, 2.0],
  [1.0, 1.25, 1.5, 2.0, 2.5, 3.0],
]

const ratePresetIndex = ref(0)
const currentRates = ref<number[]>(ratePresets[0])
const currentRate = ref(1.0)

function setRatesPreset(idx: number) {
  ratePresetIndex.value = idx
  currentRates.value = ratePresets[idx]
  addLog(`切换倍速配置方案 ${idx === 0 ? '标准' : '极速'}: [${currentRates.value.join(', ')}]`)
}

interface LogItem {
  time: string
  text: string
}

const logs = ref<LogItem[]>([])

function addLog(text: string) {
  const now = new Date()
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
  logs.value.unshift({ time: timeStr, text })
  if (logs.value.length > 20) {
    logs.value.pop()
  }
}

function callApiPlaybackRate(r: number) {
  playerRef.value?.playbackRate(r)
  addLog(`通过组件 Ref API 强制设置倍速: ${r}x`)
}

function onRateChange(payload: { rate: number }) {
  uni.showToast({
    title: `当前倍速: ${payload.rate}x`,
    icon: 'none',
  })
  addLog(`触发 @ratechange 事件回调: rate=${payload.rate}`)
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

.control-card {
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 24rpx;
  padding: 28rpx;
  margin-bottom: 32rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.08);
}

.control-card__title {
  color: #f8fafc;
  font-size: 28rpx;
  font-weight: 600;
  display: block;
  margin-bottom: 20rpx;
}

.control-group {
  margin-bottom: 24rpx;
}

.control-label {
  color: #cbd5e1;
  font-size: 26rpx;
  display: block;
  margin-bottom: 12rpx;
}

.btn-group {
  display: flex;
  gap: 12rpx;
  flex-wrap: wrap;
}

.btn {
  font-size: 22rpx;
  padding: 8rpx 20rpx;
  border-radius: 12rpx;
  background: rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  border: 1rpx solid transparent;
  line-height: 1.5;
}

.btn--active {
  background: #10b981;
  color: #ffffff;
}

.btn--api {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border: 1rpx solid rgba(16, 185, 129, 0.3);
}

.log-card {
  background: rgba(30, 41, 59, 0.7);
  border-radius: 24rpx;
  padding: 24rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.08);
}

.log-card__title {
  color: #f8fafc;
  font-size: 26rpx;
  font-weight: 600;
  display: block;
  margin-bottom: 16rpx;
}

.log-list {
  max-height: 240rpx;
}

.log-item {
  display: flex;
  gap: 16rpx;
  font-size: 22rpx;
  padding: 6rpx 0;
  border-bottom: 1rpx dashed rgba(255, 255, 255, 0.05);
}

.log-time {
  color: #64748b;
  font-family: monospace;
}

.log-text {
  color: #34d399;
}
</style>
