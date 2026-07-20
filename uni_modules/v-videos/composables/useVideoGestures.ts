import { ref, type Ref, type ComponentPublicInstance } from "vue";
import type {
  ElementRect,
  SettingKey,
  UniTapEvent,
  UniTouchEvent,
} from "../types";

export function useVideoGestures(
  instance: ComponentPublicInstance | null,
  uid: string,
  videoId: string,
  innerDuration: Ref<number>,
  innerCurrent: Ref<number>,
  seeking: Ref<boolean>,
  seekPreview: Ref<number>,
  isPlaying: Ref<boolean>,
  mutedOn: Ref<boolean>,
  volume: Ref<number>,
  play: () => void,
  pause: () => void,
  seek: (pos: number) => void,
  scheduleHide: () => void,
  clearHideTimer: () => void,
  applySetting: (key: SettingKey, clientX: number, rect: { left: number; width: number } | null) => void
) {
  let trackRect: { left: number; width: number } | null = null;
  let wasPlayingBeforeSeek: boolean = false;
  let lastTouchSeekAt: number = 0;

  let settingRect: { left: number; width: number } | null = null;
  let settingDragging: boolean = false;

  function tapPoint(e: UniTapEvent): { x: number; y: number } {
    const d =
      typeof e.detail === "object" && e.detail !== null ? e.detail : undefined;
    return { x: d?.x ?? e.clientX ?? 0, y: d?.y ?? e.clientY ?? 0 };
  }

  function queryRectById(id: string): Promise<ElementRect | null> {
    return new Promise((resolve) => {
      try {
        const query = instance
          ? uni.createSelectorQuery().in(instance)
          : uni.createSelectorQuery();
        query
          .select(`#${id}`)
          .boundingClientRect((rect) => {
            const info = Array.isArray(rect) ? rect[0] : rect;
            if (info && (info.width ?? 0) > 0) {
              resolve({
                left: info.left ?? 0,
                top: info.top ?? 0,
                width: info.width ?? 0,
                height: info.height ?? 0,
              });
            } else {
              resolve(null);
            }
          })
          .exec();
      } catch {
        resolve(null);
      }
    });
  }

  function queryTrackRect(): Promise<{ left: number; width: number } | null> {
    return new Promise((resolve) => {
      try {
        const query = instance
          ? uni.createSelectorQuery().in(instance)
          : uni.createSelectorQuery();
        query
          .select(".vp-progress")
          .boundingClientRect((rect) => {
            const info = Array.isArray(rect) ? rect[0] : rect;
            if (info && (info.width ?? 0) > 0) {
              resolve({ left: info.left ?? 0, width: info.width ?? 0 });
            } else {
              resolve(null);
            }
          })
          .exec();
      } catch {
        resolve(null);
      }
    });
  }

  function percentFromClientX(clientX: number): number {
    if (!trackRect || trackRect.width <= 0) return 0;
    const percent: number = ((clientX - trackRect.left) / trackRect.width) * 100;
    return Math.min(100, Math.max(0, percent));
  }

  function applySeekPreview(clientX: number): void {
    seekPreview.value =
      (percentFromClientX(clientX) / 100) * innerDuration.value;
  }

  function commitSeek(): void {
    seek(seekPreview.value);
    innerCurrent.value = seekPreview.value;
    seeking.value = false;
    if (wasPlayingBeforeSeek) {
      play();
    }
    wasPlayingBeforeSeek = false;
    scheduleHide();
  }

  async function onTrackTouchStart(e: UniTouchEvent): Promise<void> {
    trackRect = await queryTrackRect();
    wasPlayingBeforeSeek = isPlaying.value;
    if (isPlaying.value) {
      pause();
    }
    seeking.value = true;
    clearHideTimer();
    applySeekPreview(e.touches?.[0]?.clientX ?? 0);
  }

  function onTrackTouchMove(e: UniTouchEvent): void {
    if (!seeking.value) return;
    applySeekPreview(e.touches?.[0]?.clientX ?? 0);
  }

  function onTrackTouchEnd(): void {
    if (!seeking.value) return;
    lastTouchSeekAt = Date.now();
    commitSeek();
  }

  async function onTrackClick(e: UniTapEvent): Promise<void> {
    if (innerDuration.value <= 0) return;
    if (Date.now() - lastTouchSeekAt < 500) return;
    trackRect = await queryTrackRect();
    wasPlayingBeforeSeek = isPlaying.value;
    seeking.value = true;
    applySeekPreview(tapPoint(e).x);
    commitSeek();
  }

  async function onSettingTouchStart(e: UniTouchEvent, key: SettingKey): Promise<void> {
    const rect = await queryRectById(`${uid}-hs-${key}`);
    if (!rect) return;
    settingRect = { left: rect.left, width: rect.width };
    settingDragging = true;
    applySetting(key, e.touches?.[0]?.clientX ?? 0, settingRect);
  }

  function onSettingTouchMove(e: UniTouchEvent, key: SettingKey): void {
    if (!settingDragging) return;
    applySetting(key, e.touches?.[0]?.clientX ?? 0, settingRect);
  }

  function onSettingTouchEnd(): void {
    settingDragging = false;
  }

  async function onSettingClick(e: UniTapEvent, key: SettingKey): Promise<void> {
    const rect = await queryRectById(`${uid}-hs-${key}`);
    if (!rect) return;
    settingRect = { left: rect.left, width: rect.width };
    applySetting(key, tapPoint(e).x, settingRect);
  }

  // #ifdef H5
  function applyVolumeToDom(v: number): void {
    const container = document.getElementById(videoId);
    const el = container?.querySelector("video");
    if (el) {
      el.volume = Math.min(1, Math.max(0, v / 100));
    }
  }

  async function setVolumeByClientY(clientY: number): Promise<void> {
    const rect = await queryRectById(`${uid}-volume-track`);
    if (!rect || rect.height <= 0) return;
    const pct: number = Math.min(
      1,
      Math.max(0, 1 - (clientY - rect.top) / rect.height)
    );
    volume.value = Math.round(pct * 100);
    mutedOn.value = volume.value === 0;
    applyVolumeToDom(volume.value);
  }

  function onVolumeTouch(e: UniTouchEvent): void {
    const clientY: number = e.touches?.[0]?.clientY ?? 0;
    setVolumeByClientY(clientY);
  }

  function onVolumeClick(e: UniTapEvent): void {
    setVolumeByClientY(tapPoint(e).y);
  }
  // #endif

  return {
    tapPoint,
    queryRectById,
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
  };
}
