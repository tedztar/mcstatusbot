import { beaver } from './consoleLogging';
import { getServerStatus } from './getServerStatus';
import { renameChannels } from './renameChannels';

export default async (job) => {
	const server = job.data.server;
	const statusChannel = job.data.statusChannel;
	const playersChannel = job.data.playersChannel;

	let serverStatus;

	try {
		serverStatus = await getServerStatus(server);
	} catch (error) {
		if (!server.ip.includes('_')) {
			beaver.log(
				'update-servers',
				'Error pinging Minecraft server while updating servers',
				JSON.stringify({
					'Server IP': server.ip
				}),
				error
			);
		}
	}

	const channels = [
		{ object: statusChannel, type: 'status' },
		{ object: playersChannel, type: 'players' }
	];

	await renameChannels(channels, serverStatus, 'low_priority');
};
