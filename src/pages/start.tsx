import { useEffect, useRef, useState } from 'react';

export default function Start(): JSX.Element {
	const localVideoRef = useRef<HTMLVideoElement>(null);
	const remoteVideoRef = useRef<HTMLVideoElement>(null);
	const textRef = useRef<HTMLTextAreaElement>(null);
	const connection = useRef<RTCPeerConnection>();
	const [localDescription, setLocalDescription] = useState<RTCSessionDescriptionInit | undefined>();
	const [localIceCandidates, setLocalIceCandidates] = useState<(RTCIceCandidate | null)[]>([]);
	const [start, setStart] = useState(false);
	const [join, setJoin] = useState(false);

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
				console.log(JSON.stringify(event.candidate));
				setLocalIceCandidates((candidates) => [...candidates, event.candidate]);
			}
		};

		peerConnection.oniceconnectionstatechange = (event) => {
			console.log('ice connection state change', event);
		};

		peerConnection.ontrack = (event) => {
			if (remoteVideoRef.current) {
				remoteVideoRef.current.srcObject = event.streams[0];
			}
		};

		connection.current = peerConnection;
	}, []);

	function createOffer() {
		connection.current
			?.createOffer()
			.then((offer) => {
				console.log(JSON.stringify(offer));
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
				console.log(JSON.stringify(answer));
				connection.current?.setLocalDescription(answer);
				setLocalDescription(answer);
			})
			.catch((error) => {
				alert(error);
			});
	}

	function setRemoteDescription() {
		if (textRef.current) {
			const description = JSON.parse(textRef.current.value);
			console.log({ description });
			connection.current?.setRemoteDescription(description);
		}
	}

	function addCandidate() {
		if (textRef.current) {
			const candidates = JSON.parse(textRef.current.value);
			console.log(candidates);
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

	return (
		<div className="container">
			<main className="main">
				<video autoPlay ref={localVideoRef} />
				<video autoPlay ref={remoteVideoRef} />

				{!start && !join && (
					<>
						<button onClick={() => setStart(true)}>Start</button>
						<button onClick={() => setJoin(true)}>Join</button>
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

						<textarea cols={30} rows={10} ref={textRef} />
						<button onClick={setRemoteDescription}>Set remote description</button>
					</>
				)}

				{start && <button onClick={addCandidate}>Add candidates</button>}

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
			</main>
		</div>
	);
}

