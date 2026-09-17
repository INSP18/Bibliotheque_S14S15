import {Router} from 'express'
import getStats from '../controllers/statsControllers.js'

const router = Router()
router.get('/', getStats)

export default router 
