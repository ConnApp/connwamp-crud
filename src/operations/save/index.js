const mongoose = require('mongoose')
const currentService = __dirname.split('/').pop()

module.exports = async function service_save(payload, procedure) {
    const { data } = payload

    // connapp.alpha.save.events
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

    let result

    try {
        const { _id, ...$set } = data

        const operation = _id
            ? Model.findOneAndUpate({ _id }, { $set }, { new: true })
            : new Model(data).save()

        const savedDocument = await operation

        result = {
            status: 'success',
            document: savedDocument,
            message: `Document ${_id ? 'updated' : 'saved'} successfully`,
        }
    } catch (error) {
        result = {
            status: 'fail',
            document: data,
            message: error.message,
        }
    }

    return result
}
