<template>
  <div class="relative font-bangers">
    <img class="fixed h-auto w-1/3 bottom-0 right-0" src="./assets/kiba.png" />
    <App-Header />
    <div class="relative pb-10 sm:py-5">
      <main>
        <div class="max-w-3xl mx-auto sm:px-6 lg:px-8 mt-10">
          <div
            v-if="isConnected && !swap && !initLoading"
            class="max-w-full px-6 py-5 mb-5 mx-auto text-center text-white bg-red-600 rounded justify-between flex"
          >
            Please switch to ETH network or BSC network.
            <button class="btn" @click="switchNetwork">Switch Network</button>
          </div>
          <div
            class="flex flex-col h-auto pb-10 mx-3 rounded-3xl sm:mx-auto swap-bg"
          >
            <div class="flex flex-col sm:px-12 px-8 mt-8">
              <network :network="smartContractType" />
              <div class="relative mt-5">
                <span class="absolute flex items-center inset-y-0 pl-3 text-lg text-white text-opacity-40 font-normal">$KIBA</span>
                <input
                  v-model="swapAmount"
                  :disabled="!swap"
                  type="text"
                  name="price"
                  id="price"
                  class="block w-full pl-20 pr-16 pt-5 pb-5 text-sm text-left text-white placeholder-white bg-kiba-lightgray rounded-lg outline-none sm:text-xl placeholder-opacity-40"
                  placeholder="Enter the amount you want to swap $KIBA"
                />
                <button
                  v-if="isConnected && swap"
                  :disabled="!isConnected && initLoading"
                  @click="
                    swapAmount = '35000000'.replace(
                      /,/g,
                      ''
                    )
                  "
                  class="absolute inset-y-0 right-0 flex items-center pr-6 text-black bg-white rounded-r-lg hover:bg-opacity-40"
                >
                  <span class="ml-5">Max</span>
                </button>
              </div>
              <div
                class="flex flex-col my-6 space-y-1.5"
              >
                <p class="font-medium text-white break-all">
                  $KIBA Balance:
                  <span v-if="swap">{{ userBalanceFormatted(swap.token) }}</span
                  ><span v-else>0.00</span>
                </p>
                <p class="font-medium text-white break-all">
                  You are about to send: {{ swapAmountFormatted }} $KIBA
                </p>
              </div>
              <div class="flex items-center justify-center">
                <button
                  v-if="!isConnected"
                  type="button"
                  @click="init"
                  class="bg-linear-blue inline-flex items-center justify-center w-full p-3 text-base font-extrabold text-black uppercase border-0 border-transparent rounded-lg bg-white"
                >
                  Connect Wallet
                </button>
                <button
                  v-if="isConnected && initLoading"
                  type="button"
                  class="bg-linear-blue inline-flex items-center justify-center w-full p-3 text-base font-extrabold text-black uppercase border-0 border-transparent rounded-lg bg-white"
                >
                  Connecting Wallet
                  <Spinner />
                </button>
                <button
                  v-else-if="isConnected"
                  type="button"
                  @click="sendSwap"
                  :disabled="isLoading"
                  class="bg-linear-blue inline-flex items-center justify-center w-full p-3 text-base font-extrabold text-black uppercase border-0 border-transparent rounded-lg bg-white hover:bg-opacity-40"
                >
                  Initiate Swap
                  <Spinner v-if="isLoading" />
                </button>
              </div>
            </div>
          </div>
          <div class="flex relative flex-wrap flex-col space-y-3 justify-center h-auto px-8 mx-3 my-10 rounded-3xl sm:mx-0 sm:py-0 py-5 sm:h-32 swap-bg text-white">
             <div class="flex items-center">
              <div class="flex items-center space-x-2">
                <Ethereum />
                <h1>$KIBA <span>{{ userBalanceFormat(parseFloat(kibaBalance.eth)) }}</span></h1>
                <h1>(${{ userBalanceFormat(parseFloat(kibaBalance.eth) * kibaUsdPrice) }})</h1>
              </div>
            </div>
            <div class="flex items-center">
              <div class="flex items-center space-x-2">
                <Binance />
                <h1>$KIBA <span>{{ userBalanceFormat(parseFloat(kibaBalance.bsc)) }}</span></h1>
                <h1>(${{ userBalanceFormat(parseFloat(kibaBalance.bsc) * kibaUsdPrice) }})</h1>
              </div>
            </div>
          </div>
          <div class="flex relative flex-wrap sm:flex-row flex-col items-center h-auto px-8 mx-3 my-10 rounded-3xl sm:mx-0 sm:py-0 py-5 sm:h-20 swap-bg">
            <div class="flex flex-col mr-auto text-white sm:w-auto w-full">
              <p class="text-lg font-bold" v-if="swap && hasUnclaimedSentFromTarget">
                {{ claimAmount }} <span class="text-sm font-normal">$KIBA</span>
              </p>
              <p class="text-lg font-bold" v-else>
                0.00 <span class="text-sm font-normal">$KIBA</span>
              </p>
              <p class="text-sm">Available Tokens</p>
            </div>
            <div class="flex items-center sm:w-2/3 w-full mt-3 mb-3" v-if="swap">
              <button @click="manualClaimModal = true" :disabled="isLoading" class="inline-flex items-center justify-center sm:w-1/2 w-full ml-auto py-1.5 px-4 text-base font-semibold text-black uppercase bg-white border-0 border-transparent rounded-lg hover:bg-opacity-40">
                Claim Tokens
              </button>
              <button 
                v-if="hasUnclaimedInSourceAndNotInitiatedClaiming"
                @click="onRefundModal = true"
                :disabled="isLoading"
                class="inline-flex items-center justify-center w-auto py-1.5 px-4 text-base font-semibold text-black uppercase bg-white ml-4 border-0 border-transparent rounded-lg hover:bg-opacity-40"
              >
                Refund
              </button>
            </div>
          </div>
          <footer class="text-base text-center text-white">
            <a href="https://oklg.io/" target="_blank" class="flex items-center justify-center">
              Powered by 
              OKLG
            </a>
          </footer>
        </div>
      </main>
    </div>
    <claim-token-modal
      v-if="manualClaimModal"
      @close-modal="manualClaimModal = false"
    />
    <sent-token-modal
      v-if="successfullySentModal"
      @close-modal="successfullySentModal = false"
    />
    <refund-modal
      v-if="onRefundModal"
      @close-modal="onRefundModal = false"
      @refund="onRefundTokens"
    />
    <alert-modal
      v-if="withAlert"
      @close-modal="withAlert = false"
    />
    <notifications position="top right" />
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import BigNumber from "bignumber.js";
import AppHeader from "./components/AppHeader.vue";
import ClaimTokenModal from "./components/ClaimTokenModal.vue";
import SentTokenModal from "./components/SentTokenModal.vue";
import RefundModal from "./components/RefundModal.vue";
import AlertModal from "./components/AlertModal.vue";
import Spinner from "./components/Spinner.vue";
import Network from "./components/Network.vue";
import Binance from "./components/Binance.vue";
import Ethereum from "./components/Ethereum.vue";

