/**
 * @param {PromiseLike<T>|T|Promise<unknown>} promise
 * @param {number} minDuration
 */
async function makePromiseLastAtLeast(promise, minDuration) {
	return (
		await Promise.all([
			promise,
			new Promise(resolve => setTimeout(resolve, minDuration))
		])
	)[0];
}

module.exports = makePromiseLastAtLeast;
