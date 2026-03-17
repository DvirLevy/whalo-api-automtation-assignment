import { expect } from '@playwright/test'
import { Reward } from '../infrastructure/state/StateType.types'

import { StateContext } from '../infrastructure/state/StateContext'
import { SnapshotType } from '../infrastructure/state/Snapshot.types'

export class ValidateWheelSpin {
  static validateSpinStructure(spinResponse: Record<string, any>): void {
    expect(spinResponse).toBeTruthy()
    expect(spinResponse.SelectedIndex).toEqual(expect.any(Number))
    expect(spinResponse.SpinResult).toBeTruthy()
    expect(spinResponse.SpinResult.Rewards).toBeInstanceOf(Array)
  }

  static validateRewardStructure(reward: Reward[]): void {
    reward.forEach((reward) => {
      expect(reward.RewardDefinitionType).toEqual(expect.any(Number))
      expect(reward.RewardResourceType).toEqual(expect.any(Number))
      expect(reward.Amount).toEqual(expect.any(Number))
    })
  }

  static countRewardedAmount(rewards: Reward[]): number {
    let totalAmount = 0
    rewards.forEach((reward) => {
      totalAmount += reward.Amount
    })
    return totalAmount
  }

  static validateRewaredCoinsBalance(stateContext: StateContext): void {
    const coinsBeforeSpin = stateContext.getSnapshot(SnapshotType.BEFORE_SPIN).balance.Coins
    const coinsAfterSpin = stateContext.getSnapshot(SnapshotType.AFTER_SPIN).balance.Coins
    const rewardedAmount = stateContext.spin ? this.countRewardedAmount(stateContext.spin.rewards) : 0
    expect(coinsAfterSpin).toEqual(coinsBeforeSpin + rewardedAmount)
  }

  static getCoinsRewarded(rewards: Reward[]): number | null {
    const coinRewarded = rewards.find((reward) => reward.RewardDefinitionType === 1 && reward.RewardResourceType === 1)
    return coinRewarded?.Amount ?? null
  }

  static isRewardGrantedOnce(reward: Reward[], rewardLenBeforeSpin: number): boolean {
    const rewardLen = reward.length
    if (rewardLen - rewardLenBeforeSpin === 1) return true
    else return false
  }
}
