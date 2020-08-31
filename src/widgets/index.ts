import WidgetList from '../model/dashboard/WidgetList';

import SimpleWidget from './SimpleWidget/SimpleWidget';
import MapWidget from './MapWidget/MapWidget';
import ProcedureWidget from './ProcedureWidget/ProcedureWidget';
import LineGraphWidget from './LineGraphWidget/LineGraphWidget';

const widgets: WidgetList = {
	simpleWidget: SimpleWidget,
	mapWidget: MapWidget,
	procedureWidget: ProcedureWidget,
	lineGraphWidget: LineGraphWidget
};

export default widgets;
