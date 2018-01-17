import {
    convertCsvToObject
} from '..'
  
  
  describe('convertCsvToObject', () => {
    test('convert csv to object', async() => {
        const input = `a,b,c
1,2,3`
   
      expect(convertCsvToObject(input)).toEqual([
          {
              a: '1', b: '2', c: '3'
          }
      ])
    });
  });