using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLAdminGeoLocationDatabaseTable
    {
        Task<bool> CreateTempTableCreation(string dynamicTableName);

        Task<bool> RenameTableName(string dynamicTableName);

        //void InsertGeoIpBulkData(DataTable dataTable, string tableName);
    }
}
