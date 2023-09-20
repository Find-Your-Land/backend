import { artistService } from './artist.service'
import { logger } from '../../services/logger.service'
import { Request, Response } from 'express'
import { ArtistFilter } from '../../models/artist.model'

async function getArtists(req: Request, res: Response) {
      try {
            const filterBy = req.query as ArtistFilter
            const index = req.query.page ? +req.query.page : 0
            logger.debug('Getting artists')
            const artists = await artistService.query(filterBy , index)
            res.json(artists)
      } catch (err) {
            logger.error('Failed to get artists', err)
            res.status(500).send({ err: 'Failed to get artists' })
      }
}

async function getArtistsLength(req: Request, res: Response) {
      try {
            const filterBy = req.query as ArtistFilter
            logger.debug('Getting artists length')
            const artists = await artistService.artistsLength(filterBy)
            res.json(artists)
      } catch (err) {
            logger.error('Failed to get artists length', err)
            res.status(500).send({ err: 'Failed to get artists length' })
      }
}

async function getArtistById(req: Request, res: Response) {
      try {
            const artistId = req.params.artistId
            const artist = await artistService.getById(artistId)
            res.json(artist)
      } catch (err) {
            logger.error('Failed to get artist', err)
            res.status(500).send({ err: 'Failed to get artist' })
      }
}

async function addArtist(req: Request, res: Response) {
      try {
            const artist = req.body
            const addedArtist = await artistService.add(artist)
            res.json(addedArtist)
      } catch (err) {
            logger.error('Failed to add artist', err)
            res.status(500).send({ err: 'Failed to add artist' })
      }
}

async function updateArtist(req: Request, res: Response) {
      try {
            const artist = req.body
            const updatedArtist = await artistService.update(artist)
            res.json(updatedArtist)
      } catch (err) {
            logger.error('Failed to update artist', err)
            res.status(500).send({ err: 'Failed to update artist' })
      }
}



export const artistController = {
      getArtists,
      getArtistsLength,
      getArtistById,
      addArtist,
      updateArtist,
}