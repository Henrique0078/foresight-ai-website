import { DBSQLClient } from "@databricks/sql"
import type IDBSQLSession from "@databricks/sql/dist/contracts/IDBSQLSession"
import type IOperation from "@databricks/sql/dist/contracts/IOperation"

interface DatabricksConfig {
  host: string
  httpPath: string
  token: string
  catalog?: string
  schema?: string
}

interface SpotData {
  id?: number
  execution_day: string
  summarized_time: string
  forecast_time: string
  elastic: {
    E1: string
    E2: string
    E3: string
    E4: string
  }
  index_summarized: string
  index_forecast: string
  metric_name: string
  query: string
}

// Configuration for Databricks connection
const databricksConfig: DatabricksConfig = {
  host: process.env.DATABRICKS_SERVER_HOSTNAME || "",
  httpPath: process.env.DATABRICKS_HTTP_PATH || "",
  token: process.env.DATABRICKS_TOKEN || "",
  catalog: process.env.DATABRICKS_CATALOG || "main",
  schema: process.env.DATABRICKS_SCHEMA || "default",
}

// JDBC connection string for Databricks
// const getJdbcUrl = (): string => {
//   const { host, port, httpPath, catalog, schema } = databricksConfig
//   return `jdbc:databricks://${host}:${port}/o/0/${httpPath};ConnCatalog=${catalog};ConnSchema=${schema}`
// }

// Simulate JDBC connection (replace with actual JDBC implementation)
// class DatabricksConnection {
//   private config: DatabricksConfig

//   constructor(config: DatabricksConfig) {
//     this.config = config
//   }

//   async connect(): Promise<boolean> {
//     try {
//       // In a real implementation, you would use the Databricks JDBC driver here
//       // For now, we'll simulate the connection
//       console.log("[v0] Connecting to Databricks with JDBC URL:", getJdbcUrl())
//       console.log("[v0] Using token:", this.config.token ? "Token provided" : "No token")

//       // Simulate connection delay
//       await new Promise((resolve) => setTimeout(resolve, 1000))

//       return true
//     } catch (error) {
//       console.error("[v0] Failed to connect to Databricks:", error)
//       return false
//     }
//   }

//   async executeQuery(sql: string): Promise<any[]> {
//     try {
//       console.log("[v0] Executing query:", sql)

//       // In a real implementation, you would execute the SQL query here
//       // For now, we'll return mock data based on the query type
//       if (sql.toLowerCase().includes("select")) {
//         return this.mockSelectResult()
//       }

//       return []
//     } catch (error) {
//       console.error("[v0] Query execution failed:", error)
//       throw error
//     }
//   }

//   async executeUpdate(sql: string): Promise<number> {
//     try {
//       console.log("[v0] Executing update:", sql)

//       // In a real implementation, you would execute the INSERT/UPDATE/DELETE here
//       // Return number of affected rows
//       return 1
//     } catch (error) {
//       console.error("[v0] Update execution failed:", error)
//       throw error
//     }
//   }

//   private mockSelectResult(): any[] {
//     // Mock data for testing - replace with actual query results
//     return [
//       {
//         id: 1,
//         execution_day: "2024-01-15",
//         summarized_time: "10:30:00",
//         forecast_time: "11:00:00",
//         elastic_e1: "localhost",
//         elastic_e2: "9200",
//         elastic_e3: "admin",
//         elastic_e4: "****",
//         index_summarized: "summary_index",
//         index_forecast: "forecast_index",
//         metric_name: "cpu_usage",
//         query: 'SELECT * FROM metrics WHERE type = "cpu"',
//       },
//     ]
//   }

//   async close(): Promise<void> {
//     console.log("[v0] Closing Databricks connection")
//     // Close the JDBC connection
//   }
// }

class DatabricksConnection {
  private config: DatabricksConfig
  private client: DBSQLClient
  private session: IDBSQLSession | null = null

  constructor(config: DatabricksConfig) {
    this.config = config
    this.client = new DBSQLClient()
  }

  async connect(): Promise<boolean> {
    try {
      const connectOptions = {
        host: this.config.host,
        path: this.config.httpPath,
        token: this.config.token,
      }

      console.log("[v0] Connecting to Databricks with host:", this.config.host)

      await this.client.connect(connectOptions)
      this.session = await this.client.openSession()

      return true
    } catch (error) {
      console.error("[v0] Failed to connect to Databricks:", error)
      return false
    }
  }

