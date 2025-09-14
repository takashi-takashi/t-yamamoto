<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'

onMounted(() => {
  const root = document.querySelector<HTMLElement>('#sticky-scene')
  if (!root) return
  let raf = 0
  const onScroll = () => {
    if (raf) return
    raf = requestAnimationFrame(() => {
      const rect = root.getBoundingClientRect()
      const vh = window.innerHeight || 1
      const total = rect.height - vh
      const progress = total > 0 ? Math.min(1, Math.max(0, (0 - rect.top) / total)) : 0
      root.style.setProperty('--p', String(progress))
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
      <h1>Parallax 5: Sticky Scene</h1>
      <p>Elements animate based on sticky scroll progress.</p>
    </header>

    <section id="sticky-scene" class="scene">
      <div class="viewport">
        <div class="layer sky" />
        <div class="layer sun" />
        <div class="layer clouds" />
        <div class="layer city" />
        <div class="layer title">
          <div class="panel">
            <h2>Sticky progress-driven parallax</h2>
            <p>
              The section is taller than the viewport. The inner viewport is
              sticky, and elements transform as you scroll the section.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="after">
      <div class="container">
        <h3>Regular content after the scene</h3>
        <p>Use this pattern for hero intros or storytelling sections.</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page { color: #fff; background: #0b1020; }

.lead {
  min-height: 45vh;
  display: grid;
  place-items: center;
  text-align: center;
}

.scene {
  height: 200vh; /* big section to scroll through */
}

.viewport {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
}

.layer { position: absolute; inset: 0; }

.sky { background: linear-gradient(#0ea5e9, #0b1020 70%); }

.sun {
  --x: calc(50% + (var(--p) * 15%));
  --y: calc(60% - (var(--p) * 40%));
  background: radial-gradient(circle at var(--x) var(--y), rgba(255,221,147,0.9), rgba(255,221,147,0.45) 20%, rgba(255,221,147,0) 45%);
  mix-blend-mode: screen;
}

.clouds {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600"><g fill="white" opacity="0.6"><ellipse cx="200" cy="200" rx="120" ry="60"/><ellipse cx="270" cy="210" rx="100" ry="50"/><ellipse cx="900" cy="160" rx="140" ry="70"/><ellipse cx="980" cy="170" rx="120" ry="60"/></g></svg>');
  background-repeat: repeat-x;
  background-size: 1200px 600px;
  background-position: calc(-200px * var(--p)) 0;
  opacity: 0.5;
}

.city {
  background-image: linear-gradient(to top, rgba(0,0,0,0.5), rgba(0,0,0,0)), url('https://images.unsplash.com/photo-1448317971280-6c74e016e49f?q=80&w=1974&auto=format&fit=crop');
  background-position: bottom center;
  background-size: cover;
  transform: translate3d(0, calc(var(--p) * 40px), 0);
  filter: brightness(0.9) contrast(1.1);
}

.title { display: grid; place-items: center; }

.panel {
  transform: translate3d(0, calc(var(--p) * -60px), 0);
  background: rgba(0,0,0,0.5);
  border: 1px solid rgba(255,255,255,0.08);
  padding: 24px;
  border-radius: 12px;
  width: min(90%, 800px);
  text-align: center;
}

.after { padding: 64px 24px 20vh; }
.container { max-width: 900px; margin: 0 auto; }
</style>
