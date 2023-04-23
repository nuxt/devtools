<template>
  <HelpTip
    title="Performance Tip"
    icon="carbon-meter"
    n="lime6 dark:lime5"
  >
    <ContentSlot :use="$slots.default" unwrap="p" />
  </HelpTip>
</template>
