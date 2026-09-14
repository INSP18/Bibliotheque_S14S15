const express = require('express')
const {getAuteurs, createAuteur, 
    getAuteursById, modifierAuteur,
    supprimerAuteur
} = require('../controllers/auteursController')
const router = express.Router()

router.get('/', getAuteurs)
router.get('/:id', getAuteursById)
router.post('/', createAuteur)
router.put('/:id', modifierAuteur)
router.delete('/:id', supprimerAuteur)

module.exports = router