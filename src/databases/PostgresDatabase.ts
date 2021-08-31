import { BotDatabaseInterface, CommandSearchInputs } from "./BotDatabaseInterface";
import { Connection } from "postgresql-client";
export class PostgresDatabase implements BotDatabaseInterface {
	PostgresDatabase() {
		const connection = new Connection(process.env.PGURI);
	}

	getMessage(inputs: CommandSearchInputs): string {
		throw new Error("Method not implemented.");
	}
}