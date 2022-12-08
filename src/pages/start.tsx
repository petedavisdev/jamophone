import { useEffect, useRef, useState } from 'react';

export default function Start(): JSX.Element {
	const localVideoRef = useRef<HTMLVideoElement>(null);
	const remoteVideoRef = useRef<HTMLVideoElement>(null);
	const descriptionEl = useRef<HTMLTextAreaElement>(null);
	const candidatesEl = useRef<HTMLTextAreaElement>(null);
	const connection = useRef<RTCPeerConnection>();
	const channel = useRef<RTCDataChannel>();
	const [localDescription, setLocalDescription] = useState<RTCSessionDescriptionInit | undefined>();
	const [localIceCandidates, setLocalIceCandidates] = useState<(RTCIceCandidate | null)[]>([]);
	const [start, setStart] = useState(false);
	const [join, setJoin] = useState(false);
	const [messages, setMessages] = useState<string[]>([]);

	useEffect(() => {
		navigator.mediaDevices
			.getUserMedia({ audio: false, video: true })
			.then((stream) => {
				if (localVideoRef.current) {
					localVideoRef.current.srcObject = stream;

					stream.getTracks().forEach((track) => {
						connection.current?.addTrack(track, stream);
					});
				}
			})
			.catch((error) => {
				alert(error);
			});

		const peerConnection = new RTCPeerConnection();

		peerConnection.onicecandidate = (event) => {
			if (event.candidate) {
				setLocalIceCandidates((candidates) => [...candidates, event.candidate]);
			}
		};

		peerConnection.ontrack = (event) => {
			if (remoteVideoRef.current) {
				remoteVideoRef.current.srcObject = event.streams[0];
			}
		};

		connection.current = peerConnection;
	}, []);

	function startChannel() {
		if (connection.current) {
			const dataChannel = connection.current.createDataChannel('channel');

			dataChannel.onopen = () => console.log('Channel open');
			dataChannel.onclose = () => console.log('Channel close');
			dataChannel.onmessage = (event) =>
				setMessages((messages) => [...messages, 'Them: ' + event.data]);

			channel.current = dataChannel;
			setStart(true);
		}
	}

	function joinChannel() {
		if (connection.current) {
			connection.current.ondatachannel = (event) => {
				const dataChannel = event.channel;

				dataChannel.onopen = () => console.log('Channel open');
				dataChannel.onclose = () => console.log('Channel close');
				dataChannel.onmessage = (event) =>
					setMessages((messages) => [...messages, 'Them: ' + event.data]);

				channel.current = dataChannel;
			};

			setJoin(true);
		}
	}

	function createOffer() {
		connection.current
			?.createOffer()
			.then((offer) => {
				connection.current?.setLocalDescription(offer);
				setLocalDescription(offer);
			})
			.catch((error) => {
				alert(error);
			});
	}

	function createAnswer() {
		connection.current
			?.createAnswer()
			.then((answer) => {
				connection.current?.setLocalDescription(answer);
				setLocalDescription(answer);
			})
			.catch((error) => {
				alert(error);
			});
	}

	function setRemoteDescription() {
		if (descriptionEl.current) {
			const description = JSON.parse(descriptionEl.current.value);
			connection.current?.setRemoteDescription(description);
		}
	}

	function addCandidates() {
		if (candidatesEl.current) {
			const candidates = JSON.parse(candidatesEl.current.value);
			candidates.forEach((candidate: RTCIceCandidate) => {
				connection.current?.addIceCandidate(new RTCIceCandidate(candidate));
			});
		}
	}

	function copyAsText(data: unknown) {
		try {
			navigator.clipboard.writeText(JSON.stringify(data));
		} catch (error) {
			alert(error);
		}
	}

	function sendMessage() {
		try {
			channel.current?.send('Hello world');
			setMessages((messages) => [...messages, 'Me: Hello world']);
		} catch (error: unknown) {
			console.error(error);
		}
	}

	return (
		<div className="container">
			<main className="main">
				<video autoPlay ref={localVideoRef} />
				<video autoPlay ref={remoteVideoRef} />

				{!start && !join && (
					<>
						<button onClick={startChannel}>Start</button>
						<button onClick={joinChannel}>Join</button>
					</>
				)}

				{start && <button onClick={createOffer}>Create offer</button>}

				{(start || join) && (
					<>
						{localDescription && (
							<p>
								<span className="truncatedText">{JSON.stringify(localDescription)}</span>
								<button onClick={() => copyAsText(localDescription)}>Copy local description</button>
							</p>
						)}

						<textarea cols={30} rows={10} ref={descriptionEl} />
						<button onClick={setRemoteDescription}>Set remote description</button>
					</>
				)}

				{start && (
					<>
						<textarea cols={30} rows={10} ref={candidatesEl} />
						<button onClick={addCandidates}>Add candidates</button>
					</>
				)}

				{join && (
					<>
						<button onClick={createAnswer}>Create answer</button>

						{localIceCandidates && (
							<p>
								<span className="truncatedText">{JSON.stringify(localIceCandidates)}</span>
								<button onClick={() => copyAsText(localIceCandidates)}>
									Copy local ICE candidates
								</button>
							</p>
						)}
					</>
				)}

				<button onClick={sendMessage}>Send message</button>
				<ol>
					{messages.map((message, index) => (
						<li key={index}>{message}</li>
					))}
				</ol>
			</main>
		</div>
	);
}

