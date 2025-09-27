import { useState, useEffect, useRef } from 'react';
import Header from './Header';
import Body from './Body';

import './Card.scss';

const baseWidth = 1024;
const baseHeight = 1536;

function getScale(parent: HTMLElement): number {
	const cs = getComputedStyle(parent);
	const [w, h] = [
		parent.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight),
		parent.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)
	];
	if (w === 0 || h === 0) return 1;
	return Math.min(w / baseWidth, h / baseHeight, 1);
}

const Card: React.FC = () => {
	const [scale, setScale] = useState(1);
	const ref = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const parent = ref.current?.parentElement;
		if (!parent) return;
		setScale(getScale(parent));

		let timeout: number | null = null;
		const observer = new ResizeObserver(() => {
			if (timeout) window.clearTimeout(timeout);
			timeout = window.setTimeout(() => {
				timeout = null;
				setScale(getScale(parent));
			}, 100);
		});

		observer.observe(parent);

		return () => {
			observer.disconnect();
			if (timeout) window.clearTimeout(timeout);
		}

	}, []);

	return (
		<div ref={ref} id='card' style={{ transform: `scale(${scale})` }}>
			<Header />
			<Body />
		</div>
	);
}

export default Card;