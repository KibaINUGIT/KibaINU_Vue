<template>
    <div class="fixed inset-0 z-10 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" aria-hidden="true"></div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform rounded-lg shadow-xl bg-kiba-lightblack sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
                <div class="flex justify-end item-center">
                    <button @click="$emit('close-modal')" type="button" class="text-gray-400 bg-transparent rounded-md hover:text-gray-500">
                        <span class="sr-only">Close</span>
                        <!-- Heroicon name: outline/x -->
                        <svg class="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div>
                    <div class="mt-3 sm:mt-5">
                        <h3 class="text-2xl font-bold leading-6 text-center text-white" id="modal-title">
                            Successfully sent your tokens to the Bridge!
                        </h3>
                        <div class="flex items-center justify-center mt-2">
                            <p class="max-w-lg text-sm text-center text-white">
                            Please write down the following information. You will need this information to claim your tokens on the target network. After you write down this information, switch to the target network on your wallet to claim your tokens.
                            </p>
                        </div>
                        <div class="flex flex-col items-center justify-center px-8 py-5 mt-4 break-words">
                            <div class="flex flex-col items-center w-full">
                                <p class="font-semibold text-white">Swap ID</p> 
                                <div class="text-sm font-semibold text-white w-full flex items-center rounded mt-2">
                                    <p class="justify-self-center w-full text-center">{{ swap_id }}</p>
                                </div>
                            </div>
                            <div class="flex flex-col items-center my-8 w-full">
                                <p class="font-semibold text-white">Unique Identifier</p>
                                <div class="text-sm font-semibold text-white w-full flex items-center rounded mt-2">
                                    <p class="justify-self-center w-full text-center">{{ unique_identifier }}</p>
                                </div>
                            </div>
                            <div class="flex flex-col items-center w-full">
                                <p class="font-semibold text-white">Amount</p> 
                                <div class="text-sm font-semibold text-white w-full flex items-center rounded mt-2">
                                    <p class="justify-self-center w-full text-center">{{ swap_amount }}</p>
                                </div>
                            </div>
                            <button
                                @click="$emit('close-modal')"
                                type="button"
                                class="inline-flex items-center justify-center w-full px-8 py-2 mt-10 mb-6 text-base font-bold text-black rounded-lg shadow-sm bg-white hover:bg-opacity-40"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    computed: {
        ...mapGetters(['isConnected'])
    },
    data() {
        return {
            swap_id: "",
            unique_identifier: "",
            swap_amount: ""
        }
    },
    mounted() {
        if (localStorage.kibaLatestSwapId) {
            this.swap_id = localStorage.kibaLatestSwapId;
            this.unique_identifier = localStorage.kibaLatestSwapTimestamp;
            this.swap_amount = localStorage.kibaLatestSwapNumTokens;
        }
    },
}
</script>