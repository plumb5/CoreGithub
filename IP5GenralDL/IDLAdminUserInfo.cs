using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLAdminUserInfo : IDisposable
    {
        Task<MLAdminUserInfo?> GetDetails(string EmailId);
        Task<long> UpdateLastSignedIn(int UserId);
        Task<long> InsertEventLog(int UserId, int AccountId, string AccountName, string Description, string MailTo, string MailFrom, string Subject, string BodyMessage, string UserName);
    }
}
