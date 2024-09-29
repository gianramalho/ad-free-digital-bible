import { useSQLiteContext } from "expo-sqlite";
import { versionsDataType } from "./services.types";

export function VersionsServices() {
    const database = useSQLiteContext()

    async function list() {
        try {
            const query = "SELECT * FROM versions";
            const response = await database.getAllAsync<versionsDataType>(query);

            return response;

        } catch (error) {
            console.error('Erro ao buscar versões:', error);
            return [];
        }
    }

    return { list }
}
