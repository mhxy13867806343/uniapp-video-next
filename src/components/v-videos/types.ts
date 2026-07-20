import type { Platform } from "@/utils/platform";

export interface DanmuItem {
  text: string;
  color?: string;
  time?: number;
}

export interface QualityItem {
  label: string;
  url: string;
}

/** 触摸点 */
export interface UniTouchPoint {
  clientX: number;
  clientY: number;
}

/** 触摸事件（跨端通用字段，兼容 DOM TouchEvent） */
export interface UniTouchEvent {
  touches?: ArrayLike<UniTouchPoint>;
  changedTouches?: ArrayLike<UniTouchPoint>;
}

/** 点击事件（小程序 detail.x/y，H5 PointerEvent 的 detail 为 number） */
export interface UniTapEvent {
  detail?: number | { x?: number; y?: number };
  clientX?: number;
  clientY?: number;
}

export interface VideoTimeUpdateEvent {
  detail?: { currentTime?: number; duration?: number };
}

export interface VideoFullscreenChangeEvent {
  detail?: { fullScreen?: boolean; direction?: string };
}

export interface VideoProgressEvent {
  detail?: { buffered?: number };
}

export interface VideoControlsToggleEvent {
  detail?: { show?: boolean };
}

export interface VideoFullscreenClickEvent {
  detail?: {
    screenX?: number;
    screenY?: number;
    screenWidth?: number;
    screenHeight?: number;
  };
}

/** App 端 VideoContext 额外方法 */
export interface ExtendedVideoContext extends UniApp.VideoContext {
  showStatusBar?: () => void;
  hideStatusBar?: () => void;
}

export interface ElementRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface MoreActionItem {
  key: string;
  label: string;
  icon?: string;
  [key: string]: unknown;
}

export type IconKey =
  | "play"
  | "pause"
  | "loop"
  | "muted"
  | "volume"
  | "danmuOn"
  | "danmuOff"
  | "danmuSetting"
  | "fullscreen"
  | "more"
  | "back"
  | "loading"
  | "rate"
  | "episodes";

export interface EpisodeItem {
  number?: number | string;
  title?: string;
  url?: string;
  cover?: string;
  badge?: string;
  vip?: boolean;
}

export interface VideoPlayerOptions {
  poster?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  objectFit?: "contain" | "fill" | "cover";
  initialTime?: number;
  showFullscreenBtn?: boolean;
  showPlayBtn?: boolean;
  showCenterPlayBtn?: boolean;
  showMoreBtn?: boolean;
  showDanmakuBtn?: boolean;
  showDanmakuSettingBtn?: boolean;
  showSendInput?: boolean;
  showQualityBtn?: boolean;
  showRateBtn?: boolean;
  showEpisodesBtn?: boolean;
  showVolumeBtn?: boolean;
  showLoopBtn?: boolean;
  moreActions?: MoreActionItem[];
  episodes?: EpisodeItem[];
  currentEpisode?: number;
  loading?: boolean;
  loadingText?: string;
  loadingIcon?: string;
  rates?: number[];
  rate?: number;
  isLive?: boolean;
  liveText?: string;
  enableProgressGesture?: boolean;
  pageGesture?: boolean;
  vslideGesture?: boolean;
  direction?: 0 | 90 | -90;
  title?: string;
  showMuteBtn?: boolean;
  playBtnPosition?: "bottom" | "center";
  enablePlayGesture?: boolean;
  showCastingButton?: boolean;
  showLoading?: boolean;
  customControls?: boolean;
  /** 以下为官方 video 组件属性透传 */
  duration?: number;
  showProgress?: boolean;
  danmuList?: DanmuItem[];
  danmuBtn?: boolean;
  enableDanmu?: boolean;
  autoPauseIfNavigate?: boolean;
  autoPauseIfOpenNative?: boolean;
  vslideGestureInFullscreen?: boolean;
  adUnitId?: string;
  posterForCrawler?: string;
  codec?: "hardware" | "software";
  httpCache?: boolean;
  playStrategy?: 0 | 1 | 2 | 3 | 4 | 5;
  header?: Record<string, string>;
  pictureInPictureMode?: string | string[];
  pictureInPictureShowProgress?: boolean;
  enableAutoRotation?: boolean;
  showScreenLockButton?: boolean;
  showSnapshotButton?: boolean;
  showBackgroundPlaybackButton?: boolean;
  backgroundPoster?: string;
  referrerPolicy?: "origin" | "no-referrer";
}

