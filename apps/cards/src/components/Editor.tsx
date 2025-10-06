import { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.bubble.css';

interface EditorProperties {
	id: string;
	defaultValue?: string;
	placeholder?: string;
}

const Editor: React.FC<EditorProperties> = ({ id, defaultValue = '', placeholder = '' }) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const quillRef = useRef<Quill | null>(null);

	useEffect(() => {
		if (containerRef.current && !quillRef.current) {
			quillRef.current = new Quill(containerRef.current, {
				theme: 'bubble',
				placeholder
			});

			if (defaultValue) {
				quillRef.current.root.innerHTML = defaultValue;
			}
		}
	}, []);

	return <div id={id} ref={containerRef} />;
};

export default Editor;
