import { Jamophone } from 'src/components/Jamophone/Jamophone';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

type FormValues = {
	answer: string;
};

export default function Duet(): JSX.Element {
	const form = useForm<FormValues>();
	const [offer, setOffer] = useState<RTCSessionDescriptionInit | undefined>();
	const [connection, setConnection] = useState<RTCPeerConnection | undefined>();
	const [channel, setChannel] = useState<RTCDataChannel | undefined>();

	function createOffer() {
		const localConnection = new RTCPeerConnection();
		const dataChannel = localConnection.createDataChannel('sendChannel');

		localConnection.onicecandidate = () => {
			console.log('NEW ice candidate!! on localconnection reprinting SDP ');
			console.log(JSON.stringify(localConnection.localDescription));
		};

		dataChannel.onopen = () => console.log('sendChannel open');
		dataChannel.onclose = () => console.log('sendChannel close');
		dataChannel.onmessage = (event) => alert('sendChannel message received ' + event.data);

		localConnection.createOffer().then((offerData) => {
			localConnection.setLocalDescription(offerData);
			setOffer(offerData);
		});

		setConnection(localConnection);
		setChannel(dataChannel);
	}

	function connect(data: FormValues) {
		if (connection && channel) {
			connection.setRemoteDescription(JSON.parse(data.answer)).then(() => console.log('done'));
			channel.send('hello');
		}
	}

	return (
		<div className="container">
			<main className="main">
				<h1>Jamophone Duet</h1>

				{!offer ? (
					<button onClick={createOffer}>Start Duet</button>
				) : (
					<>
						<textarea rows={10} readOnly value={JSON.stringify(offer)} />

						<form onSubmit={form.handleSubmit(connect)}>
							<label>
								Answer:
								<input {...form.register('answer')} required minLength={50} />
							</label>
							<button>Connect</button>
						</form>
					</>
				)}

				<Jamophone />
			</main>
		</div>
	);
}

