import { Router } from 'express'
import { 
    createLivre, 
    deleteLivre, 
    getAllLivres, 
    getLivresById, 
    modifyLivre 
} from '../controllers/livresControllers.js'

const router = Router()

router.get('/', getAllLivres)
router.get('/:id', getLivresById)
router.post('/', createLivre)
router.put('/:id', modifyLivre)
router.delete('/:id', deleteLivre)

export default router