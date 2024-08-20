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
    internal class DLContactImportFromFileSQL : CommonDataBaseInteraction, IDLContactImportFromFile
    {
        CommonInfo conn;
        public DLContactImportFromFileSQL(int adsId)
        {
            conn = GetDBConnection(adsId);
        }

        public DLContactImportFromFileSQL(string connectionString)
        {
            conn = new CommonInfo() { Connection = connectionString };
        }

        public void ImportData(DataTable dt, int Contact_ImportOverviewId)
        {
            string commandName = "Contact_ImportFrom_File";
            SqlConnection connection = new SqlConnection(conn.Connection);
            try
            {
                using (SqlCommand command = new SqlCommand())
                {
                    connection.Open();
                    command.Connection = connection;
                    command.CommandText = commandName;
                    command.CommandType = CommandType.StoredProcedure;
                    command.CommandTimeout = int.MaxValue;
                    command.Parameters.Add("@Action", SqlDbType.VarChar).Value = "SaveData";
                    command.Parameters.Add("@ContactImportOverviewIds", SqlDbType.Int).Value = Contact_ImportOverviewId;
                    command.Parameters.Add("@AllData", SqlDbType.Structured).Value = dt;

                    command.ExecuteNonQuery();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                connection.Close();
            }
        }

        public async Task<DataSet> StartImport(int Contact_ImportOverviewId, ContactMergeConfiguration mergeConfiguration)
        {
            string storeProcCommand = "Contact_ImportFrom_File";
            object? param = new { Action = "StartImport", Contact_ImportOverviewId, mergeConfiguration.PrimaryEmail, mergeConfiguration.PrimarySMS, mergeConfiguration.AlternateEmail, mergeConfiguration.AlternateSMS };

            using var db = GetDbConnection(conn.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param, commandTimeout: int.MaxValue, commandType: CommandType.StoredProcedure);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        public async Task<DataSet> GetImportResult(int Contact_ImportOverviewId, ContactMergeConfiguration mergeConfiguration)
        {
            return await Task.FromResult(new DataSet());
        }

        public async Task<DataSet> SaveGroupRejectedandLMSRejected(int Contact_ImportOverviewId)
        {
            return await Task.FromResult(new DataSet());

        }

        public async Task ImportRejectedResults(int Contact_ImportOverviewId, int GroupImportOverViewId, int LmsGroupImportOverViewId)
        {
            await Task.FromResult(new DataSet());
        }

        public async Task<int> DeleteImportResult()
        {
            return await Task.FromResult(0);
        }

        public async Task<int> DeleteTempData()
        {
            return await Task.FromResult(0);
        }

        #region Dispose Method
        bool disposed;
        protected virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {
                    conn = null;
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

