import { Router } from 'express'
import { 
    createAdherent, 
    deleteAdherent, 
    getAdherentsById, 
    getAllAdherents, 
    modifyAdherent 
} from '../controllers/adherentsController.js'

const router = Router()

router.get('/', getAllAdherents)
router.get('/:id', getAdherentsById)
router.post('/', createAdherent)
router.put('/:id', modifyAdherent)
router.delete('/:id', deleteAdherent)

export default router