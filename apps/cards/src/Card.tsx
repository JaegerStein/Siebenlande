import type { ReactElement } from 'react';
import { useEffect } from 'react';

import './Card.scss'

function Card(): ReactElement {
	useEffect(() => {
		document.documentElement.style.setProperty('--pixel-ratio', window.devicePixelRatio.toString());
	}, []);

	return <div id='card'></div>
}

export default Card;