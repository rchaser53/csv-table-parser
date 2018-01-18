import isNumber = require('is-number')

export interface AnyObject {
	[key: string]: any
}

export interface Options {
	trim?: boolean
	separator?: string
	convertNumber?: boolean
	convertBoolean?: boolean
}

export interface FixedOptions {
	trim: boolean
	separator: string
	convertNumber: boolean
	convertBoolean: boolean
}

export type CreateRows = (obj: AnyObject, elem: any, index: number) => AnyObject

const DefaultOptions = {
	trim: true,
	separator: ',',
	convertNumber: true,
	convertBoolean: true
}

export const createOptions = (options: Options): FixedOptions => {
	return { ...DefaultOptions, ...options }
}

export const convertCsvToObject = (tsvString: string, options: Options = {}): AnyObject => {
	const fixedOptions = createOptions(options)
	const { separator } = fixedOptions

	const rows = tsvString.split('\n')
	const keys = rows.length > 0 ? (rows.shift() || '').split(separator) : []
	const createRow = createRowFactory(keys, fixedOptions)

	return rows.reduce<AnyObject[]>((stack, next) => {
		const values = next.split(separator)
		const rowDataObject = values.reduce<AnyObject>(createRow, {})
		return stack.concat(rowDataObject)
	}, [])
}

export const createRowFactory = (keys: string[], fixedOptions: FixedOptions): CreateRows => {
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
	const { convertNumber, convertBoolean } = fixedOptions
	if (isNumber(str) && convertNumber) return parseInt(str)
	if (isBoolean(str) && convertBoolean) return str === 'true'
	return str
}

export const trimString = (str: string): string => {
	return str.replace(/^\s*/, '').replace(/\s*$/, '')
}

export default convertCsvToObject
