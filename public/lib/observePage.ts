import Page from 'models/Page'
import database from './firebase/database'

const observePage = (key: string, callback: (page: Page | null) => void) => {
	const ref = database.child(`pages/${key}`)
	const transform = ref.on('value', snapshot => callback(snapshot.val()))
	
	return () => ref.off('value', transform)
}

export default observePage
