import { ReactText, useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Dashboard } from '@wuespace/telestion-client-types';

export type Key = string;

export interface Item {
	key: Key;
	title: string;
}

export interface SelectState {
	items: Array<Item>;

	selected: Key;

	setSelected: (key: ReactText) => void;

	shouldRender: boolean;
}

export const emptyKey: Key = '-1';

export function useSelectState(
	dashboards: Array<Dashboard> | undefined
): SelectState {
	// gather information
	const history = useHistory();
	const { id } = useParams<{ id: Key | undefined }>();
	const [selected, setSelected] = useState<Key>(id || emptyKey);

	// sync selection with current route
	useEffect(() => {
		setSelected(id || emptyKey);
	}, [id]);

	// sync current route with selection
	useEffect(() => {
		// only change app path when not key not empty
		if (selected !== emptyKey) {
			const newPath = `/dashboard/${selected}`;
			if (history.location.pathname !== newPath) {
				history.push(newPath);
			}
		}
	}, [history, selected]);

	// build states
	const handleSelect = useCallback(
		(key: ReactText) => setSelected(key as Key),
		[]
	);

	const items: Array<Item> = useMemo(() => {
		if (dashboards) {
			return dashboards.map((dashboard, index) => ({
				key: `${index}`,
				title: dashboard.title
			}));
		}
		return [];
	}, [dashboards]);

	const shouldRender = useMemo(() => !!(dashboards && id), [dashboards, id]);

	return {
		items,
		selected,
		setSelected: handleSelect,
		shouldRender
	};
}
