const test = require('ava')

const ensureIsInt = require('./ensureIsInt')

test('should parse number [decimal]', async t => {
    const result = ensureIsInt(1.2, 5)

    t.is(result, 1)
})

test('should parse number [string]', async t => {
    const result = ensureIsInt('1.2', 5)

    t.is(result, 1)
})

test('should set default [NaN]', async t => {
    const result = ensureIsInt(false, 5)

    t.is(result, 5)
})

test('should set default [number | does not pass check]', async t => {
    const result = ensureIsInt(1, 5, value => value > 3)

    t.is(result, 5)
})

test('should set default [NaN | does pass check]', async t => {
    const result = ensureIsInt(false, 3, value => value < 3)

    t.is(result, 3)
})
