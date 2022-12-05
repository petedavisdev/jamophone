import { useForm } from 'react-hook-form';
import { useState } from 'react';

type FormValues = {
	firstName: string;
	lastName: string;
	colour: string;
};

export function ExampleForm(): JSX.Element {
	const form = useForm<FormValues>();
	const [fullName, setFullName] = useState('');
	const [favouriteColour, setFavouriteColour] = useState('');

	function submit(data: FormValues) {
		setFullName(`${data.firstName} ${data.lastName}`);
		setFavouriteColour(data.colour);
	}

	return (
		<form onSubmit={form.handleSubmit(submit)}>
			<fieldset>
				<legend>Name:</legend>
				<p>
					<label htmlFor="first">First Name:</label>
				</p>
				<p>
					<input {...form.register('firstName')} type="text" id="first" />
				</p>

				<p>
					<label htmlFor="name">Last Name:</label>
				</p>
				<p>
					<input {...form.register('lastName')} type="text" id="last" />
				</p>
			</fieldset>

			<fieldset>
				<legend>Pick a colour</legend>
				<p>
					<label htmlFor="red">Red:</label>
					<input {...form.register('colour')} value="Red" type="radio" id="red" />
				</p>
				<p>
					<label htmlFor="green">Green:</label>
					<input {...form.register('colour')} type="radio" name="colour" value="Green" id="green" />
				</p>
				<p>
					<label htmlFor="blue">Blue:</label>
					<input {...form.register('colour')} type="radio" name="colour" value="Blue" id="blue" />
				</p>
			</fieldset>

			<button type="submit">Submit</button>

			<p>Name: {fullName}</p>
			<p>Favourite colour: {favouriteColour}</p>
		</form>
	);
}

