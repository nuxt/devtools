<template>
  <div class="nuxt-devtools-floating">
    <div class="panel">
      <button class="icon-button">
        <svg viewBox="0 0 324 324" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-top:-3px; height: 1.2em; width: 1.2em;">
          <path d="M181.767 270H302.211C306.037 270 309.795 269.003 313.108 267.107C316.421 265.211 319.172 262.484 321.084 259.2C322.996 255.915 324.002 252.19 324 248.399C323.998 244.607 322.989 240.883 321.074 237.601L240.187 98.7439C238.275 95.4607 235.525 92.7342 232.213 90.8385C228.901 88.9429 225.143 87.9449 221.318 87.9449C217.494 87.9449 213.736 88.9429 210.424 90.8385C207.112 92.7342 204.361 95.4607 202.449 98.7439L181.767 134.272L141.329 64.7975C139.416 61.5145 136.664 58.7884 133.351 56.8931C130.038 54.9978 126.28 54 122.454 54C118.629 54 114.871 54.9978 111.558 56.8931C108.245 58.7884 105.493 61.5145 103.58 64.7975L2.92554 237.601C1.01067 240.883 0.00166657 244.607 2.06272e-06 248.399C-0.00166244 252.19 1.00407 255.915 2.91605 259.2C4.82803 262.484 7.57884 265.211 10.8918 267.107C14.2047 269.003 17.963 270 21.7886 270H97.3936C127.349 270 149.44 256.959 164.641 231.517L201.546 168.172L221.313 134.272L280.637 236.1H201.546L181.767 270ZM96.1611 236.065L43.3984 236.054L122.49 100.291L161.953 168.172L135.531 213.543C125.436 230.051 113.968 236.065 96.1611 236.065Z" fill="#00DC82" />
        </svg>
      </button>
      <div style="border-left: 1px solid #8883;width:1px;height:10px;" />
      <div style="font-size: 0.8em; padding: 0 6px;">
        100ms
      </div>
      <div style="border-left: 1px solid #8883;width:1px;height:10px;" />
      <button class="icon-button">
        <svg xmlns="http://www.w3.org/2000/svg" style="height: 1.2em; width: 1.2em; opacity:0.8;" viewBox="0 0 24 24"><path fill="currentColor" d="m13 1l.001 3.062A8.004 8.004 0 0 1 19.938 11H23v2l-3.062.001a8.004 8.004 0 0 1-6.937 6.937L13 23h-2v-3.062a8.004 8.004 0 0 1-6.938-6.937L1 13v-2h3.062A8.004 8.004 0 0 1 11 4.062V1h2Zm-1 5a6 6 0 1 0 0 12a6 6 0 0 0 0-12Zm0 4a2 2 0 1 1 0 4a2 2 0 0 1 0-4Z" /></svg>
      </button>
    </div>
    <div class="glowing" />
  </div>
</template>

<style scoped>
.nuxt-devtools-floating .panel {
  position: fixed;
  z-index: 2147483645;
  right: 10px;
  bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2px;
  padding: 2px 4px;
  border: 1px solid rgba(125,125,125,0.3);
  border-radius: 100px;
  background-color: #020202;
  backdrop-filter: blur(10px);
  color: white;
  box-shadow: 2px 2px 5px rgba(0,0,0,0.5);
}

.nuxt-devtools-floating .icon-button {
  border-radius: 100%;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.8;
  transition: all 0.2s ease-in-out;
}
.nuxt-devtools-floating .icon-button:hover {
  background-color: rgba(125,125,125,0.15);
  opacity: 1;
}

.nuxt-devtools-floating:hover .glowing {
  opacity: 0.6;
}

.nuxt-devtools-floating .glowing {
  opacity: 0;
  transition: all 0.8s ease;
  -webkit-text-size-adjust: 100%;
  font-feature-settings: normal;
  font-variation-settings: normal;
  tab-size: 4;
  line-height: inherit;
  border: 0 solid #e5e7eb;
  box-sizing: border-box;
  ---scroll-snap-strictness: proximity;
  ---gradient-from-position: ;
  ---gradient-via-position: ;
  ---gradient-to-position: ;
  pointer-events: none;
  position: fixed;
  z-index: 1;
  border-radius: 9999px;
  background-image: linear-gradient(to right,#00dc82,#36e4da,#0047e1);
  width: 150px;
  height: 150px;
  bottom: -60px;
  right: -10px;
  filter: blur(60px);
}
</style>
