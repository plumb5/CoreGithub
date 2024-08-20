using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Plumb5GenralFunction
{
    public interface IBulkWhatsAppSending
    {
        List<MLWhatsAppVendorResponse> VendorResponses { get; set; }
        string ErrorMessage { get; set; }
        bool SendWhatsApp(List<MLWhatsappSent> whatsappSent);
        bool SendEachWhatsApp(MLWhatsappSent whatsappSent);
    }
}
