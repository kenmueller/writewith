import database from './firebase/database'

export interface UpdatePageContentData {
	title?: string
	body?: string
}

const updatePageContent = (key: string, data: UpdatePageContentData): Promise<void> =>
	database.child(`pages/${key}/content`).update(data)

export default updatePageContent
