using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLContactExtraField:IDisposable
    {
        Task<Int16> Save(ContactExtraField contactField);
        Task<bool> Update(ContactExtraField contactField);
        Task<List<ContactExtraField>> GetList(int UserInfoUserId = 0, List<int> UserInfoUserIdList = null);
        Task<bool> Delete(int Id);
        Task<bool> ChangeEditableStatus(ContactExtraField fieldConfig);
        Task<ContactExtraField?> GetDetails(ContactExtraField fieldConfig);  

    }
}
