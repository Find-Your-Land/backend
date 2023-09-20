import { Artist, ArtistFilter } from "../../models/artist.model"

var dbService = require('../../services/db.service')
var ObjectId = require('mongodb').ObjectId
var logger = require('../../services/logger.service')
const ARTIST_INCREMENT = 20

async function query(filterBy: ArtistFilter, index: number) {
    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('artist')
        const artists = await collection.find(criteria).toArray()
        return artists.slice(ARTIST_INCREMENT * index, ARTIST_INCREMENT * index + ARTIST_INCREMENT)
    } catch (err) {
        logger.error('cannot find artists', err)
        throw err
    }
}

async function artistsLength(filterBy: ArtistFilter) {
    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('artist')
        const artists = await collection.find(criteria).toArray()
        return artists.length
    } catch (err) {
        logger.error('cannot find artists', err)
        throw err
    }
}

async function getById(artistId: string) {
    try {
        const collection = await dbService.getCollection('artist')
        const artist = collection.findOne({ _id: new ObjectId(artistId) })
        return artist
    } catch (err) {
        logger.error(`while finding artist ${artistId}`, err)
        throw err
    }
}

async function add(artist: Artist) {
    try {
        const collection = await dbService.getCollection('artist')
        await collection.insertOne(artist)
        return artist
    } catch (err) {
        logger.error('cannot insert artist', err)
        throw err
    }
}

async function update(artist: Artist) {
    try {
        const artistToSave: any = { ...artist }
        delete artistToSave._id
        const collection = await dbService.getCollection('artist')
        await collection.updateOne({ _id: new ObjectId(artist._id) }, { $set: artistToSave })
        return artist
    } catch (err) {
        logger.error(`cannot update artist ${artist._id}`, err)
        throw err
    }
}

function _buildCriteria(filterBy: ArtistFilter) {
    const criteria: any = {}
    if (filterBy?.place) {
        criteria['loc.address'] = { $regex: filterBy.place, $options: 'i' }
    }
    if (filterBy?.likeByUser) {
        criteria.likedByUsers = { $in: [filterBy.likeByUser] }
    }
    if (filterBy?.label) {
        criteria.labels = { $in: [filterBy.label] }
    }
    if (filterBy?.hostId) {
        criteria['host._id'] = filterBy.hostId
    }
    if (filterBy?.isPetAllowed === 'true') {
        criteria.amenities = { $in: ['Pets allowed'] }
    }
    return criteria
}

export const artistService = {
    query,
    artistsLength,
    getById,
    add,
    update,
}