import { computed } from "vue";
import { platform } from "@/utils/platform";
import type {
  IconKey,
  VideoPlayerOptions,
  VideoPlayerProps,
} from "../types";

export const defaultOptions: Required<Omit<VideoPlayerOptions, never>> = {
  poster: "",
  autoplay: false,
  loop: false,
  muted: false,
  controls: true,
  objectFit: "contain",
  initialTime: 0,
  showFullscreenBtn: true,
  showPlayBtn: true,
  showCenterPlayBtn: true,
  showProgressBar: true,
  progressColor: "",
  progressTrackColor: "",
  progressThumbColor: "",
  progressHeight: "",
  showMoreBtn: true,
  showDanmakuBtn: true,
  showDanmakuSettingBtn: true,
  showSendInput: true,
  showQualityBtn: true,
  showRateBtn: true,
  showEpisodesBtn: true,
  showVolumeBtn: true,
  showLoopBtn: true,
  moreActions: [],
  episodes: [],
  currentEpisode: 0,
  loading: false,
  loadingText: "加载中...",
  loadingIcon: "",
  rates: [0.5, 0.75, 1.0, 1.25, 1.5, 2.0],
  rate: 1.0,
  isLive: false,
  liveText: "直播中",
  enableProgressGesture: true,
  pageGesture: false,
  vslideGesture: false,
  direction: 0,
  title: "",
  showMuteBtn: false,
  playBtnPosition: "bottom",
  enablePlayGesture: false,
  showCastingButton: false,
  showLoading: true,
  customControls: true,
  /** 官方 video 属性透传默认值 */
  duration: 0,
  showProgress: true,
  danmuList: [],
  danmuBtn: false,
  enableDanmu: false,
  autoPauseIfNavigate: true,
  autoPauseIfOpenNative: true,
  vslideGestureInFullscreen: true,
  adUnitId: "",
  posterForCrawler: "",
  codec: "hardware",
  httpCache: true,
  playStrategy: 0,
  header: {},
  pictureInPictureMode: [],
  pictureInPictureShowProgress: false,
  enableAutoRotation: false,
  showScreenLockButton: false,
  showSnapshotButton: false,
  showBackgroundPlaybackButton: false,
  backgroundPoster: "",
  referrerPolicy: "no-referrer",
};

export const defaultIcons: Record<IconKey, string> = {
  play: "▶",
  pause: "❚❚",
  loop: "⟳",
  muted: "🔇",
  volume: "🔊",
  danmuOn: "弹",
  danmuOff: "弹",
  danmuSetting: "⚙",
  fullscreen: "⛶",
  more: "•••",
  back: "←",
  loading: "⏳",
  rate: "倍速",
  episodes: "选集",
  centerPlay: "▶",
  centerPause: "❚❚",
};

export function useVideoOptions(props: VideoPlayerProps) {
  const opts = computed<Required<VideoPlayerOptions>>(() => {
    const generic: Partial<VideoPlayerOptions> = {};
    (Object.keys(defaultOptions) as (keyof VideoPlayerOptions)[]).forEach(
      (key) => {
        const value = props[key];
        if (value !== undefined) {
          (generic as Record<keyof VideoPlayerOptions, unknown>)[key] = value;
        }
      }
    );
    const platformOverrides = props.platformConfig?.[platform] ?? {};
    return { ...defaultOptions, ...generic, ...platformOverrides };
  });

  function iconOf(key: IconKey): string {
    return props.icons?.[key] ?? defaultIcons[key];
  }

  function isImageIcon(value: string): boolean {
    return /^(https?:|data:|\/|\.\/|\.\.\/)/.test(value);
  }

  return {
    opts,
    iconOf,
    isImageIcon,
  };
}
