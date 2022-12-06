import { Jamophone } from 'src/components/Jamophone/Jamophone';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

type FormValues = {
	offer: string;
};

export default function Join(): JSX.Element {
	const form = useForm<FormValues>();
	const [answer, setAnswer] = useState<RTCSessionDescriptionInit | undefined>();

	function createAnswer(data: FormValues) {
		if (data.offer) {
			const remoteConnection = new RTCPeerConnection();

			remoteConnection.onicecandidate = () => {
				console.log(' NEW ice candidate!! on localconnection reprinting SDP ');
				console.log(JSON.stringify(remoteConnection.localDescription));
			};

			remoteConnection.ondatachannel = (event) => {
				const dataChannel = event.channel;

				dataChannel.onopen = () => console.log('Channel opened');
				dataChannel.onclose = () => console.log('Channel closed');
				dataChannel.onmessage = (event) => alert('Message received ' + event.data);
			};

			remoteConnection
				.setRemoteDescription(JSON.parse(data.offer))
				.then(() => console.log('remote description set'));

			remoteConnection
				.createAnswer()
				.then((answerData) => {
					remoteConnection.setLocalDescription(answerData);
					setAnswer(answerData);
				})
				.then(() => console.log('Answer created'));
		}
	}

	return (
		<div className="container">
			<main className="main">
				<h1>Jamophone Join</h1>

				{answer ? (
					<textarea rows={10} readOnly value={JSON.stringify(answer)} />
				) : (
					<form onSubmit={form.handleSubmit(createAnswer)}>
						<label>
							Offer:
							<input {...form.register('offer')} required minLength={50} />
						</label>
						<button>Connect</button>
					</form>
				)}

				<Jamophone />
			</main>
		</div>
	);
}

