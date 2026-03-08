import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";

export default function RootLayout() {
  return (
    <SQLiteProvider
      databaseName="notas.db"
      onInit={
        async (db) => {
          await db.execAsync(`
            CREATE TABLE IF NOT EXISTS notas (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              titulo TEXT,
              descricao TEXT,
              categoria TEXT
            );
            PRAGMA journal_mode = WAL;
          `);
        }
      }
      options={{ useNewConnection: false }}
    >
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </SQLiteProvider>
  );
}
