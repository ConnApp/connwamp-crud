module.exports = function ensureIsInt(number, defaultValue, customCondition = () => true) {
    const parsed = parseInt(number)

    if (Number.isNaN(parsed) || !customCondition(parsed)) {
        return defaultValue
    }

    return parsed
}
