using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using Dapper;
using System.Data;

namespace P5GenralDL
{
    public class DLMobilePushTemplateSQL : CommonDataBaseInteraction, IDLMobilePushTemplate
    {
        CommonInfo connection = null;
        public DLMobilePushTemplateSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }
        public DLMobilePushTemplateSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> Save(MobilePushTemplate mobilePushTemplate)
        {
            string storeProcCommand = "MobilePush_Template";
            object? param = new { @Action = "Save", mobilePushTemplate.UserInfoUserId, mobilePushTemplate.CampaignId, mobilePushTemplate.TemplateName, mobilePushTemplate.TemplateDescription, mobilePushTemplate.NotificationType, mobilePushTemplate.Title, mobilePushTemplate.MessageContent, mobilePushTemplate.SubTitle, mobilePushTemplate.ImageURL, mobilePushTemplate.Button1Name, mobilePushTemplate.Button1ActionType, mobilePushTemplate.Button1ActionURL, mobilePushTemplate.Button1ClickKeyPairValue, mobilePushTemplate.Button2Name, mobilePushTemplate.Button2ActionType, mobilePushTemplate.Button2ActionURL, mobilePushTemplate.Button2ClickKeyPairValue, mobilePushTemplate.ClickActionType, mobilePushTemplate.ClickActionURL, mobilePushTemplate.ClickKeyPairValue, mobilePushTemplate.Button1IosActionURL, mobilePushTemplate.Button1IosClickKeyPairValue, mobilePushTemplate.Button2IosActionURL, mobilePushTemplate.Button2IosClickKeyPairValue, mobilePushTemplate.ClickIosActionURL, mobilePushTemplate.ClickIosKeyPairValue };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> Update(MobilePushTemplate mobilePushTemplate)
        {
            string storeProcCommand = "MobilePush_Template";
            object? param = new { @Action = "Update", mobilePushTemplate.Id, mobilePushTemplate.TemplateName, mobilePushTemplate.TemplateDescription, mobilePushTemplate.NotificationType, mobilePushTemplate.Title, mobilePushTemplate.MessageContent, mobilePushTemplate.SubTitle, mobilePushTemplate.ImageURL, mobilePushTemplate.Button1Name, mobilePushTemplate.Button1ActionType, mobilePushTemplate.Button1ActionURL, mobilePushTemplate.Button1ClickKeyPairValue, mobilePushTemplate.Button2Name, mobilePushTemplate.Button2ActionType, mobilePushTemplate.Button2ActionURL, mobilePushTemplate.Button2ClickKeyPairValue, mobilePushTemplate.ClickActionType, mobilePushTemplate.ClickActionURL, mobilePushTemplate.ClickKeyPairValue, mobilePushTemplate.Button1IosActionURL, mobilePushTemplate.Button1IosClickKeyPairValue, mobilePushTemplate.Button2IosActionURL, mobilePushTemplate.Button2IosClickKeyPairValue, mobilePushTemplate.ClickIosActionURL, mobilePushTemplate.ClickIosKeyPairValue };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<MobilePushTemplate> GetDetailsByName(string TemplateName)
        {
            string storeProcCommand = "MobilePush_Template";
            object? param = new { @Action = "GetTemplateByName", TemplateName };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MobilePushTemplate>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<MobilePushTemplate> GetArchiveTemplate(string TemplateName)
        {
            string storeProcCommand = "MobilePush_Template";
            object? param = new { @Action = "GetArchiveTemplate", TemplateName };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MobilePushTemplate>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> UpdateArchiveStatus(int Id)
        {
            string storeProcCommand = "MobilePush_Template";
            object? param = new { @Action = "UpdateArchiveStatus", Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<int> GetMaxCount(MobilePushTemplate mobilepushTemplate)
        {
            string storeProcCommand = "MobilePush_Template";
            object? param = new { @Action = "MaxCount", mobilepushTemplate.Id, mobilepushTemplate.CampaignId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<List<MobilePushTemplate>> GetAllTemplates(MobilePushTemplate mobilepushTemplate, int OffSet = 0, int FetchNext = 0)
        {
            string storeProcCommand = "MobilePush_Template";
            object? param = new { @Action = "GET", mobilepushTemplate.TemplateName, mobilepushTemplate.CampaignId, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MobilePushTemplate>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }
        public async Task<MobilePushTemplate?> GetDetails(MobilePushTemplate mobilepushTemplate)
        {
            string storeProcCommand = "MobilePush_Template";
            object? param = new { @Action = "GET", mobilepushTemplate.Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MobilePushTemplate?>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> Delete(int Id)
        {
            string storeProcCommand = "MobilePush_Template";
            object? param = new { @Action = "Delete", Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteAsync(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
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



