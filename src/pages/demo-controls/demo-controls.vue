<template>
  <view class="demo-page">
    <view class="demo-header">
      <text class="demo-title">⚙️ 控制条按键显隐与进度条/居中图标自定义</text>
      <text class="demo-desc">支持显隐控制（进度条、居中播放图标、底栏所有按键），并支持进度条颜色、高度、滑块及图标自定义。</text>
    </view>

    <!-- 播放器区域 -->
    <view class="player-wrapper">
      <v-videos
        ref="playerRef"
        :src="videoSrc"
        title="控制条与进度条自定义演示"
        :custom-controls="true"
        :qualities="qualities"
        :episodes="episodes"
        :show-center-play-btn="ctrls.showCenterPlayBtn"
        :show-progress-bar="ctrls.showProgressBar"
        :progress-color="progressColor"
        :progress-height="progressHeight"
        :progress-track-color="progressTrackColor"
        :progress-thumb-color="progressThumbColor"
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
        :icons="customIcons"
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
          🎬 纯净无打扰模式
        </button>
      </view>
    </view>

    <!-- 🎨 进度条 (图片 4) 自定义样式配置 -->
    <view class="control-card">
      <text class="control-card__title">🎨 进度条 (图片 4) 自定义样式配置</text>

      <view class="style-row">
        <text class="style-row__label">进度条颜色 (progressColor)：</text>
        <view class="color-options">
          <view
            v-for="c in colorOptions"
            :key="c.value"
            class="color-dot"
            :style="{ backgroundColor: c.color }"
            :class="{ 'color-dot--active': progressColor === c.value }"
            @click="progressColor = c.value"
          />
        </view>
      </view>

      <view class="style-row">
        <text class="style-row__label">进度条高度 (progressHeight)：</text>
        <view class="height-options">
          <button
            v-for="h in heightOptions"
            :key="h"
            class="btn btn--sm"
            :class="{ 'btn--active': progressHeight === h }"
            @click="progressHeight = h"
          >
            {{ h }}
          </button>
        </view>
      </view>

      <view class="style-row">
        <text class="style-row__label">居中图标方案 (图片 2 & 3)：</text>
        <view class="height-options">
          <button
            class="btn btn--sm"
            :class="{ 'btn--active': iconPreset === 'default' }"
            @click="setIconPreset('default')"
          >
            默认圆形绿调
          </button>
          <button
            class="btn btn--sm"
            :class="{ 'btn--active': iconPreset === 'emoji' }"
            @click="setIconPreset('emoji')"
          >
            Emoji 风格 (⚡/⏸)
          </button>
        </view>
      </view>
    </view>

    <!-- 🎛 独立按键与组件 Switch 开关矩阵 -->
    <view class="control-card">
      <text class="control-card__title">🎛 独立 Switch 隐显开关矩阵</text>
      
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

const progressColor = ref('#22c55e')
const progressHeight = ref('6rpx')
const progressTrackColor = ref('rgba(255, 255, 255, 0.2)')
const progressThumbColor = ref('#ffffff')

const colorOptions = [
  { value: '#22c55e', color: '#22c55e' }, // 翡翠绿
  { value: '#3b82f6', color: '#3b82f6' }, // 科技蓝
  { value: '#a855f7', color: '#a855f7' }, // 霓虹紫
  { value: '#ef4444', color: '#ef4444' }, // 警示红
  { value: '#f59e0b', color: '#f59e0b' }, // 琥珀黄
]

const heightOptions = ['4rpx', '6rpx', '8rpx', '12rpx']

const iconPreset = ref<'default' | 'emoji'>('default')
const customIcons = ref<Record<string, string>>({})

function setIconPreset(preset: 'default' | 'emoji') {
  iconPreset.value = preset
  if (preset === 'emoji') {
    customIcons.value = {
      centerPlay: '🚀',
      centerPause: '⏸',
    }
  } else {
    customIcons.value = {}
  }
}

interface ControlSwitches {
  showCenterPlayBtn: boolean
  showProgressBar: boolean
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
  showCenterPlayBtn: true,
  showProgressBar: true,
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
  { key: 'showCenterPlayBtn', label: '居中大播放/暂停图标 (图片2 & 3)' },
  { key: 'showProgressBar', label: '底栏播放进度条 (图片4)' },
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
  ctrls.showCenterPlayBtn = true
  ctrls.showProgressBar = true
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
  font-size: 32rpx;
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

.btn--sm {
  font-size: 20rpx;
  padding: 6rpx 18rpx;
  border-radius: 10rpx;
  background: rgba(255, 255, 255, 0.08);
  color: #94a3b8;
}

.btn--active {
  background: #22c55e;
  color: #ffffff;
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
  margin-bottom: 32rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.08);
}

.control-card__title {
  color: #f8fafc;
  font-size: 28rpx;
  font-weight: 600;
  display: block;
  margin-bottom: 24rpx;
}

.style-row {
  margin-bottom: 24rpx;
}

.style-row__label {
  color: #cbd5e1;
  font-size: 24rpx;
  display: block;
  margin-bottom: 12rpx;
}

.color-options {
  display: flex;
  gap: 20rpx;
}

.color-dot {
  width: 44rpx;
  height: 44rpx;
  border-radius: 50%;
  border: 3rpx solid transparent;
  transition: transform 0.15s ease;
}

.color-dot--active {
  border-color: #ffffff;
  transform: scale(1.15);
}

.height-options {
  display: flex;
  gap: 12rpx;
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
