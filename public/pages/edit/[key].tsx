import { useState, useCallback, ChangeEvent, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch, faSave, faShareSquare, faTimes } from '@fortawesome/free-solid-svg-icons'
import cx from 'classnames'

import Page from 'models/Page'
import observePage from 'lib/observePage'
import updatePageSlug from 'lib/updatePageSlug'
import updatePageContent from 'lib/updatePageContent'
import isPageSlugAvailable from 'lib/isPageSlugAvailable'
import preventDefault from 'lib/preventDefault'
import Editor from 'components/Editor'

import styles from 'styles/Edit.module.scss'

const Edit = () => {
	const key = useRouter().query.key as string | undefined
	
	const [page, setPage] = useState<Page | null>(null)
	const [slug, setSlug] = useState<string | null>(null)
	
	const [isSlugLoading, setIsSlugLoading] = useState(false)
	const [isSlugAvailable, setIsSlugAvailable] = useState<boolean | null>(null)
	
	const pageSlug = page?.slug
	
	const onSlugSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		
		if (!slug)
			return
		
		if (slug === pageSlug) {
			window.open(`/${slug}`)
			return
		}
		
		if (!(isSlugAvailable && key))
			return
		
		try {
			setIsSlugLoading(true)
			await updatePageSlug(key, slug)
		} catch (error) {
			console.error(error)
			alert(error.message)
		}
		
		setIsSlugLoading(false)
	}, [slug, pageSlug, isSlugAvailable, key])
	
	const onSlugChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		setSlug(event.target.value)
	}, [setSlug])
	
	const onTitleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		if (key)
			updatePageContent(key, { title: event.target.value })
	}, [key])
	
	const onBodyChange = useCallback((body: string) => {
		if (key)
			updatePageContent(key, { body })
	}, [key])
	
	useEffect(() => (
		key ? observePage(key, setPage) : undefined
	), [key, setPage])
	
	useEffect(() => {
		if (pageSlug)
			setSlug(pageSlug)
	}, [pageSlug, setSlug])
	
	useEffect(() => {
		if (!slug || pageSlug === slug)
			return
		
		setIsSlugAvailable(null)
		
		let current = true
		
		isPageSlugAvailable(slug)
			.then(isAvailable => {
				if (current)
					setIsSlugAvailable(isAvailable)
			})
			.catch(error => {
				console.error(error)
				alert(error.message)
			})
		
		return () => { current = false }
	}, [slug, pageSlug, setIsSlugAvailable])
	
	return (
		<div className={styles.root}>
			<Head>
				<title key="title">
					{page
						? `Edit ${page.content.title || 'Untitled document'}`
						: 'WriteWith'
					}
				</title>
			</Head>
			<nav className={styles.nav}>
				<Link href="/">
					<a className={styles.home}>WriteWith</a>
				</Link>
				<form className={styles.slugForm} onSubmit={onSlugSubmit}>
					<label className={styles.label} htmlFor="slug-input">
						url
					</label>
					<input
						className={styles.slugInput}
						id="slug-input"
						required
						placeholder={slug === null ? 'Loading...' : undefined}
						value={slug ?? ''}
						onChange={onSlugChange}
					/>
					<button
						className={cx(styles.slugSubmit, {
							[styles.slugSubmitInvalid]: slug !== pageSlug && (slug === '' || isSlugAvailable === false)
						})}
						disabled={isSlugLoading || !(slug && (slug === pageSlug || isSlugAvailable))}
					>
						{isSlugLoading
							? <FontAwesomeIcon className={styles.spinner} icon={faCircleNotch} />
							: slug === ''
								? <FontAwesomeIcon icon={faTimes} />
								: slug === null
									? <FontAwesomeIcon className={styles.spinner} icon={faCircleNotch} />
									: slug === pageSlug
										? <FontAwesomeIcon icon={faShareSquare} />
										: isSlugAvailable === null
											? <FontAwesomeIcon className={styles.spinner} icon={faCircleNotch} />
											: <FontAwesomeIcon icon={isSlugAvailable ? faSave : faTimes} />
						}
					</button>
				</form>
				<form className={styles.titleForm} onSubmit={preventDefault}>
					<label className={styles.label} htmlFor="title-input">
						title
					</label>
					<input
						className={styles.titleInput}
						id="title-input"
						required
						placeholder={page ? 'Untitled document' : 'Loading...'}
						value={page?.content.title ?? ''}
						onChange={onTitleChange}
					/>
				</form>
			</nav>
			{page && <Editor value={page.content.body} onChange={onBodyChange} />}
		</div>
	)
}

export default Edit
