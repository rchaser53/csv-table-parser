export type CreateRows = (obj: AnyObject, elem: any, index: number) => AnyObject

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
	startRow?: number
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
	startRow: number
}
