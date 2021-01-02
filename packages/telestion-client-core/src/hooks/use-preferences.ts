import { ReactNode } from 'react';
import create from 'zustand';

import { JsonSerializable } from '../types/json-serializable';

/**
 * the "name" of the preference
 */
export type Selector = string;

/**
 * Renders a React node that
 */
export type RendererFunction = (
	preference: JsonSerializable,
	setPreference: (newPreference: JsonSerializable) => void
) => ReactNode;

export type PreferencesState = {
	/**
	 * Stores the registered preferences as selector-value pair.
	 *
	 * To add, update and remove the preference use {@link update}.
	 *
	 * @example```ts
	 * const preference = usePreferences(state => state.preferences['selector']);
	 *
	 * return <div>{preferences}</div>;
	 * ```
	 */
	preferences: Record<Selector, JsonSerializable>;

	/**
	 * Stores the registered renderers for the preference.
	 *
	 * To add, update and remove the renderer use {@link updateRenderer}.
	 *
	 * @example```ts
	 * import shallow from 'zustand/shallow';
	 *
	 * const renderer = usePreferences(state => state.renderer['selector']);
	 * const { preference, update } = usePreferences(state => ({
	 *   preference: state.preferences['selector'],
	 *   update: state.update
	 * }), shallow);
	 *
	 * return (
	 *   <div>
	 *     {renderer(preference, newPref => update('selector', newPref)}
	 *   </div>
	 * );
	 * ```
	 */
	renderer: Record<Selector, RendererFunction>;

	/**
	 * Adds, updates or removes a preference from the preference store.
	 *
	 * The selector specifies the "storage" space
	 * where the preference will be stored.
	 *
	 * If the preference is `undefined`
	 * the "storage" space will be cleared
	 * and the preference removed from the store.
	 *
	 * @param selector the "storage" space and accessor of the preference
	 * @param newPreference the new value for the preference
	 * if `undefined` the preference will be removed
	 *
	 * @example```ts
	 * const update = usePreferences(state => state.update);
	 *
	 * return (
	 * 	 <button onClick={() => update('selector', 'Hey there!')}>
	 * 	   Set Preference for 'selector'
	 * 	 </button>
	 * );
	 */
	update: (
		selector: Selector,
		newPreference: JsonSerializable | undefined
	) => void;

	/**
	 * Adds, updates or removes a preference renderer from the renderer store.
	 *
	 * The selector specifies the "storage" space
	 * where the renderer will be stored.
	 *
	 * If the renderer is `undefined`
	 * the "storage" space will be cleared
	 * and the renderer removed from the store.
	 *
	 * @param selector the "storage" space and accessor of the preference
	 * @param newRenderer the new renderer function for the preference
	 * if `undefined` the renderer will be removed
	 *
	 * @example```ts
	 * const updateRenderer = usePreferences(state => state.updateRenderer);
	 *
	 * const renderer = (data, update) => (
	 *   <TextInput initialValue={data} onSubmit={update} />
	 * );
	 *
	 * return (
	 *   <button onClick={() => updateRenderer('selector', renderer)}>
	 *     Set Renderer for 'selector'
	 *   </button>
	 * );
	 * ```
	 */
	updateRenderer: (
		selector: Selector,
		newRenderer: RendererFunction | undefined
	) => void;
};

export const usePreferences = create<PreferencesState>((set, get) => ({
	preferences: {},
	renderer: {},
	update: (selector, newPreference) => {
		const newPreferences = { ...get().preferences, [selector]: newPreference };

		if (typeof newPreference === 'undefined') {
			// remove preference from store
			delete newPreferences[selector];
		}

		set({ preferences: newPreferences });
	},
	updateRenderer: (selector, newRenderer) => {
		const newRenderers = { ...get().renderer, [selector]: newRenderer };

		if (typeof newRenderer === 'undefined') {
			// remove preference from store
			delete newRenderers[selector];
		}

		set({ renderer: newRenderers });
	}
}));
