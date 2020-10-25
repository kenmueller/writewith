import { FormEvent } from 'react'

const preventDefault = (event: FormEvent<HTMLFormElement>) =>
	event.preventDefault()

export default preventDefault
