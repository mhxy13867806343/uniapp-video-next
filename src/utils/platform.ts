export type Platform =
  | "h5"
  | "app"
  | "mp-weixin"
  | "mp-alipay"
  | "mp-baidu"
  | "mp-toutiao"
  | "mp-qq"
  | "mp-kuaishou"
  | "mp-jd"
  | "mp-lark"
  | "mp-xhs"
  | "mp-harmony"
  | "quickapp-webview"
  | "unknown";

export function getPlatform(): Platform {
  // #ifdef H5
  return "h5";
  // #endif

  // #ifdef APP-PLUS
  return "app";
  // #endif

  // #ifdef MP-WEIXIN
  return "mp-weixin";
  // #endif

  // #ifdef MP-ALIPAY
  return "mp-alipay";
  // #endif

  // #ifdef MP-BAIDU
  return "mp-baidu";
  // #endif

  // #ifdef MP-TOUTIAO
  return "mp-toutiao";
  // #endif

  // #ifdef MP-QQ
  return "mp-qq";
  // #endif

  // #ifdef MP-KUAISHOU
  return "mp-kuaishou";
  // #endif

  // #ifdef MP-JD
  return "mp-jd";
  // #endif

  // #ifdef MP-LARK
  return "mp-lark";
  // #endif

  // #ifdef MP-XHS
  return "mp-xhs";
  // #endif

  // #ifdef MP-HARMONY
  return "mp-harmony";
  // #endif

  // #ifdef QUICKAPP-WEBVIEW
  return "quickapp-webview";
  // #endif

  // eslint-disable-next-line no-unreachable
  return "unknown";
}

export const platform: Platform = getPlatform();
