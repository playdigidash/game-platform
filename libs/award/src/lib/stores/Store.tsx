import { Instance, types } from 'mobx-state-tree'
import { createContext, useContext } from 'react'
import { AwardsViewStore } from './AwardViewStore'

export const AwardRootStore = types.model('RootStore', {
    awardsViewStore: types.optional(AwardsViewStore, {})
})

export const store = AwardRootStore.create({})

export type RootInstance = Instance<typeof AwardRootStore>
export const StoreContext = createContext<null | RootInstance>(null)
export const useStore = () => {
    const storeToUse = useContext(StoreContext)
    if (storeToUse === null) {
        throw new Error('Store cannot be null, please add a context  provider')
    }
    return store
}
export type IAwardRootStore = Instance<typeof AwardRootStore>