const mongoose = require('mongoose')
const currentService = __dirname.split('/').pop()

module.exports = async function service_delete(payload, procedure) {
    const { data, soft = true } = payload

    // connapp.alpha.save.events
    const [
        appConcern, // eslint-disable-line
        apiVersion, // eslint-disable-line
        operation,
        model,
    ] = procedure.split('.')

    if (operation !== currentService)
        throw new Error('Current service is difference than procedure. Check the URI')

    const Model = mongoose.models[model]

    if (!Model) throw new Error(`Model ${model} not initialized or not found`)

    let result

    try {
        const { _id } = data

        if (soft) {
            await Model.findOneAndUpate({ _id }, { $set: { __deleted: true } })
        } else {
            const document = await Model.findOne({ _id })

            await document.remove()
        }

        result = {
            status: 'success',
            document: data,
            message: 'Document deleted successfully',
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
