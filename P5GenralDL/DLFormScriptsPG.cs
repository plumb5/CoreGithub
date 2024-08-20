using Dapper;
using DBInteraction;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLFormScriptsPG : CommonDataBaseInteraction, IDLFormScripts
    {
        CommonInfo connection;
        public DLFormScriptsPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLFormScriptsPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> Save(FormScripts formScripts)
        {
            string storeProcCommand = "select * from form_script_save(@FormId, @FormType, @FormScript, @Description, @FormScriptStatus, @FormScriptType, @ConfigurationDetails, @PageUrl, @AlternatePageUrls)";
            object? param = new { formScripts.FormId, formScripts.FormType, formScripts.FormScript, formScripts.Description, formScripts.FormScriptStatus, formScripts.FormScriptType, formScripts.ConfigurationDetails, formScripts.PageUrl, formScripts.AlternatePageUrls };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }

        public async Task<bool> Update(FormScripts formScripts)
        {
            string storeProcCommand = "select * from form_scrip_update(@Id, @FormId, @FormType, @FormScript, @Description, @FormScriptType, @ConfigurationDetails, @PageUrl, @AlternatePageUrls)";
            object? param = new { formScripts.Id, formScripts.FormId, formScripts.FormType, formScripts.FormScript, formScripts.Description, formScripts.FormScriptType, formScripts.ConfigurationDetails, formScripts.PageUrl, formScripts.AlternatePageUrls };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }

        public async Task<bool> ToogleStatus(int Id, bool FormScriptStatus)
        {
            string storeProcCommand = "select * from form_script_updatestatus(@Id, @FormScriptStatus)";
            object? param = new { Id, FormScriptStatus };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        public async Task<bool> Delete(int Id)
        {
            string storeProcCommand = "select * from form_script_delete(@Id)";
            object? param = new { Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        public async Task<int> GetMaxCount(MLFormScripts formScripts)
        {
            string storeProcCommand = "select * from form_script_getmaxcount(@FormId, @FormType, @FormScriptStatus, @FormScriptType, @Id, @PageUrl, @FormIdentifier)";
            object? param = new { formScripts.FormId, formScripts.FormType, formScripts.FormScriptStatus, formScripts.FormScriptType, formScripts.Id, formScripts.PageUrl, formScripts.FormIdentifier };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }

        public async Task<List<MLFormScripts>> Get(MLFormScripts formScripts, int OffSet, int FetchNext)
        {
            string storeProcCommand = "select * from form_script_getscriptdetails(formScripts.FormId,@FormType,@FormScriptStatus,@FormScriptType,@Id,@PageUrl, @OffSet, @FetchNext,@FormIdentifier)";
            object? param = new { formScripts.FormId, formScripts.FormType, formScripts.FormScriptStatus, formScripts.FormScriptType, formScripts.Id, formScripts.PageUrl, OffSet, FetchNext, formScripts.FormIdentifier };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLFormScripts>(storeProcCommand, param)).ToList();

        }

        public async Task<List<FormScripts>> GetBasedOnURL(FormScripts formScripts)
        {
            string storeProcCommand = "select * from form_script_getscriptdetails(@PageUrl, @FormScriptStatus)";
            object? param = new { formScripts.PageUrl, formScripts.FormScriptStatus };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<FormScripts>(storeProcCommand, param)).ToList();

        }

        public async Task<FormScripts?> GetDetail(FormScripts formScripts)
        {
            string storeProcCommand = "select * from form_script_get(@FormId, @FormType, @FormScriptType, @Id, @PageUrl)";
            object? param = new { formScripts.FormId, formScripts.FormType, formScripts.FormScriptType, formScripts.Id, formScripts.PageUrl };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<FormScripts?>(storeProcCommand, param);

        }

        public async Task<bool> UpdateAlternateUrl(int FormId, string AlternatePageUrls)
        {
            string storeProcCommand = "select * from form_script_updatealternateurl(@FormId, @AlternatePageUrls)";
            object? param = new { FormId, AlternatePageUrls };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

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
