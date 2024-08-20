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
    public class DLFormRulesPG : CommonDataBaseInteraction, IDLFormRules
    {
        CommonInfo connection = null;
        public DLFormRulesPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLFormRulesPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<bool>  Save(FormRules rulesData)
        {
            List<FormRules> rules = new List<FormRules>();
            rules.Add(rulesData);
            var settings = new JsonSerializerSettings();
            settings.ContractResolver = new LowercaseContractResolver();
            var rulesjson = JsonConvert.SerializeObject(rules, Formatting.Indented, settings);

            string storeProcCommand = "select form_rules_save(@rulesjson)"; 
            object? param = new { rulesjson };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param)>0;
        }

        public async Task<FormRules?>  Get(int FormId)
        {
            string storeProcCommand = "select * from form_rules_get(@FormId)"; 
            object? param = new { FormId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<FormRules?>(storeProcCommand, param);
        }

        public async Task<FormRules?> GetRawRules(int FormId)
        {
            string storeProcCommand = "select * from form_rules_getrawrules(@FormId)";
            object? param = new { FormId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<FormRules?>(storeProcCommand, param);
        }

        #region Dispose Method
        bool disposed;
        protected virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {
                }
            }
            disposed = true;
        }
        public void Dispose()
        {
            Dispose(true);
        }
        #endregion End of Dispose Method
    }
}
