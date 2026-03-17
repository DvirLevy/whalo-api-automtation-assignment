import { UserData } from './state/StateType.types'

export class Utils {
    static createNewUser(): UserData {
        return {
            DeviceId: `candidate_test_${Date.now()}`,
            LoginSource: `test_${Date.now()}`
        }
    }
}
