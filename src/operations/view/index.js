const mongoose = require('mongoose')
const currentService = __dirname.split('/').pop()
const ensureIsInt = require('../../utils/assert/ensureIsInt')

module.exports = async function service_view(payload, procedure) {
    // connapp.alpha.view.events
    const [
        appConcern,
        apiVersion,
        operation,
        model,
    ] = procedure.split('.')

    if (operation !== currentService)
        throw new Error('Current service is difference than procedure. Check the URI')

    const Model = mongoose.models[model]

    if (!Model) throw new Error(`Model ${model} not initialized or not found`)

    const sort = payload.sort
    const filter = payload.filter // TODO Parse filter and Default Filters
    const project = payload.project
    const populate = payload.populate

    const skip = ensureIsInt(payload.skip, 0, skip => skip > 0)
    const limit = ensureIsInt(payload.limit, 100, limit => limit > 0 && limit <= 100)

    const Query = project ? Model.find(filter, project) : Model.find(filter)

    Query.skip(skip).limit(limit)

    if (sort) Query.sort(sort)
    if (populate) Query.populate(populate)

    const result = await Query

    return result
}
