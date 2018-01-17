import isNumber = require('is-number')

export interface AnyObject {
	[key: string]: any
}

export interface Options {
	trim?: boolean
	separator?: string
	convertNumber?: boolean
}

export interface FixedOptions {
	trim: boolean
	separator: string
	convertNumber: boolean
}

export type CreateRows = (obj: AnyObject, elem: any, index: number) => AnyObject

const DefaultOptions = {
	trim: true,
	separator: ',',
	convertNumber: true
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
	const { trim, convertNumber } = fixedOptions
	return (obj, elem, index) => {
		const key = trim ? trimString(keys[index]) : keys[index]
		const value = trim ? trimString(elem) : elem
		obj[key] = isNumber(value) && convertNumber ? parseInt(value) : value
		return obj
	}
}

export const trimString = (str: string): string => {
	return str.replace(/^\s*/, '').replace(/\s*$/, '')
}
