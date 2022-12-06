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
				const receiveChannel = event.channel;

				receiveChannel.onopen = () => console.log('sendChannel open');
				receiveChannel.onclose = () => console.log('sendChannel close');
				receiveChannel.onmessage = (event) =>
					console.log('sendChannel message received ' + event.data);
			};

			remoteConnection
				.setRemoteDescription(JSON.parse(data.offer))
				.then(() => console.log('remote description set'));

			remoteConnection.createAnswer().then((description) => {
				remoteConnection.setLocalDescription(description);
				setAnswer(description);
			});
		}
	}

	return (
		<div className="container">
			<main className="main">
				<h1>Jamophone Duet</h1>

				{answer ? (
					<textarea rows={10} readOnly>
						{JSON.stringify(answer)}
					</textarea>
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

