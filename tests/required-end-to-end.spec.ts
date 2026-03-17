import { test, expect } from '@playwright/test';
import { Utils } from '../infrastructure/Utils';
import { StateContext } from '../infrastructure/state/StateContext';
import { SnapshotType } from '../infrastructure/state/Snapshot.types';
import Login from '../APIs/Login';
import WheelSpin from '../APIs/WheelSpin';
import { testData } from '../infrastructure/testData'
import { ValidateWheelSpin } from '../validators/validateWheelSpin'
import { ValidateLogin } from '../validators/validateLogin';


test("Required End-to-End flow",async({request})=>{

    const userData = Utils.createNewUser()
    const context = new StateContext(userData)
    let loginData: Record<string, any>;
    let respWheelSpin: Record<string, any>;

    await test.step('Executing Login Request', async()=>{
        loginData = await Login(request,userData)
    })
    
    await test.step('Validating Login response structure, Login Balance & storing data', () => {
        ValidateLogin.validateLoginStructure(loginData)
        ValidateLogin.validateLoginBalance(loginData)    
        context.updateContext({loginResponse:loginData, snapshotLabel:SnapshotType.BEFORE_SPIN})
    })

    await test.step('Executing WheelSpin Request and storing data', async()=>{
        respWheelSpin = await WheelSpin(request,testData.wheelSpin,context.accessToken)
        context.updateAfterSpin({spinResponse:respWheelSpin,snapshotLabel:SnapshotType.AFTER_SPIN})
    })

    await test.step('Validating response spin structure, rewarded structure, coins balance', async () => {
        ValidateWheelSpin.validateSpinStructure(respWheelSpin)
        if(context.spin){
            ValidateWheelSpin.validateRewardStructure(context.spin.rewards)
            await ValidateWheelSpin.validateRewaredCoinsBalance(context) // Keep await here as it internally uses getCoinsRewarded which might be kept async, or countRewardedAmount
        }
    })

    await test.step("Executing Relogin request and verify balance" , async()=>{
        const expectBalance = context.getSnapshot(SnapshotType.AFTER_SPIN).balance.Coins
        const reloginData = await Login(request,{DeviceId:context.deviceId, LoginSource:context.loginSource})
        context.updateContext({loginResponse:reloginData, snapshotLabel: SnapshotType.AFTER_RELOGIN})
        const actualBalance = context.getSnapshot(SnapshotType.AFTER_RELOGIN).balance.Coins
        expect(expectBalance).toEqual(actualBalance)
    })

    
    
  
})