<template>
  <div class="relative p-10 n-bg-base">
    <div class="container w-full mx-auto flex flex-col gap-4">
      <NTip n="hover:yellow-600 dark:hover:yellow-500">
        This library is heavily working in progress and does not serve as a generic UI library (for now). It is not recommended to use it in production.
      </NTip>

      <div class="flex justify-between items-center">
        <div class="text-4xl">
          Nuxt UI
        </div>
      </div>

      <div class="flex gap-1 mb-5">
        <NButton v-if="isDev" n="sm" to="/__unocss" icon="carbon-search">
          Inspect
        </NButton>

        <NButton n="sm" to="https://github.com/nuxt/ui/tree/main/packages/ui" target="_blank" icon="carbon-logo-github">
          GitHub
        </NButton>

        <NDarkToggle>
          <template #default="{ isDark }">
            <NSwitch v-model="isDark.value" n="indigo">
              {{ isDark.value ? 'Dark' : 'Light' }}
            </NSwitch>
          </template>
        </NDarkToggle>
      </div>

      <NCard class="p4">
        <div class="n-header-upper">
          Buttons
        </div>
        <div class="flex flex-wrap gap-3 items-center">
          <NButton n="yellow5 xs">
            XS Yellow
          </NButton>
          <NButton n="orange5 sm dashed">
            S Orange Dashed
          </NButton>
          <NButton n="red5 solid" icon="carbon:at">
            Red Solid
          </NButton>
          <NButton disabled>
            Disabled
          </NButton>
          <NButton n="purple5 xl">
            XL Purple
          </NButton>
        </div>
      </NCard>

      <NCard class="p4">
        <div class="n-header-upper">
          Checkboxes
        </div>
        <div class="flex gap-3 items-center">
          <NCheckbox n="sky5 sm" :model-value="true">
            Small
          </NCheckbox>
          <NCheckbox n="red" :model-value="false">
            Normal
          </NCheckbox>
          <NCheckbox n="purple xl" :model-value="true" disabled>
            XL Disabled
          </NCheckbox>
        </div>
      </NCard>

      <NCard class="p4" n="green">
        <div class="n-header-upper">
          Links
        </div>
        <form class="flex gap-3 items-center">
          <NLink to="/">
            NuxtLink
          </NLink>
          <NLink href="https://v3.nuxtjs.org/">
            Nuxtjs.org
          </NLink>
        </form>
      </NCard>

      <NCard class="p4">
        <div class="n-header-upper">
          Radios
        </div>
        <form class="flex gap-3 items-center">
          <NRadio v-model="radio" n="red" name="name" value="a">
            Apple
          </NRadio>
          <NRadio v-model="radio" n="yellow" name="name" value="b">
            Banana
          </NRadio>
          <NRadio v-model="radio" n="lime" name="name" value="c">
            Orange
          </NRadio>
        </form>
      </NCard>

      <NCard class="p4">
        <div class="n-header-upper">
          Switches
        </div>
        <div class="flex gap-3 items-center">
          <NSwitch n="lime5 sm" :model-value="true">
            SM
          </NSwitch>
          <NSwitch n="red" :model-value="false">
            Normal
          </NSwitch>
          <NSwitch :model-value="true" disabled>
            Disabled
          </NSwitch>
          <NSwitch n="purple xl" :model-value="false">
            XL
          </NSwitch>
        </div>
      </NCard>

      <NCard class="p4">
        <div class="n-header-upper">
          Tips
        </div>
        <div class="flex flex-col gap-2">
          <NTip n="lime6" icon="carbon:checkmark-outline">
            Success!
          </NTip>
          <NTip n="yellow6" icon="carbon:warning">
            Warning!
          </NTip>
          <NTip n="red6" icon="carbon:warning-alt">
            Error!
          </NTip>
        </div>
      </NCard>

      <NCard class="p4">
        <div class="n-header-upper">
          Dropdown
        </div>
        <div class="flex flex-col gap-2">
          <NDropdown v-model="showDropdown" n="lime6">
            <template #trigger>
              <NButton @click="showDropdown = !showDropdown">
                Dropdown ({{ showDropdown }})
              </NButton>
            </template>
            <div class="p-3 flex flex-col gap-2">
              <div>Item 1</div>
              <div>Item 2</div>
              <div>Item 3</div>
              <div>Item 4</div>
            </div>
          </NDropdown>
        </div>
      </NCard>

      <NCard class="p4">
        <div class="n-header-upper">
          TextInput
        </div>
        <div class="flex flex-col gap-2">
          <NTextInput n="lime5" icon="carbon:checkmark-outline" placeholder="Hi!" />
          <NTextInput n="pink5" icon="carbon:user" placeholder="Your name..." />
          <NTextInput n="lime5" icon="carbon:password" type="password" placeholder="Your password..." />
        </div>
      </NCard>

      <NCard class="p4">
        <div class="n-header-upper">
          Dialog
        </div>
        <div class="flex flex-col gap-2">
          <NButton n="lime5" @click="showDialog = !showDialog">
            Show Dialog
          </NButton>
          <NDialog v-model="showDialog" class="p4 min-w-100 flex flex-col gap-4">
            <h1 text-4xl>
              Hi
            </h1>
            <NTextInput n="lime5" placeholder="Say something..." />
            <div>
              <NButton @click="showDialog = false">
                Close
              </NButton>
            </div>
          </NDialog>
        </div>
      </NCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const isDev = process.dev
const showDialog = ref(false)
const showDropdown = ref(false)
const radio = ref('a')
</script>
