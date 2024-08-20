using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLContactEmailValidationOverView:IDisposable
    {
        Task<Int32> Save(ContactEmailValidationOverView contactEmailValidationOverView);
        Task<bool> Update(ContactEmailValidationOverView contactEmailValidationOverView);
        Task<Int32> GetMaxCount(int GroupId, DateTime? FromDateTime, DateTime? ToDateTime, string GroupName);
        Task<IEnumerable<MLGroupEmailValidationOverView>> GetReportDetails(int GroupId, int OffSet, int FetchNext, DateTime? FromDateTime, DateTime? ToDateTime, string GroupName);
        Task<IEnumerable<ContactEmailValidationOverView>> GetNeedToStartList();
        Task<IEnumerable<ContactEmailValidationOverView>> GetInProgress();
        Task<bool> UpdateContactEmailValidation(DataTable dt);
        Task<Int32> GetGroupCountSentForValidation(int Id);
        Task<bool> UpdateStatus(int Id, string Status);
        Task<Int32> GetConsumptionCount(DateTime FromDateTime, DateTime ToDateTime);


    }
}
