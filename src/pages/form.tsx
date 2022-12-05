import { ExampleForm } from 'src/components/ExampleForm/ExampleForm';
import Head from 'next/head';

export default function Form() {
	return (
		<div className="container">
			<Head>
				<title>React Hooks Form Example</title>
			</Head>

			<main className="main">
				<ExampleForm />
			</main>
		</div>
	);
}
