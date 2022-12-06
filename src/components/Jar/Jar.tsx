import { useRef, useState } from 'react';

import styles from './Jar.module.css';

type JarProps = {
	note: string;
	image?: string;
};

export function Jar(props: JarProps): JSX.Element {
	const track1 = useRef(null);
	const track2 = useRef(null);
	const track3 = useRef(null);
	const [nextTrack, setNextTrack] = useState(1);

	function play() {
		if (nextTrack === 1) {
			const audioEl = track1.current as null | HTMLAudioElement;
			audioEl?.play();
			setNextTrack(2);
		} else if (nextTrack === 2) {
			const audioEl = track2.current as null | HTMLAudioElement;
			audioEl?.play();
			setNextTrack(3);
		} else {
			const audioEl = track3.current as null | HTMLAudioElement;
			audioEl?.play();
			setNextTrack(1);
		}
	}

	return (
		<button className={styles.Jar}>
			<audio src={'/audio/' + props.note + '.mp3'} ref={track1} />
			<audio src={'/audio/' + props.note + '.mp3'} ref={track2} />
			<audio src={'/audio/' + props.note + '.mp3'} ref={track3} />
			<img onMouseDown={play} src={props.image || '/images/jam-strawberry.jpg'} />
		</button>
	);
}

