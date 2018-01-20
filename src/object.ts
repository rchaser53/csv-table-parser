import { FixedOptions, AnyObject, IgnoreRowConditions, CreateRows } from './interface'

import { trimString, convertStringToCorrectType, trimUnnecessaryElement } from './shape'

export const convertCsvToObject = (rows: string[], options: FixedOptions): AnyObject => {
	const { separator, ignoreRow } = options

	const keys = createKeys(rows, options)
	const createRow = createObjectRowFactory(keys, options)

	return rows.reduce<AnyObject[]>((stack, next) => {
		const values = next.split(separator)
		const rowDataObject = values.reduce<AnyObject>(createRow, {})

		return isIgnoreRowDataObject(keys, rowDataObject, ignoreRow) ? stack : stack.concat(rowDataObject)
	}, [])
}

export const createKeys = (rows: string[], options: FixedOptions): string[] => {
	const { separator, keys: optionKeys, startColumn } = options
	const isUsedOptionKeys = 0 < optionKeys.length
	const keys = isUsedOptionKeys ? optionKeys : (rows.shift() || '').split(separator)
	return trimUnnecessaryElement(keys, startColumn)
}

export const isIgnoreRowDataObject = (
	keys: string[],
	rowDataObject: AnyObject,
	ignoreRow: IgnoreRowConditions
): boolean => {
	const { lackElements } = ignoreRow
	return lackElements && Object.keys(rowDataObject).length < keys.length
}

export const createObjectRowFactory = (keys: string[], fixedOptions: FixedOptions): CreateRows => {
	const { trim, startColumn } = fixedOptions
	return (obj, elem, index) => {
		if (index < startColumn) return obj
		const actualHeaderIndex = index - startColumn
		const key = trim ? trimString(keys[actualHeaderIndex]) : keys[actualHeaderIndex]
		const value = trim ? trimString(elem) : elem
		obj[key] = convertStringToCorrectType(value, fixedOptions)
		return obj
	}
}
