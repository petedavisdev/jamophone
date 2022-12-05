import Head from 'next/head';
import { Jamophone } from 'src/components/Jamophone/Jamophone';

export default function Home() {
	return (
		<div className="container">
			<Head>
				<title>Jamophone</title>
				<meta name="description" content="The sweetest musical instrument" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Jamophone />
		</div>
	);
}