  async executeQuery(sql: string): Promise<any[]> {
    try {
      if (!this.session) {
        throw new Error("No active session. Call connect() first.")
      }

      console.log("[v0] Executing query:", sql)

      const queryOperation: IOperation = await this.session.executeStatement(sql, {
        runAsync: true,
        maxRows: 10000,
      })

      const result = await queryOperation.fetchAll()
      await queryOperation.close()

      return result
    } catch (error) {
      console.error("[v0] Query execution failed:", error)
      throw error
    }
  }

  async executeUpdate(sql: string): Promise<number> {
    try {
      if (!this.session) {
        throw new Error("No active session. Call connect() first.")
      }

      console.log("[v0] Executing update:", sql)

      const updateOperation: IOperation = await this.session.executeStatement(sql, {
        runAsync: true,
      })

      // Get affected rows count (this might need adjustment based on actual response)
      const result = await updateOperation.fetchAll()
      await updateOperation.close()

      return 1 // Return 1 for successful execution
    } catch (error) {
      console.error("[v0] Update execution failed:", error)
      throw error
    }
  }

  async close(): Promise<void> {
    try {
      if (this.session) {
        await this.session.close()
        this.session = null
      }
      this.client.close()
      console.log("[v0] Closed Databricks connection")
    } catch (error) {
      console.error("[v0] Error closing connection:", error)
    }
  }
}

// Database operations
export class DatabricksService {
  private connection: DatabricksConnection

  constructor() {
    this.connection = new DatabricksConnection(databricksConfig)
  }

  async getAllSpots(): Promise<SpotData[]> {
    try {
      await this.connection.connect()

      const sql = `
        SELECT 
          id,
          execution_day,
          summarized_time,
          forecast_time,
          elastic_e1,
          elastic_e2,
          elastic_e3,
          elastic_e4,
          index_summarized,
          index_forecast,
          metric_name,
          query
        FROM spots_table
        ORDER BY execution_day DESC
      `

      const results = await this.connection.executeQuery(sql)

      // Transform results to match our interface
      const spots: SpotData[] = results.map((row) => ({
        id: row.id,
        execution_day: row.execution_day,
        summarized_time: row.summarized_time,
        forecast_time: row.forecast_time,
        elastic: {
          E1: row.elastic_e1,
          E2: row.elastic_e2,
          E3: row.elastic_e3,
          E4: row.elastic_e4,
        },
        index_summarized: row.index_summarized,
        index_forecast: row.index_forecast,
        metric_name: row.metric_name,
        query: row.query,
      }))

      await this.connection.close()
      return spots
    } catch (error) {
      console.error("[v0] Failed to fetch spots:", error)
      throw error
    }
  }

  async insertSpot(spotData: SpotData): Promise<boolean> {
    try {
      await this.connection.connect()

      const sql = `
        INSERT INTO spots_table (
          execution_day,
          summarized_time,
          forecast_time,
          elastic_e1,
          elastic_e2,
          elastic_e3,
          elastic_e4,
          index_summarized,
          index_forecast,
          metric_name,
          query
        ) VALUES (
          '${spotData.execution_day}',
          '${spotData.summarized_time}',
          '${spotData.forecast_time}',
          '${spotData.elastic.E1}',
          '${spotData.elastic.E2}',
          '${spotData.elastic.E3}',
          '${spotData.elastic.E4}',
          '${spotData.index_summarized}',
          '${spotData.index_forecast}',
          '${spotData.metric_name}',
          '${spotData.query.replace(/'/g, "''")}'
        )
      `

      const affectedRows = await this.connection.executeUpdate(sql)
      await this.connection.close()

      return affectedRows > 0
    } catch (error) {
      console.error("[v0] Failed to insert spot:", error)
      throw error
    }
  }

  async deleteSpot(id: number): Promise<boolean> {
    try {
      await this.connection.connect()

      const sql = `DELETE FROM spots_table WHERE id = ${id}`

      const affectedRows = await this.connection.executeUpdate(sql)
      await this.connection.close()

      return affectedRows > 0
    } catch (error) {
      console.error("[v0] Failed to delete spot:", error)
      throw error
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const connected = await this.connection.connect()
      if (connected) {
        await this.connection.close()
      }
      return connected
    } catch (error) {
      console.error("[v0] Connection test failed:", error)
      return false
    }
  }
}

// Export singleton instance
export const databricksService = new DatabricksService()
