<script setup lang="ts">
import { version } from '../../package.json'

const showDialog = ref(false)
const showDropdown = ref(false)
const radio = ref('a')
</script>

<template>
  <div class="relative p-10 n-bg-base">
    <div class="mx-auto w-full flex flex-col gap-4 container">
      <NTip n="hover:yellow-600 dark:hover:yellow-500">
        This library is heavily working in progress. Breaking changes may not follow semver. Pin the version if used.
      </NTip>

      <div class="flex items-center gap-2">
        <div class="text-4xl">
          @nuxt/devtools-ui-kit
        </div>
        <sup class="text-xl">
          <code>v{{ version }}</code>
        </sup>
      </div>

      <div class="mb-5 flex gap-1">
        <NButton
          n="sm"
          to="https://github.com/nuxt/devtools/tree/main/packages/devtools-ui-kit"
          target="_blank"
          icon="i-carbon-logo-github"
        >
          GitHub
        </NButton>

        <NDarkToggle>
          <template #default="{ isDark }">
            <NSwitch v-model="isDark.value" n="indigo">
              {{ isDark.value ? "Dark" : "Light" }}
            </NSwitch>
          </template>
        </NDarkToggle>
      </div>

      <NCard class="p4">
        <div class="n-header-upper">
          Buttons
        </div>
        <div id="buttons" class="flex flex-wrap items-center gap-3">
          <NButton n="yellow6 dark:yellow5 xs">
            XS Yellow
          </NButton>
          <NButton n="orange6 dark:orange5 sm dashed">
            S Orange Dashed
          </NButton>
          <NButton n="red6 dark:red5 solid" icon="carbon:at">
            Red Solid
          </NButton>
          <NButton disabled>
            Disabled
          </NButton>
          <NButton n="purple6 dark:purple5 xl">
            XL Purple
          </NButton>
        </div>
        <ShowSource src="/playground/pages/index.vue#L44-L66" />
      </NCard>

      <NCard class="p4">
        <div class="n-header-upper">
          Checkboxes
        </div>
        <div class="flex items-center gap-3">
          <NCheckbox n="sky6 dark:sky5 sm" :model-value="true">
            Small
          </NCheckbox>
          <NCheckbox n="red6 dark:red5" :model-value="false">
            Normal
          </NCheckbox>
          <NCheckbox n="purple6 dark:purple5 xl" :model-value="true" disabled>
            XL Disabled
          </NCheckbox>
        </div>
        <ShowSource src="/playground/pages/index.vue#L68-L84" />
      </NCard>

      <NCard class="p4">
        <div class="n-header-upper">
          Links
        </div>
        <form class="flex items-center gap-3">
          <NLink to="/" n="green">
            NuxtLink
          </NLink>
          <NLink href="https://nuxt.com">
            nuxt.com
          </NLink>
        </form>
        <ShowSource src="/playground/pages/index.vue#L86-L99" />
      </NCard>

      <NCard class="p4">
        <div class="n-header-upper">
          Radios
        </div>
        <form class="flex items-center gap-3">
          <NRadio v-model="radio" n="red6 dark:red5" name="name" value="a">
            Apple
          </NRadio>
          <NRadio
            v-model="radio"
            n="yellow6 dark:yellow5"
            name="name"
            value="b"
          >
            Banana
          </NRadio>
          <NRadio
            v-model="radio"
            n="orange6 dark:orange5"
            name="name"
            value="c"
          >
            Orange
          </NRadio>
        </form>
        <ShowSource src="/playground/pages/index.vue#L101-L127" />
      </NCard>

      <NCard class="p4">
        <div class="n-header-upper">
          Switches
        </div>
        <div class="flex items-center gap-3">
          <NSwitch n="lime6 dark:lime5 sm" :model-value="true">
            SM
          </NSwitch>
          <NSwitch n="red6 dark:red5" :model-value="false">
            Normal
          </NSwitch>
          <NSwitch :model-value="true" disabled>
            Disabled
          </NSwitch>
          <NSwitch n="purple6 dark:purple5 xl" :model-value="false">
            XL
          </NSwitch>
        </div>
        <ShowSource src="/playground/pages/index.vue#L129-L148" />
      </NCard>

      <NCard class="p4">
        <div class="n-header-upper">
          Tips
        </div>
        <div class="flex flex-col gap-2">
          <NTip n="lime6 dark:lime5" icon="carbon:checkmark-outline">
            Success!
          </NTip>
          <NTip n="yellow6 dark:yellow5" icon="carbon:warning">
            Warning!
          </NTip>
          <NTip n="red6 dark:red5" icon="carbon:warning-alt">
            Error!
          </NTip>
        </div>
        <ShowSource src="/playground/pages/index.vue#L150-L166" />
      </NCard>

      <NCard class="p4">
        <div class="n-header-upper">
          Dropdown
        </div>
        <div class="flex flex-col gap-2">
          <NDropdown v-model="showDropdown" n="lime6 dark:lime5">
            <template #trigger>
              <NButton @click="showDropdown = !showDropdown">
                Dropdown ({{ showDropdown }})
              </NButton>
            </template>
            <div class="flex flex-col gap-2 p-3">
              <div>Item 1</div>
              <div>Item 2</div>
              <div>Item 3</div>
              <div>Item 4</div>
            </div>
          </NDropdown>
        </div>
        <ShowSource src="/playground/pages/index.vue#L168-L188" />
      </NCard>

      <NCard class="p4">
        <form>
          <div class="n-header-upper">
            TextInput
          </div>
          <div class="flex flex-col gap-2">
            <NTextInput
              n="lime6 dark:lime5"
              icon="carbon:checkmark-outline"
              placeholder="Hi!"
            />
            <NTextInput
              n="pink6 dark:pink5"
              icon="carbon:user"
              placeholder="Your name..."
              autocomplete="username"
            />
            <NTextInput
              n="pink6 dark:pink5"
              icon="carbon-character-whole-number"
              placeholder="Your age..."
              type="number"
            />
            <NTextInput
              n="lime6 dark:lime5"
              icon="carbon:password"
              type="password"
              placeholder="Your password..."
              autocomplete="current-password"
              required
            />
            <NButton class="self-start">
              Submit
            </NButton>
          </div>
        </form>
        <ShowSource src="/playground/pages/index.vue#L190-L227" />
      </NCard>

      <NCard class="p4">
        <div class="n-header-upper">
          Dialog
        </div>
        <div class="flex flex-col gap-2">
          <NButton n="lime6 dark:lime5" @click="showDialog = !showDialog">
            Show Dialog
          </NButton>
          <NDialog
            v-model="showDialog"
            class="min-w-100 flex flex-col gap-4 p4"
          >
            <h1 text-4xl>
              Hi
            </h1>
            <NTextInput n="lime6 dark:lime5" placeholder="Say something..." />
            <div>
              <NButton @click="showDialog = false">
                Close
              </NButton>
            </div>
          </NDialog>
        </div>
        <ShowSource src="/playground/pages/index.vue#L215-L253" />
      </NCard>

      <NCard class="p4">
        <div class="n-header-upper">
          Loading
        </div>
        <div class="flex flex-col gap-2">
          <NLoading />
        </div>
        <ShowSource src="/playground/pages/index.vue#L255-263" />
      </NCard>

      <NCard class="p4">
        <div class="n-header-upper">
          Select
        </div>
        <div class="flex flex-col gap-2">
          <NSelect n="lime6 dark:lime5" model-value="apple">
            <option value="apple">
              Apple
            </option>
            <option value="banana">
              Banana
            </option>
            <option value="orange">
              Orange
            </option>
          </NSelect>
        </div>
        <ShowSource src="/playground/pages/index.vue#L265-283" />
      </NCard>

      <NCard class="p4">
        <div class="n-header-upper">
          Select Tabs
        </div>
        <div class="flex gap-2">
          <NSelectTabs
            n="amber6 dark:amber5 sm"
            model-value="apple"
            :options="[
              { value: 'apple', label: 'Apple' },
              { value: 'banana', label: 'Banana' },
              { value: 'orange', label: 'Orange' },
            ]"
          />
        </div>
        <ShowSource src="/playground/pages/index.vue#L285-301" />
      </NCard>
    </div>
  </div>
</template>
