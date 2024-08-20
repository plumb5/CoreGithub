using DBInteraction;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;

namespace P5GenralDL
{
    public class DLMobilePushBulkSentDynamicContent : CommonDataBaseInteraction, IDisposable
    {
        CommonInfo connection;

        public DLMobilePushBulkSentDynamicContent(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMobilePushBulkSentDynamicContent(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public List<MobilePushSendingSetting> GetBulkpushSendingSettingList(int SendStatus)
        {
            string storeProcCommand = "MobilePush_BulkSentDynamicContent";
            List<string> paramName = new List<string> { "@Action", "@SendStatus" };
            object[] objDat = { "GetBulkMobilePushSendingIds", SendStatus };

            List<string> fieldName = new List<string>() { "Id" };

            using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
            {
                return DataReaderMapToList<MobilePushSendingSetting>(Command, fieldName);
            }
        }

        public List<MobilePushBulkSent> GetDetailsForMessageUpdate(int MobilePushSendingSettingId)
        {
            string storeProcCommand = "MobilePush_BulkSentDynamicContent";
            List<string> paramName = new List<string> { "@Action", "@MobilePushSendingSettingId" };
            object[] objDat = { "GetDetailsForMessageUpdate", MobilePushSendingSettingId };
            List<string> fields = new List<string>() { "Id", "MobilePushSendingSettingId", "ContactId", "MessageContent", "Title", "SubTitle" };
            using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
            {
                return DataReaderMapToList<MobilePushBulkSent>(Command, fields);
            }
        }

        public void UpdateMessageContent(DataTable AllData)
        {
            string commandName = "MobilePush_BulkSentDynamicContent";
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
            string commandName = "MobilePush_BulkSentDynamicContent";
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


        #region Dispose Method
        bool disposed;
        protected virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {
                    connection = null;
                }
            }
            //dispose unmanaged ressources
            disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
        }

        #endregion End of Dispose Method
    }
}
