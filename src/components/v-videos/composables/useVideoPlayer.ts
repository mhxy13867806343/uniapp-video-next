import { getCurrentInstance, type ComponentPublicInstance } from "vue";
import { platform } from "@/utils/platform";
import type { VideoPlayerProps, VideoPlayerEmits, DanmuItem } from "../types";
import { useVideoOptions } from "./useVideoOptions";
import { useVideoControls } from "./useVideoControls";
import { useDanmaku } from "./useDanmaku";
import { useVideoGestures } from "./useVideoGestures";
import { useVideoEvents } from "./useVideoEvents";

export function useVideoPlayer(props: VideoPlayerProps, emit: VideoPlayerEmits) {
  const uid: string = `vp-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const videoId: string = `${uid}-video`;
  const danmakuLayerId: string = `${uid}-danmaku`;
  const instance: ComponentPublicInstance | null = getCurrentInstance()?.proxy ?? null;

  // 1. 选项与图标
  const options = useVideoOptions(props);

  // 2. 控制与状态
  const controls = useVideoControls(props, options.opts, emit, videoId, instance);

  // 3. 弹幕引擎
  const danmaku = useDanmaku(
    props,
    emit,
    danmakuLayerId,
    instance,
    controls.innerCurrent,
    (extraCb) => {
      danmaku.emojiVisible.value = false;
      controls.closePanels(extraCb);
    }
  );

  function onOverlayTap(): void {
    controls.onOverlayTap(() => {
      danmaku.emojiVisible.value = false;
    });
  }

  // 4. 触摸与滑块手势
  const gestures = useVideoGestures(
    instance,
    uid,
    videoId,
    controls.innerDuration,
    controls.innerCurrent,
    controls.seeking,
    controls.seekPreview,
    controls.isPlaying,
    controls.mutedOn,
    controls.volume,
    controls.play,
    controls.pause,
    controls.seek,
    controls.scheduleHide,
    controls.clearHideTimer,
    danmaku.applySetting
  );

  // 5. 原生视频事件处理
  const events = useVideoEvents(
    emit,
    controls.isPlaying,
    controls.controlsVisible,
    controls.innerCurrent,
    controls.innerDuration,
    controls.seeking,
    controls.pendingSeek,
    controls.isFullScreen,
    controls.scheduleHide,
    controls.clearHideTimer,
    danmaku.danmakuTick,
    controls.seek
  );

  function sendDanmu(danmu: DanmuItem): void {
    danmaku.fireDanmu(danmu);
  }

  return {
    uid,
    videoId,
    danmakuLayerId,
    platform,
    sendDanmu,
    ...options,
    ...controls,
    onOverlayTap,
    ...danmaku,
    ...gestures,
    ...events,
  };
}
