import validator from '../src/validator';
const Validator = new validator();
Validator.config = {
    a: ['isEmpty'],
    b: ['isArrayEmpty'],
    c: ['isInt'],
    d: ['isName'],
    e: ['isEmail'],
    f: ['isPw']
};


describe('Validator Tool', () => {

    test('validator base', () => {
        expect(Validator.isSubmit({ a: '' })).toBe(false);
        expect(Validator.isSubmit({ a: '123' })).toBe(true);

        expect(Validator.isSubmit({ b: '' })).toBe(false);
        expect(Validator.isSubmit({ b: [] })).toBe(false);
        expect(Validator.isSubmit({ b: [123] })).toBe(true);

        expect(Validator.isSubmit({ c: '' })).toBe(false);
        expect(Validator.isSubmit({ c: 1.23 })).toBe(false);
        expect(Validator.isSubmit({ c: 123 })).toBe(true);

        expect(Validator.isSubmit({ d: '' })).toBe(false);
        expect(Validator.isSubmit({ d: 'a123' })).toBe(true);

        expect(Validator.isSubmit({ e: 'a123' })).toBe(false);
        expect(Validator.isSubmit({ e: 'a123@qq.com' })).toBe(true);

        expect(Validator.isSubmit({ f: '123123' })).toBe(false);
        expect(Validator.isSubmit({ f: 'aasdf123@qq_com' })).toBe(true);
    });

    test('validator collect', () => {
        expect(Validator.isSubmit({
            a: '123',
            b: '',
            c: 123
        })).toBe(false);

        expect(Validator.isSubmit({
            a: '123',
            b: [123],
            c: 123
        })).toBe(true);
    });

    test('validator clear', () => {
        Validator.isSubmit({
            a: '123',
            b: [123],
            c: 123
        });
        Validator.clear();
        expect(Validator.result).toStrictEqual({});
    });

});
