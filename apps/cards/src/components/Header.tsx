import { useRef, type FocusEventHandler } from "react";
import Icon from "./Icon";
import './Header.scss';

const placeholder = "Titel <i>der</i> Karte";

const Header: React.FC = () => {
	const ref = useRef<HTMLHeadingElement | null>(null);

	const handleFocus: FocusEventHandler = (event) => {
		if (ref.current) {
			//console.log(event);
			
			console.log('Text length: ', ref.current.innerText.length);
			console.log('HTML length: ', ref.current.innerHTML.length);
			
			const walker = document.createTreeWalker(ref.current, NodeFilter.SHOW_TEXT);
			let nodes = [];
			while (walker.nextNode()) nodes.push(walker.currentNode);
			console.log('Counted text nodes: ', nodes);

			const selection = window.getSelection();
			console.log(selection);

			// const currentHtml = ref.current.innerHTML;
			// ref.current.innerText = currentHtml;
		}
	}

	const handleBlur = () => {
		if (ref.current) {
			// const currentText = ref.current.innerText;
			// ref.current.innerHTML = currentText.trim();
		}
	}

	return (
		<div id="header-wrapper">
			<div id="header">
				<div id="title-wrapper">
					<h1 id="title"
						ref={ref}
						contentEditable
						spellCheck="false"
						onFocus={handleFocus}
						onBlur={handleBlur}
						dangerouslySetInnerHTML={{ __html: placeholder }}
					></h1>
				</div>
				<Icon icon="gear" />
			</div>
		</div>
	);
}

export default Header;