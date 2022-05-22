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
        class="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform rounded-lg shadow-xl bg-kiba-lightblack sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
      >
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
          <div class="mt-3 text-center sm:mt-5">
            <h3
              class="text-2xl font-medium leading-6 text-white"
              id="modal-title"
            >
              Oops!
            </h3>
            <div class="mt-2 mb-10">
              <p class="text-red-600 text-md">
                Please complete previous transaction by either claiming tokens on the opposite chain or refunding tokens to the initial chain before creating a new bridge transaction and don't forget to refresh the page.
              </p>
            </div>
          </div>
        </div>
        <div
          class="mt-5 sm:mt-6 w-full flex justify-center"
        >
          <button
            type="button"
            class="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-black bg-white border border-transparent rounded-md shadow-sm hover:bg-opacity-80 sm:ml-3 sm:w-1/2 sm:text-sm"
            @click="$emit('close-modal')"
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
