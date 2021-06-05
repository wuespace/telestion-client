import {
	Cell,
	Column,
	Row,
	Table as RSTable,
	TableBody,
	TableHeader
} from '@react-spectrum/table';
import { EventBus } from '@wuespace/vertx-event-bus';
import { buildDetails } from './build-details';

// We need these because they provide the CSS classes used above.
// These CSS classes also update on a color scheme change,
// so we don't have to worry about that.
// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
const cssLoader = (
	<RSTable aria-label="none">
		<TableHeader columns={[]}>
			{column => <Column>{column}</Column>}
		</TableHeader>
		<TableBody items={[]}>
			{item => <Row key={item}>{key => <Cell>{item[key]}</Cell>}</Row>}
		</TableBody>
	</RSTable>
);

/**
 * React Props of {@link DetailsTable}
 *
 * For more information about React Props, please look here:
 * {@link https://reactjs.org/docs/components-and-props.html}
 *
 * @see {@link DetailsTable}
 * @see {@link https://reactjs.org/docs/components-and-props.html}
 */
export interface DetailsTableProps {
	eventBus: EventBus;
	error: string | null;
	isQuiet?: boolean;
}

/**
 * Renders the details table which displays details
 * of the given eventbus connection.
 *
 * @param eventBus - the current eventbus instance
 * @param error - optional error message
 * if something gone wrong on connection setup or teardown
 * @param isQuiet - when `true`, renders a quiet table
 *
 * @example
 * ```tsx
 * const { eventBus, error } = useEventBus(selector, shallow);
 *
 * return (
 * 	<View width="100%" overflow="auto">
 * 		<DetailsTable eventBus={eventBus} error={error} isQuiet />
 * 	</View>
 * );
 * ```
 */
export function DetailsTable({
	eventBus,
	error,
	isQuiet = false
}: DetailsTableProps) {
	const details = buildDetails(eventBus, error);

	return (
		<table
			className={
				isQuiet ? '_spectrum-Table--quiet_60175' : '_spectrum-Table_60175'
			}
			style={{ width: '100%' }}
		>
			<thead>
				<tr>
					<th
						className="_spectrum-Table-headCell_60175"
						style={{ textAlign: 'left' }}
					>
						Name
					</th>
					<th
						className="_spectrum-Table-headCell_60175"
						style={{ textAlign: 'right' }}
					>
						Value
					</th>
				</tr>
			</thead>

			<tbody className="_spectrum-Table-body_60175">
				{details.map((detail, index) => (
					// eslint-disable-next-line react/no-array-index-key
					<tr key={index} className="_spectrum-Table-row_60175">
						<td className="_spectrum-Table-cell_60175">{detail.name}</td>
						<td
							className="_spectrum-Table-cell_60175"
							style={{ textAlign: 'right' }}
						>
							{detail.value}
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
