using Dapper;
using DBInteraction;
using IP5GenralDL;
using Newtonsoft.Json;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLPhoneCallCallerIdExtensionPG : CommonDataBaseInteraction, IDLPhoneCallCallerIdExtension
    {
        CommonInfo connection = null;
        public DLPhoneCallCallerIdExtensionPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLPhoneCallCallerIdExtensionPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(PhoneCallCallerIdExtension PhoneCallCallerIdExtension)
        {
            string storeProcCommand = "select phonecall_calleridextension_save(@Id, @UserInfoUserId, @PhoneNumber, @CallerId, @Extension)";

            object? param = new { PhoneCallCallerIdExtension.Id, PhoneCallCallerIdExtension.UserInfoUserId, PhoneCallCallerIdExtension.PhoneNumber, PhoneCallCallerIdExtension.CallerId, PhoneCallCallerIdExtension.Extension };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }
         
        public async Task<IEnumerable<PhoneCallCallerIdExtension>> GetList()
        {
            string storeProcCommand = "select * from phonecall_calleridextension_getlist()";
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<PhoneCallCallerIdExtension>(storeProcCommand);
        }

        public async Task<PhoneCallCallerIdExtension?>  GetByPhone(string PhoneNumber)
        {
            string storeProcCommand = "select * from phonecall_calleridextension_getbyphone(@PhoneNumber)";
            object? param = new { PhoneNumber };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<PhoneCallCallerIdExtension?>(storeProcCommand, param);
        }
        public async Task<bool>  DeleteAll()
        {
            string storeProcCommand = "select phonecall_calleridextension_deleteall()";
             
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand)>0;
        }

        public async Task<bool>  DeleteByCallerIdValue(int Id)
        {
            string storeProcCommand = "select phonecall_calleridextension_deletebycallerid(@Id)";
            object? param = new { Id };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param)>0;
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
                    connection = null;
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
