import React from 'react';
import { CircleMarker, Map, TileLayer } from 'react-leaflet';

import { MOCK_POSITION } from '../../model/Channels';

import useChannelLatest from '../hooks/useChannelLatest';
import LoadingIndicator from '../components/LoadingIndicator';

import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet.js';

export default function MapWidget() {
	const position = useChannelLatest(MOCK_POSITION);
	return (
		<LoadingIndicator dependencies={[position]}>
			{() => (
				<Map style={{ height: '100%' }} center={[67.89167, 21.08177]} zoom={6}>
					<TileLayer
						attribution='&copy;
							<a href="https://stadiamaps.com/">
								Stadia Maps
							</a>, &copy;
							<a href="https://openmaptiles.org/">
								OpenMapTiles
							</a> &copy;
							<a href="http://openstreetmap.org">
								OpenStreetMap
							</a> contributors'
						url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
					/>
					<CircleMarker center={[position.x, position.y]} radius={10} />
				</Map>
			)}
		</LoadingIndicator>
	);
}
