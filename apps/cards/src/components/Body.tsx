import './Body.scss';
import QuillEditor from './Editor';

const Body: React.FC = () => {
	return (
		<div id="body-wrapper">
			<QuillEditor 
				id="body" 
				defaultValue="<p>Beschreibung der Karte</p>"
				placeholder="Enter description..."
			/>
		</div>
	);
}

export default Body;