import WidgetList from '../model/WidgetList';

import SimpleWidget from './SimpleWidget';
import MapWidget from './MapWidget';
import ProcedureWidget from './ProcedureWidget';
import LineGraphWidget from './LineGraphWidget';

const widgets: WidgetList = {
	simpleWidget: SimpleWidget,
	mapWidget: MapWidget,
	procedureWidget: ProcedureWidget,
	lineGraphWidget: LineGraphWidget
};

export default widgets;
