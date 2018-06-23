const test = require('ava')

const save = require('.')

const proxyquire = require('proxyquire')

test('should throw error [operation different than current service]', async t => {
    const error = await t.throws(save({}, 'connapp.alpha.view.events'))

    t.is(error.message, 'Current service is difference than procedure. Check the URI')
})

test('should throw error [model not found]', async t => {
    const save = proxyquire('.', { mongoose: { models: {} } })
    const error = await t.throws(save({}, 'connapp.alpha.save.events'))

    t.is(error.message, 'Model events not initialized or not found')
})

test('should fail [error on operation]', async t => {
    t.plan(6)

    const payload = {
        _id: true,
        field1: true,
        field2: true,
    }

    const procedure = 'connapp.alpha.save.events'

    const save = proxyquire('.', {
        mongoose: {
            models: {
                events: {
                    async findOneAndUpate(query, set, options) {
                        t.deepEqual(query, { _id: payload._id })
                        t.deepEqual(set, {
                            $set: {
                                field1: payload.field1,
                                field2: payload.field2,
                            },
                        })

                        t.deepEqual(options, { new: true })

                        throw new Error('This is a operation error')
                    },
                },
            },
        },
    })

    const { status, document, message } = await save({ data: payload }, procedure)

    t.is(status, 'fail')
    t.deepEqual(document, payload)
    t.is(message, 'This is a operation error')
})

test('should update [existing id]', async t => {
    t.plan(6)

    const payload = {
        _id: true,
        field1: true,
        field2: true,
    }

    const procedure = 'connapp.alpha.save.events'

    const save = proxyquire('.', {
        mongoose: {
            models: {
                events: {
                    async findOneAndUpate(query, set, options) {
                        t.deepEqual(query, { _id: payload._id })
                        t.deepEqual(set, {
                            $set: {
                                field1: payload.field1,
                                field2: payload.field2,
                            },
                        })

                        t.deepEqual(options, { new: true })

                        return payload
                    },
                },
            },
        },
    })

    const { status, document, message } = await save({ data: payload }, procedure)

    t.is(status, 'success')
    t.deepEqual(document, payload)
    t.is(message, 'Document updated successfully')
})

test('should save [no id]', async t => {
    t.plan(4)

    const payload = {
        field1: true,
        field2: true,
    }

    const procedure = 'connapp.alpha.save.events'

    class events {
        constructor(data) {
            t.deepEqual(data, {
                field1: payload.field1,
                field2: payload.field2,
            })
        }

        async save() {
            return {
                field1: payload.field1,
                field2: payload.field2,
            }
        }
    }
    const save = proxyquire('.', { mongoose: { models: { events } } })

    const { status, document, message } = await save({ data: payload }, procedure)

    t.is(status, 'success')
    t.deepEqual(document, payload)
    t.is(message, 'Document saved successfully')
})
