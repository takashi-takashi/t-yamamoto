<script setup lang="ts">
import { utils } from '~/utils/utils'

definePageMeta({
  layout: 'empty',
})

const router = useRouter()

function requireValidate(value: string) {
  if (utils.isBlank(value)) return '入力してください'
  return !!value
}

const validForm = ref()
const validated = ref(false)
async function onLogin() {
  const { valid } = await validForm.value.validate()
  if (valid) {
    router.push({ name: 'home' })
  }
}
</script>

<template>
  <div class="fill-height">
    <v-app-bar
      :elevation="1"
      color="teal-darken-1"
      density="default"
    >
      <v-app-bar-title>ログイン画面</v-app-bar-title>
    </v-app-bar>
    <v-container
      class="fill-height"
      fluid
    >
      <v-row class="d-flex align-center justify-center">
        <v-col
          cols="12"
          md="4"
        >
          <v-card
            max-width="800"
            width="650"
            class="mx-auto my-8 rounded-xl"
          >
            <v-toolbar
              dark
              color="teal-accent-3"
              :elevation="4"
              height="150"
            >
              <v-toolbar-title
                class="font-weight-black"
                style="color:white;font-size: 40px;text-align: center;line-height:normal"
              >
                <v-icon>$vuetify</v-icon>
                dummy company
              </v-toolbar-title>
            </v-toolbar>
            <v-card-text />
            <v-card-actions>
              <v-col>
                <v-form
                  ref="validForm"
                  v-model="validated"
                  validate-on="submit"
                  @submit.prevent
                >
                  <v-row>
                    <v-col>
                      <v-text-field
                        prepend-inner-icon="mdi-account-outline"
                        label="ユーザーID"
                        variant="solo-filled"
                        type="text"
                        :rules="[requireValidate]"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-text-field
                        prepend-inner-icon="mdi-lock-outline"
                        label="パスワード"
                        variant="solo-filled"
                        type="password"
                        :rules="[requireValidate]"
                      />
                    </v-col>
                  </v-row>
                  <v-row justify="end">
                    <v-btn
                      prepend-icon="mdi-login"
                      color="teal-accent-4"
                      variant="tonal"
                      size="x-large"
                      text="ログイン"
                      rounded="xl"
                      @click="onLogin"
                    />
                  </v-row>
                </v-form>
              </v-col>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
