import { convertCsvToObject } from '../converter'

describe('convertCsvToObject', () => {
	test('convert csv to object', async () => {
		const input = `a,b,c
1,2,3`

		expect(convertCsvToObject(input)).toEqual([
			{
				a: 1,
				b: 2,
				c: 3
			}
		])
	})

	test('return empty array when first parameter is ""', async () => {
		const input = ``

		expect(convertCsvToObject(input)).toEqual([])
	})

	test('trim space and tab before and after string', async () => {
		const input = `a, b,   c
1	,2 , 3 2`

		expect(
			convertCsvToObject(input, {
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

describe('convertCsvToObject using tab for separator', () => {
	test('convert tsv to object', async () => {
		const input = `a	b	c
1	2	3`

		expect(
			convertCsvToObject(input, {
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

describe('convertCsvToObject using trim option', () => {
	test('should not trim space and tab before and after string', async () => {
		const input = `a, b,   c
1	,2 , 3 2`

		expect(
			convertCsvToObject(input, {
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

describe('convertCsvToObject using convertNumber option', () => {
	test('should not convert number value to Number', async () => {
		const input = `a, b, c
1, 2, 3`

		expect(
			convertCsvToObject(input, {
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
