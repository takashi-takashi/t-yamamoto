<script setup lang="ts">
</script>

<template>
  <div class="scene">
    <header class="intro">
      <h1>Parallax 2: CSS Perspective (1px trick)</h1>
      <p>Layers at different depths using translateZ and scale.</p>
    </header>

    <section class="group">
      <div class="layer back" />
      <div class="layer base">
        <div class="container">
          <h2>Depth Backdrop</h2>
          <p>
            The root has a tiny perspective. Pushing an element into -Z makes
            it move slower when scrolling, creating parallax.
          </p>
        </div>
      </div>
    </section>

    <section class="group alt">
      <div class="layer back b2" />
      <div class="layer base">
        <div class="container">
          <h2>Another Layer</h2>
          <p>
            This technique is CSS-only and performant because it relies on
            GPU-accelerated transforms and no JS.
          </p>
        </div>
      </div>
    </section>

    <section class="group">
      <div class="layer back b3" />
      <div class="layer base">
        <div class="container">
          <h2>Foreground Content</h2>
          <p>
            Combine with overlays and typography for a rich visual.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.scene {
  height: auto;
  perspective: 1px;
  transform-style: preserve-3d;
  overflow-x: hidden;
}

.intro {
  min-height: 60vh;
  display: grid;
  place-items: center;
  text-align: center;
  color: #fff;
  background: radial-gradient(80% 60% at 50% 40%, #1f2937 0%, #0b1020 80%);
}

.group {
  position: relative;
  height: 90vh;
  transform-style: preserve-3d;
}

.group.alt { height: 80vh; }

.layer {
  position: absolute;
  inset: 0;
}

.back {
  transform: translateZ(-1px) scale(2);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  filter: brightness(0.9) saturate(1.1);
}

.back.b2 { filter: brightness(0.85) saturate(1.15); }
.back.b3 { filter: brightness(0.8) saturate(1.2); }

.back {
  background-image: url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1974&auto=format&fit=crop');
}
.back.b2 {
  background-image: url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1974&auto=format&fit=crop');
}
.back.b3 {
  background-image: url('https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1974&auto=format&fit=crop');
}

.base {
  display: grid;
  place-items: center;
}

.container {
  color: #fff;
  background: rgba(0, 0, 0, 0.45);
  border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(6px);
  padding: 24px;
  border-radius: 12px;
  width: min(90%, 900px);
}
</style>
