export interface AnyObject {
	[key: string]: any
}

export interface Options {
	trim?: boolean,
	separator?: string
}

export interface FixedOptions {
	trim: boolean,
	separator: string
}

const DefaultOptions = {
	trim: true,
	separator: ','
}

export const createOptions = (options: Options): FixedOptions => {
	return { ...DefaultOptions, ...options }
}

export const convertCsvToObject = (tsvString: string, options: Options = {}): AnyObject => {
	const {
		separator, trim
	} = createOptions(options)

	const rows = tsvString.split('\n')
	const keys = rows.length > 0 ? (rows.shift() || '').split(separator) : []

	return rows.reduce<AnyObject[]>((stack, next) => {
		const values = next.split(separator)
		const rowDataObject = values.reduce<AnyObject>((obj, elem, index) => {
			const key = (trim) ? trimString(keys[index]) : keys[index]
			const value = (trim) ? trimString(elem) : elem
			obj[key] = value
			return obj
		}, {})
		return stack.concat(rowDataObject)
	}, [])
}

export const trimString = (str: string): string => {
	return str.replace(/^\s*/, '').replace(/\s*$/, '')
}