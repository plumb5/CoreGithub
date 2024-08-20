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
    public class DLPhoneCallCallerIdExtensionSQL : CommonDataBaseInteraction, IDLPhoneCallCallerIdExtension
    {
        CommonInfo connection = null;
    public DLPhoneCallCallerIdExtensionSQL(int adsId)
    {
        connection = GetDBConnection(adsId);
    }

    public DLPhoneCallCallerIdExtensionSQL(string connectionString)
    {
        connection = new CommonInfo() { Connection = connectionString };
    }

    public async Task<Int32> Save(PhoneCallCallerIdExtension PhoneCallCallerIdExtension)
    {
        string storeProcCommand = "PhoneCall_CallerIdExtension";

        object? param = new {Action= "Save", PhoneCallCallerIdExtension.Id, PhoneCallCallerIdExtension.UserInfoUserId, PhoneCallCallerIdExtension.PhoneNumber, PhoneCallCallerIdExtension.CallerId, PhoneCallCallerIdExtension.Extension };
        using var db = GetDbConnection(connection.Connection);
        return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
    }

    public async Task<IEnumerable<PhoneCallCallerIdExtension>> GetList()
    {
        string storeProcCommand = "PhoneCall_CallerIdExtension";
        object? param = new { Action = "GetList" };

        using var db = GetDbConnection(connection.Connection);
        return await db.QueryAsync<PhoneCallCallerIdExtension>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

    }

    public async Task<PhoneCallCallerIdExtension?> GetByPhone(string PhoneNumber)
    {
        string storeProcCommand = "PhoneCall_CallerIdExtension";
        object? param = new { Action = "GetByPhone", PhoneNumber };
        using var db = GetDbConnection(connection.Connection);
         return await db.QueryFirstOrDefaultAsync<PhoneCallCallerIdExtension?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

    }
     public async Task<bool> DeleteAll()
    {
        string storeProcCommand = "PhoneCall_CallerIdExtension"; 
        object? param = new { Action = "DeleteAll" };
        using var db = GetDbConnection(connection.Connection);
        return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
    }

    public async Task<bool> DeleteByCallerIdValue(int Id)
    {
        string storeProcCommand = "PhoneCall_CallerIdExtension)";
        object? param = new { Action = "DeleteByCallerId", Id };
        using var db = GetDbConnection(connection.Connection);
        return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure)>0;
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