import PeerJs, { Peer } from 'peerjs';
import { useEffect, useState } from 'react';

import styles from './NameInput.module.css';
import { useForm } from 'react-hook-form';

type FormValues = {
	name: string;
};

export function NameInput(): JSX.Element {
	const [availablePeer, setAvailablePeer] = useState<Peer | undefined>();
	const form = useForm<FormValues>();

	function submit(data: FormValues) {
		console.log(data);
		setAvailablePeer(new PeerJs(data.name));
	}

	useEffect(() => {
		peer = availablePeer;
	}, [availablePeer]);

	return (
		<form onSubmit={form.handleSubmit(submit)} className={styles.NameInput}>
			<label>
				Your name:
				<input {...form.register('name')} name="name" />
			</label>
			<button>Save</button>
		</form>
	);
}

