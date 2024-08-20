using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Plumb5GenralFunction
{
    public interface IBulkWebPushSending
    {
        List<MLWebPushUpdateResponsesDetails> webpushErrorResponses { get; set; }
        string ErrorMessage { get; set; }
        void SendBulkWebPush(List<WebPushSent> webpushSentList);
        bool SendSingleRssWebPush(int WebPushSendingSettingId, WebPushSent webpushSentList, WebPushTemplate webpushtemplate);
    }
}
