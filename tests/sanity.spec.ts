import { test, expect } from '@playwright/test';
import { Utils } from '../infrastructure/Utils';
import { StateContext } from '../infrastructure/state/StateContext';
import { SnapshotType } from '../infrastructure/state/Snapshot.types';
import Login from '../APIs/Login';
import WheelSpin from '../APIs/WheelSpin';
import { testData } from '../infrastructure/testData'
import {ValidateWheelSpin} from '../validatores/validateWheelSpin'
import { ValidateLogin } from '../validatores/validateLogin';


test("Sanity - New user login and executing a Wheelspin | Data Verification ",async({request})=>{

    const userData = await Utils.createNewUser()
    const context = new StateContext(userData)
    let loginData:any
    let respWheelSpin:any

    await test.step('Executing New User Login Request and storing response data', async()=>{
        loginData = await Login(request,userData)
        context.updateContext({loginResponse:loginData, snapshotLabel:SnapshotType.BEFORE_SPIN})
        console.log(context.getSnapshot(SnapshotType.BEFORE_SPIN))
        context.updateContext({loginResponse:loginData, snapshotLabel:SnapshotType.BEFORE_SPIN})
    })

    await test.step('Validating Login response structure, Login Balance', async ()=>{
        await ValidateLogin.validateLoginStructure(loginData)
        await ValidateLogin.validateLoginBalance(loginData)    
    })

    await test.step('Executing WheelSpin Request and storing data', async()=>{
        respWheelSpin = await WheelSpin(request,testData.wheelSpin,context.accessToken)
        context.updateAfterSpin({spinResponse:respWheelSpin,snapshotLabel:SnapshotType.AFTER_SPIN})
        console.log(context.getSnapshot(SnapshotType.AFTER_SPIN))
    })


    
  
})