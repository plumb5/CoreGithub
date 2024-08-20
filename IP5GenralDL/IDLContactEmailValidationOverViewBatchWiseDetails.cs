using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLContactEmailValidationOverViewBatchWiseDetails:IDisposable
    {
        Task<Int32> Save(ContactEmailValidationOverViewBatchWiseDetails contactEmailValidationOverView);
        Task<bool> Update(ContactEmailValidationOverViewBatchWiseDetails contactEmailValidationOverView);
        Task<IEnumerable<ContactEmailValidationOverViewBatchWiseDetails>> GetInProgress();
        Task<IEnumerable<ContactEmailValidationOverViewBatchWiseDetails>> GetFinishedDetails();
        Task<IEnumerable<ContactEmailValidationOverViewBatchWiseDetails>> GetFinishedStatusDetails();
        Task<Int32> CheckingForPendingStatus(int ContactEmailValidationOverViewId);
        Task<IEnumerable<ContactEmailValidationOverViewBatchWiseDetails>> GetFileDetails(int ContactEmailValidationOverViewId);
    }
}
