import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  watch,
  type Ref,
  type ComponentPublicInstance,
} from "vue";
import type {
  ExtendedVideoContext,
  MoreActionItem,
  PanelKey,
  QualityItem,
  VideoPlayerOptions,
  VideoPlayerProps,
  VideoPlayerEmits,
} from "../types";
import { defaultMoreActions, formatTime } from "../config";

export function useVideoControls(
  props: VideoPlayerProps,
  opts: Ref<Required<VideoPlayerOptions>>,
  emit: VideoPlayerEmits,
  videoId: string,
  instance: ComponentPublicInstance | null
) {
  const videoCtx: Ref<ExtendedVideoContext | null> = ref<ExtendedVideoContext | null>(null);

  const isPlaying: Ref<boolean> = ref<boolean>(false);
  const controlsVisible: Ref<boolean> = ref<boolean>(true);
  const isBuffering: Ref<boolean> = ref<boolean>(false);
  const innerCurrent: Ref<number> = ref<number>(0);
  const innerDuration: Ref<number> = ref<number>(0);
  const seeking: Ref<boolean> = ref<boolean>(false);
  const seekPreview: Ref<number> = ref<number>(0);
  const loopOn: Ref<boolean> = ref<boolean>(false);
  const mutedOn: Ref<boolean> = ref<boolean>(false);
  const volume: Ref<number> = ref<number>(100);

  const isLoading = computed<boolean>(() => {
    if (props.loading) {
      return true;
    }
    return isBuffering.value;
  });

  const activeQuality: Ref<number> = ref<number>(-1);
  const activeSrc: Ref<string> = ref<string>(props.src);
  const pendingSeek: Ref<number | null> = ref<number | null>(null);

  const panelVisible: Ref<PanelKey> = ref<PanelKey>(null);
  const anyPanelVisible = computed<boolean>(() => panelVisible.value !== null);

  let hideTimer: ReturnType<typeof setTimeout> | null = null;

  onMounted(() => {
    videoCtx.value = uni.createVideoContext(videoId, instance ?? undefined);
  });

  onUnmounted(() => {
    clearHideTimer();
  });

  watch(
    () => opts.value.loop,
    (v: boolean) => {
      loopOn.value = v;
    },
    { immediate: true }
  );

  watch(
    () => opts.value.muted,
    (v: boolean) => {
      mutedOn.value = v;
    },
    { immediate: true }
  );

  watch(
    () => props.src,
    (v: string) => {
      if (activeQuality.value === -1) {
        activeSrc.value = v;
      }
    }
  );

  const displayTime = computed<number>(() =>
    seeking.value ? seekPreview.value : innerCurrent.value
  );

  const progressPercent = computed<number>(() =>
    innerDuration.value > 0 ? (displayTime.value / innerDuration.value) * 100 : 0
  );

  const qualityOptions = computed<QualityItem[]>(() => props.qualities ?? []);

  const currentQualityLabel = computed<string>(() =>
    activeQuality.value >= 0
      ? qualityOptions.value[activeQuality.value]?.label ?? "自动"
      : "自动"
  );

  function clearHideTimer(): void {
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }
  }

  function scheduleHide(): void {
    clearHideTimer();
    if (isPlaying.value && !panelVisible.value) {
      hideTimer = setTimeout(() => {
        controlsVisible.value = false;
      }, 3000);
    }
  }

  function toggleControls(): void {
    controlsVisible.value = !controlsVisible.value;
    if (controlsVisible.value) {
      scheduleHide();
    }
  }

  function togglePlay(): void {
    if (isPlaying.value) {
      pause();
    } else {
      play();
    }
    scheduleHide();
  }

  function togglePanel(key: Exclude<PanelKey, null>): void {
    panelVisible.value = panelVisible.value === key ? null : key;
    if (panelVisible.value) {
      clearHideTimer();
    } else {
      scheduleHide();
    }
  }

  function closePanels(extraCloseCallback?: unknown): void {
    panelVisible.value = null;
    if (typeof extraCloseCallback === "function") {
      extraCloseCallback();
    }
    scheduleHide();
  }

  function onOverlayTap(extraCloseCallback?: unknown): void {
    if (panelVisible.value) {
      closePanels(extraCloseCallback);
      return;
    }
    toggleControls();
  }

  function selectQuality(index: number): void {
    if (index === activeQuality.value) {
      panelVisible.value = null;
      return;
    }
    const resumeTime: number = innerCurrent.value;
    activeQuality.value = index;
    const target: string =
      index >= 0 ? qualityOptions.value[index]?.url ?? props.src : props.src;
    if (target !== activeSrc.value) {
      pendingSeek.value = resumeTime > 0.5 ? resumeTime : null;
      activeSrc.value = target;
      nextTick(() => {
        play();
      });
    }
    panelVisible.value = null;
    emit("qualitychange", {
      index,
      label: currentQualityLabel.value,
    });
  }

  function onLoadedMetadata(): void {
    if (pendingSeek.value !== null) {
      seek(pendingSeek.value);
      pendingSeek.value = null;
    }
  }

  function toggleMute(): void {
    mutedOn.value = !mutedOn.value;
    // #ifdef H5
    applyVolumeToDom(mutedOn.value ? 0 : volume.value);
    // #endif
  }

  function onVolumeBtnClick(): void {
    // #ifdef H5
    togglePanel("volume");
    return;
    // #endif
    // eslint-disable-next-line no-unreachable
    toggleMute();
  }

  // #ifdef H5
  function applyVolumeToDom(v: number): void {
    const container = document.getElementById(videoId);
    const el = container?.querySelector("video");
    if (el) {
      el.volume = Math.min(1, Math.max(0, v / 100));
    }
  }
  // #endif

  function toggleLoop(): void {
    loopOn.value = !loopOn.value;
  }

  const isFullScreen: Ref<boolean> = ref<boolean>(false);

  const activeMoreActions = computed<MoreActionItem[]>(() => {
    if (opts.value.moreActions && opts.value.moreActions.length > 0) {
      return opts.value.moreActions;
    }
    return defaultMoreActions;
  });

  function onMoreActionClick(item: MoreActionItem, index: number): void {
    panelVisible.value = null;
    emit("moreactionclick", {
      item,
      index,
      key: item.key,
    });
  }

  // 对外 API
  function play(): void {
    videoCtx.value?.play();
  }
  function pause(): void {
    videoCtx.value?.pause();
  }
  function stop(): void {
    videoCtx.value?.pause();
    videoCtx.value?.seek(0);
  }
  function seek(position: number): void {
    videoCtx.value?.seek(position);
  }
  function requestFullScreen(direction: 0 | 90 | -90 = 90): void {
    isFullScreen.value = true;
    videoCtx.value?.requestFullScreen({ direction });
  }
  function exitFullScreen(): void {
    isFullScreen.value = false;
    videoCtx.value?.exitFullScreen();
  }
  function playbackRate(rate: number): void {
    videoCtx.value?.playbackRate(rate);
  }
  function showStatusBar(): void {
    videoCtx.value?.showStatusBar?.();
  }
  function hideStatusBar(): void {
    videoCtx.value?.hideStatusBar?.();
  }

  return {
    videoCtx,
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
    pendingSeek,
    panelVisible,
    anyPanelVisible,
    displayTime,
    progressPercent,
    qualityOptions,
    currentQualityLabel,
    isFullScreen,
    isBuffering,
    isLoading,
    activeMoreActions,
    onMoreActionClick,
    clearHideTimer,
    scheduleHide,
    toggleControls,
    togglePlay,
    togglePanel,
    closePanels,
    onOverlayTap,
    selectQuality,
    onLoadedMetadata,
    toggleMute,
    onVolumeBtnClick,
    toggleLoop,
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
  };
}
