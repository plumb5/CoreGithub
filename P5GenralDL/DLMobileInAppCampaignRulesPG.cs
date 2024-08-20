using Dapper;
using DBInteraction;
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
    public class DLMobileInAppCampaignRulesPG : CommonDataBaseInteraction, IDLMobileInAppCampaignRules
    {
        CommonInfo connection;
        public DLMobileInAppCampaignRulesPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMobileInAppCampaignRulesPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<bool> Save(MobileInAppCampaignRules rulesData)
        {
            var settings = new JsonSerializerSettings();
            settings.ContractResolver = new LowercaseContractResolver();
            var jsondata = JsonConvert.SerializeObject(rulesData, Formatting.Indented, settings);
            string storeProcCommand = "select * from mobileinappcampaign_rules_save(@InAppCampaignId,@jsondataset)";
            object? param = new { rulesData.InAppCampaignId, jsondataset = jsondata.Replace("{", "[{").Replace("}", "}]") };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        public async Task<MobileInAppCampaignRules?> Get(int InAppCampaignId)
        {
            string storeProcCommand = "select * from mobileinappcampaign_rules_get(@InAppCampaignId)";
            object? param = new { InAppCampaignId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MobileInAppCampaignRules?>(storeProcCommand, param);

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
