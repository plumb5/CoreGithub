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
    public class DLSmsBulkSentTimeSplitDynamicContentSQL : CommonDataBaseInteraction, IDLSmsBulkSentTimeSplitDynamicContent
    {
        CommonInfo connection;

        public DLSmsBulkSentTimeSplitDynamicContentSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSmsBulkSentTimeSplitDynamicContentSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
       
        public async Task<List<SmsBulkSentTimeSplit>> GetBulkSMSSendingIds(Int16 SendStatus)
        {
            string storeProcCommand = "select * from SmsBulkSentTime_SplitDynamicContent(@Action,@SendStatus)";
            object? param = new { Action= "GetBulkSMSSendingIds", SendStatus };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<SmsBulkSentTimeSplit>(storeProcCommand, param)).ToList();

        }

        public async Task<List<SmsSent>> GetDetailsForMessageUpdate(int SmsSendingSettingId)
        {
            string storeProcCommand = "select * from SmsBulkSentTime_SplitDynamicContent(@Action,@SmsSendingSettingId)";
            object? param = new {Action= "GetDetailsForMessageUpdate", SmsSendingSettingId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<SmsSent>(storeProcCommand, param)).ToList();

        }

        public void UpdateMessageContent(DataTable AllData)
        {
            string commandName = "SmsBulkSentTime_SplitDynamicContent";
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

        public void DeleteMessageContent(DataTable AllData)
        {
            string commandName = "SmsBulkSentTime_SplitDynamicContent";
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
