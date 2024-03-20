const delay = (t: number) => new Promise(r => setTimeout(r, t))

export const useCounter = defineStore('counter', {
  state: () => ({
    n: 2,
    incrementedTimes: 0,
    decrementedTimes: 0,
    numbers: [] as number[],
  }),

  getters: {
    double: state => state.n * 2,
  },

  actions: {
    increment(amount = 1) {
      this.incrementedTimes++
      this.n += amount
    },

    changeMe() {
      // eslint-disable-next-line no-console
      console.log('change me to test HMR')
    },

    async fail() {
      const n = this.n
      await delay(1000)
      this.numbers.push(n)
      await delay(1000)
      if (this.n !== n)
        throw new Error('Someone changed n!')

      return n
    },

    async decrementToZero(interval: number = 300) {
      if (this.n <= 0)
        return

      while (this.n > 0) {
        this.$patch((state) => {
          state.n--
          state.decrementedTimes++
        })
        await delay(interval)
      }
    },
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useCounter, import.meta.hot))
