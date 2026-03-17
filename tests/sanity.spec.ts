import { test } from '../infrastructure/fixtures/fixtures'
import { SnapshotType } from '../infrastructure/state/Snapshot.types'
import { ValidateLogin } from '../validators/validateLogin'
import * as allure from 'allure-js-commons'

test('Sanity - New user login and executing a Wheelspin | Data Verification ', async ({
  stateContext,
  loginData,
  wheelSpinData
}) => {
  await allure.epic('Core Automation Projects')
  await allure.feature('Sanity Workflows')
  await allure.story('Complete end-to-end new User Journey')
  await allure.owner('Dvir Levy')
  await allure.tags('Sanity', 'P0', 'CriticalPath')
  await allure.severity('critical')
  await allure.description(
    'This test creates a new user via API, verifies the Login Balance structure, and subsequently executes a Wheelspin, validating all State updates appropriately.'
  )

  await test.step('Validating Login response structure, Login Balance', () => {
    ValidateLogin.validateLoginStructure(loginData)
    ValidateLogin.validateLoginBalance(loginData)

    const beforeSnap = stateContext.getSnapshot(SnapshotType.BEFORE_SPIN)
    console.log(beforeSnap)
    allure.attachment('Snapshot Before Spin', Buffer.from(JSON.stringify(beforeSnap, null, 2)), 'application/json')
  })

  await test.step('Validating WheelSpin data stored in context', () => {
    const afterSnap = stateContext.getSnapshot(SnapshotType.AFTER_SPIN)
    console.log(afterSnap)
    allure.attachment('Snapshot After Spin', Buffer.from(JSON.stringify(afterSnap, null, 2)), 'application/json')
    allure.attachment('WheelSpin Data', Buffer.from(JSON.stringify(wheelSpinData, null, 2)), 'application/json')
  })
})
