import functions from './firebase/functions'

const _isPageSlugAvailable = functions.httpsCallable('isPageSlugAvailable')

const isPageSlugAvailable = async (slug: string) =>
	(await _isPageSlugAvailable(slug)).data as boolean

export default isPageSlugAvailable
