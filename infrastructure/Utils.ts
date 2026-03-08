import { UserData } from "./state/StateType";

export class Utils{
    static async createNewUser():Promise<UserData>{
        return {
            DeviceId: `candidate_test_${Date.now()}`,
            LoginSource: `test_${Date.now()}`
        };
    }
}