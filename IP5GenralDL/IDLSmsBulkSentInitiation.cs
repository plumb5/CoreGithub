using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLSmsBulkSentInitiation:IDisposable
    {
        Task<IEnumerable<SmsBulkSentInitiation>> GetSentInitiation();
        Task<bool> UpdateSentInitiation(SmsBulkSentInitiation BulkSentInitiation);
        Task<Int32> Save(SmsBulkSentInitiation BulkSentInitiation);
        Task<bool> ResetSentInitiation();

    }
}
