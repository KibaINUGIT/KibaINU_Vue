import BigNumber from "bignumber.js";
import sleep from "../../factories/Sleep";
import ExponentialBackoff from "../../factories/ExponentialBackoff";
import AtomicSwapOracle from "../../factories/AtomicSwapOracle";
import ERC20 from "../../factories/web3/ERC20";
import OKLGAtomicSwapInstance from "../../factories/web3/OKLGAtomicSwapInstance";
import OKLGAtomicSwap from "../../factories/web3/OKLGAtomicSwap";
import Web3Modal from "../../factories/web3/Web3Modal";
import OKLGSpend from "../../factories/web3/OKLGSpend";
import ERC20Ethers from "../../factories/web3/ERC20Ethers";
import axios from "axios"

export default {
  state: () => ({
    initLoading: false,
    activeNetwork: '',
    web3: {
      instance: null,
      isConnected: false,
      chainId: null,
      address: "",
      userMtgyBalance: "",
      mainCurrencyBalance: "",
    },
    selectedAddressInfo: {
      address: "",
      name: "",
      symbol: "",
      decimals: "",
      userBalance: "",
    },
    asaas: {
      createSwapCost: null,
      swapCost: null,
      instanceGasCost: {},
      instanceServiceCost: {},
      gas: null,
      swaps: [],
    },
    eth: {
      networks: [
        {
          name: "Arbitrum",
          short_name: "arbitrum",
          chain: "arbitrum",
          network: "arbitrum",
          chain_id: 42161,
          network_id: 42161,
          explorer_url: "https://arbiscan.io/",
          rpc_url: "https://arb1.arbitrum.io/rpc",
          blocks_per_day: 6450,
          native_currency: {
            symbol: "ETH",
            name: "ETH",
            decimals: 18,
            contractAddress: "",
            balance: "",
          },
          logo: `img/arbitrum.png`,
          contracts: {
            oklg: "0x000000000000000000000000000000000000dEaD",
            spend: "0xd9b6F6e53c60802d278efE0C643D9C01BBd93abc",
            airdropper: "0x4aF14d5A9dba22eCAB3dCC05778d7ED229306F88",
            atomicSwap: "0x49866dC11F308a558Dc3E015eE88D54aFC4cB239",
            passwordManager: "0xcC3c31a1FE9801A53604CD17c2b27fD68CABa528",
            raffler: "0xc8238E9f4c81e9B3fCCd2c5D7D93AeE9e147Fdf4",
            trustedTimestamping: "0xCb9c8e2F24Fe6C738342eFd30d0d3c4fF31a0613",
            faas: "0x096A223d3B20bD3D1611803D06D18513c1B30EfB",
            buybot: "",
          },
        },
        {
          name: "Avalanche",
          short_name: "avax",
          chain: "avax",
          network: "avax",
          chain_id: 43114,
          network_id: 43114,
          explorer_url: "https://cchain.explorer.avax.network/",
          rpc_url: "https://api.avax.network/ext/bc/C/rpc",
          blocks_per_day: 28800,
          native_currency: {
            symbol: "AVAX",
            name: "AVAX",
            decimals: 18,
            contractAddress: "",
            balance: "",
          },
          logo: `img/avax.png`,
          contracts: {
            oklg: "0x000000000000000000000000000000000000dEaD",
            spend: "0xd9b6F6e53c60802d278efE0C643D9C01BBd93abc",
            airdropper: "0x4aF14d5A9dba22eCAB3dCC05778d7ED229306F88",
            atomicSwap: "0xB4f60DF841C8225F3cc15799fCA2dD7b432Aa853",
            passwordManager: "0xcC3c31a1FE9801A53604CD17c2b27fD68CABa528",
            raffler: "0xc8238E9f4c81e9B3fCCd2c5D7D93AeE9e147Fdf4",
            trustedTimestamping: "0xCb9c8e2F24Fe6C738342eFd30d0d3c4fF31a0613",
            faas: "0x47BCC8De66D2607D70f70A5d313caa98dF06B16c",
            buybot: "",
          },
        },
        {
          name: "Binance Smart Chain",
          short_name: "bsc",
          chain: "smartchain",
          network: "mainnet",
          chain_id: 56,
          network_id: 56,
          explorer_url: "https://bscscan.com",
          rpc_url: "https://bsc-dataseed.binance.org/",
          blocks_per_day: 28800,
          native_currency: {
            symbol: "BNB",
            name: "BNB",
            decimals: 18,
            contractAddress: "",
            balance: "",
          },
          logo: `img/bsc.png`,
          contracts: {
            oklg: "0x55e8b37a3c43b049dedf56c77f462db095108651",
            spend: "0x3B971D415671D9e909562aA02b02f0BfbD572c07",
            buybackAndBurn: "0x2796844A84D8eef9aE02e60C18Cd713Dd29659B7",
            airdropper: "0xFEA788C8e1C60b9C911265cAc63f4067AC1Ce42F",
            atomicSwap: "0x12B2B415cc5555e955B83a779644DF9eeFAF5140",
            passwordManager: "0x31FE24955A0de9c5a9818DAA8d7A614eFEdb5F34",
            raffler: "0x0525a5A67820af53066713BfC5c368BD2C8A570e",
            trustedTimestamping: "0xBa63F51f7Be4022dd7BfF997BC3245c5F651B381",
            faas: "0x717EDe6051acf094Ff043E2B3BcC4F86262742DD",
            faas_V1: "0x701666359E71b38d61C7faD2A121D7e6A6F1fFff",
          },
          buy: {
            link:
              "https://exchange.pancakeswap.finance/#/swap?inputCurrency=0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c&outputCurrency=0x55e8b37a3c43b049dedf56c77f462db095108651",
            img: "img/pancakeswap.png",
            text: "PancakeSwap",
          },
        },
        {
          name: "Ethereum Mainnet",
          short_name: "eth",
          chain: "ETH",
          network: "mainnet",
          chain_id: 1,
          network_id: 1,
          explorer_url: "https://etherscan.io",
          rpc_url: "https://mainnet.infura.io/v3/%API_KEY%",
          blocks_per_day: 6450,
          native_currency: {
            symbol: "ETH",
            name: "Ethereum",
            decimals: 18,
            contractAddress: "",
            balance: "",
          },
          contracts: {
            oklg: "0x5dbb9f64cd96e2dbbca58d14863d615b67b42f2e",
            spend: "0x5bDE378E0a0ceBc941B03a579DA0088DC1616FAF",
            buybackAndBurn: "0xd501812C4FF29B0B95566a146078A218B1f7B78F",
            airdropper: "0x46510e381823Fe82d77d8F25ba78b0abD50eD444",
            atomicSwap: "0x967958DB20F9466d2fB3F1deE866671155Fb308f",
            passwordManager: "0x026132e2104ED39d9767334648052A731D0d483E",
            raffler: "0xBcA35f4b6343194c03C04c9340bAFD3de3E0284c",
            trustedTimestamping: "0xf02bc60b34A0656D35d7D57Bf9B535E945c4F1a9",
            faas: "0x7c2de66461Ba16839A5FeB5acC22a995036c3971",
            faas_V1: "0x521C1A07dB23cEEF2126EBf1924E31D55284918D",
            kether: "0xb5fe93ccfec708145d6278b0c71ce60aa75ef925",
            ketherNFT: "0x7bb952AB78b28a62b1525acA54A71E7Aa6177645",
            ketherNFTLoaner: "0x6d02744ef4418CB0D72f54c1eE53140430b9dBEd",
          },
          buy: {
            link:
              "https://app.uniswap.org/#/swap?outputCurrency=0x5dbb9f64cd96e2dbbca58d14863d615b67b42f2e",
            img: "img/uniswap.png",
            text: "Uniswap",
          },
        },
        {
          name: "Fantom Opera",
          short_name: "ftm",
          chain: "ftm",
          network: "ftm",
          chain_id: 250,
          network_id: 250,
          explorer_url: "https://ftmscan.com/",
          rpc_url: "https://rpc.ftm.tools/",
          blocks_per_day: 28800,
          native_currency: {
            symbol: "FTM",
            name: "FTM",
            decimals: 18,
            contractAddress: "",
            balance: "",
          },
          logo: `img/ftm.png`,
          contracts: {
            oklg: "0x000000000000000000000000000000000000dEaD",
            spend: "0xd9b6F6e53c60802d278efE0C643D9C01BBd93abc",
            airdropper: "0xcC3c31a1FE9801A53604CD17c2b27fD68CABa528",
            atomicSwap: "0x5dBB9F64cd96E2DbBcA58d14863d615B67B42f2e",
            passwordManager: "0xc8238E9f4c81e9B3fCCd2c5D7D93AeE9e147Fdf4",
            raffler: "0xCb9c8e2F24Fe6C738342eFd30d0d3c4fF31a0613",
            trustedTimestamping: "0x657bBa69DB9bf06D5BB2D0403867b41c08181630",
            faas: "0x3519a0EA62C2D75FF7b2fe39cDe791944DB3a0A5",
            buybot: "",
          },
        },
        {
          name: "Polygon Mainnet",
          short_name: "matic",
          chain: "MATIC",
          network: "mainnet",
          chain_id: 137,
          network_id: 1,
          explorer_url: "https://polygonscan.com/",
          rpc_url: "https://polygon-rpc.com",
          blocks_per_day: 33200,
          native_currency: {
            symbol: "MATIC",
            name: "MATIC",
            decimals: 18,
            contractAddress: "",
            balance: "",
          },
          logo: `img/polygon.png`,
          contracts: {
            oklg: "0x000000000000000000000000000000000000dEaD",
            spend: "0xd9b6F6e53c60802d278efE0C643D9C01BBd93abc",
            airdropper: "0xcC3c31a1FE9801A53604CD17c2b27fD68CABa528",
            atomicSwap: "0x17f54011cdb78772bcff6dde6e5e61e68894127a",
            passwordManager: "0xc8238E9f4c81e9B3fCCd2c5D7D93AeE9e147Fdf4",
            raffler: "0xCb9c8e2F24Fe6C738342eFd30d0d3c4fF31a0613",
            trustedTimestamping: "0x657bBa69DB9bf06D5BB2D0403867b41c08181630",
            faas: "0x23fe04798a2b84a40ba316060e174498af143607",
            buybot: "",
          },
          // buy: {
          //   link: "https://koffeeswap.exchange/#/pro",
          //   img: "img/koffeeswap.png",
          //   text: "KoffeeSwap",
          // },
        }
      ]
    },
    productIds: {
      airdropper: 1,
      passwordManager: 2,
      trustedTimestamping: 3,
      raffler: 4,
      tokenLocker: 5,
      atomicSwap: 6,
      atomicSwapInstance: 7,
      faas: 8,
    },
    kibaBalance: {
      bsc: 0,
      eth: 0
    },
    kibaUsdPrice: 0
  }),
  getters: {
    isConnected(state) {
      return state.web3.isConnected;
    },

    initLoading(state) {
      return state.initLoading
    },

    activeNetwork(state) {
      return state.eth.networks.find((n) => n.chain_id === state.web3.chainId);
    },

    swap(state, getters) {
      if (state.web3.isConnected && !state.initLoading && state.asaas.swaps.length > 0) {
        return state.asaas.swaps.filter(fs => {
          if (getters.activeNetwork.short_name == 'eth' && fs.targetToken != null) {
            return fs.targetNetwork == 'bsc' && fs.sourceContract  == "0x3298ad5853968e40751dEa61707635773D340D6b"
          } else if (getters.activeNetwork.short_name == 'bsc' && fs.targetToken != null) {
            return fs.targetNetwork == 'eth' && fs.sourceContract  == "0x1a57121A855b5043176Fcf4EeC78e35282eF090C"
          }
        })[0]
      } else {
        return null
      }
    },

    web3(state) {
      return state.web3
    },

    nativeCurrencySymbol(_, getters) {
      return (
        getters.activeNetwork && getters.activeNetwork.native_currency.symbol
      );
    },

    kibaBalance(state) {
      return state.kibaBalance
    },

    kibaUsdPrice(state) {
      return state.kibaUsdPrice
    }
  },
  mutations: {
    SET_INIT_LOADING(state, isLoading) {
      state.initLoading = isLoading;
    },

    SET_SELECTED_ADDRESS(state, address) {
      state.selectedAddressInfo.address = address;
    },

    SET_SELECTED_ADDRESS_INFO(state, info) {
      const keys = Object.keys(info);
      state.selectedAddressInfo = {
        ...state.selectedAddressInfo,
        ...keys.reduce((o, key) => ({ ...o, [key]: info[key] }), {}),
      };
    },

    SET_WEB3_IS_CONNECTED(state, isConnected) {
      state.web3.isConnected = isConnected;
    },

    SET_WEB3_CHAIN_ID(state, chainId) {
      state.web3.chainId = chainId;
    },

    SET_WEB3_INSTANCE(state, web3) {
      state.web3.instance = web3;
    },

    SET_WEB3_PROVIDER(state, provider) {
      state.web3.provider = provider;
    },

    SET_WEB3_USER_ADDRESS(state, addy) {
      state.web3.address = addy;
    },

    SET_WEB3_USER_MTGY_BALANCE(state, balance) {
      state.web3.userMtgyBalance = balance;
    },

    SET_WEB3_MAIN_BALANCE(state, balance) {
      state.web3.mainCurrencyBalance = balance;
    },

    SET_ASAAS_INSTANCE_GAS_COST(state, { contractAddress, instanceGasCost }) {
      state.asaas.instanceGasCost = {
        ...state.asaas.instanceGasCost,
        [contractAddress]: instanceGasCost,
      };
    },

    SET_ASAAS_INSTANCE_SERVICE_COST(state, { contractAddress, serviceCost }) {
      state.asaas.instanceServiceCost = {
        ...state.asaas.instanceServiceCost,
        [contractAddress]: serviceCost,
      };
    },

    SET_ASAAS_SWAPS(state, contracts) {
      state.asaas.swaps = contracts;
    },
  },
  actions: {
    async init({ commit, dispatch, getters, state }, reset = false) {
      try {
        if (state.web3 && state.web3.isConnected && !reset) return;
        commit("SET_INIT_LOADING", true)
        const { provider, web3 } = await Web3Modal.connect();
        commit("SET_WEB3_PROVIDER", provider);
        commit("SET_WEB3_INSTANCE", web3);
        commit("SET_WEB3_IS_CONNECTED", true);
        const resetConnection = async () => {
          dispatch("disconnect");
          await dispatch("init", true);
          localStorage.kibaLoggedIn = true
          localStorage.WEB3_CONNECT_CACHED_PROVIDER = '"injected"'
        };
        Web3Modal.bindProviderEvents({
          accountsChanged: resetConnection,
          chainChanged: resetConnection,
          disconnect: () => dispatch("disconnect"),
        });

        commit("SET_WEB3_CHAIN_ID", await web3.eth.getChainId());
        const [accountAddy] = await web3.eth.getAccounts();
        commit("SET_WEB3_USER_ADDRESS", accountAddy);
        await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=kiba-inu&vs_currencies=usd").then(({data}) => {
          state.kibaUsdPrice = data['kiba-inu'].usd
        })
        await dispatch('getKibaBalance');
        await dispatch('getAllSwapContracts');
      } catch (err) {
        console.log(err)
      } finally {
        commit("SET_INIT_LOADING", false)
        localStorage.kibaLoggedIn = true
      }
    },
    disconnect({ commit }) {
      commit("SET_WEB3_PROVIDER", null);
      commit("SET_WEB3_INSTANCE", null);
      commit("SET_WEB3_IS_CONNECTED", false);
      commit("SET_WEB3_CHAIN_ID", null);
      commit("SET_WEB3_USER_ADDRESS", "");

      // Clear cached provider to be able to switch between providers when disconnecting wallet
      Web3Modal.clearCachedProvider();
      localStorage.removeItem("kibaLoggedIn")
    },

    async asaasInstanceGasCost({ commit, dispatch, state }, contractAddress) {
      const web3 = state.web3.instance;
      const productID = state.productIds.atomicSwapInstance;
      const contract = OKLGAtomicSwapInstance(web3, contractAddress);
      const [serviceCost, instanceGasCost] = await Promise.all([
        dispatch("getProductCostWei", {
          productID,
          productContract: contractAddress,
        }),
        contract.methods.minimumGasForOperation().call(),
      ]);
      commit("SET_ASAAS_INSTANCE_GAS_COST", {
        contractAddress,
        instanceGasCost,
      });
      commit("SET_ASAAS_INSTANCE_SERVICE_COST", {
        contractAddress,
        serviceCost,
      });
    },

    async getAllSwapContracts({ commit, dispatch, getters, state }) {
      const web3 = state.web3.instance;
      const userAddy = state.web3.address;
      const activeNetwork = getters.activeNetwork;
      if (!activeNetwork) {
        await sleep(500);
        return await dispatch("getAllSwapContracts");
      }
      const asaasAddy = activeNetwork.contracts.atomicSwap;
      const asaasAddy_V1 = activeNetwork.contracts.atomicSwap_V1;
      const contract = OKLGAtomicSwap(web3, asaasAddy);
      const contract_V1 = asaasAddy_V1 && OKLGAtomicSwap(web3, asaasAddy_V1);
      const [allSwaps, allSwaps_V1] = await Promise.all([
        contract.methods.getAllSwapContracts().call(),
        (async () => {
          if (contract_V1) {
            return await contract_V1.methods.getAllSwapContracts().call();
          }
          return [];
        })(),
      ]);
      const mappedSwaps = await Promise.all(
        allSwaps.concat(allSwaps_V1).map(async (swap) => {
          try {
            const sourceSwapInst = OKLGAtomicSwapInstance(
              web3,
              swap.sourceContract
            );

            const isSwapActive = await sourceSwapInst.methods.isActive().call();
            if (!(isSwapActive && swap.isActive))
              throw new Error(
                `Swap doesn't appear to be active: source - ${swap.sourceContract}; target - ${swap.targetContract}`
              );

            const [
              swapTokenAddy,
              targetToken,
              unclaimedSentFromSource,
              { swap: unclaimedSentFromTarget },
            ] = await Promise.all([
              sourceSwapInst.methods.getSwapTokenAddress().call(),
              (async () => {
                try {
                  return await AtomicSwapOracle.getSwap({
                    userAddress: userAddy,
                    sourceNetwork: activeNetwork.short_name,
                    sourceContract: swap.sourceContract,
                  });
                } catch (err) {
                  console.error(`Error getting swap info`, err);
                  return null;
                }
              })(),
              (async () => {
                const lastUserSwap = await sourceSwapInst.methods
                  .lastUserSwap(userAddy)
                  .call();
                if (lastUserSwap) {
                  return await sourceSwapInst.methods
                    .swaps(lastUserSwap.id)
                    .call();
                }
              })(),
              (async () => {
                try {
                  return await AtomicSwapOracle.getLastUserSwap(
                    swap.targetNetwork,
                    userAddy,
                    swap.targetContract
                  );
                } catch (err) {
                  console.error(`Error getting target unclaimed info`, err);
                  return null;
                }
              })(),
            ]);
            const token = await dispatch("getErc20TokenInfo", swapTokenAddy);
            const tokenCont = ERC20(web3, token.address);
            return {
              unclaimedSentFromSource,
              unclaimedSentFromTarget,
              targetToken,
              token: {
                ...token,
                contractBalance: await tokenCont.methods
                  .balanceOf(swap.sourceContract)
                  .call(),
              },
              ...swap,
            };
          } catch (err) {
            console.error(`Error get swap`, err);
            return null;
          }
        })
      );
      commit(
        "SET_ASAAS_SWAPS",
        mappedSwaps.filter((s) => !!s)
      );
    },

    async asaasGetLatestUserSwap({ state }, sourceContract) {
      const web3 = state.web3.instance;
      const userAddy = state.web3.address;
      const contract = OKLGAtomicSwapInstance(web3, sourceContract);
      return await contract.methods.lastUserSwap(userAddy).call();
    },

    async getErc20TokenInfo({ state }, tokenAddy) {
      const userAddy = state.web3.address;
      const contract = ERC20(state.web3.instance, tokenAddy);
      const [name, symbol, decimals, userBalance] = await Promise.all([
        contract.methods.name().call(),
        contract.methods.symbol().call(),
        contract.methods.decimals().call(),
        contract.methods.balanceOf(userAddy).call(),
      ]);
      return {
        address: tokenAddy,
        name,
        symbol,
        decimals,
        userBalance,
      };
    },
    async sendTokensToSwap(
      { dispatch, getters, state },
      { amount, sourceContract, tokenContract }
    ) {
      const web3 = state.web3.instance;
      const userAddy = state.web3.address;
      const productID = state.productIds.atomicSwapInstance;
      const nativeCurrencySymbol = getters.nativeCurrencySymbol;
      const contract = OKLGAtomicSwapInstance(web3, sourceContract);
      const [nativeBalance, serviceCost] = await Promise.all([
        state.web3.instance.eth.getBalance(userAddy),
        dispatch("getProductCostWei", {
          productID,
          productContract: sourceContract,
        }),
      ]);
      const totalNativeNeeded = new BigNumber(
        state.asaas.instanceGasCost[sourceContract] || 0
      ).plus(serviceCost || 0);
      if (new BigNumber(nativeBalance).lt(totalNativeNeeded)) {
        throw new Error(
          `You do not have enough ${nativeCurrencySymbol} to cover the service cost. Please ensure you have enough ${nativeCurrencySymbol} in your wallet to cover the service fee and try again.`
        );
      }

      await dispatch("genericErc20Approval", {
        spendAmount: amount,
        tokenAddress: tokenContract,
        delegateAddress: sourceContract,
      });
      return await contract.methods.receiveTokensFromSource(amount).send({
        from: userAddy,
        value: totalNativeNeeded.toFixed(),
      });
    },
    async genericErc20Approval(
      { state },
      { spendAmount, tokenAddress, delegateAddress, unlimited }
    ) {
      if (new BigNumber(spendAmount || 0).lte(0)) return;

      unlimited = unlimited === false ? false : true;
      const userAddy = state.web3.address;
      const contract = ERC20(state.web3.instance, tokenAddress);
      const [userBalance, currentAllowance] = await ExponentialBackoff(
        async () => {
          return await Promise.all([
            contract.methods.balanceOf(userAddy).call(),
            contract.methods.allowance(userAddy, delegateAddress).call(),
          ]);
        }
      );
      if (new BigNumber(currentAllowance).lte(spendAmount || 0)) {
        await contract.methods
          .approve(
            delegateAddress,
            unlimited
              ? new BigNumber(2).pow(256).minus(1).toFixed()
              : userBalance
          )
          .send({ from: userAddy });
      }
    },

    async asaasFundAndClaimTokens(
      { getters, state },
      { instContract, id, timestamp, amount }
    ) {
      const web3 = state.web3.instance;
      const activeNetwork = getters.activeNetwork;
      const userAddy = state.web3.address;
      const contract = OKLGAtomicSwapInstance(web3, instContract);
      const [valueToSend, currentSwap] = await Promise.all([
        contract.methods.minimumGasForOperation().call(),
        contract.methods.swaps(id).call(),
      ]);
      if (!currentSwap.isSendGasFunded) {
        await contract.methods
          .fundSendToDestinationGas(id, timestamp, amount)
          .send({ from: userAddy, value: valueToSend });
      }
      await AtomicSwapOracle.sendTokens({
        targetNetwork: activeNetwork.short_name,
        targetContract: instContract,
        targetSwapId: id,
      });

      // poll for completion status to handle txns taking longer than
      // the 30 second HTTP limit (some chains can be deathly slow/congested)
      let isComplete = false;
      let tries = 0;
      let waitIntervalSec = 5;
      let numTotalTries = (2 * 60) / 5; // 2 min of tries
      while (!isComplete && tries < numTotalTries) {
        const { source, target } = await AtomicSwapOracle.sendTokens({
          checkOnly: true,
          targetNetwork: activeNetwork.short_name,
          targetContract: instContract,
          targetSwapId: id,
        });
        // If 'source' is complete it means the user received their tokens
        // which is all they care about anyway, so only check source for now
        // isComplete = source && target;
        isComplete = source;
        if (!isComplete) {
          await sleep(waitIntervalSec * 1e3);
        }
        tries++;
      }
      if (tries >= numTotalTries) {
        throw new Error(
          `Please check and confirm your tokens have landed in your wallet. If not please try clicking the claim button one more time. If you see this message again, please contract support to claim your tokens.`
        );
      }
    },
    async refundTokens(
      { getters, state },
      { instContract, id, timestamp, amount }
    ) {
      const web3 = state.web3.instance;
      const activeNetwork = getters.activeNetwork;
      const userAddy = state.web3.address;
      const contract = OKLGAtomicSwapInstance(web3, instContract);
      const [valueToSend, currentSwap] = await Promise.all([
        contract.methods.minimumGasForOperation().call(),
        contract.methods.swaps(id).call(),
      ]);
      if (!currentSwap.isSendGasFunded) {
        await contract.methods
          .fundSendToDestinationGas(id, timestamp, amount)
          .send({ from: userAddy, value: valueToSend });
      }
      await AtomicSwapOracle.refundTokens({
        targetNetwork: activeNetwork.short_name,
        targetContract: instContract,
        targetSwapId: id,
      });

      // poll for completion status to handle txns taking longer than
      // the 30 second HTTP limit (some chains can be deathly slow/congested)
      let isComplete = false;
      let tries = 0;
      let waitIntervalSec = 5;
      let numTotalTries = (2 * 60) / 5; // 2 min of tries
      while (!isComplete && tries < numTotalTries) {
        const { source: isRefundedYet } = await AtomicSwapOracle.refundTokens({
          checkOnly: true,
          targetNetwork: activeNetwork.short_name,
          targetContract: instContract,
          targetSwapId: id,
        });
        // If 'source' is complete it means the user received got refunded
        isComplete = isRefundedYet;
        if (!isComplete) {
          await sleep(waitIntervalSec * 1e3);
        }
        tries++;
      }
      if (tries >= numTotalTries) {
        throw new Error(
          `Please check and confirm your tokens have landed in your wallet. If not please try clicking the refund button one more time. If you see this message again, please contract support to refund your tokens.`
        );
      }
    },
    async getProductCostWei(
      { getters, state },
      { productID, productContract }
    ) {
      const web3 = state.web3.instance;
      const spendCont = getters.activeNetwork.contracts.spend;
      const spend = OKLGSpend(web3, spendCont);
      const [defaultCostUSD, overrideCostUSD] = await Promise.all([
        spend.methods.defaultProductPriceUSD(productID).call(),
        spend.methods.overrideProductPriceUSD(productContract).call(),
      ]);
      const [defaultCostWei, overrideCostWei, isRemoved] = await Promise.all([
        spend.methods.getProductCostWei(defaultCostUSD).call(),
        spend.methods.getProductCostWei(overrideCostUSD).call(),
        spend.methods.removeCost(productContract).call(),
      ]);
      return isRemoved
        ? "0"
        : new BigNumber(overrideCostWei).gt(0)
          ? overrideCostWei
          : defaultCostWei;
    },
    async getKibaBalance({ commit, state }) {
      const ethers = require("ethers");
      let bscProvider = new ethers.providers.JsonRpcProvider(
        "https://bsc-dataseed.binance.org/"
      );
      let ethProvider = new ethers.providers.JsonRpcProvider('https://cloudflare-eth.com/')
      let ethContract = await ERC20Ethers(ethers, '0x005D1123878Fc55fbd56b54C73963b234a64af3c', ethProvider);
      let bscContract = await ERC20Ethers(ethers, '0xC3afDe95B6Eb9ba8553cDAea6645D45fB3a7FAF5', bscProvider);
      const [ethBalance, bscBalance] = await Promise.all([
        ethContract.balanceOf(state.web3.address),
        bscContract.balanceOf(state.web3.address)
      ]);
      state.kibaBalance.eth = ethBalance
      state.kibaBalance.bsc = bscBalance
    }
  }
}