<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

// ページタイトルを取得するリアクティブなプロパティを作成
const pageTitle = computed(() => route.meta.title || '')
</script>

<template>
  <v-app>
    <v-app-bar
      app
      :elevation="1"
      color="teal-darken-1"
      density="default"
    >
      <v-app-bar-title>{{ pageTitle }}</v-app-bar-title>
      <template #append>
        <v-col>
          <v-btn
            elevation="2"
            variant="tonal"
            text="ログアウト"
            prepend-icon="mdi-logout"
            @click="navigateTo('/')"
          />
        </v-col>
      </template>
    </v-app-bar>
    <v-navigation-drawer
      expand-on-hover
      rail
      color="teal-lighten-2"
    >
      <v-list
        v-navigation-drawer
        density="default"
      >
        <v-list-item
          prepend-icon="mdi-home"
          title="ホーム"
          link
          @click="navigateTo('home')"
        />
        <v-divider class="border-opacity-25" />
        <v-list-item
          prepend-icon="mdi-folder"
          title="一覧"
          link
          @click="navigateTo('list')"
        />
        <v-divider class="border-opacity-25" />
        <v-list-item
          prepend-icon="mdi-account-multiple"
          title="dummy menu3"
          link
        />
        <v-divider class="border-opacity-25" />
        <v-list-item
          prepend-icon="mdi-star"
          title="dummy menu4"
          link
        />
        <v-divider class="border-opacity-25" />
        <v-list-item
          prepend-icon="mdi-forum"
          title="dummy menu5"
          link
        />
        <v-divider class="border-opacity-25" />
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="dummy menu6"
          link
        />
        <v-divider class="border-opacity-25" />
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <NuxtPage />
    </v-main>
  </v-app>
</template>
