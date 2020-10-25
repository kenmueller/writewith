import functions from './firebase/functions'

const _updatePageSlug = functions.httpsCallable('updatePageSlug')

const updatePageSlug = (key: string, slug: string) =>
	_updatePageSlug({ key, slug })

export default updatePageSlug
