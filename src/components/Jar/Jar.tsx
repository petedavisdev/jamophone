import styles from './Jar.module.css';
import { useRef } from 'react';

type JarProps = {
	note: string;
	played: (note: string) => void;
	image?: string;
};

export function Jar(props: JarProps): JSX.Element {
	const track = useRef<null | HTMLAudioElement>(null);

	function play() {
		props.played(props.note);
		const audioEl = track.current;
		audioEl?.play();
	}

	return (
		<button className={styles.Jar}>
			<audio src={'/audio/' + props.note + '.mp3'} ref={track} />
			<audio src={'/audio/' + props.note + '.mp3'} id={props.note} />
			<img onClick={play} src={props.image || '/images/jam-strawberry.jpg'} />
		</button>
	);
}

