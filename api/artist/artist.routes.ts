import express from 'express'
import { artistController } from './artist.controller'
import { requireAuth } from '../../middlewares/requireAuth.middleware'
export const router = express.Router()

router.get('/', artistController.getArtists)
router.get('/length', artistController.getArtistsLength)
router.get('/:artistId', artistController.getArtistById)
router.post('/', artistController.addArtist)
router.put('/', requireAuth, artistController.updateArtist)
