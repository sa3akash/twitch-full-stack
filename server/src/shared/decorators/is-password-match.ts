import {
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface
} from 'class-validator'

import { NewPasswordInput } from '@/src/modules/auth/password-recovery/inputs/new-password.input'

@ValidatorConstraint({ name: 'IsPasswordMatchConstraint' })
export class IsPasswordMatchConstraint implements ValidatorConstraintInterface {
	public validate(passwordRepeat: string, args: ValidationArguments) {
		const object = args.object as NewPasswordInput

		return object.password === passwordRepeat
	}

	public defaultMessage(): string {
		return 'Password must be match.'
	}
}
