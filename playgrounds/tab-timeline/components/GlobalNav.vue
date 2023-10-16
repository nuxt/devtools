<template>
  <div px10 py5 flex="~ col gap-2">
    <div>Actions</div>
    <div flex="~ gap-1">
      <NButton n="primary" @click="myFunctionA(Math.random() * 200 + 100)">
        My Function A
      </NButton>
      <NButton n="primary" @click="myFunctionB()">
        My Function B
      </NButton>
    </div>
    <div>Navigate</div>
    <div flex="~ gap-1">
      <NButton n="primary sm" to="/" active-class="n-solid">
        /home
      </NButton>
      <NButton n="primary sm" to="/empty" active-class="n-solid">
        /empty
      </NButton>
      <NButton n="primary sm" to="/dynamic-foo" active-class="n-solid">
        /dynamic-foo
      </NButton>
      <NButton n="primary sm" to="/dynamic-bar" active-class="n-solid">
        /dynamic-bar
      </NButton>
    </div>
  </div>
</template>
