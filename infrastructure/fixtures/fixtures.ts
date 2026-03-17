import { test as base, expect, APIRequestContext } from '@playwright/test'
import { Utils } from '../Utils'
import { StateContext } from '../state/StateContext'
import { SnapshotType } from '../state/Snapshot.types'
import Login from '../../APIs/Login'
import WheelSpin from '../../APIs/WheelSpin'
import { testData } from '../testData'
import { UserData } from '../state/StateType'

type Fixtures = {
  userData: UserData
  stateContext: StateContext
  loginData: any
  wheelSpinData: any
}

export const test = base.extend<Fixtures>({
  userData: async ({}, use) => {
    const userData = await Utils.createNewUser()
    console.log(userData)
    await use(userData)
  },

  stateContext: async ({ userData }, use) => {
    const stateContext = new StateContext(userData)
    await use(stateContext)
  },

  loginData: async (
    { request, userData, stateContext }: { request: APIRequestContext; userData: UserData; stateContext: StateContext },
    use: (arg0: any) => any
  ) => {
    const loginData = await Login(request, userData)

    stateContext.updateContext({
      loginResponse: loginData,
      snapshotLabel: SnapshotType.BEFORE_SPIN
    })

    await use(loginData)
  },

  wheelSpinData: async (
    { request, stateContext }: { request: APIRequestContext; stateContext: StateContext },
    use: (arg0: any) => any
  ) => {
    const wheelSpinData = await WheelSpin(request, testData.wheelSpin, stateContext.accessToken)

    stateContext.updateAfterSpin({
      spinResponse: wheelSpinData,
      snapshotLabel: SnapshotType.AFTER_SPIN
    })

    await use(wheelSpinData)
  }
})

export { expect }
