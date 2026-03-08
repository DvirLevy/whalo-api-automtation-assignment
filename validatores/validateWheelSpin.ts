import { expect, test } from '@playwright/test'
import { Reward, SpinState } from '../infrastructure/state/StateType';
import { get } from 'http';
import { StateContext } from '../infrastructure/state/StateContext';
import { SnapshotType } from '../infrastructure/state/Snapshot.types';


export class ValidateWheelSpin{
    static async validateSpinStructure(spinResponse: any) {
        expect(spinResponse).toBeTruthy();
        expect(spinResponse.SelectedIndex).toEqual(expect.any(Number));
        expect(spinResponse.SpinResult).toBeTruthy();
        expect(spinResponse.SpinResult.Rewards).toBeInstanceOf(Array)
    }

    static async validateRewardStructure(reward: Reward[]) {
        reward.forEach(reward =>{
            expect(reward.RewardDefinitionType).toEqual(expect.any(Number));
            expect(reward.RewardResourceType).toEqual(expect.any(Number));
            expect(reward.Amount).toEqual(expect.any(Number));
        })
    }

    static async countRewardedAmount(rewards:Reward[]):Promise<number>{
        let totalAmount = 0
        rewards.forEach(reward =>{
            totalAmount+=reward.Amount
        })
        return totalAmount
    }

    static async validateRewaredCoinsBalance(stateContext:StateContext){
        const coinsBeforeSpin = stateContext.getSnapshot(SnapshotType.BEFORE_SPIN).balance.Coins
        const coinsAfterSpin = stateContext.getSnapshot(SnapshotType.AFTER_SPIN).balance.Coins
        const rewardedAmount = stateContext.spin ? await this.countRewardedAmount(stateContext.spin.rewards) : 0
        await expect(coinsAfterSpin).toEqual(coinsBeforeSpin + rewardedAmount)
    }


    static async getCoinsRewarded(rewards: Reward[]): Promise<number | null> {
        const coinRewarded = rewards.find(
        reward => reward.RewardDefinitionType === 1 && reward.RewardResourceType === 1)
        return coinRewarded?.Amount ?? null
    }

    static async isRewardGrantedOnce(reward: Reward[], rewardLenBeforeSpin:number):Promise<boolean>{
        const rewardLen = reward.length
        if(rewardLen-rewardLenBeforeSpin === 1)
            return true
        else
            return false
    }
}