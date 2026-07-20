<template>
  <view class="page">
    <!-- 状态、进度、播放控制均由组件内置的自定义控制层处理 -->
    <v-videos :src="videoSrc" :custom-controls="true" />
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import VVideos from "@/components/v-videos";

const videoSrc = ref(
  "https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/2minute-demo.mp4"
);
</script>

<style scoped>
.page {
  padding: 24rpx;
  background: #0f1115;
  min-height: 100vh;
  box-sizing: border-box;
}
</style>
