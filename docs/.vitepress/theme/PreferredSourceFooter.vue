<template>
  <div class="preferred-source-footer">
    <div google-add-preferred-source-btn :data-theme="isDark ? 'dark' : 'light'"></div>
    <p class="preferred-source-note">
      Add <code>sebasoft.github.io</code> as a preferred source in Google Search — Top Stories,
      AI Overviews, and AI Mode.
    </p>
  </div>
</template>

<script setup lang="ts">
import { useData } from "vitepress";

const { isDark } = useData();
</script>

<style scoped>
.preferred-source-footer {
  align-items: center;
  border-top: 1px solid var(--vp-c-divider);
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 24px auto 0;
  max-width: 768px;
  padding: 16px 24px 8px;
}

.preferred-source-footer > div {
  min-height: 40px;
}

.preferred-source-note {
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.5;
  margin: 0;
  text-align: center;
}
</style>
