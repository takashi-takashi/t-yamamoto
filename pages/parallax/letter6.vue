<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'

onMounted(() => {
  const root = document.querySelector<HTMLElement>('#letter6')
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
      <h1>Parallax 6: Letter + Flowing Strip</h1>
      <p>Sticky letter at left, images flow to the right.</p>
    </header>

    <section id="letter6" class="scene">
      <div class="viewport">
        <div class="letter">
          <div class="paper">
            <h2>手紙</h2>
            <p>こんにちは。今日は、窓の外を流れていく景色を見ながら、あなたに手紙を書いています。</p>
            <p>スクロールに合わせて、写真がゆっくりと流れます。遠くの山、静かな街並み、そして海。</p>
            <p>流れる景色の合間に、ふと立ち止まる言葉があることを願って。</p>
            <p>どうか、このページが少しの安らぎになりますように。</p>
            <p class="foot">— ささやかな風景と共に</p>
          </div>
        </div>
        <div class="strip">
          <div class="rail" aria-hidden="true">
            <img class="img" src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop" alt="" />
            <img class="img" src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop" alt="" />
            <img class="img" src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600&auto=format&fit=crop" alt="" />
            <img class="img" src="https://images.unsplash.com/photo-1470770903676-69b98201ea1c?q=80&w=1600&auto=format&fit=crop" alt="" />
            <img class="img" src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1600&auto=format&fit=crop" alt="" />
          </div>
        </div>
      </div>
    </section>

    <section class="after">
      <div class="container">
        <h3>Thanks for reading</h3>
        <p>Use this layout for narrative + visual flow.</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page { color: #e6e7ee; background: #0b1020; }
.lead { min-height: 40vh; display: grid; place-items: center; text-align: center; }
.scene { height: 240vh; }
.viewport { position: sticky; top: 0; height: 100vh; overflow: hidden; display: grid; grid-template-columns: 1fr 2fr; }

.letter { position: relative; display: grid; place-items: center; padding: 24px; }
.paper {
  width: min(92%, 520px); max-height: 80vh; overflow: auto;
  background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(6px) saturate(120%);
  color: #fff; padding: 24px 28px; border-radius: 12px;
  transform: translate3d(0, calc(var(--p) * -30px), 0);
}
.paper h2 { margin: 0 0 8px; }
.paper p { line-height: 1.8; margin: 0 0 16px; }
.paper .foot { margin-top: 20px; opacity: 0.8; }

.strip { position: relative; }
.rail {
  position: absolute; inset: 0; display: flex; align-items: center; gap: 16px; padding: 24px;
  transform: translate3d(calc(var(--p) * -45%), 0, 0);
}
.img { height: 80vh; width: auto; flex: 0 0 auto; border-radius: 12px; object-fit: cover; box-shadow: 0 10px 30px rgba(0,0,0,0.35); }

.after { padding: 64px 24px 18vh; }
.container { max-width: 900px; margin: 0 auto; }
</style>

