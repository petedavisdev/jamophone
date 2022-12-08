import { useEffect, useRef, useState } from 'react';

import { Jar } from '../Jar/Jar';
import styles from './Jamophone.module.css';

export function Jamophone(): JSX.Element {
	const descriptionEl = useRef<HTMLTextAreaElement>(null);
	const candidatesEl = useRef<HTMLTextAreaElement>(null);
	const connection = useRef<RTCPeerConnection>();
	const channel = useRef<RTCDataChannel>();
	const [localDescription, setLocalDescription] = useState<RTCSessionDescriptionInit | undefined>();
	const [localIceCandidates, setLocalIceCandidates] = useState<(RTCIceCandidate | null)[]>([]);
	const [start, setStart] = useState(false);
	const [join, setJoin] = useState(false);
	const [notes, setNotes] = useState<string[]>([]);

	useEffect(() => {
		const peerConnection = new RTCPeerConnection();

		peerConnection.onicecandidate = (event) => {
			if (event.candidate) {
				setLocalIceCandidates((candidates) => [...candidates, event.candidate]);
			}
		};

		connection.current = peerConnection;
	}, []);

	function startChannel() {
		if (connection.current) {
			const dataChannel = connection.current.createDataChannel('channel');

			dataChannel.onopen = () => console.log('Channel open');
			dataChannel.onclose = () => console.log('Channel close');
			dataChannel.onmessage = (event) => {
				setNotes((notes) => [...notes, 'Them: ' + event.data]);
				const audioEl = document.getElementById(event.data) as HTMLAudioElement;
				audioEl?.play();
			};

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
				dataChannel.onmessage = (event) => {
					setNotes((notes) => [...notes, 'Them: ' + event.data]);

					const audioEl = document.getElementById(event.data) as HTMLAudioElement;
					audioEl?.play();
				};
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

	function played(note: string) {
		if (channel.current) {
			try {
				channel.current?.send(note);
				setNotes((notes) => [...notes, 'Me: ' + note]);
			} catch (error: unknown) {
				console.error(error);
			}
		}
	}

	return (
		<>
			<div className={styles.Jamophone}>
				<Jar note="C" played={played} />
				<Jar note="D" played={played} />
				<Jar note="E" played={played} />
				<Jar note="F" played={played} />
				<Jar note="G" played={played} />
				<Jar note="A" played={played} />
				<Jar note="B" played={played} />
				<Jar note="M" played={played} image="/images/marmalade.png" />
			</div>

			<ol>
				{notes.map((note, index) => (
					<li key={index}>{note}</li>
				))}
			</ol>

			<div className={styles.Connection}>
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
			</div>
		</>
	);
}

