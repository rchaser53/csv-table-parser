import isNumber = require('is-number')

export interface AnyObject {
	[key: string]: any
}

export interface Options {
	separator?: string
	keys?: string[]
	type?: 'object' | 'array'
	trim?: boolean
	convertNumber?: boolean
	convertBoolean?: boolean,
	defaultValue?: string
}

export interface FixedOptions {
	separator: string
	keys: string[]
	type: 'object' | 'array'
	trim: boolean
	convertNumber: boolean
	convertBoolean: boolean,
	defaultValue: string
}

export type CreateRows = (obj: AnyObject, elem: any, index: number) => AnyObject

const DefaultOptions: FixedOptions = {
	separator: ',',
	keys: [],
	type: 'object',
	trim: true,
	convertNumber: true,
	convertBoolean: true,
	defaultValue: ''
}

export const createOptions = (options: Options): FixedOptions => {
	return { ...DefaultOptions, ...options }
}

export const parser = (tsvString: string, options: Options = {}): AnyObject | any[][] => {
	const fixedOptions = createOptions(options)
	return fixedOptions.type === 'object'
		? convertCsvToObject(tsvString, fixedOptions)
		: convertCsvToArray(tsvString, fixedOptions)
}

export const convertCsvToArray = (tsvString: string, options: FixedOptions): any[][] => {
	const rows = tsvString.split('\n')
	const { separator, trim } = options
	return rows.map((next) => {
		return next.split(separator).map((elem) => {
			const value = trim ? trimString(elem) : elem
			return convertStringToCorrectType(value, options)
		})
	})
}

export const convertCsvToObject = (tsvString: string, options: FixedOptions): AnyObject => {
	const { separator, keys: optionKeys } = options

	const rows = tsvString.split('\n')
	const isUsedOptionKeys = 0 < optionKeys.length
	const keys = isUsedOptionKeys ? optionKeys : (rows.shift() || '').split(separator)
	const createRow = createObjectRowFactory(keys, options)

	return rows.reduce<AnyObject[]>((stack, next) => {
		const values = next.split(separator)
		const rowDataObject = values.reduce<AnyObject>(createRow, {})
		return stack.concat(rowDataObject)
	}, [])
}

export const getKeys = (rows: string[], keys: string[], separator: string): string[] => {
	if (0 < keys.length) return keys
	return rows.length > 0 ? (rows[0] || '').split(separator) : []
}

export const createObjectRowFactory = (keys: string[], fixedOptions: FixedOptions): CreateRows => {
	const { trim } = fixedOptions
	return (obj, elem, index) => {
		const key = trim ? trimString(keys[index]) : keys[index]
		const value = trim ? trimString(elem) : elem
		obj[key] = convertStringToCorrectType(value, fixedOptions)
		return obj
	}
}

export const isBoolean = (value: string): boolean => {
	return value === 'true' || value === 'false'
}

export const convertStringToCorrectType = (str: string, fixedOptions: FixedOptions): any => {
	const { convertNumber, convertBoolean, defaultValue } = fixedOptions
	if (isNumber(str) && convertNumber) return parseInt(str)
	if (isBoolean(str) && convertBoolean) return str === 'true'
	return (str === '') ? defaultValue : str
}

export const trimString = (str: string): string => {
	return str.replace(/^\s*/, '').replace(/\s*$/, '')
}

export default parser
