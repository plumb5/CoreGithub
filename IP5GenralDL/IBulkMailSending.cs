using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IBulkMailSending
    {
        string ErrorMessage { get; set; }
        List<MLMailVendorResponse> VendorResponses { get; set; }
        bool SendBulkMail(List<MLMailSent> mailSentList);
        bool SendSingleMail(MLMailSent mailSent);
        bool SendSpamScoreMail(string ToMailAddress, string BodyContent);
    }
}
