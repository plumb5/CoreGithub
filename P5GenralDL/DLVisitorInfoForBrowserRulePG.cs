using Dapper;
using DBInteraction;
using IP5GenralDL;
using Microsoft.Data.SqlClient;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLVisitorInfoForBrowserRulePG : CommonDataBaseInteraction, IDLVisitorInfoForBrowserRule
    {
        private CommonInfo _connection = null;
        public DLVisitorInfoForBrowserRulePG(int adsId)
        {
            _connection = GetDBConnection(adsId);
        }

        public DLVisitorInfoForBrowserRulePG(string connectionString)
        {
            _connection = new CommonInfo() { Connection = connectionString };
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="MachineId"></param>
        /// <returns></returns>
        public async Task<List<int>> ResponseFormList(string MachineId)
        {
            List<int> FormIdList = new List<int>();
            string storeProcCommand = "select * from forms_sp_allformsloading_responseformlist(@MachineId)";
            object? param = new { MachineId };

            using var db = GetDbConnection(_connection.Connection);
            using var reader = await db.ExecuteReaderAsync(storeProcCommand, param);

            while (reader.Read())
            {
                FormIdList.Add(Convert.ToInt32(reader["FormId"]));
            }

            return FormIdList;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="MachineId"></param>
        /// <param name="FormId"></param>
        /// <returns></returns>
        public async Task<DataSet> FormLeadDetailsAnswerDependency(string MachineId, int FormId)
        {
            DataSet ds = new DataSet();
            string storeProcCommand = "select * from forms_sp_allformsloading_responseleaddata(@MachineId, @FormId)";
            object? param = new { MachineId, FormId };

            using var db = GetDbConnection(_connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="MachineId"></param>
        /// <param name="FormId"></param>
        /// <returns></returns>
        public async Task<short> GetFormImpression(string MachineId, int FormId)
        {
            string storeProcCommand = "select forms_sp_allformsloading_formimpression(@MachineId, @FormId)";
            object? param = new { MachineId, FormId };

            using var db = GetDbConnection(_connection.Connection);
            return await db.ExecuteScalarAsync<short>(storeProcCommand, param);
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="MachineId"></param>
        /// <param name="FormId"></param>
        /// <returns></returns>
        public async Task<short> GetFormCloseCount(string MachineId, int FormId)
        {
            string storeProcCommand = "select forms_sp_allformsloading_formclosecount(@MachineId, @FormId)";
            object? param = new { MachineId, FormId };

            using var db = GetDbConnection(_connection.Connection);
            return await db.ExecuteScalarAsync<short>(storeProcCommand, param);
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="MachineId"></param>
        /// <param name="FormId"></param>
        /// <returns></returns>
        public async Task<short?> GetFormResponseCount(string MachineId, int FormId)
        {
            string storeProcCommand = "select forms_sp_allformsloading_formresponsecount(@MachineId, @FormId)";
            object? param = new { MachineId, FormId };

            using var db = GetDbConnection(_connection.Connection);
            return await db.ExecuteScalarAsync<short?>(storeProcCommand, param);
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="EmailId"></param>
        /// <returns></returns>
        public async Task<byte> OnlineSentimentIs(string EmailId)
        {
            if (!String.IsNullOrEmpty(EmailId))
            {
                string storeProcCommand = "select formrules_engauageandq5_onlinesentimentis(@EmailId)";
                object? param = new { EmailId };

                using var db = GetDbConnection(_connection.Connection);
                return await db.ExecuteScalarAsync<byte>(storeProcCommand, param);
            }
            return 0;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="ContactId"></param>
        /// <returns></returns>
        public async Task<short> NurtureStatusIs(int ContactId)
        {
            if (ContactId > 0)
            {
                string storeProcCommand = "select forms_sp_allformsloading_nurturestatusis(@ContactId)";
                object? param = new { ContactId };

                using var db = GetDbConnection(_connection.Connection);
                return await db.ExecuteScalarAsync<short>(storeProcCommand, param);
            }
            return 0;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="ContactId"></param>
        /// <returns></returns>
        public async Task<short> LoyaltyPoints(int ContactId)
        {
            if (ContactId > 0)
            {
                string storeProcCommand = "select formrules_engauageandq5_loyaltypoints(@ContactId)";
                object? param = new { ContactId };

                using var db = GetDbConnection(_connection.Connection);
                return await db.ExecuteScalarAsync<short>(storeProcCommand, param);
            }
            return 0;
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="ContactId"></param>
        /// <returns></returns>
        public async Task<byte> ConnectedSocially(int ContactId)
        {
            if (ContactId > 0)
            {
                string storeProcCommand = "select formrules_engauageandq5_connectedsocially(@ContactId)";
                object? param = new { ContactId };

                using var db = GetDbConnection(_connection.Connection);
                return await db.ExecuteScalarAsync<byte>(storeProcCommand, param);
            }
            return 0;
        }

        #region Dispose Method

        private bool _disposed = false;
        /// <summary>
        /// 
        /// </summary>
        /// <param name="disposing"></param>
        protected void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                _disposed = true;
                if (disposing)
                {
                    _connection = null;
                }
            }
        }

        public void Dispose()
        {
            Dispose(true);
        }

        #endregion End of Dispose Method
    }
}
