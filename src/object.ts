import { FixedOptions, AnyObject, IgnoreRowConditions, CreateRows } from './interface'

import { trimString, convertStringToCorrectType } from './shape'

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
