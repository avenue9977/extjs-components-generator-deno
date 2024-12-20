import { expect } from 'jsr:@std/expect'
import { describe, it } from 'jsr:@std/testing/bdd'
import ComponentValidator from './ComponentValidator.ts'

describe('ComponentValidator', () => {
	const validator = new ComponentValidator()

	it('Validates component name successfully', () => {
		expect(validator.validateName('button')).toBe(true)
		expect(validator.validateName('BUTTON')).toBe(true)
	})

	it('Returns an error string if the validation of the name fails', () => {
		const errorMessage = 'Component name may only include letters'
		expect(validator.validateName('Button_1')).toBe(errorMessage)
		expect(validator.validateName('--button')).toBe(errorMessage)
	})

	it('Validates component location successfully', () => {
		expect(validator.validateLocation('components')).toBe(true)
		expect(validator.validateLocation('COMPONENTS')).toBe(true)
		expect(validator.validateLocation('COMPONENTS_test')).toBe(true)
		expect(validator.validateLocation('COMPONENTS/test_')).toBe(true)
	})

	it('Returns an error string if the validation of the name fails', () => {
		expect(validator.validateLocation('-2**')).toBe(
			'Component location may only include letters, underscores and slashes.',
		)
	})
})
