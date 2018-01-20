import { FixedOptions, Options, AnyObject } from './interface'

import { convertCsvToArray } from './array'
import { convertCsvToObject } from './object'

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

export default parser
