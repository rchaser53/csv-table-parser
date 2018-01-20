import isNumber = require('is-number')

export interface AnyObject {
	[key: string]: any
}

export interface IgnoreRowConditions {
	lackElements: boolean
}

export interface Options {
	separator?: string
	keys?: string[]
	type?: 'object' | 'array'
	trim?: boolean
	convertNumber?: boolean
	convertBoolean?: boolean
	defaultValue?: string
	ignoreRow?: IgnoreRowConditions
}

export interface FixedOptions {
	separator: string
	keys: string[]
	type: 'object' | 'array'
	trim: boolean
	convertNumber: boolean
	convertBoolean: boolean
	defaultValue: string
	ignoreRow: IgnoreRowConditions
}

export type CreateRows = (obj: AnyObject, elem: any, index: number) => AnyObject

const DefaultOptions: FixedOptions = {
	separator: ',',
	keys: [],
	type: 'object',
	trim: true,
	convertNumber: true,
	convertBoolean: true,
	defaultValue: '',
	ignoreRow: {
		lackElements: true
	}
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
	const { separator, ignoreRow } = options

	if (rows.length === 0) return [[]]
	const firstRow = (rows.shift() as any).split(separator).map((elem: any) => shapeData(elem, options))

	const remainingRow = rows.reduce<any[][]>((stack, next) => {
		const rowDataArray = next.split(separator).reduce<any[]>((stack, elem) => {
			return stack.concat([shapeData(elem, options)])
		}, [])
		return isIgnoreRowDataArray(firstRow, rowDataArray, ignoreRow) ? stack : stack.concat([rowDataArray])
	}, [])
	return [firstRow].concat(remainingRow)
}

export const shapeData = (str: string, options: FixedOptions): any => {
	const { trim } = options
	const value = trim ? trimString(str) : str
	return convertStringToCorrectType(value, options)
}

export const isIgnoreRowDataArray = (keys: string[], rowDataArray: any[], ignoreRow: IgnoreRowConditions): boolean => {
	const { lackElements } = ignoreRow
	return lackElements && rowDataArray.length < keys.length
}

export const convertCsvToObject = (tsvString: string, options: FixedOptions): AnyObject => {
	const { separator, keys: optionKeys, ignoreRow } = options

	const rows = tsvString.split('\n')
	const isUsedOptionKeys = 0 < optionKeys.length
	const keys = isUsedOptionKeys ? optionKeys : (rows.shift() || '').split(separator)
	const createRow = createObjectRowFactory(keys, options)

	return rows.reduce<AnyObject[]>((stack, next) => {
		const values = next.split(separator)
		const rowDataObject = values.reduce<AnyObject>(createRow, {})

		return isIgnoreRowDataObject(keys, rowDataObject, ignoreRow) ? stack : stack.concat(rowDataObject)
	}, [])
}

export const isIgnoreRowDataObject = (
	keys: string[],
	rowDataObject: AnyObject,
	ignoreRow: IgnoreRowConditions
): boolean => {
	const { lackElements } = ignoreRow
	return lackElements && Object.keys(rowDataObject).length < keys.length
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
	if (str === 'null') return null
	if (str === 'undefined') return undefined
	return str === '' ? defaultValue : str
}

export const trimString = (str: string): string => {
	return str.replace(/^\s*/, '').replace(/\s*$/, '')
}

export default parser
