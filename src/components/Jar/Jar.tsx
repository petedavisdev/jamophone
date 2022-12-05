import { useRef } from 'react';
import styles from './Jar.module.css';

type JarProps = {
	note: string;
	image?: string;
};

export function Jar(props: JarProps): JSX.Element {
	const audio = useRef(null);

	function play() {
		const audioEl = audio.current as null | HTMLAudioElement;
		audioEl?.play();
	}

	return (
		<span className={styles.Jar}>
			<audio src={'audio/' + props.note + '.mp3'} ref={audio} />
			<img onMouseOver={play} src={props.image || 'images/jam-strawberry.jpg'} />
		</span>
	);
}
