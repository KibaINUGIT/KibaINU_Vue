<template>
  <div
    class="fixed inset-0 z-10 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
    >
      <div
        class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
        aria-hidden="true"
      ></div>
      <span
        class="hidden sm:inline-block sm:align-middle sm:h-screen"
        aria-hidden="true"
        >&#8203;</span
      >
      <div
        class="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform rounded-lg shadow-xl bg-kiba-lightblack sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6"
      >
        <div class="flex justify-end item-center">
          <button
            type="button"
            @click="$emit('close-modal')"
            class="text-gray-400 bg-transparent rounded-md"
          >
            <span class="sr-only">Close</span>
            <!-- Heroicon name: outline/x -->
            <svg
              class="w-6 h-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="4"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div class="flex flex-col items-center justify-center">
          <div>
            <h3
              class="text-xl font-bold leading-6 text-center text-white"
              id="modal-title"
            >
              Claim Your Tokens
            </h3>
            <div class="flex items-center justify-center mt-2">
              <p class="max-w-md text-sm text-center text-white">
                Once you initiate a swap and send tokens on one side of the
                bridge, you can come here to enter your swap information below
                that was given to you to claim the tokens on the receiving side.
              </p>
            </div>
            <div
              class="flex flex-col max-w-sm py-5 mx-auto mt-3 break-words"
            >
              <div v-if="hasUnclaimedSentFromTarget" class="p-5 mb-5 border-2 border-white rounded-lg">
                <p class="font-semibold text-white">Swap Id: <span class="text-sm text-white">{{ swapId }}</span></p>
                <p class="font-semibold text-white">Unique Identifier: <span class="text-sm text-white">{{ uniqueIdentifier }}</span></p>
                <p class="font-semibold text-white">Amount: <span class="text-sm text-white">{{ swapAmount }}</span></p>
              </div>
              <div>
                <label
                  for="email"
                  class="block text-base font-bold text-left uppercase text-white"
                  >Swap ID</label
                >
                <div class="mt-2">
                  <input
                    type="text"
                    v-model="swap_id"
                    name="swap_id"
                    id="swap_id"
                    class="block w-full p-2 text-center text-white placeholder-white rounded-md shadow-sm bg-kiba-lightgray"
                    placeholder="Swap ID"
                  />
                </div>
              </div>
              <div class="my-8">
                <label
                  for="email"
                  class="block text-base font-bold text-left uppercase text-white"
                  >Unique Identifier</label
                >
                <div class="mt-2">
                  <input
                    type="text"
                    v-model="unique_identifier"
                    name="unique_identifier"
                    id="unique_identifier"
                    class="block w-full p-2 text-center text-white placeholder-white rounded-md shadow-sm bg-kiba-lightgray"
                    placeholder="Unique Identifier"
                  />
                </div>
              </div>
              <div>
                <label
                  for="email"
                  class="block text-base font-bold text-left uppercase text-white"
                  >Amount of Tokens Your Swapping</label
                >
                <div class="mt-2">
                  <input
                    type="text"
                    v-model="swap_amount"
                    name="amount"
                    id="amount"
                    class="block w-full p-2 text-center text-white placeholder-white rounded-md shadow-sm bg-kiba-lightgray"
                    placeholder="Amount of Tokens Your Swapping"
                  />
                </div>
              </div>
            </div>
          </div>
          <button
            @click="claimTokens"
            type="button"
            class="inline-flex items-center px-8 py-2 mt-10 mb-6 text-base font-bold text-black rounded-lg shadow-sm bg-white hover:bg-opacity-40"
          >
            Claim Now!
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import BigNumber from "bignumber.js";

export default {
  data() {
    return {
      isLoading: false,
      swap_id: "",
      unique_identifier: "",
      swap_amount: "",
      manualClaim: false,
      swapId: "",
      uniqueIdentifier: "",
      swapAmount: ""
    };
  },
  computed: {
    ...mapGetters(["isConnected", "swap"]),
    hasUnclaimedSentFromSource() {
      if (this.swap) {
        const targetSwap = this.swap.unclaimedSentFromSource;
        return (
          targetSwap &&
          new BigNumber(targetSwap.amount).gt(0) &&
          !targetSwap.isComplete &&
          !targetSwap.isRefunded
        );
      } else {
        return false;
      }
    },
    hasUnclaimedSentFromTarget() {
      if (this.swap) {
        const targetSwap = this.swap.unclaimedSentFromTarget;
        return (
          targetSwap &&
          new BigNumber(targetSwap.amount).gt(0) &&
          !targetSwap.isComplete &&
          !targetSwap.isRefunded
        );
      } else {
        return false;
      }
    },
  },
  mounted() {
    if (this.hasUnclaimedSentFromTarget) {
      this.swapId = this.swap.unclaimedSentFromTarget.id
      this.uniqueIdentifier = this.swap.unclaimedSentFromTarget.origTimestamp
      let amount = this.swap.unclaimedSentFromTarget.amount
      this.swapAmount = new BigNumber(amount)
        .div(new BigNumber(10).pow(this.swap.targetToken.targetTokenDecimals))
        .toFormat();
      this.swap_id = this.swap.unclaimedSentFromTarget.id
      this.unique_identifier = this.swap.unclaimedSentFromTarget.origTimestamp
      this.swap_amount = new BigNumber(amount)
        .div(new BigNumber(10).pow(this.swap.targetToken.targetTokenDecimals))
        .toFormat();
    }
  },
  methods: {
    ...mapActions(["asaasFundAndClaimTokens", "getAllSwapContracts"]),
    async claimTokens() {
      try {
        this.isLoading = true;
        if (!(this.swap_id && this.unique_identifier && this.swap_amount))
          return;
        const amount = new BigNumber(this.swap_amount.replace(/,/g, ""))
          .times(
            new BigNumber(10).pow(this.swap.targetToken.targetTokenDecimals)
          )
          .toFixed();
        await this.asaasFundAndClaimTokens({
          instContract: this.swap.sourceContract,
          id: this.swap_id,
          timestamp: this.unique_identifier,
          amount: amount,
        });
        this.$notify({ type: "success", text: "Successfully claimed your tokens!" });
        localStorage.removeItem("kibaLatestSwapId");
        localStorage.removeItem("kibaLatestSwapTimestamp");
        localStorage.removeItem("kibaLatestSwapNumTokens");
        await this.getAllSwapContracts();
      } catch (err) {
        return null;
      } finally {
        this.isLoading = false;
      }
    },
    formatUnclaimedFromTargetAmount(amount) {
      return new BigNumber(amount)
        .div(new BigNumber(10).pow(this.swap.targetToken.targetTokenDecimals))
        .toFormat();
    },
  },
};
</script>