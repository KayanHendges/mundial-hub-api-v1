import { Router } from "express";
import testController from "../../controllers/Test/testController";


const testRouter = Router()

    testRouter.get('/test/tray-request', testController.trayRequests)

export default testRouter