import { test, expect } from '@playwright/test';
import { Utils } from '../infrastructure/Utils';
import { StateContext } from '../infrastructure/state/StateContext';
import { SnapshotType } from '../infrastructure/state/Snapshot.types';
import Login from '../APIs/Login';
import WheelSpin from '../APIs/WheelSpin';
import { testData } from '../infrastructure/testData'
import {ValidateWheelSpin} from '../validatores/validateWheelSpin'


test("test create user",async({request})=>{

    const userData = await Utils.createNewUser()
    const context = new StateContext(userData)

    await test.step('Executing Login Request and storing response data', async()=>{
        const loginData = await Login(request,userData)
        context.updateContext({loginResponse:loginData, snapshotLabel:SnapshotType.BEFORE_SPIN})
        console.log(context.getSnapshot(SnapshotType.BEFORE_SPIN))
    })

    await test.step("relogin to the same user" , async()=>{
        const reloginData = await Login(request,{DeviceId:context.deviceId, LoginSource:context.loginSource})
        context.updateContext({loginResponse:reloginData, snapshotLabel: SnapshotType.AFTER_RELOGIN})
        console.log(context.getSnapshot(SnapshotType.AFTER_RELOGIN))
    })

    await test.step('wheel spin', async()=>{
        const respWheelSpin = await WheelSpin(request,testData.wheelSpin,context.accessToken)
        context.updateAfterSpin({spinResponse:respWheelSpin,snapshotLabel:SnapshotType.AFTER_SPIN})
        console.log(context.getSnapshot(SnapshotType.AFTER_SPIN))
        context.spin ? console.log(await ValidateWheelSpin.getCoinsRewarded(context.spin.rewards)): null
        
    })
    
  
})