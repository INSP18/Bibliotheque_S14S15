const express = require('express')
const { getAdherent, getAdherentsById, 
    createAdherent, 
    modifierAdherent,
    supprimerAdherent} = require('../controllers/adherentsController')
const router = express.Router()

router.get('/', getAdherent)
router.get('/:id', getAdherentsById)
router.post('/', createAdherent)
router.put('/:id', modifierAdherent)
router.delete('/:id', supprimerAdherent)

module.exports = router