import type { ReactElement } from 'react';
import { useState, useEffect } from 'react';

import { ShieldHalf, Swords, Skull, HandFist, Flame, Gem, Milk } from 'lucide-react';

import './Card.scss';

function getScale(): number {
	const [w, h] = [window.innerWidth, window.innerHeight];
	if (w === 0 || h === 0) return 1;
	return Math.min(w / 1024, h / 1536, 1);
}

function Card(): ReactElement {
	const [scale, setScale] = useState(getScale());
	useEffect(() => {
		const onResize = () => setScale(getScale());
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	}, []);

	return (
		<div
			id='card'
			style={{ transform: `scale(${scale})` }}
		>
			<div className="icon-showcase">
				<h2>Available Icons</h2>
				<div className="icon-grid">

					<div className="icon-item">
						<ShieldHalf />
						<span>Ausrüstung</span>
					</div>

					<div className="icon-item">
						<Swords />
						<span>Waffe</span>
					</div>

					<div className="icon-item">
						<Skull />
						<span>Eigenschaft</span>
					</div>

					<div className="icon-item">
						<HandFist />
						<span>Talent</span>
					</div>

					<div className="icon-item">
						<Flame />
						<span>Zauber</span>
					</div>

					<div className="icon-item">
						<Gem />
						<span>Artefakt</span>
					</div>

					<div className="icon-item">
						<Milk />
						<span>Konsumierbar</span>
					</div>

				</div>
			</div>
		</div>
	);
}

export default Card;