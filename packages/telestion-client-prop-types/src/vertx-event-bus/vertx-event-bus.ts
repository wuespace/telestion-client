import PropTypes from 'prop-types';
import { EventBus } from '@wuespace/vertx-event-bus';

/**
 * PropType for an event bus instance
 *
 * See {@link @wuespace/vertx-event-bus#EventBus}
 * for further information.
 *
 * For more information about using PropTypes,
 * see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 *
 * @see {@link @wuespace/vertx-event-bus#EventBus}
 * @see {@link https://reactjs.org/docs/typechecking-with-proptypes.html}
 */
export const eventBusPropType = PropTypes.instanceOf(EventBus);
