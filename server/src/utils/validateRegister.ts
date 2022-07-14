import { RegisterInputs } from '../resolvers/inputTypes/RegisterInputs'

export const validateRegister = (options: RegisterInputs) => {
	if (!options.email.includes('@')) {
		return [
			{
				field: 'email',
				message: 'Invalid email',
			},
		]
	}

	if (options.username.length <= 2) {
		return [
			{
				field: 'username',
				message: 'Length must be greater than 2',
			},
		]
	}

	if (options.username.includes('@')) {
		return [
			{
				field: 'username',
				message: 'username cannot include an @ sign',
			},
		]
	}

	if (options.password.length <= 3) {
		return [
			{
				field: 'password',
				message: 'Length must be greater than 3',
			},
		]
	}
	return null
}
