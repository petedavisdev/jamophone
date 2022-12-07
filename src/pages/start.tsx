import { useEffect, useRef } from 'react';

export default function Start(): JSX.Element {
	const localVideoRef = useRef<HTMLVideoElement>(null);
	const remoteVideoRef = useRef<HTMLVideoElement>(null);
	const textRef = useRef<HTMLTextAreaElement>(null);
	const connection = useRef<RTCPeerConnection>();

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
				console.log('candidate', event.candidate);
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
			const candidate = JSON.parse(textRef.current.value);
			console.log({ candidate });
			connection.current?.addIceCandidate(new RTCIceCandidate(candidate));
		}
	}

	return (
		<div className="container">
			<main className="main">
				<h1>Start</h1>
				<section>
					<video autoPlay ref={localVideoRef} />
					<button onClick={createOffer}>Create offer</button>
					<button onClick={addCandidate}>Add candidate</button>
					<textarea cols={30} rows={10} ref={textRef} />
				</section>
				<section>
					<video autoPlay ref={remoteVideoRef} />
					<button onClick={setRemoteDescription}>Accept offer</button>
					<button onClick={createAnswer}>Create answer</button>
				</section>
			</main>
		</div>
	);
}

