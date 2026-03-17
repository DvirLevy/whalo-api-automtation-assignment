import { expect, test } from '@playwright/test'
import { Balance } from '../infrastructure/state/StateType.types'

export class ValidateLogin {
  static validateLoginStructure(loginResponse: Record<string, any>): void {
    expect(loginResponse).toBeTruthy()
    expect(loginResponse.AccessToken).toBeTruthy()
    expect(loginResponse.UserBalance).toBeTruthy()
  }

  static validateLoginBalance(loginResponse: Record<string, any>): void {
    expect(loginResponse.UserBalance.Coins).toEqual(expect.any(Number))
    expect(loginResponse.UserBalance.Energy).toEqual(expect.any(Number))
  }
}
