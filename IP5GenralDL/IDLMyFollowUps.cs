using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLMyFollowUps : IDisposable
    {
        Task<List<Contact>> GetFollowUpNotification(string UserIdList, DateTime StartDate, DateTime EndDate);
    }
}
