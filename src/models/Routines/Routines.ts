import cron from "node-cron"
import OAuth2Tray from "../Auth/OAuth2Tray";
import Categories from "../Categories/Categories";
import Requests from "../Tray/Requests";

class Routines {

    async startRoutine(){
        return new Promise(async(resolve, reject) => {
            
            

            console.log("rotinas iniciadas")
            OAuth2Tray.tokenRoutine()
            cron.schedule("0 0 * * *", () => Requests.resetCountRequests());
            cron.schedule("00 03 * * *", () => Categories.updateCategoryOrder());

        })
    }

}

export default new Routines