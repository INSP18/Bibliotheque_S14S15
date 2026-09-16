import { Router } from 'express'
import { 
    getAuteurs, 
    createAuteur, 
    getAuteursById, 
    modifierAuteur, 
    supprimerAuteur } from '../controllers/auteursController.js'

    const router = Router()

router.get('/', getAuteurs)
router.get('/:id', getAuteursById)
router.post('/', createAuteur)
router.put('/:id', modifierAuteur)
router.delete('/:id', supprimerAuteur)

export default router