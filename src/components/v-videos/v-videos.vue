<template>
  <view class="video-player">
    <video
      :id="videoId"
      class="video-player__video"
      :src="activeSrc"
      :poster="opts.poster"
      :autoplay="opts.autoplay"
      :loop="loopOn"
      :muted="mutedOn"
      :controls="opts.customControls ? false : opts.controls"
      :object-fit="opts.objectFit"
      :initial-time="opts.initialTime"
      :show-fullscreen-btn="opts.showFullscreenBtn"
      :show-play-btn="opts.showPlayBtn"
      :show-center-play-btn="opts.showCenterPlayBtn"
      :enable-progress-gesture="opts.enableProgressGesture"
      :page-gesture="opts.pageGesture"
      :vslide-gesture="opts.vslideGesture"
      :direction="opts.direction"
      :title="opts.title"
      :show-mute-btn="opts.showMuteBtn"
      :play-btn-position="opts.playBtnPosition"
      :enable-play-gesture="opts.enablePlayGesture"
      :show-casting-button="opts.showCastingButton"
      :show-loading="opts.showLoading"
      :duration="opts.duration > 0 ? opts.duration : undefined"
      :show-progress="opts.showProgress"
      :danmu-list="opts.danmuList"
      :danmu-btn="opts.danmuBtn"
      :enable-danmu="opts.enableDanmu"
      :auto-pause-if-navigate="opts.autoPauseIfNavigate"
      :auto-pause-if-open-native="opts.autoPauseIfOpenNative"
      :vslide-gesture-in-fullscreen="opts.vslideGestureInFullscreen"
      :ad-unit-id="opts.adUnitId"
      :poster-for-crawler="opts.posterForCrawler"
      :codec="opts.codec"
      :http-cache="opts.httpCache"
      :play-strategy="opts.playStrategy"
      :header="opts.header"
      :is-live="opts.isLive"
      :picture-in-picture-mode="opts.pictureInPictureMode"
      :picture-in-picture-show-progress="opts.pictureInPictureShowProgress"
      :enable-auto-rotation="opts.enableAutoRotation"
      :show-screen-lock-button="opts.showScreenLockButton"
      :show-snapshot-button="opts.showSnapshotButton"
      :show-background-playback-button="opts.showBackgroundPlaybackButton"
      :background-poster="opts.backgroundPoster"
      :referrer-policy="opts.referrerPolicy"
      @play="onPlay"
      @pause="onPause"
      @ended="onEnded"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
      @fullscreenchange="onFullscreenChange"
      @waiting="onWaiting"
      @error="onError"
      @progress="onProgress"
      @loadeddata="onLoadedData"
      @loadstart="onLoadStart"
      @seeked="onSeeked"
      @seeking="onSeeking"
      @fullscreenclick="onFullscreenClick"
      @controlstoggle="onControlsToggle"
    />

    <!-- 弹幕层 -->
    <view
      v-if="opts.customControls && danmakuEnabled"
      :id="danmakuLayerId"
      class="vp-danmaku"
      :style="{
        opacity: danmakuSettings.opacity / 100,
        height: danmakuSettings.area + '%',
      }"
    >
      <view
        v-for="item in activeDanmus"
        :key="item.id"
        class="vp-danmaku__item"
        :style="{
          top: item.top + '%',
          transform: `translateX(${item.x}px)`,
          transition: item.started
            ? `transform ${item.moveDuration}s linear`
            : 'none',
        }"
      >
        <text
          class="vp-danmaku__text"
          :style="{ color: item.color || '#ffffff', fontSize: danmuFontSize }"
        >
          {{ item.text }}
        </text>
      </view>
    </view>

    <!-- 自定义控制层 -->
    <view
      v-if="opts.customControls"
      class="vp-overlay"
      :class="{ 'vp-overlay--hidden': !controlsVisible && !anyPanelVisible }"
      @click="onOverlayTap"
    >
      <view class="vp-overlay__center" @click.stop="togglePlay">
        <text class="vp-overlay__center-icon">
          {{ isPlaying ? iconOf('pause') : iconOf('play') }}
        </text>
      </view>

      <view class="vp-overlay__bar" @click.stop>
        <text class="vp-overlay__time">{{ formatTime(displayTime) }}</text>
        <view
          class="vp-progress"
          @click="onTrackClick"
          @touchstart="onTrackTouchStart"
          @touchmove="onTrackTouchMove"
          @touchend="onTrackTouchEnd"
          @touchcancel="onTrackTouchEnd"
        >
          <view class="vp-progress__track">
            <view
              class="vp-progress__played"
              :style="{ width: progressPercent + '%' }"
            />
            <view
              class="vp-progress__thumb"
              :class="{ 'vp-progress__thumb--active': seeking }"
              :style="{ left: progressPercent + '%' }"
            />
          </view>
        </view>
        <text class="vp-overlay__time">{{ formatTime(innerDuration) }}</text>
      </view>

      <!-- 工具栏 -->
      <view class="vp-toolbar" @click.stop>
        <view
          class="vp-tool"
          :class="{ 'vp-tool--active': danmakuEnabled }"
          @click="toggleDanmaku"
        >
          <image
            v-if="isImageIcon(iconOf(danmakuEnabled ? 'danmuOn' : 'danmuOff'))"
            class="vp-tool__img"
            :src="iconOf(danmakuEnabled ? 'danmuOn' : 'danmuOff')"
          />
          <text v-else class="vp-tool__icon">
            {{ iconOf(danmakuEnabled ? 'danmuOn' : 'danmuOff') }}
          </text>
        </view>

        <view class="vp-tool" @click="togglePanel('danmuSetting')">
          <image
            v-if="isImageIcon(iconOf('danmuSetting'))"
            class="vp-tool__img"
            :src="iconOf('danmuSetting')"
          />
          <text v-else class="vp-tool__icon">{{ iconOf('danmuSetting') }}</text>
        </view>

        <view
          v-if="qualityOptions.length > 0"
          class="vp-tool vp-tool--label"
          @click="togglePanel('quality')"
        >
          <text class="vp-tool__label">{{ currentQualityLabel }}</text>
        </view>

        <view class="vp-send-entry" @click="togglePanel('send')">
          <text class="vp-send-entry__text">发个弹幕吧～</text>
        </view>

        <view
          class="vp-tool"
          :class="{ 'vp-tool--active': mutedOn }"
          @click="onVolumeBtnClick"
        >
          <image
            v-if="isImageIcon(iconOf(mutedOn ? 'muted' : 'volume'))"
            class="vp-tool__img"
            :src="iconOf(mutedOn ? 'muted' : 'volume')"
          />
          <text v-else class="vp-tool__icon">
            {{ iconOf(mutedOn ? 'muted' : 'volume') }}
          </text>
        </view>

        <view
          class="vp-tool"
          :class="{ 'vp-tool--active': loopOn }"
          @click="toggleLoop"
        >
          <image
            v-if="isImageIcon(iconOf('loop'))"
            class="vp-tool__img"
            :src="iconOf('loop')"
          />
          <text v-else class="vp-tool__icon">{{ iconOf('loop') }}</text>
        </view>

        <view class="vp-tool" @click="requestFullScreen()">
          <image
            v-if="isImageIcon(iconOf('fullscreen'))"
            class="vp-tool__img"
            :src="iconOf('fullscreen')"
          />
          <text v-else class="vp-tool__icon">{{ iconOf('fullscreen') }}</text>
        </view>
      </view>
    </view>

    <!-- 点击任意处关闭面板的遮罩 -->
    <view
      v-if="anyPanelVisible"
      class="vp-mask"
      @click.stop="closePanels()"
      @touchmove.stop.prevent
    />

    <!-- 清晰度面板 -->
    <view
      v-if="panelVisible === 'quality'"
      class="vp-panel vp-panel--left"
      @click.stop
    >
      <view
        v-for="(q, i) in qualityOptions"
        :key="i"
        class="vp-panel__item"
        :class="{ 'vp-panel__item--active': i === activeQuality }"
        @click="selectQuality(i)"
      >
        <text class="vp-panel__item-text">{{ q.label }}</text>
      </view>
      <view
        class="vp-panel__item"
        :class="{ 'vp-panel__item--active': activeQuality === -1 }"
        @click="selectQuality(-1)"
      >
        <text class="vp-panel__item-text">自动</text>
      </view>
    </view>

    <!-- 弹幕设置面板 -->
    <view
      v-if="panelVisible === 'danmuSetting'"
      class="vp-panel vp-panel--right"
      @click.stop
    >
      <view
        v-for="row in settingRows"
        :key="row.key"
        class="vp-setting"
      >
        <text class="vp-setting__label">{{ row.label }}</text>
        <view
          :id="`${uid}-hs-${row.key}`"
          class="vp-hslider"
          @click="onSettingClick($event, row.key)"
          @touchstart="onSettingTouchStart($event, row.key)"
          @touchmove="onSettingTouchMove($event, row.key)"
          @touchend="onSettingTouchEnd"
          @touchcancel="onSettingTouchEnd"
        >
          <view class="vp-hslider__track">
            <view
              class="vp-hslider__fill"
              :style="{ width: settingPercent(row.key) + '%' }"
            />
            <view
              class="vp-hslider__thumb"
              :style="{ left: settingPercent(row.key) + '%' }"
            />
          </view>
        </view>
        <text class="vp-setting__value">{{ settingDisplay(row.key) }}</text>
      </view>
    </view>

    <!-- 弹幕发送栏 -->
    <view
      v-if="panelVisible === 'send'"
      class="vp-send"
      @click.stop
    >
      <view class="vp-send__row">
        <view
          class="vp-send__emoji-btn"
          :class="{ 'vp-send__emoji-btn--active': emojiVisible }"
          @click="emojiVisible = !emojiVisible"
        >
          <text class="vp-send__emoji-icon">😀</text>
        </view>
        <input
          v-model="danmuInput"
          class="vp-send__input"
          type="text"
          confirm-type="send"
          placeholder="发个友善的弹幕见证当下"
          placeholder-class="vp-send__placeholder"
          :maxlength="60"
          @confirm="submitDanmu"
        />
        <view
          class="vp-send__submit"
          :class="{ 'vp-send__submit--disabled': !danmuInput.trim() }"
          @click="submitDanmu"
        >
          <text class="vp-send__submit-text">发送</text>
        </view>
      </view>

      <view class="vp-send__colors">
        <view
          v-for="c in danmuColors"
          :key="c"
          class="vp-send__color"
          :class="{ 'vp-send__color--active': c === danmuColor }"
          :style="{ backgroundColor: c }"
          @click="danmuColor = c"
        />
      </view>

      <scroll-view
        v-if="emojiVisible"
        class="vp-send__emojis"
        scroll-y
      >
        <view class="vp-send__emoji-grid">
          <view
            v-for="emoji in emojiList"
            :key="emoji"
            class="vp-send__emoji-item"
            @click="appendEmoji(emoji)"
          >
            <text class="vp-send__emoji-char">{{ emoji }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 音量面板（仅 H5，其他端点击音量按钮为静音开关） -->
    <!-- #ifdef H5 -->
    <view
      v-if="panelVisible === 'volume'"
      class="vp-volume"
      @click.stop
    >
      <text class="vp-volume__value">{{ volume }}</text>
      <view
        :id="`${uid}-volume-track`"
        class="vp-volume__slider"
        @click="onVolumeClick"
        @touchstart="onVolumeTouch"
        @touchmove="onVolumeTouch"
      >
        <view class="vp-volume__track">
          <view
            class="vp-volume__fill"
            :style="{ height: volume + '%' }"
          />
          <view
            class="vp-volume__thumb"
            :style="{ bottom: volume + '%' }"
          />
        </view>
      </view>
      <view class="vp-volume__mute" @click="toggleMute">
        <text class="vp-tool__icon">
          {{ iconOf(mutedOn ? 'muted' : 'volume') }}
        </text>
      </view>
    </view>
    <!-- #endif -->
  </view>
</template>

<script lang="ts">
export * from "./types";
export default {
  name: "v-videos",
};
</script>

<script setup lang="ts">
import { useVideoPlayer } from "./composables/useVideoPlayer";
import type { VideoPlayerProps, VideoPlayerEmits, VideoPlayerExpose } from "./types";

const props = defineProps<VideoPlayerProps>();
const emit = defineEmits<VideoPlayerEmits>();

const player = useVideoPlayer(props, emit);

const {
  uid,
  videoId,
  danmakuLayerId,
  opts,
  iconOf,
  isImageIcon,
  // 播放状态与控制
  isPlaying,
  controlsVisible,
  innerCurrent,
  innerDuration,
  seeking,
  seekPreview,
  loopOn,
  mutedOn,
  volume,
  activeQuality,
  activeSrc,
  panelVisible,
  anyPanelVisible,
  displayTime,
  progressPercent,
  qualityOptions,
  currentQualityLabel,
  toggleControls,
  togglePlay,
  togglePanel,
  closePanels,
  onOverlayTap,
  selectQuality,
  onVolumeBtnClick,
  toggleLoop,
  toggleMute,
  formatTime,
  play,
  pause,
  stop,
  seek,
  requestFullScreen,
  exitFullScreen,
  playbackRate,
  showStatusBar,
  hideStatusBar,
  // 弹幕
  danmakuEnabled,
  danmakuSettings,
  activeDanmus,
  danmuInput,
  emojiVisible,
  danmuColor,
  danmuColors,
  emojiList,
  settingRows,
  danmuFontSize,
  toggleDanmaku,
  fireDanmu,
  sendDanmu,
  appendEmoji,
  submitDanmu,
  settingPercent,
  settingDisplay,
  // 手势
  onTrackTouchStart,
  onTrackTouchMove,
  onTrackTouchEnd,
  onTrackClick,
  onSettingTouchStart,
  onSettingTouchMove,
  onSettingTouchEnd,
  onSettingClick,
  // #ifdef H5
  onVolumeTouch,
  onVolumeClick,
  // #endif
  // 视频原生事件
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate,
  onLoadedMetadata,
  onFullscreenChange,
  onWaiting,
  onError,
  onProgress,
  onLoadedData,
  onLoadStart,
  onSeeked,
  onSeeking,
  onFullscreenClick,
  onControlsToggle,
  platform,
} = player;

defineExpose<VideoPlayerExpose>({
  play,
  pause,
  stop,
  seek,
  requestFullScreen,
  exitFullScreen,
  sendDanmu,
  playbackRate,
  showStatusBar,
  hideStatusBar,
  toggleDanmaku,
  selectQuality,
  platform,
});
</script>

<style scoped>
@import "./styles/video-player.css";
</style>
