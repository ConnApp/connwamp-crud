const test = require('ava')

const view = require('.')

const proxyquire = require('proxyquire')

test('should throw error [operation different than current service]', async t => {
    const error = await t.throws(view({}, 'connapp.alpha.save.events'))

    t.is(error.message, 'Current service is difference than procedure. Check the URI')
})

test('should throw error [model not found]', async t => {
    const view = proxyquire('.', { mongoose: { models: {} } })
    const error = await t.throws(view({}, 'connapp.alpha.view.events'))

    t.is(error.message, 'Model events not initialized or not found')
})

test.cb('should query correctly [valide inputs | with project]', t => {
    t.plan(6)

    const func = async () => {
        const payload = {
            filter: { filter: true },
            project: { id: 1 },
            skip: 10,
            limit: 10,
            sort: 'name',
            populate: 'contact',
        }

        const view = proxyquire('.', {
            mongoose: {
                models: {
                    events: {
                        find: (filter, project) => {
                            t.deepEqual(payload.filter, filter)
                            t.deepEqual(payload.project, project)

                            return {
                                skip: skip => {
                                    t.is(payload.skip, skip)
                                },
                                limit: limit => {
                                    t.is(payload.limit, limit)
                                },
                                sort: sort => {
                                    t.is(payload.sort, sort)
                                },
                                populate: populate => {
                                    t.is(payload.populate, populate)
                                },
                            }
                        },
                    },
                },
            },
        })

        await view(payload, 'connapp.alpha.view.events')
    }

    func()
        .then(() => {
            t.end()
        })
        .catch(err => {
            console.log(err)
        })
})

test.cb('should query correctly [valide inputs | without project]', t => {
    t.plan(5)

    const func = async () => {
        const payload = {
            filter: { filter: true },
            skip: 10,
            limit: 10,
            sort: 'name',
            populate: 'contact',
        }

        const view = proxyquire('.', {
            mongoose: {
                models: {
                    events: {
                        find: filter => {
                            t.deepEqual(payload.filter, filter)

                            return {
                                skip: skip => {
                                    t.is(payload.skip, skip)
                                },
                                limit: limit => {
                                    t.is(payload.limit, limit)
                                },
                                sort: sort => {
                                    t.is(payload.sort, sort)
                                },
                                populate: populate => {
                                    t.is(payload.populate, populate)
                                },
                            }
                        },
                    },
                },
            },
        })

        await view(payload, 'connapp.alpha.view.events')
    }

    func()
        .then(() => {
            t.end()
        })
        .catch(err => {
            console.log(err)
        })
})

test.cb('should query correctly [valide inputs | without skip]', t => {
    t.plan(4)

    const func = async () => {
        const payload = {
            filter: { filter: true },
            limit: 10,
            sort: 'name',
            populate: 'contact',
        }

        const view = proxyquire('.', {
            mongoose: {
                models: {
                    events: {
                        find: filter => {
                            t.deepEqual(payload.filter, filter)

                            return {
                                skip: () => {
                                    t.fail()
                                },
                                limit: limit => {
                                    t.is(payload.limit, limit)
                                },
                                sort: sort => {
                                    t.is(payload.sort, sort)
                                },
                                populate: populate => {
                                    t.is(payload.populate, populate)
                                },
                            }
                        },
                    },
                },
            },
        })

        await view(payload, 'connapp.alpha.view.events')
    }

    func()
        .then(() => {
            t.end()
        })
        .catch(err => {
            console.log(err)
        })
})

test.cb('should query correctly [valide inputs | without sort]', t => {
    t.plan(3)

    const func = async () => {
        const payload = {
            filter: { filter: true },
            limit: 10,
            populate: 'contact',
        }

        const view = proxyquire('.', {
            mongoose: {
                models: {
                    events: {
                        find: filter => {
                            t.deepEqual(payload.filter, filter)

                            return {
                                skip: () => {
                                    t.fail()
                                },
                                limit: limit => {
                                    t.is(payload.limit, limit)
                                },
                                sort: () => {
                                    t.fail()
                                },
                                populate: populate => {
                                    t.is(payload.populate, populate)
                                },
                            }
                        },
                    },
                },
            },
        })

        await view(payload, 'connapp.alpha.view.events')
    }

    func()
        .then(() => {
            t.end()
        })
        .catch(err => {
            console.log(err)
        })
})

test.cb('should query correctly [valide inputs | without populate]', t => {
    t.plan(2)

    const func = async () => {
        const payload = { filter: { filter: true } }

        const view = proxyquire('.', {
            mongoose: {
                models: {
                    events: {
                        find: filter => {
                            t.deepEqual(payload.filter, filter)

                            return {
                                skip: () => {
                                    t.fail()
                                },
                                limit: limit => {
                                    t.is(100, limit)
                                },
                                sort: () => {
                                    t.fail()
                                },
                                populate: () => {
                                    t.fail()
                                },
                            }
                        },
                    },
                },
            },
        })

        await view(payload, 'connapp.alpha.view.events')
    }

    func()
        .then(() => {
            t.end()
        })
        .catch(err => {
            console.log(err)
        })
})
