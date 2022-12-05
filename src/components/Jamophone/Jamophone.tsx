import { Jar } from '../Jar/Jar';
import styles from './Jamophone.module.css';

type JamophoneProps = {};

export function Jamophone(props: JamophoneProps): JSX.Element {
	return (
		<div className={styles.Jamophone}>
			<Jar note="C" />
			<Jar note="D" />
			<Jar note="E" />
			<Jar note="F" />
			<Jar note="G" />
			<Jar note="A" />
			<Jar note="B" />
			<Jar note="M" image="images/marmalade.png" />
		</div>
	);
}
