<script setup lang="ts">
</script>

<template>
  <v-container class="py-10">
    <v-row justify="center" class="mb-8">
      <v-col cols="12" md="8" lg="6">
        <v-card elevation="3">
          <v-card-title class="text-h5">Welcome</v-card-title>
          <v-card-text>
            <div class="text-body-1 mb-4">yamamoto takafumi</div>
            <div class="text-body-2">座席管理ページへ移動して、座席の状態や使用期間を確認・更新できます。</div>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" variant="flat" to="/seats">座席管理へ</v-btn>
            <v-btn color="secondary" variant="flat" to="/salary">年収シミュレーションへ</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card elevation="3">
          <v-card-title class="text-h6">Parallax デモ</v-card-title>
          <v-card-text class="d-flex flex-wrap gap-2">
            <v-btn color="primary" variant="tonal" to="/parallax/basic">1. Background Attachment</v-btn>
            <v-btn color="primary" variant="tonal" to="/parallax/perspective">2. CSS Perspective</v-btn>
            <v-btn color="primary" variant="tonal" to="/parallax/layers">3. JS Layers</v-btn>
            <v-btn color="primary" variant="tonal" to="/parallax/vuetify">4. Vuetify</v-btn>
            <v-btn color="primary" variant="tonal" to="/parallax/sticky">5. Sticky Scene</v-btn>

            <v-btn color="primary" variant="tonal" to="/parallax/letter6">6. Letter + Strip</v-btn>
            <v-btn color="primary" variant="tonal" to="/parallax/letter7">7. Letter + Columns</v-btn>
            <v-btn color="primary" variant="tonal" to="/parallax/letter8">8. Letter + Panorama</v-btn>

            <v-btn color="primary" variant="tonal" to="/parallax/letter9">9. Long Letter + Filmstrips</v-btn>
            <v-btn color="primary" variant="tonal" to="/parallax/letter10">10. Long Journey Letter</v-btn>
            <v-btn color="primary" variant="tonal" to="/parallax/letter11">11. Letter + Yes/No</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center" class="mt-6">
      <v-col cols="12" md="8" lg="6">
        <v-card elevation="3">
          <v-card-title class="text-h6">おまけ</v-card-title>
          <v-card-text>
            ドラッグ＆ドロップの順序パズルで遊べます。
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="success" variant="flat" to="/puzzle">順序パズルへ</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center" class="mt-6">
      <v-col cols="12" md="8" lg="6">
        <v-card elevation="3">
          <v-card-title class="text-h6">Order Puzzle</v-card-title>
          <v-card-text class="d-flex flex-wrap gap-2">
            <v-btn color="success" variant="flat" to="/puzzle">順序パズル</v-btn>
            <v-btn color="success" variant="tonal" to="/puzzle2">順序パズル 2（6枠）</v-btn>
            <v-btn color="success" variant="tonal" to="/puzzle3">順序パズル 3（3段）</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  
</template>
