import { test } from '../infrastructure/fixtures/fixtures'
import { SnapshotType } from '../infrastructure/state/Snapshot.types'
import { ValidateLogin } from '../validators/validateLogin'

test('Sanity - New user login and executing a Wheelspin | Data Verification ', async ({
  stateContext,
  loginData,
  wheelSpinData
}) => {
  await test.step('Validating Login response structure, Login Balance', () => {
    ValidateLogin.validateLoginStructure(loginData)
    ValidateLogin.validateLoginBalance(loginData)

    console.log(stateContext.getSnapshot(SnapshotType.BEFORE_SPIN))
  })

  await test.step('Validating WheelSpin data stored in context', () => {
    console.log(stateContext.getSnapshot(SnapshotType.AFTER_SPIN))
    console.log(wheelSpinData)
  })
})
