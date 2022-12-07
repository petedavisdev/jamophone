import styles from './Overview.module.css';

type OverviewProps = {
	children: React.ReactNode;
};

export function Overview(props: OverviewProps): JSX.Element {
	return <div className={styles.Overview}>{props.children}</div>;
}