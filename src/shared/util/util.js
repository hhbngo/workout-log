export const awaitPop = async (action, callback, ...params) => {
    try {
        const success = await action(...params);
        return callback(success);
    } catch (error) {
        return callback(null, error);
    }
}
