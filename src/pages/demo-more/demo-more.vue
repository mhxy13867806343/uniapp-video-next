<template>
  <view class="demo-page">
    <view class="demo-header">
      <text class="demo-title">⚡ 自定义“更多”操作面板测试</text>
      <text class="demo-desc">测试 showMoreBtn 开关、自定义传入 2个 / 10个 / 20个 菜单项及点击事件代理。</text>
    </view>

    <!-- 播放器区域 -->
    <view class="player-wrapper">
      <v-videos
        ref="playerRef"
        :src="videoSrc"
        title="更多操作面板功能演示"
        :custom-controls="true"
        :show-more-btn="showMoreBtn"
        :more-actions="currentMoreActions"
        @moreactionclick="onMoreActionClick"
      />
    </view>

    <!-- 控制面板区域 -->
    <view class="control-card">
      <text class="control-card__title">🎛 菜单数量与开关切换</text>
      
      <view class="control-group">
        <text class="control-label">显示更多按钮 (:show-more-btn)：</text>
        <switch :checked="showMoreBtn" color="#3b82f6" @change="showMoreBtn = !showMoreBtn" />
      </view>

      <view class="control-group">
        <text class="control-label">自定义 Action 菜单数量：</text>
        <view class="btn-group">
          <button
            class="btn"
            :class="{ 'btn--active': currentCount === 2 }"
            @click="setCount(2)"
          >
            2 项 (默认)
          </button>
          <button
            class="btn"
            :class="{ 'btn--active': currentCount === 10 }"
            @click="setCount(10)"
          >
            10 项
          </button>
          <button
            class="btn"
            :class="{ 'btn--active': currentCount === 20 }"
            @click="setCount(20)"
          >
            20 项 (海量)
          </button>
        </view>
      </view>
    </view>

    <!-- 事件日志区 -->
    <view class="log-card">
      <text class="log-card__title">🔔 点击事件回调 (@moreactionclick)</text>
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
import { ref, computed } from 'vue'
import VVideos, { defaultMoreActions, type MoreActionItem } from '@/components/v-videos'

const playerRef = ref<InstanceType<typeof VVideos> | null>(null)
const videoSrc = ref('https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/2minute-demo.mp4')
const showMoreBtn = ref(true)
const currentCount = ref(10)

// 20 项完整菜单列表
const full20Actions: MoreActionItem[] = [
  { key: 'share', label: '微信分享', icon: '🔗' },
  { key: 'favorite', label: '加入收藏', icon: '⭐' },
  { key: 'download', label: '缓存下载', icon: '⬇️' },
  { key: 'cast', label: '电视投屏', icon: '📺' },
  { key: 'copy', label: '复制链接', icon: '📋' },
  { key: 'speed', label: '倍速播放', icon: '🚀' },
  { key: 'pip', label: '画中画', icon: '🖼️' },
  { key: 'screenshot', label: '视频截图', icon: '📸' },
  { key: 'loop', label: '单曲循环', icon: '⟳' },
  { key: 'report', label: '违规举报', icon: '⚠️' },
  { key: 'soundtrack', label: '原声提取', icon: '🎵' },
  { key: 'subtitle', label: '字幕设置', icon: '💬' },
  { key: 'aspect', label: '画面比例', icon: '📐' },
  { key: 'equalizer', label: '音效均衡', icon: '🎚️' },
  { key: 'night', label: '夜间模式', icon: '🌙' },
  { key: 'mirror', label: '镜像翻转', icon: '🪞' },
  { key: 'gif', label: '截取GIF', icon: '🎞️' },
  { key: 'feedback', label: '意见反馈', icon: '📩' },
  { key: 'stats', label: '统计信息', icon: '📊' },
  { key: 'about', label: '关于作品', icon: 'ℹ️' },
]

const currentMoreActions = computed<MoreActionItem[]>(() => {
  if (currentCount.value === 2) {
    return full20Actions.slice(0, 2)
  }
  if (currentCount.value === 10) {
    return full20Actions.slice(0, 10)
  }
  return full20Actions
})

function setCount(count: number) {
  currentCount.value = count
  addLog(`切换菜单模式: ${count} 项`)
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

function onMoreActionClick(payload: { item: MoreActionItem; index: number; key: string }) {
  uni.showToast({
    title: `触发: ${payload.item.label}`,
    icon: 'none',
  })
  addLog(`点击菜单项 [${payload.index}]: key="${payload.key}", label="${payload.item.label}"`)
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
  background: #3b82f6;
  color: #ffffff;
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
  color: #a855f7;
}
</style>
