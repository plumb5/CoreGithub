using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
	public class MLWhatsAppVendorResponse
	{
		public long Id { get; set; }
		public int WhatsappSendingSettingId { get; set; }
		public int ContactId { get; set; }
		public string PhoneNumber { get; set; }
		public string ResponseId { get; set; }
		public string ErrorMessage { get; set; }
		public string MessageContent { get; set; }
		public short SendStatus { get; set; }
		public string VendorName { get; set; }
		public int WhatsappTemplateId { get; set; }
		public int GroupId { get; set; }
		public int WorkFlowId { get; set; }
		public int WorkFlowDataId { get; set; }
		public string CampaignJobName { get; set; }
		public short IsDelivered { get; set; }
		public short IsClicked { get; set; }
		public string MediaFileURL { get; set; }
		public string UserAttributes { get; set; }
		public string ButtonOneDynamicURLSuffix { get; set; }
		public string ButtonTwoDynamicURLSuffix { get; set; }
		public short IsFailed { get; set; }

		public string P5WhatsappUniqueID { get; set; }
	}
}
