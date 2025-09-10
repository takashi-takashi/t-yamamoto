<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { collection, addDoc, serverTimestamp, query, orderBy, limit, onSnapshot } from 'firebase/firestore'

const { $firebase } = useNuxtApp() as any
const { user, login, logout } = useAuthState()

type Post = {
  id?: string
  authorId: string
  authorName: string
  content: string
  createdAt?: any
}

const content = ref('')
const posts = ref<Post[]>([])
const loading = ref(true)

onMounted(() => {
  if (!$firebase) return
  const q = query(collection($firebase.db, 'posts'), orderBy('createdAt', 'desc'), limit(50))
  return onSnapshot(q, (snap) => {
    posts.value = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }))
    loading.value = false
  })
})

async function submit() {
  if (!user.value) { await login(); return }
  const trimmed = content.value.trim()
  if (!trimmed) return
  await addDoc(collection($firebase.db, 'posts'), {
    authorId: user.value.uid,
    authorName: user.value.displayName || 'no-name',
    content: trimmed,
    createdAt: serverTimestamp(),
  })
  content.value = ''
}
</script>

<template>
  <v-container class="py-6">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card elevation="2" class="mb-4">
          <v-card-title class="d-flex align-center">
            <div class="text-subtitle-1">社内フィード（Firebase）</div>
            <v-spacer />
            <v-chip v-if="user" color="primary" class="mr-2" variant="flat">{{ user?.displayName }}</v-chip>
            <v-btn v-if="!user" color="primary" @click="login">Googleでログイン</v-btn>
            <v-btn v-else variant="text" @click="logout">ログアウト</v-btn>
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-textarea v-model="content" auto-grow rows="2" label="いま何してる？" :disabled="!user" />
            <div class="text-right">
              <v-btn color="primary" :disabled="!content" @click="submit">投稿</v-btn>
            </div>
          </v-card-text>
        </v-card>

        <v-skeleton-loader v-if="loading" type="article, article, article" />

        <v-slide-y-transition group>
          <v-card v-for="p in posts" :key="p.id" class="mb-3" elevation="1">
            <v-card-title class="py-2 text-body-2">
              <v-icon icon="mdi-account" size="small" class="mr-1" />
              {{ p.authorName }}
              <v-spacer />
              <v-icon icon="mdi-clock-outline" size="small" class="mr-1" />
              <span class="text-caption">{{ p.createdAt?.toDate?.().toLocaleString?.() || '—' }}</span>
            </v-card-title>
            <v-divider />
            <v-card-text class="text-body-1" style="white-space: pre-wrap">{{ p.content }}</v-card-text>
          </v-card>
        </v-slide-y-transition>
      </v-col>
    </v-row>
  </v-container>
</template>

