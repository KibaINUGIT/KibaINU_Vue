import { createStore } from 'vuex'

import kiba from '../store/modules/kiba'

const store = createStore({
    modules: {
        kiba
    }
})

export default store