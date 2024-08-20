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
    public class DLIpligenceCityListPG : CommonDataBaseInteraction, IDLIpligenceCityList
    {
        CommonInfo connection;
        public DLIpligenceCityListPG()
        {
            connection = GetDBConnection();
        }
        public async Task<List<IpligenceCityList>> GET(string CityName)
        {
            string storeProcCommand = "select * from ipligence_citylist_getcitylist(@CityName)";
            object? param = new { CityName };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<IpligenceCityList>(storeProcCommand, param)).ToList();
        }
        public async Task<IpligenceDAS?> GetCityCoOrdinate(string CityName)
        {
            string storeProcCommand = "select * from ipligence_citylist_getcitycoordinate(@CityName)";
            object? param = new { CityName };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<IpligenceDAS?>(storeProcCommand, param);
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

