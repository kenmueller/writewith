import { https } from 'firebase-functions'
import * as admin from 'firebase-admin'

import { KEY_REGEX } from './constants'

const { onCall, HttpsError } = https
const database = admin.database().ref()

export default onCall(async slug => {
	if (!(typeof slug === 'string' && KEY_REGEX.test(slug)))
		throw new HttpsError('invalid-argument', 'You must pass in a valid slug')
	
	return !(await database.child(`slugs/${slug}`).once('value')).exists()
})
