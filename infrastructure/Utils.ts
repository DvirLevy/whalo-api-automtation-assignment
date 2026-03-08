import { timeStamp } from "node:console";

export class Utils{
    static async createNewUser():Promise<any>{
        return {
            DeviceId: `candidate_test_${Date.now()}`,
            LoginSource: `test_${Date.now()}`
        };
    }
}