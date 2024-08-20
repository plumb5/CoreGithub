using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLContactDeduplicateOverview:IDisposable
    {
        Task<Int32> GetMaxCount(DateTime FromDateTime, DateTime ToDateTime);
        Task<IEnumerable<ContactDeDuplicateOverView>> GetDetails(int OffSet, int FetchNext, DateTime FromDateTime, DateTime ToDateTime);
        Task<IEnumerable<ContactDeDuplicateOverView>> GetContactDeduplicateOverviewDetail();
        Task<DataSet> GetVerifiedExistingContactData(DataTable dt);
        Task<DataSet> GetVerifiedUniqueContactData(); 
        Task<bool> Update(ContactDeDuplicateOverView contactdeduplicateImportOverview);
        Task<ContactDeDuplicateOverView?> GetFileContentToDownload(int Id, string ContactFileType);
        Task<Int32> Save(int UserInfoUserId, string ImportedFileName, byte[] ImportedFileBinaryData);
        Task<ContactDeDuplicateOverView?> Get(ContactDeDuplicateOverView contactdeduplicateImportOverview);
    }
}
