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
				}
			]
		},
		{
			name: 'Special',
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
				}
			]
		}
	]
};

export default userDashboards;
