import Head from 'next/head';
import PeerJs from 'peerjs';

let peer: PeerJs;
let connection: PeerJs.DataConnection;

interface ChatMessage {
	id: number;
	self: boolean;
	user: string;
	message: string;
	time: string;
}

export default function Connect(): JSX.Element {
	return (
		<div className="container">
			<Head>
				<title>Connect</title>
			</Head>

			<main className="main">
				<h1>Connect</h1>
			</main>
		</div>
	);
}
