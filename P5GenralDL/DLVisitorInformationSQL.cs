using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using System.Data;

namespace P5GenralDL
{
    public class DLVisitorInformationSQL : CommonDataBaseInteraction, IDLVisitorInformation
    {
        CommonInfo connection;

        public DLVisitorInformationSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLVisitorInformationSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<List<VisitorInformation>> GetList(VisitorInformation VisitorInformation)
        {
            string storeProcCommand = "VisitorInformation_Details";
            object? param = new { Action = "GetList", VisitorInformation.ContactId, VisitorInformation.MachineId };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<VisitorInformation>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }

        public async Task<VisitorInformation?> Get(VisitorInformation VisitorInformation)
        {
            string storeProcCommand = "VisitorInformation_Details";
            object? param = new { Action = "Get", VisitorInformation.ContactId, VisitorInformation.MachineId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<VisitorInformation?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<MLVisitorInformation?> GetContactDetails(MLVisitorInformation VisitorInformation)
        {
            string storeProcCommand = "VisitorInformation_Details";
            object? param = new { Action = "GetContactDetails", VisitorInformation.MachineId, VisitorInformation.EmailId, VisitorInformation.PhoneNumber, VisitorInformation.DeviceId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLVisitorInformation?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
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
