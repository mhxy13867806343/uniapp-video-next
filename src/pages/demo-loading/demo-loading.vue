<template>
  <view class="demo-page">
    <view class="demo-header">
      <text class="demo-title">⏳ 网络 Loading 状态测试</text>
      <text class="demo-desc">测试 loading 手动控制、loadingText 文字以及 loadingIcon 自定义加载图标/Spinner。</text>
    </view>

    <!-- 播放器区域 -->
    <view class="player-wrapper">
      <v-videos
        ref="playerRef"
        :src="videoSrc"
        title="网络缓冲 Loading 演示"
        :custom-controls="true"
        :loading="isLoadingState"
        :loading-text="loadingText"
        :loading-icon="loadingIcon"
        @waiting="onWaiting"
      />
    </view>

    <!-- 控制面板区域 -->
    <view class="control-card">
      <text class="control-card__title">🎛 Loading 浮层调试台</text>
      
      <view class="control-group">
        <text class="control-label">强制开启 Loading (:loading)：</text>
        <switch :checked="isLoadingState" color="#f59e0b" @change="isLoadingState = !isLoadingState" />
      </view>

      <view class="control-group">
        <text class="control-label">提示文字 (:loading-text)：</text>
        <view class="btn-group">
          <button
            v-for="t in textOptions"
            :key="t"
            class="btn"
            :class="{ 'btn--active': loadingText === t }"
            @click="loadingText = t"
          >
            {{ t }}
          </button>
        </view>
      </view>

      <view class="control-group">
        <text class="control-label">图标类型 (:loading-icon)：</text>
        <view class="btn-group">
          <button
            class="btn"
            :class="{ 'btn--active': loadingIcon === '' }"
            @click="loadingIcon = ''"
          >
            默认 Spinner
          </button>
          <button
            class="btn"
            :class="{ 'btn--active': loadingIcon === '⏳' }"
            @click="loadingIcon = '⏳'"
          >
            ⏳ Emoji
          </button>
          <button
            class="btn"
            :class="{ 'btn--active': loadingIcon === '🔄' }"
            @click="loadingIcon = '🔄'"
          >
            🔄 旋转图标
          </button>
        </view>
      </view>

      <view class="control-group">
        <text class="control-label">模拟网络卡顿 (3秒后恢复)：</text>
        <button class="btn btn--sim" @click="simulateLag">
          ⚡ 触发 3 秒网络缓冲
        </button>
      </view>
    </view>

    <!-- 事件日志区 -->
    <view class="log-card">
      <text class="log-card__title">📋 缓冲运行日志</text>
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
import VVideos from '@/components/v-videos'

const playerRef = ref<InstanceType<typeof VVideos> | null>(null)
const videoSrc = ref('https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/2minute-demo.mp4')
const isLoadingState = ref(false)
const loadingText = ref('加载中...')
const textOptions = ['加载中...', '网络较慢，请稍候', '精彩马上呈现', '缓冲中 80%']
const loadingIcon = ref('')

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

function simulateLag() {
  isLoadingState.value = true
  addLog('模拟卡顿开始: isBuffering = true')
  setTimeout(() => {
    isLoadingState.value = false
    addLog('模拟卡顿结束: isBuffering = false')
  }, 3000)
}

function onWaiting() {
  addLog('触发原生网络缓冲事件: @waiting')
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
  display: flex;
  flex-direction: column;
  gap: 12rpx;
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
  background: #f59e0b;
  color: #ffffff;
}

.btn--sim {
  background: rgba(245, 158, 11, 0.2);
  color: #fbbf24;
  border: 1rpx solid rgba(245, 158, 11, 0.4);
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
  color: #fbbf24;
}
</style>
