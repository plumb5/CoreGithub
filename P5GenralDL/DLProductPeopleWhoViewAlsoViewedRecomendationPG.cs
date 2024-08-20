using Dapper;
using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    internal class DLProductPeopleWhoViewAlsoViewedRecomendationPG : CommonDataBaseInteraction, IDLProductPeopleWhoViewAlsoViewedRecomendation
    {

        CommonInfo connection;

        public DLProductPeopleWhoViewAlsoViewedRecomendationPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLProductPeopleWhoViewAlsoViewedRecomendationPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<IEnumerable<ProductPeopleWhoViewAlsoViewedRecomendation>>   GetProductRecomendationList(List<string> ProductIdList = null)
        {
            string ProductIdLists = ProductIdList != null ? string.Join(",", ProductIdList.Select(x => string.Format("'{0}'", x)).ToList()) : null;
            string storeProcCommand = "select * from productpeople_whoviewalsoviewedrecomendation_get()";
            object? param = new
            {
                ProductIdLists
            };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<ProductPeopleWhoViewAlsoViewedRecomendation>(storeProcCommand, param);
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
