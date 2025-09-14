<script setup lang="ts">
</script>

<template>
  <div class="page">
    <section class="hero">
      <div class="content">
        <h1>Parallax 1: Background Attachment</h1>
        <p>CSS-only parallax using background-attachment: fixed.</p>
      </div>
    </section>

    <section class="parallax bg1" />

    <section class="text">
      <div class="container">
        <h2>Section Content</h2>
        <p>
          This section demonstrates a classic parallax effect by fixing the
          background image while the foreground content scrolls over it.
        </p>
      </div>
    </section>

    <section class="parallax bg2" />

    <section class="text">
      <div class="container">
        <h2>Another Content Block</h2>
        <p>
          Use high-contrast imagery and generous spacing to make the effect
          feel rich without extra JavaScript.
        </p>
      </div>
    </section>

    <section class="parallax bg3" />
  </div>
</template>

<style scoped>
.page {
  color: #fff;
}

.hero {
  min-height: 60vh;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #0f172a, #1e293b);
  text-align: center;
}

.content h1 {
  margin: 0 0 12px;
}

.parallax {
  min-height: 65vh;
  background-attachment: fixed;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  filter: saturate(1.05) contrast(1.05);
}

.bg1 {
  background-image: url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1974&auto=format&fit=crop');
}

.bg2 {
  background-image: url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1974&auto=format&fit=crop');
}

.bg3 {
  background-image: url('https://images.unsplash.com/photo-1470770903676-69b98201ea1c?q=80&w=1974&auto=format&fit=crop');
}

.text {
  background: #0b1020;
  padding: 64px 24px;
}

.container {
  max-width: 960px;
  margin: 0 auto;
}
</style>
