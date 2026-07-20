import {
  computed,
  onUnmounted,
  reactive,
  ref,
  type Ref,
  type ComponentPublicInstance,
} from "vue";
import type {
  ActiveDanmu,
  DanmakuSettings,
  DanmuItem,
  SettingKey,
  VideoPlayerProps,
  VideoPlayerEmits,
} from "../types";

export function useDanmaku(
  props: VideoPlayerProps,
  emit: VideoPlayerEmits,
  danmakuLayerId: string,
  instance: ComponentPublicInstance | null,
  innerCurrent: Ref<number>,
  closePanels: (cb?: () => void) => void
) {
  const danmakuEnabled: Ref<boolean> = ref<boolean>(true);
  const danmakuSettings: DanmakuSettings = reactive<DanmakuSettings>({
    opacity: 100,
    fontSize: 100,
    speed: 100,
    area: 100,
  });

  const activeDanmus: Ref<ActiveDanmu[]> = ref<ActiveDanmu[]>([]);
  const danmuTimers: ReturnType<typeof setTimeout>[] = [];
  let danmuSeq: number = 0;
  let danmuPointer: number = 0;
  let danmuTrack: number = 0;
  let danmakuWidth: number = 0;

  const danmuInput: Ref<string> = ref<string>("");
  const emojiVisible: Ref<boolean> = ref<boolean>(false);
  const danmuColor: Ref<string> = ref<string>("#ffffff");

  const danmuColors: string[] = [
    "#ffffff",
    "#ef4444",
    "#f59e0b",
    "#22c55e",
    "#3b82f6",
    "#a855f7",
    "#ec4899",
  ];

  const emojiList: string[] = [
    "😀", "😂", "🤣", "😍", "🥰", "😎", "🤔", "😭",
    "😱", "😡", "🤯", "🥳", "🙈", "👍", "👏", "🙏",
    "💪", "🎉", "🔥", "❤️", "💔", "✨", "⚡", "🌟",
    "🌈", "🍺", "🍿", "🎮", "🎵", "🚀", "👌", "🤝",
    "😴", "🤪", "😇", "😈", "👻", "🤖", "💩", "🐢",
  ];

  const settingRows: { key: SettingKey; label: string }[] = [
    { key: "area", label: "显示区域" },
    { key: "opacity", label: "不透明度" },
    { key: "fontSize", label: "字体大小" },
    { key: "speed", label: "弹幕速度" },
  ];

  const settingRanges: Record<SettingKey, { min: number; max: number }> = {
    opacity: { min: 10, max: 100 },
    fontSize: { min: 50, max: 150 },
    speed: { min: 50, max: 200 },
    area: { min: 25, max: 100 },
  };

  onUnmounted(() => {
    danmuTimers.forEach((t: ReturnType<typeof setTimeout>) => clearTimeout(t));
  });

  const danmuFontSize = computed<string>(
    () => `${Math.round((28 * danmakuSettings.fontSize) / 100)}rpx`
  );

  const sortedDanmus = computed<DanmuItem[]>(() =>
    [...(props.danmus ?? [])].sort((a, b) => (a.time ?? 0) - (b.time ?? 0))
  );

  function toggleDanmaku(): void {
    danmakuEnabled.value = !danmakuEnabled.value;
    if (!danmakuEnabled.value) {
      activeDanmus.value = [];
    }
  }

  function queryDanmakuWidth(): Promise<number> {
    return new Promise((resolve) => {
      try {
        const query = instance
          ? uni.createSelectorQuery().in(instance)
          : uni.createSelectorQuery();
        query
          .select(`#${danmakuLayerId}`)
          .boundingClientRect((rect) => {
            const info = Array.isArray(rect) ? rect[0] : rect;
            const w = info?.width ?? 0;
            if (w > 0) {
              resolve(w);
            } else {
              const sys = uni.getSystemInfoSync();
              resolve(sys.windowWidth || 375);
            }
          })
          .exec();
      } catch {
        const sys = uni.getSystemInfoSync();
        resolve(sys.windowWidth || 375);
      }
    });
  }

  async function fireDanmu(danmu: DanmuItem): Promise<void> {
    if (!danmakuEnabled.value) return;

    let currentWidth = danmakuWidth;
    if (currentWidth <= 0) {
      currentWidth = await queryDanmakuWidth();
      danmakuWidth = currentWidth;
    }
    if (currentWidth <= 0) {
      currentWidth = 375;
    }

    const fontPx: number = (16 * danmakuSettings.fontSize) / 100;
    const estWidth: number = danmu.text.length * fontPx + 24;
    const speedPxPerSec: number = (120 * danmakuSettings.speed) / 100;
    const distance: number = currentWidth + estWidth;
    const moveDuration: number = distance / speedPxPerSec;

    const item: ActiveDanmu = {
      id: ++danmuSeq,
      text: danmu.text,
      color: danmu.color,
      top: (danmuTrack % 6) * 15 + 2,
      x: 0,
      started: false,
      moveDuration,
    };
    danmuTrack++;
    activeDanmus.value.push(item);

    setTimeout(() => {
      const target = activeDanmus.value.find((d: ActiveDanmu) => d.id === item.id);
      if (target) {
        target.started = true;
        target.x = -distance;
      }
    }, 30);

    danmuTimers.push(
      setTimeout(() => {
        activeDanmus.value = activeDanmus.value.filter(
          (d: ActiveDanmu) => d.id !== item.id
        );
      }, moveDuration * 1000 + 500)
    );
  }

  function danmakuTick(currentTime: number, previousTime: number): void {
    if (!danmakuEnabled.value) return;
    const list = sortedDanmus.value;
    if (list.length === 0) return;
    if (currentTime < previousTime - 1) {
      danmuPointer = list.findIndex((d) => (d.time ?? 0) >= currentTime);
      if (danmuPointer < 0) danmuPointer = list.length;
      return;
    }
    while (
      danmuPointer < list.length &&
      (list[danmuPointer].time ?? 0) <= currentTime
    ) {
      if ((list[danmuPointer].time ?? 0) >= previousTime) {
        fireDanmu(list[danmuPointer]);
      }
      danmuPointer++;
    }
  }

  function appendEmoji(emoji: string): void {
    danmuInput.value += emoji;
  }

  function submitDanmu(): void {
    const text: string = danmuInput.value.trim();
    if (!text) return;
    const danmu: DanmuItem = {
      text,
      color: danmuColor.value,
      time: innerCurrent.value,
    };
    if (!danmakuEnabled.value) {
      danmakuEnabled.value = true;
    }
    fireDanmu(danmu);
    emit("senddanmu", danmu);
    danmuInput.value = "";
    emojiVisible.value = false;
    closePanels();
  }

  function settingPercent(key: SettingKey): number {
    const { min, max } = settingRanges[key];
    return ((danmakuSettings[key] - min) / (max - min)) * 100;
  }

  function settingDisplay(key: SettingKey): string {
    if (key === "speed") {
      const v: number = danmakuSettings.speed;
      if (v < 80) return "慢";
      if (v <= 130) return "适中";
      return "快";
    }
    return `${danmakuSettings[key]}%`;
  }

  function applySetting(key: SettingKey, clientX: number, settingRect: { left: number; width: number } | null): void {
    if (!settingRect || settingRect.width <= 0) return;
    const { min, max } = settingRanges[key];
    const pct: number = Math.min(
      1,
      Math.max(0, (clientX - settingRect.left) / settingRect.width)
    );
    danmakuSettings[key] = Math.round(min + pct * (max - min));
  }

  return {
    danmakuEnabled,
    danmakuSettings,
    activeDanmus,
    danmuInput,
    emojiVisible,
    danmuColor,
    danmuColors,
    emojiList,
    settingRows,
    settingRanges,
    danmuFontSize,
    sortedDanmus,
    toggleDanmaku,
    fireDanmu,
    danmakuTick,
    appendEmoji,
    submitDanmu,
    settingPercent,
    settingDisplay,
    applySetting,
  };
}
