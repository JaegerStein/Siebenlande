import './Header.scss';

import Icon from "./Icon";
import Editor from './Editor';

const Header: React.FC = () => {
	return (
		<div id="header-wrapper">
			<div id="header">
				<div id="title-wrapper">
					<Editor 
						id="title" 
						defaultValue="Titel der Karte"
						placeholder="Enter title..."
					/>
				</div>
				<Icon icon="gear" />
			</div>
		</div>
	);
}

export default Header;