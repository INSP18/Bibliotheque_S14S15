import { Router } from 'express'
import { 
    createAuteur, 
    deleteAuteur, 
    getAllAuteurs, 
    getAuteursById, 
    modifyAuteur 
} from '../controllers/auteursController.js'

const router = Router()

router.get('/', getAllAuteurs)
router.get('/:id', getAuteursById)
router.post('/', createAuteur)
router.put('/:id', modifyAuteur)
router.delete('/:id', deleteAuteur)

export default router