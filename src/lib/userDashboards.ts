import Dashboard from '../model/Dashboard';

interface UserDashboards {
	[key: string]: Dashboard[];
}

const userDashboards: UserDashboards = {
	admin: [
		{
			name: 'Overview',
			items: [
				{
					cols: 2,
					rows: 2,
					widget: 'simpleWidget'
				},
				{
					cols: 1,
					rows: 2,
					widget: 'simpleWidget'
				},
				{
					cols: 1,
					rows: 4,
					widget: 'simpleWidget'
				},
				{
					cols: 3,
					rows: 2,
					widget: 'myAwesomeWidget'
				}
			]
		},
		{
			name: 'Special',
			items: [
				{
					cols: 2,
					rows: 4,
					widget: 'simpleWidget'
				},
				{
					cols: 2,
					rows: 4,
					widget: 'noWidget'
				}
			]
		}
	]
};

export default userDashboards;
