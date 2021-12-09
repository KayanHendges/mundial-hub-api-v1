import cron from "node-cron"
import Categories from "../Categories/Categories";
import Requests from "../Tray/Requests";

class Routines {

    async startRoutine(){
        return new Promise(async(resolve, reject) => {
            
            

            console.log("rotinas iniciadas")
            const categories = new Categories
            const requests = new Requests
            cron.schedule("0 0 * * *", () => requests.resetCountRequests());
            cron.schedule("00 03 * * *", () => categories.updateCategoryOrder());

        })
    }

}

export default Routines