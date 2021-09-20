import { BotDatabaseInterface, CommandSearchInputs } from "./BotDatabaseInterface";
import { Client } from "pg";
import { textSpanContainsPosition } from "typescript";
export class PostgresDatabase implements BotDatabaseInterface {
	client: Client = new Client({
		//connectionString: process.env.PGURI,
		user: process.env.PGUSER,
		host: process.env.PGHOST,
		database: process.env.PGDATABASE,
		password: process.env.PGPASSWORD,
		port: Number(process.env.PGPORT),
		ssl: { rejectUnauthorized: false }
	});

	PostgresDatabase() {

	}

	async getMessage(inputs: CommandSearchInputs): Promise<string> {
		this.client.connect();
		console.log(this.client);
		console.log(process.env.PGDATABASE);
		//TODO: figure out if user is mod
		//# TODO: use regex instead of like so that you can match on mixed case versions of the string.
		console.log(inputs);
		let query = `
            SELECT entry_value FROM COMMAND_LIST WHERE server_id='${inputs.guild?.id}' AND command_string='${inputs.command}'`;
		if (inputs.search) {
			query +=
				` AND entry_value ILIKE '${inputs.search}'`
		}
		query += " ORDER BY RANDOM() LIMIT 1;"
		console.log(query);
		let result = await this.client.query(query, (err, res) => {
			console.log(err, res);
			this.client.end();
		});
		console.log(result);

		return "test";
	}

}