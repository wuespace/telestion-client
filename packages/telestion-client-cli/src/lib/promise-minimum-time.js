/**
 *
 * @param promise
 * @param minDuration
 */
module.exports = async function makePromiseLastAtLeast(promise, minDuration) {
	return (
		await Promise.all([
			promise,
			new Promise(resolve => setTimeout(resolve, minDuration))
		])
	)[0];
};
