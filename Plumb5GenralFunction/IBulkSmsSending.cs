using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Plumb5GenralFunction
{
    public interface IBulkSmsSending
    {
        List<MLSmsVendorResponse> VendorResponses { get; set; }

        string ErrorMessage { get; set; }
        bool SendBulkSms(List<SmsSent> smsSentList);
        bool SendSingleSms(SmsSent smsSent);
    }
}
