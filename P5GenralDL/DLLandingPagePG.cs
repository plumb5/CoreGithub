using Dapper;
using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLLandingPagePG : CommonDataBaseInteraction, IDLLandingPage
    {
        CommonInfo connection;
        public DLLandingPagePG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLLandingPagePG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<Int32> Save(LandingPage landingPage)
        {
            string storeProcCommand = "select landing_page_save(@UserInfoUserId, @UserGroupId, @PageName, @PageDescription, @LandingPageConfigurationId, @IsBeeTemplate, @IsTemplateSaved)";
            object? param = new { landingPage.UserInfoUserId, landingPage.UserGroupId, landingPage.PageName, landingPage.PageDescription, landingPage.LandingPageConfigurationId, landingPage.IsBeeTemplate, landingPage.IsTemplateSaved };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param);
        }

        public async Task<bool> Update(LandingPage landingPage)
        {
            string storeProcCommand = "select landing_page_update(@Id, @UserInfoUserId, @UserGroupId, @PageName, @PageDescription,@LandingPageConfigurationId, @IsBeeTemplate, @IsTemplateSaved)";
            object? param = new { landingPage.Id, landingPage.UserInfoUserId, landingPage.UserGroupId, landingPage.PageName, landingPage.PageDescription, landingPage.LandingPageConfigurationId, landingPage.IsBeeTemplate, landingPage.IsTemplateSaved };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<bool>(storeProcCommand, param);
        }
        public async Task<bool> UpdateIsTemplateSaved(LandingPage landingPage)
        {
            string storeProcCommand = "select landing_page_updateistemplatesaved(@Id, @IsTemplateSaved)";
            object? param = new { landingPage.Id, landingPage.IsTemplateSaved };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<bool>(storeProcCommand, param);
        }

        public async Task<int> MaxCount(LandingPage landingPage)
        {
            string storeProcCommand = "select landing_page_maxcount(@PageName)";
            object? param = new { landingPage.PageName };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<Int32>(storeProcCommand, param);
        }

        public async Task<List<MLLandingPage>> GetDetails(MLLandingPage landingPage, int FetchNext, int OffSet)
        {
            string storeProcCommand = "select * from landing_page_getlist(@PageName, @FetchNext, @OffSet)";
            object? param = new { landingPage.PageName, FetchNext, OffSet };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLLandingPage>(storeProcCommand, param)).ToList();
        }
        public async Task<LandingPage?> GetSingle(LandingPage landingPage)
        {
            string storeProcCommand = "select * from landing_page_get(@Id)";
            object? param = new { landingPage.Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<LandingPage?>(storeProcCommand, param);
        }

        public async Task<bool> Delete(int Id)
        {
            string storeProcCommand = "select * from landing_page_get(@Id)";
            object? param = new { Id };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<bool>(storeProcCommand, param);
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

