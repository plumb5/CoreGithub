using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLMainContactEmailValidationOverViewBatchWiseDetails:IDisposable
    {
        Task<Int32> Save(MainContactEmailValidationOverViewBatchWiseDetails contactEmailValidationOverView);
        Task<Int32> Update(MainContactEmailValidationOverViewBatchWiseDetails contactEmailValidationOverView);
        Task<bool> UpdateStatus(string file_id);
        Task<IEnumerable<MainContactEmailValidationOverViewBatchWiseDetails>> GetInProgress(string File_Id);
        Task<IEnumerable<MainContactEmailValidationOverViewBatchWiseDetails>> GetFinishedDetails();
    }
}
