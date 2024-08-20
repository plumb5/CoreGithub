using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLP5BulkServices
    {
        Task<DataSet> GetBulkServices(string Channel);
        Task<DataSet> GetBulkServicesDateTime(string Channel, int SendingSettingId);
    }
}
