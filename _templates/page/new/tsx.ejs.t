---
to: src/pages/<%= h.changeCase.kebab(name) %>.tsx
---
import Head from 'next/head';

export default function <%= PageName = h.changeCase.pascal(name) %>(): JSX.Element {
	return (
		<div className="container">
			<Head>
				<title><%= h.changeCase.title(name) %></title>
			</Head>

			<main className="main">
				<h1><%= h.changeCase.title(name) %></h1>
			</main>
		</div>
	);
}