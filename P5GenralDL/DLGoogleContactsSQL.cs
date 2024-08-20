using Dapper;
using DBInteraction;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLGoogleContactsSQL : CommonDataBaseInteraction, IDLGoogleContacts
    {
        CommonInfo connection = null;
        public DLGoogleContactsSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLGoogleContactsSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> GetContactsCount(int GroupId)
        {
            string storeProcCommand = "Google_Contacts";
            object? param = new { GroupId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }

        public async Task<List<GoogleContact>> GetContacts(int GoogleImportSettingsId, int GroupId, int Offset, int FetchNext)
        {
            string storeProcCommand = "Google_Contacts";
            object? param = new { GoogleImportSettingsId, GroupId, Offset, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<GoogleContact>(storeProcCommand, param)).ToList();

        }
    }
}
