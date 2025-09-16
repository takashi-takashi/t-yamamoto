<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'

onMounted(() => {
  const root = document.querySelector<HTMLElement>('#letter7')
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
      <h1>Parallax 7: Letter + Columns</h1>
      <p>Letter centered; image columns drift at different speeds.</p>
    </header>

    <section id="letter7" class="scene">
      <div class="viewport">
        <div class="columns" aria-hidden="true">
          <div class="col slow">
            <img src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop" />
            <img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop" />
            <img src="https://images.unsplash.com/photo-1470770903676-69b98201ea1c?q=80&w=1200&auto=format&fit=crop" />
          </div>
          <div class="col mid">
            <img src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop" />
            <img src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop" />
            <img src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop" />
          </div>
          <div class="col fast">
            <img src="https://images.unsplash.com/photo-1526481280698-8fcc13fd5bf3?q=80&w=1200&auto=format&fit=crop" />
            <img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop" />
            <img src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1200&auto=format&fit=crop" />
          </div>
        </div>

        <div class="center">
          <div class="paper">
            <h2>手紙</h2>
            <p>一枚ずつ流れる写真は、思い出の断片のように。</p>
            <p>よく見ると、列ごとに速度が違います。視線は手紙に、背景はやさしく流れて。</p>
            <p>あなたの一日にも、穏やかな流れが続きますように。</p>
            <p class="foot">— 今日の景色より</p>
          </div>
        </div>
      </div>
    </section>

    <section class="after">
      <div class="container">
        <h3>Columns variant</h3>
        <p>Multiple vertical rails create a deeper parallax feel.</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page { color: #e6e7ee; background: #0b1020; }
.lead { min-height: 40vh; display: grid; place-items: center; text-align: center; }
.scene { height: 240vh; }
.viewport { position: sticky; top: 0; height: 100vh; overflow: hidden; }

.columns { position: absolute; inset: -10vh 0 -10vh 0; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; padding: 24px; opacity: 0.8; }
.col { display: grid; gap: 24px; align-content: start; }
.col img { width: 100%; height: 48vh; object-fit: cover; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.35); }
.slow { transform: translate3d(0, calc(var(--p) * -40px), 0); }
.mid  { transform: translate3d(0, calc(var(--p) * -80px), 0); }
.fast { transform: translate3d(0, calc(var(--p) * -140px), 0); }

.center { position: relative; display: grid; place-items: center; height: 100vh; }
.paper {
  width: min(92%, 600px); max-height: 78vh; overflow: auto; color: #fff;
  background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(6px) saturate(120%);
  padding: 24px 28px; border-radius: 12px;
  transform: translate3d(0, calc(var(--p) * -30px), 0);
}
.paper h2 { margin: 0 0 8px; }
.paper p { line-height: 1.8; margin: 0 0 16px; }
.paper .foot { margin-top: 20px; opacity: 0.8; }

.after { padding: 64px 24px 18vh; }
.container { max-width: 900px; margin: 0 auto; }
</style>

