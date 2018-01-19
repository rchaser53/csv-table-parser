import { parser } from '../parser'

describe('parser', () => {
	test('parse csv to object', async () => {
		const input = `a,b,c
1,2,3`

		expect(parser(input)).toEqual([
			{
				a: 1,
				b: 2,
				c: 3
			}
		])
	})

	test('parse boolean string to boolean', async () => {
		const input = `a,b,c
true,false,3`

		expect(parser(input)).toEqual([
			{
				a: true,
				b: false,
				c: 3
			}
		])
	})

	test('return empty array when first parameter is ""', async () => {
		const input = ``

		expect(parser(input)).toEqual([])
	})

	test('trim space and tab before and after string', async () => {
		const input = `a, b,   c
1	,2 , 3 2`

		expect(
			parser(input, {
				trim: true
			})
		).toEqual([
			{
				a: 1,
				b: 2,
				c: '3 2'
			}
		])
	})
})

describe('parser using tab for separator', () => {
	test('parse tsv to object', async () => {
		const input = `a	b	c
1	2	3`

		expect(
			parser(input, {
				separator: '\t',
				trim: false
			})
		).toEqual([
			{
				a: 1,
				b: 2,
				c: 3
			}
		])
	})
})

describe('parser using trim option', () => {
	test('should not trim space and tab before and after string', async () => {
		const input = `a, b,   c
1	,2 , 3 2`

		expect(
			parser(input, {
				trim: false,
				convertNumber: false
			})
		).toEqual([
			{
				a: '1	',
				' b': '2 ',
				'   c': ' 3 2'
			}
		])
	})
})

describe('parser using parseNumber option', () => {
	test('should not parse number value to Number', async () => {
		const input = `a, b, c
1, 2, 3`

		expect(
			parser(input, {
				convertNumber: false
			})
		).toEqual([
			{
				a: '1',
				b: '2',
				c: '3'
			}
		])
	})
})

describe('parser using parseBoolean option', () => {
	test('should not convert boolean value to boolean', async () => {
		const input = `a, b, c
1, true, false`

		expect(
			parser(input, {
				convertBoolean: false
			})
		).toEqual([
			{
				a: 1,
				b: 'true',
				c: 'false'
			}
		])
	})
})

describe('parser using keys option', () => {
	test('use keys option for key insteadof firstline', async () => {
		const input = `a, b, c
1, true, false`

		expect(
			parser(input, {
				keys: ['aaa', 'bbb', 'ccc']
			})
		).toEqual([
			{
				aaa: 'a',
				bbb: 'b',
				ccc: 'c'
			},
			{
				aaa: 1,
				bbb: true,
				ccc: false
			}
		])
	})
})

describe('parser using type option', () => {
	test('return array insteadof object if type is "array"', async () => {
		const input = `a, b, c
1, true, false`

		expect(
			parser(input, {
				type: 'array'
			})
		).toEqual([['a', 'b', 'c'], [1, true, false]])
	})
})

describe('parser using default option', () => {
	test('return default value if value is null or undefined', async () => {
		const input = `a, b, c
1, true, 
, 2, 3
4, ,5`

		expect(
			parser(input, {
				defaultValue: 'default value'
			})
		).toEqual([
			{ a: 1, b: true, c: 'default value'},
			{ a: 'default value', b: 2, c: 3},
			{ a: 4, b: 'default value', c: 5},
		])
	})
})