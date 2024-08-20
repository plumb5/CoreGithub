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
    public class DLControlGroupCampaignResponsesSQL : CommonDataBaseInteraction, IDLControlGroupCampaignResponses
    {
        CommonInfo connection;
        public DLControlGroupCampaignResponsesSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public async Task<List<MLControlGroupCampaignResponses>> GetControlGroupCampaignResponses(string CampaignName)
        {
            string storeProcCommand = "ControlGroups_CampaignResponse";
            object? param = new object[] { CampaignName };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLControlGroupCampaignResponses>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
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
