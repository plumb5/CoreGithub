using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using Dapper;
using System.Data;

namespace P5GenralDL
{
    public class DLFormBannerLoadClickCountSQL : CommonDataBaseInteraction, IDLFormBannerLoadClickCount
    {
        CommonInfo connection = null;
        public DLFormBannerLoadClickCountSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLFormBannerLoadClickCountSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }
        public void SaveUpdateForImpression(int FormBannerId)
        {
            string storeProcCommand = "Form_BannerLoadClickCount";
            object? param = new { @Action = "SaveUpdateForImpression", FormBannerId };

            using var db = GetDbConnection(connection.Connection);
            db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        public void UpdateFormResponse(int FormBannerId)
        {
            string storeProcCommand = "Form_BannerLoadClickCount";
            object? param = new { @Action = "UpdateFormResponse", FormBannerId };

            using var db = GetDbConnection(connection.Connection);
            db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
        public void UpdateFormClose(int FormBannerId)
        {
            string storeProcCommand = "Form_BannerLoadClickCount";
            object? param = new { @Action = "UpdateFormClose", FormBannerId };

            using var db = GetDbConnection(connection.Connection);
            db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }
    }
}



