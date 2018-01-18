import { parse } from '../converter'

describe('parse', () => {
	test('convert csv to object', async () => {
		const input = `a,b,c
1,2,3`

		expect(parse(input)).toEqual([
			{
				a: 1,
				b: 2,
				c: 3
			}
		])
	})

	test('convert boolean string to boolean', async () => {
		const input = `a,b,c
true,false,3`

		expect(parse(input)).toEqual([
			{
				a: true,
				b: false,
				c: 3
			}
		])
	})

	test('return empty array when first parameter is ""', async () => {
		const input = ``

		expect(parse(input)).toEqual([])
	})

	test('trim space and tab before and after string', async () => {
		const input = `a, b,   c
1	,2 , 3 2`

		expect(
			parse(input, {
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

describe('parse using tab for separator', () => {
	test('convert tsv to object', async () => {
		const input = `a	b	c
1	2	3`

		expect(
			parse(input, {
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

describe('parse using trim option', () => {
	test('should not trim space and tab before and after string', async () => {
		const input = `a, b,   c
1	,2 , 3 2`

		expect(
			parse(input, {
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

describe('parse using convertNumber option', () => {
	test('should not convert number value to Number', async () => {
		const input = `a, b, c
1, 2, 3`

		expect(
			parse(input, {
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

describe('parse using convertBoolean option', () => {
	test('should not convert boolean value to boolean', async () => {
		const input = `a, b, c
1, true, false` 

		expect(
			parse(input, {
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

describe('parse using keys option', () => {
	test('use keys option for key insteadof firstline', async () => {
		const input = `a, b, c
1, true, false` 

		expect(
			parse(input, {
				keys: ["aaa", "bbb", "ccc"]
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

describe('parse using type option', () => {
	test('return array insteadof object if type is "array"', async () => {
		const input = `a, b, c
1, true, false` 

		expect(
			parse(input, {
				type: 'array'
			})
		).toEqual([
			['a', 'b', 'c'],
			[1, true, false]
		])
	})
})