export type VideoPlatformConfig = Partial<
  Record<Platform, Partial<VideoPlayerOptions>>
>;

export interface VideoPlayerProps extends VideoPlayerOptions {
  src: string;
  platformConfig?: VideoPlatformConfig;
  qualities?: QualityItem[];
  episodes?: EpisodeItem[];
  danmus?: DanmuItem[];
  icons?: Partial<Record<IconKey, string>>;
}

/** 事件 Payload 类型定义 */
export interface TimeUpdatePayload {
  currentTime: number;
  duration: number;
}

export interface FullscreenChangePayload {
  fullScreen: boolean;
}

export interface QualityChangePayload {
  index: number;
  label: string;
}

export interface RateChangePayload {
  rate: number;
}

export interface EpisodeChangePayload {
  index: number;
  item: EpisodeItem;
}

export interface ProgressPayload {
  buffered: number;
}

export interface FullscreenClickPayload {
  screenX: number;
  screenY: number;
  screenWidth: number;
  screenHeight: number;
}

export interface ControlsTogglePayload {
  show: boolean;
}

export interface MoreActionPayload {
  item: MoreActionItem;
  index: number;
  key: string;
}

export type VideoPlayerEmits = {
  (e: "play"): void;
  (e: "pause"): void;
  (e: "ended"): void;
  (e: "timeupdate", payload: TimeUpdatePayload): void;
  (e: "fullscreenchange", payload: FullscreenChangePayload): void;
  (e: "waiting"): void;
  (e: "error", payload: unknown): void;
  (e: "qualitychange", payload: QualityChangePayload): void;
  (e: "ratechange", payload: RateChangePayload): void;
  (e: "episodechange", payload: EpisodeChangePayload): void;
  (e: "progress", payload: ProgressPayload): void;
  (e: "loadeddata", payload: unknown): void;
  (e: "loadstart", payload: unknown): void;
  (e: "seeked", payload: unknown): void;
  (e: "seeking", payload: unknown): void;
  (e: "fullscreenclick", payload: FullscreenClickPayload): void;
  (e: "controlstoggle", payload: ControlsTogglePayload): void;
  (e: "senddanmu", payload: DanmuItem): void;
  (e: "moreactionclick", payload: MoreActionPayload): void;
};

/** 弹幕运行项 */
export interface ActiveDanmu {
  id: number;
  text: string;
  color?: string;
  top: number;
  x: number;
  started: boolean;
  moveDuration: number;
}

/** 弹幕设置面板配置项 */
export interface DanmakuSettings {
  opacity: number;
  fontSize: number;
  speed: number;
  area: number;
}

export type PanelKey =
  | "quality"
  | "danmuSetting"
  | "volume"
  | "send"
  | "more"
  | "rate"
  | "episodes"
  | null;
export type SettingKey = "opacity" | "fontSize" | "speed" | "area";

/** 暴露给父组件引用的实例方法与属性接口 */
export interface VideoPlayerExpose {
  play: () => void;
  pause: () => void;
  stop: () => void;
  seek: (position: number) => void;
  requestFullScreen: (direction?: 0 | 90 | -90) => void;
  exitFullScreen: () => void;
  sendDanmu: (danmu: DanmuItem) => void;
  playbackRate: (rate: number) => void;
  showStatusBar: () => void;
  hideStatusBar: () => void;
  toggleDanmaku: () => void;
  selectQuality: (index: number) => void;
  platform: Platform;
}
