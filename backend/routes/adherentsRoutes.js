import { Router } from 'express'
import { 
    getAdherent, 
    getAdherentsById, 
    createAdherent, 
    modifierAdherent, 
    supprimerAdherent } from '../controllers/adherentsController.js'

const router = Router()

router.get('/', getAdherent)
router.get('/:id', getAdherentsById)
router.post('/', createAdherent)
router.put('/:id', modifierAdherent)
router.delete('/:id', supprimerAdherent)

export default router