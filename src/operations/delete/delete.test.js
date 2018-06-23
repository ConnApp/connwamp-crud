const test = require('ava')

const _delete = require('.')

const proxyquire = require('proxyquire')

test('should throw error [operation different than current service]', async t => {
    const error = await t.throws(_delete({}, 'connapp.alpha.view.events'))

    t.is(error.message, 'Current service is difference than procedure. Check the URI')
})

test('should throw error [model not found]', async t => {
    const _delete = proxyquire('.', { mongoose: { models: {} } })
    const error = await t.throws(_delete({}, 'connapp.alpha.delete.events'))

    t.is(error.message, 'Model events not initialized or not found')
})

test('should delete [soft delete]', async t => {
    t.plan(5)
    const payload = { _id: 'id' }

    const procedure = 'connapp.alpha.delete.events'

    const _delete = proxyquire('.', {
        mongoose: {
            models: {
                events: {
                    async findOneAndUpate(query, set) {
                        t.deepEqual(query, { _id: payload._id })

                        t.deepEqual(set, { $set: { __deleted: true } })
                    },
                },
            },
        },
    })

    const { status, document, message } = await _delete({ data: payload }, procedure)

    t.is(status, 'success')
    t.deepEqual(document, payload)
    t.is(message, 'Document deleted successfully')
})

test('should delete [hard delete]', async t => {
    t.plan(5)
    const payload = { _id: 'id' }

    const procedure = 'connapp.alpha.delete.events'

    const _delete = proxyquire('.', {
        mongoose: {
            models: {
                events: {
                    async findOne(query) {
                        t.deepEqual(query, { _id: payload._id })

                        return {
                            async remove() {
                                t.pass()
                            },
                        }
                    },
                },
            },
        },
    })

    const { status, document, message } = await _delete(
        {
            data: payload,
            soft: false,
        },
        procedure
    )

    t.is(status, 'success')
    t.deepEqual(document, payload)
    t.is(message, 'Document deleted successfully')
})

test('should throw error [fail operation]', async t => {
    t.plan(4)
    const payload = { _id: 'id' }

    const procedure = 'connapp.alpha.delete.events'

    const _delete = proxyquire('.', {
        mongoose: {
            models: {
                events: {
                    async findOne(query) {
                        t.deepEqual(query, { _id: payload._id })

                        throw new Error('This is a failed operation')
                    },
                },
            },
        },
    })

    const { status, document, message } = await _delete(
        {
            data: payload,
            soft: false,
        },
        procedure
    )

    t.is(status, 'fail')
    t.deepEqual(document, payload)
    t.is(message, 'This is a failed operation')
})
