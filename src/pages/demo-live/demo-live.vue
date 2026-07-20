<template>
  <view class="demo-page">
    <view class="demo-header">
      <text class="demo-title">🔴 直播源功能测试 (isLive / liveText)</text>
      <text class="demo-desc">测试直播场景下隐藏进度条与时间，展示动态脉冲直播 Tag 及弹幕互动。</text>
    </view>

    <!-- 播放器区域 -->
    <view class="player-wrapper">
      <v-videos
        ref="playerRef"
        :src="liveVideoSrc"
        :is-live="isLiveMode"
        :live-text="liveText"
        title="CCTV 官方高清直播演示"
        :custom-controls="true"
        :danmus="liveDanmus"
        @play="addLog('播放 [play]')"
        @pause="addLog('暂停 [pause]')"
        @ended="addLog('结束 [ended]')"
      />
    </view>

    <!-- 控制面板区域 -->
    <view class="control-card">
      <text class="control-card__title">🎛 属性操控台</text>
      
      <view class="control-group">
        <text class="control-label">直播模式 (:is-live)：</text>
        <switch :checked="isLiveMode" color="#ef4444" @change="isLiveMode = !isLiveMode" />
      </view>

      <view class="control-group">
        <text class="control-label">直播标识文本 (:live-text)：</text>
        <view class="btn-group">
          <button
            v-for="t in textOptions"
            :key="t"
            class="btn"
            :class="{ 'btn--active': liveText === t }"
            @click="liveText = t"
          >
            {{ t }}
          </button>
        </view>
      </view>

      <view class="control-group">
        <text class="control-label">发送直播弹幕：</text>
        <button class="btn btn--primary" @click="sendLiveDanmu">
          🚀 发送“主播 666”
        </button>
      </view>
    </view>

    <!-- 事件日志区 -->
    <view class="log-card">
      <text class="log-card__title">📋 运行日志</text>
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
import VVideos, { defaultDanmus } from '@/components/v-videos'

const playerRef = ref<InstanceType<typeof VVideos> | null>(null)
const liveVideoSrc = ref('https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/2minute-demo.mp4')
const isLiveMode = ref(true)
const liveText = ref('直播中')
const textOptions = ['直播中', '🔴 LIVE', '赛事直播', '带货热播']

const liveDanmus = defaultDanmus

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

function sendLiveDanmu() {
  playerRef.value?.sendDanmu({
    text: '主播 666，跨平台播放器强无敌！🔥',
    color: '#ef4444',
  })
  addLog('发送弹幕: 主播 666')
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.control-label {
  color: #cbd5e1;
  font-size: 26rpx;
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
  background: #ef4444;
  color: #ffffff;
}

.btn--primary {
  background: #ef4444;
  color: #ffffff;
  font-size: 24rpx;
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
  color: #38bdf8;
}
</style>
