import isNumber = require('is-number')
import { FixedOptions } from './interface'

export const shapeData = (str: string, options: FixedOptions): any => {
	const { trim } = options
	const value = trim ? trimString(str) : str
	return convertStringToCorrectType(value, options)
}

export const isBoolean = (value: string): boolean => {
	return value === 'true' || value === 'false'
}

export const convertStringToCorrectType = (str: string, fixedOptions: FixedOptions): any => {
	const { convertNumber, convertBoolean, defaultValue } = fixedOptions
	if (isNumber(str) && convertNumber) return parseInt(str)
	if (isBoolean(str) && convertBoolean) return str === 'true'
	if (str === 'null') return null
	if (str === 'undefined') return undefined
	return str === '' ? defaultValue : str
}

export const trimString = (str: string): string => {
	return str.replace(/^\s*/, '').replace(/\s*$/, '')
}
