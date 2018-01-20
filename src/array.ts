import { FixedOptions, IgnoreRowConditions } from './interface'
import { shapeData } from './shape'

export const convertCsvToArray = (rows: string[], options: FixedOptions): any[][] => {
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

export const isIgnoreRowDataArray = (keys: string[], rowDataArray: any[], ignoreRow: IgnoreRowConditions): boolean => {
	const { lackElements } = ignoreRow
	return lackElements && rowDataArray.length < keys.length
}
