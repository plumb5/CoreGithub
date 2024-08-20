using Dapper;
using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLAdminMasterCreditPG : CommonDataBaseInteraction, IDLAdminMasterCredit
    {
        CommonInfo connection;
        public DLAdminMasterCreditPG()
        {
            connection = GetDBConnection();
        }
        public async Task<Int32> SaveDetails(AdminMasterCredit masterCredit)
        {
            string storeProcCommand = "select * from master_credit_save(@ConsumableType, @ProviderName, @CreditAllocated, @CreditConsumed, @LastModifiedByUserName, @Remarks)";
            object? param = new { masterCredit.ConsumableType, masterCredit.ProviderName, masterCredit.CreditAllocated, masterCredit.CreditConsumed, masterCredit.LastModifiedByUserName, masterCredit.Remarks };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param);
        }

        public async Task<bool> UpdateCreditConsumed(AdminMasterCredit masterCredit)
        {
            string storeProcCommand = "select * from master_credit_selectmastercredit(@CreditConsumed, @LastModifiedByUserName, @ConsumableType, @ProviderName)";
            object? param = new { masterCredit.CreditConsumed, masterCredit.LastModifiedByUserName, masterCredit.ConsumableType, masterCredit.ProviderName };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<List<AdminMasterCredit>> SelectMasterCredit(AdminMasterCredit masterCredit)
        {
            string storeProcCommand = "select * from callapi_configuration_get(@ConsumableType)";
            object? param = new { masterCredit.ConsumableType };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<AdminMasterCredit>(storeProcCommand, param)).ToList();

        }

        public async Task<List<MLAdminMasterCredit>> GetFeatureWiseMaxCount()
        {
            string storeProcCommand = "select * from master_credit_getfeaturewisemaxcount()";

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLAdminMasterCredit>(storeProcCommand)).ToList();

        }
        #region Dispose Method
        private bool _disposed = false;
        protected void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                _disposed = true;
                if (disposing)
                {

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

