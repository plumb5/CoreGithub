using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System.Data;
using Dapper;

namespace P5GenralDL
{
    public class DLMailTemplateAttachmentSQL : CommonDataBaseInteraction, IDLMailTemplateAttachment
    {
        CommonInfo connection = null;
        public DLMailTemplateAttachmentSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMailTemplateAttachmentSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> Save(MailTemplateAttachment mailAttachment)
        {
            string storeProcCommand = "select * from mail_templateattachment_save(@MailTemplateId, @AttachmentFileName, @FileSize, @AttachmentResponseId, @AttachmentFileType, @AttachmentFileContent)";
            object? param = new { mailAttachment.MailTemplateId, mailAttachment.AttachmentFileName, mailAttachment.FileSize, mailAttachment.AttachmentResponseId, mailAttachment.AttachmentFileType, mailAttachment.AttachmentFileContent };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param, commandType: CommandType.StoredProcedure);
        }

        public List<MailTemplateAttachment> GetAttachments(int MailTemplateId)
        {
            string storeProcCommand = "select *  from mail_templateattachment_getlist(@MailTemplateId)";
            object? param = new { MailTemplateId };

            using var db = GetDbConnection(connection.Connection);
            return (db.Query<MailTemplateAttachment>(storeProcCommand, param, commandType: CommandType.StoredProcedure)).ToList();
        }
        public async Task<bool> Delete(int MailTemplateId, int MailAttachmentId)
        {
            string storeProcCommand = "select mail_templateattachment_delete(@MailAttachmentId)";
            object? param = new { MailAttachmentId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int16>(storeProcCommand, param, commandType: CommandType.StoredProcedure) > 0;
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

