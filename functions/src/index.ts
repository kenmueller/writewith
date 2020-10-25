import { initializeApp } from 'firebase-admin'

initializeApp({
	databaseURL: 'https://write-with.firebaseio.com',
	storageBucket: 'write-with.appspot.com'
})

export { default as page } from './page'
export { default as upload } from './upload'
export { default as isPageSlugAvailable } from './isPageSlugAvailable'
export { default as updatePageSlug } from './updatePageSlug'
