import { useCallback } from 'react'
import CKEditor from '@ckeditor/ckeditor5-react'
import _Editor from 'ckeditor5-memorize.ai'

const CONFIG = {
	startupFocus: true,
	simpleUpload: {
		uploadUrl: 'https://write-with.web.app/api/upload'
	}
}

const focusEditor = (editor: any) => {
	editor.editing.view.focus()
}

export interface EditorProps {
	value: string
	onChange(value: string): void
}

const Editor = ({ value, onChange }: EditorProps) => {
	const _onChange = useCallback((_event: any, editor: any) => {
		onChange(editor.getData())
	}, [onChange])
	
	return (
		<CKEditor
			editor={_Editor}
			data={value}
			config={CONFIG}
			onInit={focusEditor}
			onChange={_onChange}
		/>
	)
}

export default Editor
