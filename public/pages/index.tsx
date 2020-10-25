import { useState, useCallback, FormEvent, ChangeEvent } from 'react'
import Head from 'next/head'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

import styles from 'styles/Home.module.scss'

const Home = () => {
	const [slug, setSlug] = useState('')
	
	const visitPage = useCallback((event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		
		if (slug)
			window.location.href = `/${slug}`
	}, [slug])
	
	const onSlugChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		setSlug(event.target.value)
	}, [setSlug])
	
	return (
		<div className={styles.root}>
			<Head>
				<title>WriteWith</title>
			</Head>
			<article className={styles.container}>
				<h1 className={styles.title}>WriteWith</h1>
				<p className={styles.description}>
					Share and collaborate on documents. Realtime editing. Designed for simplicity.
				</p>
				<form className={styles.form} onSubmit={visitPage}>
					<label className={styles.label} htmlFor="slug-input">
						visit or create page
					</label>
					<input
						className={styles.input}
						id="slug-input"
						required
						value={slug}
						onChange={onSlugChange}
					/>
					<button className={styles.button} disabled={!slug}>
						<FontAwesomeIcon className={styles.icon} icon={faArrowRight} />
					</button>
				</form>
			</article>
		</div>
	)
}

export default Home
