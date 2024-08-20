using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLPaymentCardDetails:IDisposable
    {
        Task<Int32> SaveDetails(PaymentCardDetails cardDetails);
        Task<bool> UpdateDetails(PaymentCardDetails cardDetails);
        Task<IEnumerable<PaymentCardDetails>> GetDetailsList(int UserInfoUserId);
        Task<PaymentCardDetails?> GetDetail(Int32 Id);
        Task<bool> Delete(Int16 Id);
    }
}
