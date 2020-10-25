import { https } from 'firebase-functions'
import * as admin from 'firebase-admin'
import { v4 as uuid } from 'uuid'

import { BASE64_CONTENT_TYPE_REGEX } from './constants'

const storage = admin.storage().bucket()

export default https.onRequest(async ({ method, body }, res) => {
	res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
	
	if (method === 'OPTIONS') {
		res.send()
		return
	}
	
	if (method !== 'POST') {
		res.status(404).send('Invalid method')
		return
	}
	
	const sendError = (message: string) => {
		res.json({
			error: { message }
		})
	}
	
	if (typeof body !== 'string')
		return sendError('You must send a string')
	
	const contentTypeMatch = body.match(BASE64_CONTENT_TYPE_REGEX)
	
	if (!contentTypeMatch)
		return sendError('Invalid image data')
	
	const path = `uploads/${uuid()}`
	
	try {
		await storage.file(path).save(
			Buffer.from(body.replace(contentTypeMatch[0], ''), 'base64'),
			{
				public: true,
				metadata: {
					contentType: contentTypeMatch[1],
					metadata: {
						firebaseStorageDownloadTokens: uuid()
					}
				}
			}
		)
		
		res.json({
			url: `https://storage.googleapis.com/write-with.appspot.com/${path}`
		})
	} catch (error) {
		sendError(error.message)
	}
})
