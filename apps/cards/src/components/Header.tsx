import Icon from "./Icon";
import './Header.scss';

const Header: React.FC = () => {
	return (
		<div id="header-wrapper">
			<div id="header">
				<div id="title-wrapper">
					<h1 id="title">Titel der Karte</h1>
				</div>
				<Icon icon="gear" />
			</div>
		</div>
	);
}

export default Header;