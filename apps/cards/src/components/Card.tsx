import { useState, useEffect, useRef } from 'react';
import { ShieldHalf, Swords, Skull, HandFist, Flame, Gem, Milk } from 'lucide-react';
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
		<div
			ref={ref}
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