export default {
  components: {
    AppHeader,
    ClaimTokenModal,
    SentTokenModal,
    RefundModal,
    AlertModal,
    Spinner,
    Network,
    Binance,
    Ethereum
  },
  data() {
    return {
      isLoading: false,
      swapAmount: null,
      manualClaimModal: false,
      successfullySentModal: false,
      onRefundModal: false,
      swap_id: "",
      unique_identifier: "",
      swap_amount: 0,
      withAlert: false
    };
  },
  computed: {
    ...mapGetters([
      "isConnected",
      "initLoading",
      "activeNetwork",
      "web3",
      "swap",
      "kibaBalance",
      "kibaUsdPrice"
    ]),
    smartContractType() {
      if (this.isConnected && !this.initLoading) {
        if (this.activeNetwork.network_id == 1) {
          return "ERC20";
        } else if (this.activeNetwork.network_id == 56) {
          return "BEP20";
        }
      } else {
        return "ERC20";
      }
    },
    swapAmountFormatted() {
      if (!this.swapAmount) {
        return 0;
      } else {
        return this.swapAmount;
      }
    },
    claimAmount() {
      if (this.swap) {
        const claimAmount = this.swap.unclaimedSentFromTarget;
        return new BigNumber(claimAmount.amount)
          .div(new BigNumber(10).pow(this.swap.targetToken.targetTokenDecimals))
          .toFormat();
      } else {
        return 0;
      }
    },
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
    hasUnclaimedInSourceAndNotInitiatedClaiming() {
      if (this.swap) {
        const sourceSwap = this.swap.unclaimedSentFromSource;
        const targetSwap = this.swap.unclaimedSentFromTarget;
        return (
          sourceSwap &&
          new BigNumber(sourceSwap.amount).gt(0) &&
          !sourceSwap.isComplete &&
          !sourceSwap.isRefunded &&
          (!targetSwap || sourceSwap.id !== (targetSwap || {}).id)
        );
      } else {
        return false;
      }
    },
  },
  watch: {
    swapAmount(value) {
      if (value >= 35000000) {
        this.swapAmount = "35000000"
      } else {
        this.swapAmount = value
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (
        typeof localStorage.getItem("kibaLoggedIn") !== "object" &&
        localStorage.getItem("kibaLoggedIn") == "true"
      ) {
        this.init(true);
      }
    });
  },
  methods: {
    ...mapActions([
      "init",
      "sendTokensToSwap",
      "asaasInstanceGasCost",
      "asaasGetLatestUserSwap",
      "refundTokens",
      "getAllSwapContracts",
    ]),
    userBalanceFormatted(tokenInfo) {
      return new BigNumber(tokenInfo.userBalance)
        .div(new BigNumber(10).pow(tokenInfo.decimals))
        .toFormat(2);
    },
    userBalanceFormat(balance) {
      return new BigNumber(balance)
        .div(new BigNumber(10).pow(18))
        .toFormat(2);
    },
    async sendSwap() {
      try {
        this.isLoading = true;
        if (!this.swapAmount || this.swapAmount == "0.00") return;
        if (this.hasUnclaimedSentFromTarget && this.hasUnclaimedInSourceAndNotInitiatedClaiming) {
          this.withAlert = true
          return;
        }
        const amountToFormat = new BigNumber(this.swapAmount.replace(/,/g, ""));
        const correctSendTokenAmount = new BigNumber(amountToFormat)
          .times(new BigNumber(10).pow(this.swap.token.decimals))
          .toFixed();
        await this.asaasInstanceGasCost(this.swap.sourceContract);
        await this.sendTokensToSwap({
          amount: correctSendTokenAmount,
          sourceContract: this.swap.sourceContract,
          tokenContract: this.swap.token.address,
        });
        this.latestSwap = await this.asaasGetLatestUserSwap(
          this.swap.sourceContract
        );
        localStorage.kibaLatestSwapId = this.latestSwap.id;
        localStorage.kibaLatestSwapTimestamp = this.latestSwap.origTimestamp;
        localStorage.kibaLatestSwapNumTokens = new BigNumber(
          correctSendTokenAmount
        )
          .div(new BigNumber(10).pow(this.swap.token.decimals))
          .toFormat();
        this.successfullySentModal = true;
        this.$notify({
          type: "error",
          text: "Successfully initiated your swap!",
        });
      } catch (err) {
        this.$notify({ type: "error", text: err.message });
      } finally {
        this.isLoading = false;
      }
    },
    async onRefundTokens(refund) {
      try {
        if (refund) {
          this.isLoading = true;
          await this.refundTokens({
            instContract: this.swap.sourceContract,
            id: this.swap.unclaimedSentFromSource.id,
            timestamp: this.swap.unclaimedSentFromSource.origTimestamp,
            amount: this.swap.unclaimedSentFromSource.amount,
          });
          this.$notify({
            type: "error",
            text: "Your tokens were successfully refunded!",
          });
          await this.getAllSwapContracts();
        } else {
          this.onRefundModal = false;
        }
      } catch (err) {
        this.$notify({ type: "error", text: err.message });
      } finally {
        this.isLoading = false;
      }
    },
    async switchNetwork() {
      const chainId = '0x38'
      const chainName = 'Binance Smart Chain'
      const nativeCurrency =
      {
          name: 'BNB',
          symbol: 'BNB',
          decimals: 18
      }
      const rpcUrls = ['https://bsc-dataseed.binance.org/']
      const blockExplorerUrls = ['https://bscscan.com/']
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId,
            chainName,
            nativeCurrency,
            rpcUrls,
            blockExplorerUrls,
          },
        ],
      });
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [
          {
            chainId: `0x38`,
          },
        ],
      });
    },
  },
};
</script>

<style>
html,
body {
  width: 100%;
  height: 100%;
}
#app {
  background-image: url("./assets/bg.png");
  background-repeat: no-repeat;
  background-size: cover;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  min-height: 100%;
}
.swap-bg {
  background: linear-gradient(
    0.53deg,
    rgba(20, 15, 73, 0.8) 0.47%,
    rgba(0, 0, 0, 0.8) 99.55%
  );
}
</style>
