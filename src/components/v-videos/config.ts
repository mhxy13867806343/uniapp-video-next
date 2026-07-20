import type { DanmuItem, MoreActionItem, QualityItem } from "./types";

/** 预设示例弹幕数据 */
export const defaultDanmus: DanmuItem[] = [
  { text: "前排围观！", time: 1, color: "#ffffff" },
  { text: "uni-app 跨平台真香", time: 3, color: "#22c55e" },
  { text: "这个播放器不错啊", time: 5, color: "#f59e0b" },
  { text: "弹幕来喽～～～", time: 7, color: "#ec4899" },
  { text: "支持自定义颜色", time: 9, color: "#3b82f6" },
  { text: "666666", time: 11 },
  { text: "进度条拖拽也没问题", time: 14, color: "#a855f7" },
];

/** 预设示例清晰度列表 */
export const defaultQualities: QualityItem[] = [
  { label: "1080P 原画", url: "https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/2minute-demo.mp4" },
  { label: "720P 超清", url: "https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/2minute-demo.mp4" },
  { label: "480P 清晰", url: "https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/2minute-demo.mp4" },
];

/** 预设播放倍速选项 */
export const defaultRates: number[] = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

/** 预设示例“更多操作”菜单选项 */
export const defaultMoreActions: MoreActionItem[] = [
  { key: "share", label: "微信分享", icon: "🔗" },
  { key: "favorite", label: "加入收藏", icon: "⭐" },
  { key: "download", label: "缓存下载", icon: "⬇️" },
  { key: "cast", label: "电视投屏", icon: "📺" },
  { key: "copy", label: "复制链接", icon: "📋" },
  { key: "speed", label: "倍速播放", icon: "🚀" },
  { key: "pip", label: "画中画", icon: "🖼️" },
  { key: "screenshot", label: "视频截图", icon: "📸" },
  { key: "loop", label: "单曲循环", icon: "⟳" },
  { key: "report", label: "违规举报", icon: "⚠️" },
];

/** 时间格式化工具函数（秒 -> mm:ss 或 hh:mm:ss） */
export function formatTime(seconds: number): string {
  const s: number = Math.floor(seconds || 0);
  const h: number = Math.floor(s / 3600);
  const m: number = Math.floor((s % 3600) / 60);
  const rest: number = s % 60;
  if (h > 0) {
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}
