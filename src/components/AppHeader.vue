<template>
    <nav class="flex flex-col items-center w-full sm:py-4 py-10 bg-transparent sm:flex-row sm:justify-between h-44 sm:h-32 sm:px-6 lg:px-24">
      <div class="flex items-center flex-shrink-0 mt-2 sm:mt-0">
        <img  
          class="block w-auto h-14"
          src="../assets/logo.png"
        />
      </div>
      <div class="flex items-center justify-between mt-5 sm:mt-0">
        <div v-if="isConnected && !initLoading" class="flex mx-10 text-xs font-semibold text-white sm:text-base">
          <div class="p-2.5 px-5 rounded-full">
            {{ start_and_end(web3.address) }}
          </div>
        </div>
        <button v-if="!isConnected" type="button" @click="init" class="bg-linear-blue inline-flex items-center px-4 py-2.5 ml-0 sm:mt-0 sm:ml-6 text-xs font-bold text-black uppercase rounded-lg shadow-sm sm:text-base hover:bg-opacity-50 bg-white relative">
          Connect Wallet
          <Spinner v-if="initLoading" />
        </button>
        <button v-if="isConnected && initLoading" type="button" class="bg-linear-blue inline-flex items-center px-4 py-2.5 text-xs font-bold text-black uppercase rounded-lg shadow-sm sm:text-base hover:bg-opacity-50 bg-white relative">
          Connecting Wallet
          <Spinner />
        </button>
        <button v-else-if="isConnected" type="button" @click="disconnect" class="bg-linear-blue inline-flex items-center px-4 py-2.5 text-xs font-bold text-black uppercase rounded-lg shadow-sm sm:text-base hover:bg-opacity-50 bg-white relative">
          Disconnect Wallet
        </button>
      </div>
    </nav>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Spinner from './Spinner.vue'
export default {
    name: "AppHeader",
    components: {
      Spinner
    },
    computed: {
      ...mapGetters([
        'isConnected',
        'initLoading',
        'activeNetwork',
        'web3',
        'swap'
      ])
    },
    methods: {
      ...mapActions([
        'init',
        'disconnect'
      ]),
      intToString(num) {
        if (num < 1000) {
            return num;
        }
        let si = [
          {v: 1E3, s: "K"},
          {v: 1E6, s: "M"},
          {v: 1E9, s: "B"},
          {v: 1E12, s: "T"},
          {v: 1E15, s: "P"},
          {v: 1E18, s: "E"}
          ];
        let i;
        for (i = si.length - 1; i > 0; i--) {
            if (num >= si[i].v) {
                break;
            }
        }
        return `${(num / si[i].v).toFixed(2).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + si[i].s}`;
      },
      start_and_end(str) {
        return str.substr(0, 6) + '...' + str.substr(str.length-4, str.length);
      }
    }
}
</script>