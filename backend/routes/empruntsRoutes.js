import { Router } from 'express'
import { 
    createEmprunts, 
    getAllEmprunts, 
    getBorrowing, 
    getLateBorrow, 
    returningEmprunt 
} from '../controllers/empruntsControllers.js'

const router = Router()

router.get('/', getAllEmprunts)
router.get('/en-cours', getBorrowing)
router.get('/en-retard', getLateBorrow)
router.get('/:id', returningEmprunt)
router.post('/', createEmprunts)

export default router