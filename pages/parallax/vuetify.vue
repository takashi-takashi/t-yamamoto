<script setup lang="ts">
</script>

<template>
  <v-container fluid class="pa-0">
    <div class="py-10 text-center text-white" style="background:#0b1020">
      <h1 class="text-h4 mb-2">Parallax 4: Vuetify VParallax</h1>
      <div class="text-body-1">Built-in, GPU-accelerated backgrounds with overlays</div>
    </div>

    <v-parallax
      height="520"
      src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1974&auto=format&fit=crop"
    >
      <div class="fill-height d-flex flex-column align-center justify-center text-white text-center bg-overlay">
        <div class="text-h4 mb-2">Mountain View</div>
        <div class="text-subtitle-1">Slow background scroll under content</div>
      </div>
    </v-parallax>

    <v-container class="py-12">
      <v-row justify="center">
        <v-col cols="12" md="8">
          <v-card elevation="3">
            <v-card-title>Content Between Parallax Blocks</v-card-title>
            <v-card-text>
              This is a standard Vuetify card placed between parallax
              backgrounds, showing how typical content flows with the effect.
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-parallax
      height="520"
      src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1974&auto=format&fit=crop"
    >
      <div class="fill-height d-flex flex-column align-center justify-center text-white text-center bg-overlay">
        <div class="text-h4 mb-2">Forest Layers</div>
        <div class="text-subtitle-1">Combine multiple parallax segments</div>
      </div>
    </v-parallax>

    <v-container class="py-12">
      <v-row justify="center">
        <v-col cols="12" md="8">
          <v-alert type="info" variant="tonal">
            Tip: For best readability, add overlays on top of images and
            increase contrast for titles and buttons.
          </v-alert>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<style scoped>
.bg-overlay {
  background: linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.45));
}
</style>
