import { FixedOptions, IgnoreRowConditions, CreateColumns } from './interface'
import { shapeData } from './shape'

export const convertCsvToArray = (rows: string[], options: FixedOptions): any[][] => {
	const { separator, ignoreRow } = options
	const rowElmentFactory = createColumnsFactory(options)
	if (rows.length === 0) return [[]]
	const firstRow = ((rows.shift() as any).split(separator) as string[]).reduce<string[]>(rowElmentFactory, [])

	const remainingRow = rows.reduce<any[][]>((stack, next) => {
		const rowDataArray = next.split(separator).reduce<any[]>(rowElmentFactory, [])
		return isIgnoreRowDataArray(firstRow, rowDataArray, ignoreRow) ? stack : stack.concat([rowDataArray])
	}, [])
	return [firstRow].concat(remainingRow)
}

export const createColumnsFactory = (options: FixedOptions): CreateColumns => {
	const { startColumn } = options
	return (stack, elem, index) => {
		if (index < startColumn) return stack
		return stack.concat([shapeData(elem, options)])
	}
}

export const isIgnoreRowDataArray = (keys: string[], rowDataArray: any[], ignoreRow: IgnoreRowConditions): boolean => {
	const { lackElements } = ignoreRow
	return lackElements && rowDataArray.length < keys.length
}
