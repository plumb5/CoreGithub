using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class WorkFlowWebPushBulk
    {
        public Int64 Id { get; set; }
        public int ConfigureWebPushId { get; set; }
        public int WebPushTemplateId { get; set; }
        public string MachineId { get; set; }
        public int ContactId { get; set; }
        public byte SendStatus { get; set; }
        public string P5UniqueId { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string MessageTitle { get; set; }
        public string MessageContent { get; set; }
        public string VendorName { get; set; }
        public string FCMRegId { get; set; }
        public string VapidEndpointUrl { get; set; }
        public string VapidTokenkey { get; set; }
        public string VapidAuthkey { get; set; }
        public int WorkFlowId { get; set; }
        public int WorkFlowDataId { get; set; }
        public string Button1_Redirect { get; set; }
        public string Button2_Redirect { get; set; }
        public string OnClickRedirect { get; set; }
        public string BannerImage { get; set; }
    }
}
