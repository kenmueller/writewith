import { https } from 'firebase-functions'
import * as admin from 'firebase-admin'

import { KEY_REGEX } from './constants'

const { onCall, HttpsError } = https
const database = admin.database().ref()

export default onCall(async data => {
	if (typeof data !== 'object')
		throw new HttpsError('invalid-argument', 'You must pass in an object')
	
	const { key, slug } = data
	
	if (!(typeof key === 'string' && KEY_REGEX.test(key) && typeof slug === 'string' && KEY_REGEX.test(slug)))
		throw new HttpsError('invalid-argument', 'Invalid data')
	
	const keyRef = database.child(`slugs/${slug}`)
	
	if ((await keyRef.once('value')).exists())
		throw new HttpsError('already-exists', 'The page slug is taken')
	
	const slugRef = database.child(`pages/${key}/slug`)
	const oldSlugSnapshot = await slugRef.once('value')
	
	if (!oldSlugSnapshot.exists())
		throw new HttpsError('not-found', 'Key not found')
	
	await Promise.all([
		keyRef.set(key),
		slugRef.set(slug),
		database.child(`slugs/${oldSlugSnapshot.val()}`).remove()
	])
})
