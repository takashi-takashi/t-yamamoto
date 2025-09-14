<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'

onMounted(() => {
  const layers = Array.from(document.querySelectorAll<HTMLElement>('[data-speed]'))
  let raf = 0
  const onScroll = () => {
    if (raf) return
    raf = requestAnimationFrame(() => {
      const y = window.scrollY
      for (const el of layers) {
        const speed = parseFloat(el.dataset.speed || '0') || 0
        el.style.transform = `translate3d(0, ${y * speed}px, 0)`
      }
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
    <header class="hero">
      <h1>Parallax 3: JS-driven Layers</h1>
      <p>Elements move at different speeds while scrolling.</p>
    </header>

    <section class="stage">
      <div class="layer cloud" data-speed="0.25" />
      <div class="layer mountains" data-speed="0.15" />
      <div class="layer hills" data-speed="0.08" />
      <div class="layer trees" data-speed="0.03" />
      <div class="layer foreground" data-speed="0">
        <div class="card">
          <h2>Multi-speed composition</h2>
          <p>
            Each layer translates vertically based on the scrollY and its
            assigned speed. Using requestAnimationFrame boosts performance.
          </p>
        </div>
      </div>
    </section>

    <section class="spacer">
      <div class="container">
        <h3>Scrollable Content</h3>
        <p>
          Add more content to experience the layered movement. This section
          exists mainly to extend the page height and make scrolling obvious.
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page { background: linear-gradient(#0b1020, #111827); color: #fff; }

.hero {
  min-height: 50vh;
  display: grid;
  place-items: center;
  text-align: center;
}

.stage {
  position: relative;
  height: 120vh;
  overflow: hidden;
}

.layer {
  position: absolute;
  inset: 0;
  background-position: bottom center;
  background-repeat: no-repeat;
  background-size: cover;
  will-change: transform;
}

.cloud {
  background-image: linear-gradient(180deg, rgba(255,255,255,0.2), rgba(255,255,255,0) 70%),
    url('https://images.unsplash.com/photo-1499346030926-9a72daac6c63?q=80&w=1974&auto=format&fit=crop');
  filter: brightness(1.1) saturate(1.05);
}

.mountains {
  background-image: url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1974&auto=format&fit=crop');
}

.hills {
  background-image: url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1974&auto=format&fit=crop');
  opacity: 0.9;
}

.trees {
  background-image: url('https://images.unsplash.com/photo-1470770903676-69b98201ea1c?q=80&w=1974&auto=format&fit=crop');
  opacity: 0.85;
}

.foreground {
  display: grid;
  place-items: center;
}

.card {
  background: rgba(0,0,0,0.5);
  border: 1px solid rgba(255,255,255,0.08);
  padding: 24px;
  border-radius: 12px;
  width: min(90%, 800px);
}

.spacer {
  padding: 64px 24px 100vh;
}

.container {
  max-width: 900px;
  margin: 0 auto;
}
</style>
