import { https } from 'firebase-functions'
import * as admin from 'firebase-admin'

import { KEY_REGEX, PAGE_URL_REGEX } from './constants'

const database = admin.database().ref()

const getSlug = (url: string) =>
	url.match(PAGE_URL_REGEX)?.[1]

export default https.onRequest(async ({ method, url }, res) => {
	if (method !== 'GET') {
		res.status(404).send('Invalid method')
		return
	}
	
	const slug = getSlug(url)
	
	if (!(slug && KEY_REGEX.test(slug))) {
		res.status(404).send('Invalid URL')
		return
	}
	
	const keySnapshot = await database.child(`slugs/${slug}`).once('value')
	
	if (!keySnapshot.exists()) {
		const ref = database.child('pages').push()
		const { key } = ref
		
		await Promise.all([
			ref.set({
				slug,
				content: { title: '', body: '' }
			}),
			database.child(`slugs/${slug}`).set(key)
		])
		
		return res.redirect(301, `/edit/${key}`)
	}
	
	const contentSnapshot = await database.child(`pages/${keySnapshot.val()}/content`).once('value')
	
	if (!contentSnapshot.exists()) {
		res.status(500).send('Unable to fetch the page content')
		return
	}
	
	const { title, body } = contentSnapshot.val()
	
	res.removeHeader('Cache-Control')
	res.send(`<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="preconnect" href="https://fonts.gstatic.com">
		<link rel="preconnect" href="https://cdn.jsdelivr.net">
		<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Muli:wght@200;300;400;500;600;700;800;900&display=swap">
		<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@latest/dist/katex.min.css">
		<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@latest/themes/prism.min.css">
		<link rel="stylesheet" href="/page.css">
		<title>${title || 'Untitled document'}</title>
	</head>
	<body>
		${body}
		<script src="https://cdn.jsdelivr.net/combine/npm/katex@latest/dist/katex.min.js,npm/katex@latest/dist/contrib/auto-render.min.js,npm/prismjs@latest/prism.min.js,npm/prismjs@latest/plugins/autoloader/prism-autoloader.min.js" onload="renderMathInElement(document.body)"></script>
	</body>
</html>`)
})
