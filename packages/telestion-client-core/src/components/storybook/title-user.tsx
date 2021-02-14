import { useTitle } from '../../hooks';

/**
 * Sample Component for Storybook stories
 *
 * @example
 * ```ts
 * <TelestionClient>
 *     <TitleUser />
 * </TelestionClient>
 * ```
 */
export function TitleUser() {
	const title = useTitle();

	return <p>Title: {title}</p>;
}
