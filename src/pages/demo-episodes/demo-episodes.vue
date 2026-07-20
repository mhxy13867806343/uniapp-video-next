<template>
  <view class="demo-page">
    <view class="demo-header">
      <text class="demo-title">📺 选集 / 剧集功能测试 (episodes)</text>
      <text class="demo-desc">测试剧集面板 1~34 集网格与列表排版、VIP 标识、选集切换视频源及 @episodechange 回调。</text>
    </view>

    <!-- 播放器区域 -->
    <view class="player-wrapper">
      <v-videos
        ref="playerRef"
        :src="currentVideoSrc"
        :title="currentVideoTitle"
        :custom-controls="true"
        :episodes="currentEpisodes"
        :current-episode="activeEpisodeIdx"
        @episodechange="onEpisodeChange"
      />
    </view>

    <!-- 控制面板区域 -->
    <view class="control-card">
      <text class="control-card__title">🎛 选集剧集数据方案切换</text>
      
      <view class="control-group">
        <text class="control-label">切换剧集套餐方案：</text>
        <view class="btn-group">
          <button
            class="btn"
            :class="{ 'btn--active': presetIndex === 0 }"
            @click="setPreset(0)"
          >
            哆啦A梦 (6集短剧)
          </button>
          <button
            class="btn"
            :class="{ 'btn--active': presetIndex === 1 }"
            @click="setPreset(1)"
          >
            热播大剧 (24集全)
          </button>
        </view>
      </view>

      <view class="control-group">
        <text class="control-label">代码控制选集 (Ref.selectEpisode)：</text>
        <view class="btn-group">
          <button
            v-for="(ep, i) in currentEpisodes.slice(0, 6)"
            :key="i"
            class="btn btn--api"
            :class="{ 'btn--active-api': i === activeEpisodeIdx }"
            @click="callApiSelectEpisode(i)"
          >
            第 {{ ep.number }} 集
          </button>
        </view>
      </view>
    </view>

    <!-- 事件日志区 -->
    <view class="log-card">
      <text class="log-card__title">🔔 选集回调事件 (@episodechange)</text>
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
import VVideos, { defaultEpisodes, type EpisodeItem } from '@/components/v-videos'

const playerRef = ref<InstanceType<typeof VVideos> | null>(null)
const presetIndex = ref(0)
const activeEpisodeIdx = ref(0)

// 方案 1：6 集短剧
const presetShort: EpisodeItem[] = defaultEpisodes

// 方案 2：24 集热播大剧
const preset24: EpisodeItem[] = Array.from({ length: 24 }, (_, i) => ({
  number: i + 1,
  title: `第${i + 1}集 ${['命运的抉择', '暗流涌动', '决战前夕', '曙光乍现', '终极破局'][i % 5]}`,
  url: 'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/2minute-demo.mp4',
  badge: i > 2 ? 'VIP' : '免费',
  vip: i > 2,
}))

const currentEpisodes = computed<EpisodeItem[]>(() => {
  return presetIndex.value === 0 ? presetShort : preset24
})

const currentVideoTitle = computed<string>(() => {
  const ep = currentEpisodes.value[activeEpisodeIdx.value]
  return ep ? `哆啦A梦 · ${ep.title}` : '哆啦A梦：大雄的地球交响乐'
})

const currentVideoSrc = computed<string>(() => {
  const ep = currentEpisodes.value[activeEpisodeIdx.value]
  return ep?.url || 'https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/2minute-demo.mp4'
})

function setPreset(idx: number) {
  presetIndex.value = idx
  activeEpisodeIdx.value = 0
  addLog(`切换剧集方案: ${idx === 0 ? '6集短剧' : '24集大剧'}`)
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

function callApiSelectEpisode(idx: number) {
  activeEpisodeIdx.value = idx
  addLog(`手动选择集数 [索引 ${idx}]: 第 ${currentEpisodes.value[idx]?.number} 集`)
}

function onEpisodeChange(payload: { index: number; item: EpisodeItem }) {
  activeEpisodeIdx.value = payload.index
  uni.showToast({
    title: `已选择: ${payload.item.title || `第${payload.item.number}集`}`,
    icon: 'none',
  })
  addLog(`触发 @episodechange: index=${payload.index}, title="${payload.item.title}"`)
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
  background: #3b82f6;
  color: #ffffff;
}

.btn--api {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
  border: 1rpx solid rgba(59, 130, 246, 0.3);
}

.btn--active-api {
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
  color: #60a5fa;
}
</style>
