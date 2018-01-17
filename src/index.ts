export interface AnyObject {
	[key: string]: any
}

export const convertCsvToObject = (tsvString: string, separator = ','): AnyObject => {
	const rows = tsvString.split('\n')
	const keys = rows.length > 0 ? (rows.shift() || '').split(separator) : []

	return rows.reduce<AnyObject[]>((stack, next) => {
		const values = next.split(separator)
		const rowDataObject = values.reduce<AnyObject>((obj, elem, index) => {
			obj[keys[index]] = elem
			return obj
		}, {})
		return stack.concat(rowDataObject)
	}, [])
}
