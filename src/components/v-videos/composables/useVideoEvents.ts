import type { Ref } from "vue";
import type {
  VideoControlsToggleEvent,
  VideoFullscreenChangeEvent,
  VideoFullscreenClickEvent,
  VideoPlayerEmits,
  VideoProgressEvent,
  VideoTimeUpdateEvent,
} from "../types";

export function useVideoEvents(
  emit: VideoPlayerEmits,
  isPlaying: Ref<boolean>,
  controlsVisible: Ref<boolean>,
  innerCurrent: Ref<number>,
  innerDuration: Ref<number>,
  seeking: Ref<boolean>,
  pendingSeek: Ref<number | null>,
  isFullScreen: Ref<boolean>,
  scheduleHide: () => void,
  clearHideTimer: () => void,
  danmakuTick: (currentTime: number, previousTime: number) => void,
  seek: (pos: number) => void
) {
  function onPlay(): void {
    isPlaying.value = true;
    scheduleHide();
    emit("play");
  }

  function onPause(): void {
    isPlaying.value = false;
    controlsVisible.value = true;
    clearHideTimer();
    emit("pause");
  }

  function onEnded(): void {
    isPlaying.value = false;
    controlsVisible.value = true;
    clearHideTimer();
    emit("ended");
  }

  function onLoadedMetadata(): void {
    if (pendingSeek.value !== null) {
      seek(pendingSeek.value);
      pendingSeek.value = null;
    }
  }

  function onTimeUpdate(e: Event | VideoTimeUpdateEvent): void {
    const detail = (e as VideoTimeUpdateEvent).detail;
    const currentTime: number = detail?.currentTime ?? 0;
    const duration: number = detail?.duration ?? 0;
    const previous: number = innerCurrent.value;
    if (pendingSeek.value !== null && duration > 0) {
      seek(pendingSeek.value);
      pendingSeek.value = null;
    }
    if (!seeking.value) {
      innerCurrent.value = currentTime;
      innerDuration.value = duration;
    }
    danmakuTick(currentTime, previous);
    emit("timeupdate", { currentTime, duration });
  }

  function onFullscreenChange(e: Event | VideoFullscreenChangeEvent): void {
    const fs = !!(e as VideoFullscreenChangeEvent).detail?.fullScreen;
    isFullScreen.value = fs;
    emit("fullscreenchange", {
      fullScreen: fs,
    });
  }

  function onWaiting(): void {
    emit("waiting");
  }

  function onError(e: unknown): void {
    emit("error", e);
  }

  function onProgress(e: Event | VideoProgressEvent): void {
    emit("progress", {
      buffered: (e as VideoProgressEvent).detail?.buffered ?? 0,
    });
  }

  function onLoadedData(e: unknown): void {
    emit("loadeddata", e);
  }

  function onLoadStart(e: unknown): void {
    emit("loadstart", e);
  }

  function onSeeked(e: unknown): void {
    emit("seeked", e);
  }

  function onSeeking(e: unknown): void {
    emit("seeking", e);
  }

  function onFullscreenClick(e: Event | VideoFullscreenClickEvent): void {
    const detail = (e as VideoFullscreenClickEvent).detail;
    emit("fullscreenclick", {
      screenX: detail?.screenX ?? 0,
      screenY: detail?.screenY ?? 0,
      screenWidth: detail?.screenWidth ?? 0,
      screenHeight: detail?.screenHeight ?? 0,
    });
  }

  function onControlsToggle(e: Event | VideoControlsToggleEvent): void {
    emit("controlstoggle", {
      show: !!(e as VideoControlsToggleEvent).detail?.show,
    });
  }

  return {
    onPlay,
    onPause,
    onEnded,
    onLoadedMetadata,
    onTimeUpdate,
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
  };
}
