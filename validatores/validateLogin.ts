import { expect, test } from '@playwright/test'
import { Balance } from '../infrastructure/state/StateType';

export class ValidateLogin {
    static async validateLoginStructure(loginResponse : any):Promise<void>{
        expect(loginResponse).toBeTruthy();
        expect(loginResponse.AccessToken).toBeTruthy();
        expect(loginResponse.UserBalance).toBeTruthy();
    }

    static async validateLoginBalance(loginResponse:any):Promise<void>{
        expect(loginResponse.UserBalance.Coins).toEqual(expect.any(Number));
        expect(loginResponse.UserBalance.Energy).toEqual(expect.any(Number));
    }
}