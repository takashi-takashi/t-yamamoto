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
            <v-btn color="success" variant="flat" to="/feed">社内フィード(Firebase)</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  
</template>
