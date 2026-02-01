import { ShieldHalf, Swords, Skull, HandFist, Flame, Gem, Milk } from 'lucide-react';
import './Icon.scss';

type IconName = 'gear' | 'weapon' | 'trait' | 'talent' | 'spell' | 'artifact' | 'consumable';

interface IconProps {
	icon: IconName;
}

const Icon: React.FC<IconProps> = ({ icon }) => {
	const semanticIconMap = {
		gear: ShieldHalf,
		weapon: Swords,
		trait: Skull,
		talent: HandFist,
		spell: Flame,
		artifact: Gem,
		consumable: Milk,
	};

	const IconComponent = semanticIconMap[icon];

	return (
		<div id="icon-wrapper">
			<IconComponent />
		</div>
	);
};

export default Icon;
export type { IconName };