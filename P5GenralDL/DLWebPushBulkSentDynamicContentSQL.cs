using Dapper;
using DBInteraction;
using Microsoft.Data.SqlClient;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLWebPushBulkSentDynamicContentSQL : CommonDataBaseInteraction, IDLWebPushBulkSentDynamicContent
    {
        CommonInfo connection;
        public DLWebPushBulkSentDynamicContentSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLWebPushBulkSentDynamicContentSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<List<WebPushSendingSetting>> GetBulkpushSendingSettingList(int SendStatus)
        {
            string storeProcCommand = "WebPush_BulkSentDynamicContent";
            object? param = new { Action = "GetBulkWebPushSendingIds", SendStatus };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<WebPushSendingSetting>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }

        public async Task<List<WebPushBulkSent>> GetDetailsForMessageUpdate(int WebPushSendingSettingId)
        {
            string storeProcCommand = "WebPush_BulkSentDynamicContent";
            object? param = new { Action = "GetDetailsForMessageUpdate", WebPushSendingSettingId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<WebPushBulkSent>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();

        }

        public async Task UpdateMessageContent(DataTable AllData)
        {
            string commandName = "WebPush_BulkSentDynamicContent";
            SqlConnection SqlConnections = new SqlConnection(connection.Connection);
            try
            {
                using (SqlCommand command = new SqlCommand())
                {
                    SqlConnections.Open();
                    command.Connection = SqlConnections;
                    command.CommandText = commandName;
                    command.CommandType = CommandType.StoredProcedure;
                    command.CommandTimeout = 600;
                    command.Parameters.Add("@Action", SqlDbType.VarChar).Value = "UpdateMessageContent";
                    command.Parameters.Add("@AllMessageContent", SqlDbType.Structured).Value = AllData;

                    command.ExecuteNonQuery();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                SqlConnections.Close();
            }
        }

        public async Task DeleteMessageContent(DataTable AllData)
        {
            string commandName = "WebPush_BulkSentDynamicContent";
            SqlConnection SqlConnections = new SqlConnection(connection.Connection);
            try
            {
                using (SqlCommand command = new SqlCommand())
                {
                    SqlConnections.Open();
                    command.Connection = SqlConnections;
                    command.CommandText = commandName;
                    command.CommandType = CommandType.StoredProcedure;
                    command.CommandTimeout = 600;
                    command.Parameters.Add("@Action", SqlDbType.VarChar).Value = "DeleteMessageContent";
                    command.Parameters.Add("@AllMessageContent", SqlDbType.Structured).Value = AllData;

                    command.ExecuteNonQuery();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                SqlConnections.Close();
            }
        }
    }
}
