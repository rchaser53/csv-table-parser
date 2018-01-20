import { parser } from '../parser'
import { Options } from '../interface'

describe('parser', () => {
	describe('type object', () => {
		test('ignore rows if element length is less than keys length', async () => {
			const input = `a,b,c
true,false,3

`
			expect(parser(input)).toEqual([
				{
					a: true,
					b: false,
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

		test('parse null or undefined string to null or undefined', async () => {
			const input = `a,b,c
null, undefined, 3`
			expect(parser(input)).toEqual([
				{
					a: null,
					b: undefined,
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

		describe('parser using default option', () => {
			test('return default value if value is null or undefined', async () => {
				const input = `a, b, c
, true, 1
2, , 3
4, 5,`
				expect(
					parser(input, {
						defaultValue: 'default value'
					})
				).toEqual([
					{ a: 'default value', b: true, c: 1 },
					{ a: 2, b: 'default value', c: 3 },
					{ a: 4, b: 5, c: 'default value' }
				])
			})
		})
	})

	describe('type array', () => {
		const defaultOptions: Options = { type: 'array' }
		test('ignore rows if element length is less than first element length', async () => {
			const input = `a,b,c
1, true,false

`
			expect(parser(input, defaultOptions)).toEqual([['a', 'b', 'c'], [1, true, false]])
		})

		test('parse csv to array', async () => {
			const input = `a, b, c
1, true, false`
			expect(parser(input, defaultOptions)).toEqual([['a', 'b', 'c'], [1, true, false]])
		})

		test('parse null or undefined string to null or undefined', async () => {
			const input = `a,b,c
null, undefined, 3`
			expect(parser(input, defaultOptions)).toEqual([['a', 'b', 'c'], [null, undefined, 3]])
		})

		describe('parser using tab for separator', () => {
			test('parse tsv to array', async () => {
				const input = `a	b	c
1	2	3`
				expect(
					parser(input, {
						...defaultOptions,
						separator: '\t',
						trim: false
					})
				).toEqual([['a', 'b', 'c'], [1, 2, 3]])
			})
		})

		describe('parser using trim option', () => {
			test('should not trim space and tab before and after string', async () => {
				const input = `a, b,   c
1	,2 , 3 2`

				expect(
					parser(input, {
						...defaultOptions,
						trim: false,
						convertNumber: false
					})
				).toEqual([['a', ' b', '   c'], ['1	', '2 ', ' 3 2']])
			})
		})

		describe('parser using parseNumber option', () => {
			test('should not parse number value to Number', async () => {
				const input = `a, b, c
1, 2, 3`

				expect(
					parser(input, {
						...defaultOptions,
						convertNumber: false
					})
				).toEqual([['a', 'b', 'c'], ['1', '2', '3']])
			})
		})

		describe('parser using parseBoolean option', () => {
			test('should not convert boolean value to boolean', async () => {
				const input = `a, b, c
1, true, false`

				expect(
					parser(input, {
						...defaultOptions,
						convertBoolean: false
					})
				).toEqual([['a', 'b', 'c'], [1, 'true', 'false']])
			})
		})

		describe('parser using keys option', () => {
			test('ignore keys option', async () => {
				const input = `a, b, c
1, true, false`

				expect(
					parser(input, {
						...defaultOptions,
						keys: ['aaa', 'bbb', 'ccc']
					})
				).toEqual([['a', 'b', 'c'], [1, true, false]])
			})
		})

		describe('parser using default option', () => {
			test('return default value if value is null or undefined', async () => {
				const input = `a, b, c
, true, 1
2, , 3
4, 5,`

				expect(
					parser(input, {
						...defaultOptions,
						defaultValue: 'default value'
					})
				).toEqual([
					['a', 'b', 'c'],
					['default value', true, 1],
					[2, 'default value', 3],
					[4, 5, 'default value']
				])
			})
		})
	})
})
