import styles from './ExampleCard.module.css';

type ExampleCardProps = {
	to: string;
	title?: string;
	children: React.ReactNode;
};

export function ExampleCard(props: ExampleCardProps): JSX.Element {
	return (
		<a href={props.to} className={styles.card}>
			<h2>{props.title} &rarr;</h2>
			{props.children}
		</a>
	);
}

