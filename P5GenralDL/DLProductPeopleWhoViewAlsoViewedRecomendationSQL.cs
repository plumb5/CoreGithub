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
    public class DLProductPeopleWhoViewAlsoViewedRecomendationSQL : CommonDataBaseInteraction, IDLProductPeopleWhoViewAlsoViewedRecomendation
    {

        CommonInfo connection;

        public DLProductPeopleWhoViewAlsoViewedRecomendationSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLProductPeopleWhoViewAlsoViewedRecomendationSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<IEnumerable<ProductPeopleWhoViewAlsoViewedRecomendation>> GetProductRecomendationList(List<string> ProductIdList = null)
        {
            string ProductIdLists = ProductIdList != null ? string.Join(",", ProductIdList.Select(x => string.Format("'{0}'", x)).ToList()) : null;
            string storeProcCommand = "ProductPeople_WhoViewAlsoViewedRecomendation";
            object? param = new
            {   Action = "Get",
                ProductIdLists
            };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<ProductPeopleWhoViewAlsoViewedRecomendation>(storeProcCommand, param, commandType: CommandType.StoredProcedure);

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
