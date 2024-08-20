using Dapper;
using DBInteraction;
using IP5GenralDL;
using Newtonsoft.Json;
using Npgsql;
using NpgsqlTypes;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLSmsBulkSentTimeSplitDynamicContentPG : CommonDataBaseInteraction, IDLSmsBulkSentTimeSplitDynamicContent
    {
        CommonInfo connection;

        public DLSmsBulkSentTimeSplitDynamicContentPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLSmsBulkSentTimeSplitDynamicContentPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<List<SmsBulkSentTimeSplit>> GetBulkSMSSendingIds(Int16 SendStatus)
        {
            string storeProcCommand = "select * from smsbulksenttime_splitdynamiccontent_getbulksmssendingids(@SendStatus)";
            object? param = new { SendStatus };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<SmsBulkSentTimeSplit>(storeProcCommand, param)).ToList();

        }

        public async Task<List<SmsSent>> GetDetailsForMessageUpdate(int SmsSendingSettingId)
        {
            string storeProcCommand = "select * from smsbulksenttime_splitdynamiccontent_getdetailsformessageupdate(@SmsSendingSettingId)";
            object? param = new { SmsSendingSettingId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<SmsSent>(storeProcCommand, param)).ToList();

        }

        public void UpdateMessageContent(DataTable AllData)
        {
            string commandName = "smsbulksenttime_splitdynamiccontent_updatemessagecontent";
            NpgsqlConnection SqlConnections = new NpgsqlConnection(connection.Connection);
            try
            {
                using (NpgsqlCommand command = new NpgsqlCommand())
                {
                    SqlConnections.Open();
                    command.Connection = SqlConnections;
                    command.CommandText = commandName;
                    command.CommandType = CommandType.StoredProcedure;
                    command.CommandTimeout = 600;
                    command.Parameters.Add("@_allmessagecontent", NpgsqlDbType.Json).Value = JsonConvert.SerializeObject(AllData);

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
            string commandName = "smsbulksenttime_splitdynamiccontent_deletemessagecontent";
            NpgsqlConnection SqlConnections = new NpgsqlConnection(connection.Connection);
            try
            {
                using (NpgsqlCommand command = new NpgsqlCommand())
                {
                    SqlConnections.Open();
                    command.Connection = SqlConnections;
                    command.CommandText = commandName;
                    command.CommandType = CommandType.StoredProcedure;
                    command.CommandTimeout = 600;
                    command.Parameters.Add("@_allmessagecontent", NpgsqlDbType.Json).Value = JsonConvert.SerializeObject(AllData);

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
