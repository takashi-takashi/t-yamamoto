<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'

onMounted(() => {
  const root = document.querySelector<HTMLElement>('#letter8')
  if (!root) return
  let raf = 0
  const onScroll = () => {
    if (raf) return
    raf = requestAnimationFrame(() => {
      const rect = root.getBoundingClientRect()
      const vh = window.innerHeight || 1
      const total = rect.height - vh
      const p = total > 0 ? Math.min(1, Math.max(0, (0 - rect.top) / total)) : 0
      root.style.setProperty('--p', String(p))
      raf = 0
    })
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
    if (raf) cancelAnimationFrame(raf)
  })
})
</script>

<template>
  <div class="page">
    <header class="lead">
      <h1>Parallax 8: Letter + Panorama</h1>
      <p>One wide panorama pans as you read.</p>
    </header>

    <section id="letter8" class="scene">
      <div class="viewport">
        <div class="panorama" aria-hidden="true" />
        <div class="glass">
          <div class="paper">
            <h2>手紙</h2>
            <p>水平線に沿って、ゆっくりと景色が横へ流れていきます。</p>
            <p>スクロールを止めると、時間も少しだけ止まるような。</p>
            <p>また動き出すと、風も光も一緒に流れていくのです。</p>
            <p>きょうも、よい旅を。</p>
            <p class="foot">— 風の見えるところ</p>
          </div>
        </div>
      </div>
    </section>

    <section class="after">
      <div class="container">
        <h3>Panorama variant</h3>
        <p>A single, ultra-wide image panning under a frosted letter.</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page { color: #e6e7ee; background: #0b1020; }
.lead { min-height: 40vh; display: grid; place-items: center; text-align: center; }
.scene { height: 220vh; }
.viewport { position: sticky; top: 0; height: 100vh; overflow: hidden; }

.panorama {
  position: absolute; inset: 0; background-repeat: no-repeat;
  background-size: 2400px 100vh; /* very wide */
  background-position: calc(50% + (var(--p) * -800px)) center;
  filter: brightness(0.9) contrast(1.05) saturate(1.05);
  background-image: url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2400&auto=format&fit=crop');
}

.glass { position: relative; display: grid; place-items: center; height: 100vh; }
.paper {
  width: min(92%, 620px); max-height: 78vh; overflow: auto; color: #fff;
  background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(6px) saturate(120%);
  padding: 24px 28px; border-radius: 12px;
  transform: translate3d(0, calc(var(--p) * -28px), 0);
}
.paper h2 { margin: 0 0 8px; }
.paper p { line-height: 1.8; margin: 0 0 16px; }
.paper .foot { margin-top: 20px; opacity: 0.8; }

.after { padding: 64px 24px 18vh; }
.container { max-width: 900px; margin: 0 auto; }
</style>

