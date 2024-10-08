﻿using DBInteraction;
using IP5GenralDL;
using Newtonsoft.Json;
using P5GenralML;
using Dapper;

namespace P5GenralDL
{
    public class DLChatRulePG : CommonDataBaseInteraction, IDLChatRule
    {
        CommonInfo connection = null;
        public DLChatRulePG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }
        public DLChatRulePG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<bool> Save(ChatRule rulesData)
        {
            List<ChatRule> rules = new List<ChatRule>();
            rules.Add(rulesData);
            var settings = new JsonSerializerSettings();
            settings.ContractResolver = new LowercaseContractResolver();
            var rulesjson = JsonConvert.SerializeObject(rules, Formatting.Indented, settings);

            string storeProcCommand = "select * from chat_rules_save(@Rulesjson)";
            object? param = new { rulesjson };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param) > 0;
        }
        
        public async Task<ChatRule?> Get(int ChatId)
        {
            string storeProcCommand = "select * from chat_rules_get(@ChatId)";
            object? param = new { ChatId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<ChatRule>(storeProcCommand, param);
        }

        public async Task<ChatRule?> GetRawRules(int ChatId)
        {
            string storeProcCommand = "select * from chat_rules_getrawrules(@ChatId)";
            object? param = new { ChatId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<ChatRule>(storeProcCommand, param);
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
