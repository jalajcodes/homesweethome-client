const CracoLessPlugin = require('craco-less');
// const path = require('path');
module.exports = {
	plugins: [
		{
			plugin: CracoLessPlugin,
			options: {
				lessLoaderOptions: {
					lessOptions: {
						modifyVars: { '@primary-color': '#55ec7b' },
						javascriptEnabled: true,
					},
				},
			},
		},
	],
};
