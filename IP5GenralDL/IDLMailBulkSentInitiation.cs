using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLMailBulkSentInitiation
    {
        Task<List<MailBulkSentInitiation>> GetSentInitiation();
        Task<bool> UpdateSentInitiation(MailBulkSentInitiation BulkSentInitiation);
        Task<bool> ResetSentInitiation();
    }
}
