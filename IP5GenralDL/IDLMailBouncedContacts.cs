using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLMailBouncedContacts : IDisposable
    {
        Task<int> Save(MailBouncedContact bounceDetails);
        Task<bool> Delete(int Id);
        Task<List<MLMailBouncedContact>> GetBouncedContacts(MLMailBouncedContact bouncedDetails, int OffSet, int FetchNext, int GroupId);
        Task<int> GetMaxCount(MLMailBouncedContact bouncedDetails, int GroupId);
        Task<List<MLMailBouncedCategory>> GetBouncedCategory(DateTime FromDateTime, DateTime ToDateTime);
        Task<DataSet> GetMailEmailsOpenHourOfDay(DateTime FromDateTime, DateTime ToDateTime);
    }
}
