<template>
    <div>
        <div class="flex items-center justify-start" v-if="network == 'ERC20'">
            <ethereum />
            <svg class="mx-5" width="17" height="12" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.04667 5.21429L0.5 8.35714L4.04667 11.5V9.14286H10.2778V7.57143H4.04667V5.21429ZM16.5 3.64286L12.9533 0.5V2.85714H6.72222V4.42857H12.9533V6.78571L16.5 3.64286Z" fill="#FFFFFF"/>
            </svg>
            <binance />
        </div>
        <div v-else class="flex items-center justify-start">
            <binance />
            <svg class="mx-5" width="17" height="12" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.04667 5.21429L0.5 8.35714L4.04667 11.5V9.14286H10.2778V7.57143H4.04667V5.21429ZM16.5 3.64286L12.9533 0.5V2.85714H6.72222V4.42857H12.9533V6.78571L16.5 3.64286Z" fill="#FFFFFF"/>
            </svg>
            <ethereum />
        </div>
    </div>
</template>

<script>
import Binance from "./Binance.vue"
import Ethereum from './Ethereum.vue'
export default {
    name: "Network",
    components: {
        Binance,
        Ethereum
    },
    props: {
        network: {
            type: String
        }
    }
}
</script>