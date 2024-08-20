using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using Dapper;

namespace P5GenralDL
{
    public class DLMobilePushTemplatePG : CommonDataBaseInteraction, IDLMobilePushTemplate
    {
        CommonInfo connection = null;
        public DLMobilePushTemplatePG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }
        public DLMobilePushTemplatePG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> Save(MobilePushTemplate mobilePushTemplate)
        {
            string storeProcCommand = "select mobilepush_template_save(@UserInfoUserId, @CampaignId, @TemplateName, @TemplateDescription, @NotificationType, @Title, @MessageContent, @SubTitle, @ImageURL, @Button1Name, @Button1ActionType, @Button1ActionURL, @Button1ClickKeyPairValue, @Button2Name, @Button2ActionType, @Button2ActionURL, @Button2ClickKeyPairValue, @ClickActionType, @ClickActionURL, @ClickKeyPairValue, @Button1IosActionURL, @Button1IosClickKeyPairValue, @Button2IosActionURL, @Button2IosClickKeyPairValue, @ClickIosActionURL, @ClickIosKeyPairValue)";
            object? param = new { mobilePushTemplate.UserInfoUserId, mobilePushTemplate.CampaignId, mobilePushTemplate.TemplateName, mobilePushTemplate.TemplateDescription, mobilePushTemplate.NotificationType, mobilePushTemplate.Title, mobilePushTemplate.MessageContent, mobilePushTemplate.SubTitle, mobilePushTemplate.ImageURL, mobilePushTemplate.Button1Name, mobilePushTemplate.Button1ActionType, mobilePushTemplate.Button1ActionURL, mobilePushTemplate.Button1ClickKeyPairValue, mobilePushTemplate.Button2Name, mobilePushTemplate.Button2ActionType, mobilePushTemplate.Button2ActionURL, mobilePushTemplate.Button2ClickKeyPairValue, mobilePushTemplate.ClickActionType, mobilePushTemplate.ClickActionURL, mobilePushTemplate.ClickKeyPairValue, mobilePushTemplate.Button1IosActionURL, mobilePushTemplate.Button1IosClickKeyPairValue, mobilePushTemplate.Button2IosActionURL, mobilePushTemplate.Button2IosClickKeyPairValue, mobilePushTemplate.ClickIosActionURL, mobilePushTemplate.ClickIosKeyPairValue };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param);
        }

        public async Task<bool> Update(MobilePushTemplate mobilePushTemplate)
        {
            string storeProcCommand = "select mobilepush_template_update(@Id, @TemplateName, @TemplateDescription, @NotificationType, @Title, @MessageContent, @SubTitle, @ImageURL, @Button1Name, @Button1ActionType, @Button1ActionURL, @Button1ClickKeyPairValue, @Button2Name, @Button2ActionType, @Button2ActionURL, @Button2ClickKeyPairValue, @ClickActionType, @ClickActionURL, @ClickKeyPairValue, @Button1IosActionURL, @Button1IosClickKeyPairValue, @Button2IosActionURL, @Button2IosClickKeyPairValue, @ClickIosActionURL, @ClickIosKeyPairValue)";
            object? param = new { mobilePushTemplate.Id, mobilePushTemplate.TemplateName, mobilePushTemplate.TemplateDescription, mobilePushTemplate.NotificationType, mobilePushTemplate.Title, mobilePushTemplate.MessageContent, mobilePushTemplate.SubTitle, mobilePushTemplate.ImageURL, mobilePushTemplate.Button1Name, mobilePushTemplate.Button1ActionType, mobilePushTemplate.Button1ActionURL, mobilePushTemplate.Button1ClickKeyPairValue, mobilePushTemplate.Button2Name, mobilePushTemplate.Button2ActionType, mobilePushTemplate.Button2ActionURL, mobilePushTemplate.Button2ClickKeyPairValue, mobilePushTemplate.ClickActionType, mobilePushTemplate.ClickActionURL, mobilePushTemplate.ClickKeyPairValue, mobilePushTemplate.Button1IosActionURL, mobilePushTemplate.Button1IosClickKeyPairValue, mobilePushTemplate.Button2IosActionURL, mobilePushTemplate.Button2IosClickKeyPairValue, mobilePushTemplate.ClickIosActionURL, mobilePushTemplate.ClickIosKeyPairValue };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param) > 0;
        }

        public async Task<MobilePushTemplate> GetDetailsByName(string TemplateName)
        {
            string storeProcCommand = "select *  from mobilepush_template_gettemplatebyname(@TemplateName)";
            object? param = new { TemplateName };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MobilePushTemplate>(storeProcCommand, param);
        }

        public async Task<MobilePushTemplate> GetArchiveTemplate(string TemplateName)
        {
            string storeProcCommand = "select *  from mobilepush_template_getarchivetemplate(@TemplateName)";
            object? param = new { TemplateName };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MobilePushTemplate>(storeProcCommand, param);
        }

        public async Task<bool> UpdateArchiveStatus(int Id)
        {
            string storeProcCommand = "select *  from mobilepush_template_updatearchivestatus(@Id)";
            object? param = new { Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param) > 0;
        }

        public async Task<int> GetMaxCount(MobilePushTemplate mobilepushTemplate)
        {
            string storeProcCommand = "select * from mobilepush_template_maxcount(@Id, @CampaignId)";
            object? param = new { mobilepushTemplate.Id, mobilepushTemplate.CampaignId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param);
        }

        public async Task<List<MobilePushTemplate>> GetAllTemplates(MobilePushTemplate mobilepushTemplate, int OffSet = 0, int FetchNext = 0)
        {
            string storeProcCommand = "select *  from mobilepush_template_get(@TemplateName, @CampaignId, @OffSet, @FetchNext)";
            object? param = new { mobilepushTemplate.TemplateName, mobilepushTemplate.CampaignId, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MobilePushTemplate>(storeProcCommand, param)).ToList();
        }
        public async Task<MobilePushTemplate?> GetDetails(MobilePushTemplate mobilepushTemplate)
        {
            string storeProcCommand = "select *  from mobilepush_template_get(@Id)";
            object? param = new { mobilepushTemplate.Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MobilePushTemplate?>(storeProcCommand, param);
        }

        public async Task<bool> Delete(int Id)
        {
            string storeProcCommand = "select mobilepush_template_delete(@Id)";
            object? param = new { Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param) > 0;
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


