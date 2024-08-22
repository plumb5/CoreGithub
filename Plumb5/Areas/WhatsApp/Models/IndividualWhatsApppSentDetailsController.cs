using P5GenralDL;
using P5GenralML;
using Plumb5GenralFunction;
using System.ComponentModel.DataAnnotations;

namespace Plumb5.Areas.WhatsApp.Models
{
    public class IndividualWhatsAppSent
    {
        public Int64 Id { get; set; }
        public int TemplateId { get; set; }
        public string TemplateName { get; set; }
        public string CampaignName { get; set; }
        public short? Sent { get; set; }
        public short? Delivered { get; set; }
        public short? Read { get; set; }
        public short? Click { get; set; }
        public string ReasonForNotDelivery { get; set; }
        public DateTime? SentDate { get; set; }
        public string PhoneNumber { get; set; }
        public string TemplateContent { get; set; }
        public string CampaignJobName { get; set; }
        public string Templatetype { get; set; }
        public string MediaFileURL { get; set; }
        public string ButtonOneText { get; set; }
        public string ButtonTwoText { get; set; }
        public bool? IsUnsubscribed { get; set; }
        public short? IsFailed { get; set; }
        public string UrlLink { get; set; }
        public int UniqueClick { get; set; }
        public string P5WhatsAppUniqueID { get; set; }

    }
    public class IndividualWhatsApppSentDetails
    {
        #region Members
        public string PhoneNumber { get; set; }
        public string WhatsAppContent { get; set; }
        public string TemplateName { get; set; }

        [DisplayFormat(DataFormatString = "{0:MMM dd yyyy hh:mm:ss tt}", ApplyFormatInEditMode = true)]
        public Nullable<DateTime> SentDate { get; set; }

        #endregion Members
        readonly int AdsId = 0;

        public IndividualWhatsApppSentDetails(int adsid)
        {
            AdsId = adsid;
        }

        public IndividualWhatsApppSentDetails()
        {

        }

        public async Task<List<IndividualWhatsApppSentDetails>> GetIndividualWhatsappHistoryDetails(List<WhatsAppTrackForIndividual> whatsapptrackdetails,string DbType)
        {
            List<WhatsAppTemplates> whatsapptemplist = new List<WhatsAppTemplates>();
            List<IndividualWhatsApppSentDetails> data;

            List<int> WhatsAppTemplateIds = (from p in whatsapptrackdetails
                                             where p.WhatsAppTemplateId != 0
                                             select p.WhatsAppTemplateId).Distinct().ToList();

            if (WhatsAppTemplateIds != null && WhatsAppTemplateIds.Count > 0)
            {
                using (var objDL = DLWhatsAppTemplates.GetDLWhatsAppTemplates(AdsId, DbType))
                {
                    whatsapptemplist =await objDL.GetAllTemplate(WhatsAppTemplateIds);
                }
            }

            data = (from WhatsAppTrackForIndividual in whatsapptrackdetails
                    join WhatsAppTemplates in whatsapptemplist on WhatsAppTrackForIndividual.WhatsAppTemplateId equals WhatsAppTemplates.Id
                    into UserInformationValues
                    from output in UserInformationValues.DefaultIfEmpty(new WhatsAppTemplates())
                    select new IndividualWhatsApppSentDetails
                    {
                        PhoneNumber = Helper.MaskPhoneNumber(WhatsAppTrackForIndividual.PhoneNumber),
                        WhatsAppContent = String.IsNullOrEmpty(WhatsAppTrackForIndividual.WhatsAppContent) ? "NA" : WhatsAppTrackForIndividual.WhatsAppContent,
                        TemplateName = String.IsNullOrEmpty(output.Name) ? "NA" : output.Name,
                        SentDate = WhatsAppTrackForIndividual.SentDate
                    }).ToList();

            return data;
        }

        public async Task<List<IndividualWhatsAppSent>> GetIndividualwhatsAppResponseData(int AdsId, DateTime FromDateTime, DateTime ToDateTime, int OffSet, int FetchNext, int WATemplateId = 0, string PhoneNumber = null,string DbType=null)
        {
            List<IndividualWhatsAppSent> individualWhatsappSentsList = null;
            List<WhatsappSent> responseDetails = null;
            List<WhatsAppTemplates> templateDetails = null;
            List<WhatsAppCampaign> campaignDetails = null;
            List<WhatsappClick> WhatsappClickDetails = null;
            using (var objDL = DLWhatsAppSent.GetDLWhatsAppSent(AdsId,DbType))
            {
                responseDetails =await objDL.GetIndividualResponseData(FromDateTime, ToDateTime, OffSet, FetchNext, WATemplateId, PhoneNumber);
            }

            if (responseDetails != null && responseDetails.Count > 0)
            {
                using (var objDL = DLWhatsAppTemplates.GetDLWhatsAppTemplates(AdsId,DbType))
                {
                    templateDetails =await objDL.GetAllTemplate(responseDetails.Select(x => x.WhatsappTemplateId).Distinct());
                }
                using (var objDL = DLWhatsappClick.GetDLWhatsappClick(AdsId,DbType))
                {
                    WhatsappClickDetails =await objDL.GetwhatsappClick(responseDetails.Select(x => x.P5WhatsappUniqueID).Distinct());
                }

                if (templateDetails != null && templateDetails.Count > 0)
                {
                    List<string> fieldName = new List<string>() { "id", "userinfouserid", "name" };
                    using (var obDL = DLWhatsAppCampaign.GetDLWhatsAppCampaign(AdsId, DbType))
                    {
                        campaignDetails = await obDL.GetCustomisedCampaignDetails(templateDetails.Select(x => x.WhatsAppCampaignId).Distinct(), fieldName);
                    }
                }

                if (templateDetails != null && templateDetails.Count > 0 && campaignDetails != null && campaignDetails.Count > 0)
                {
                    individualWhatsappSentsList = (from WhatsappSent in responseDetails
                                                   join Template in templateDetails on WhatsappSent.WhatsappTemplateId equals Template.Id
                                                   join Campaign in campaignDetails on Template.WhatsAppCampaignId equals Campaign.Id
                                                   select new IndividualWhatsAppSent
                                                   {
                                                       Id = WhatsappSent.Id,
                                                       TemplateId = WhatsappSent.WhatsappTemplateId,
                                                       TemplateName = Template.Name,
                                                       CampaignName = Campaign.Name,
                                                       Sent = Convert.ToByte(WhatsappSent.IsSent),
                                                       Delivered = Convert.ToByte(WhatsappSent.IsDelivered),
                                                       Read = Convert.ToByte(WhatsappSent.IsRead),
                                                       Click = Convert.ToByte(WhatsappSent.IsClicked),
                                                       ReasonForNotDelivery = WhatsappSent.ErrorMessage,
                                                       SentDate = WhatsappSent.SentDate,
                                                       PhoneNumber = Helper.MaskPhoneNumber(WhatsappSent.PhoneNumber),
                                                       TemplateContent = WhatsappSent.MessageContent,
                                                       CampaignJobName = WhatsappSent.CampaignJobName,
                                                       Templatetype = Template.TemplateType,
                                                       MediaFileURL = Template.MediaFileURL,
                                                       ButtonOneText = Template.ButtonOneText,
                                                       ButtonTwoText = Template.ButtonTwoText,
                                                       IsFailed = Convert.ToByte(WhatsappSent.IsFailed),
                                                       IsUnsubscribed = WhatsappSent.IsUnsubscribed,
                                                       P5WhatsAppUniqueID = WhatsappSent.P5WhatsappUniqueID,
                                                   }).ToList();
                }
                else if (templateDetails != null && templateDetails.Count > 0 && campaignDetails.Count == 0)
                {
                    individualWhatsappSentsList = (from WhatsappSent in responseDetails
                                                   join Template in templateDetails on WhatsappSent.WhatsappTemplateId equals Template.Id
                                                   into IndividualData
                                                   from Whatsappsents in IndividualData.DefaultIfEmpty()
                                                   select new IndividualWhatsAppSent
                                                   {
                                                       Id = WhatsappSent.Id,
                                                       TemplateId = WhatsappSent.WhatsappTemplateId,
                                                       TemplateName = Whatsappsents != null && !String.IsNullOrEmpty(Whatsappsents.Name) ? Whatsappsents.Name : "NA",
                                                       CampaignName = "NA",
                                                       Sent = Convert.ToByte(WhatsappSent.IsSent),
                                                       Delivered = Convert.ToByte(WhatsappSent.IsDelivered),
                                                       Read = Convert.ToByte(WhatsappSent.IsRead),
                                                       Click = Convert.ToByte(WhatsappSent.IsClicked),
                                                       ReasonForNotDelivery = WhatsappSent.ErrorMessage,
                                                       SentDate = WhatsappSent.SentDate,
                                                       PhoneNumber = Helper.MaskPhoneNumber(WhatsappSent.PhoneNumber),
                                                       TemplateContent = WhatsappSent.MessageContent,
                                                       CampaignJobName = WhatsappSent.CampaignJobName,
                                                       Templatetype = Whatsappsents != null && !String.IsNullOrEmpty(Whatsappsents.TemplateType) ? Whatsappsents.TemplateType : "NA",
                                                       MediaFileURL = Whatsappsents != null && !String.IsNullOrEmpty(Whatsappsents.MediaFileURL) ? Whatsappsents.MediaFileURL : "NA",
                                                       ButtonOneText = Whatsappsents != null && !String.IsNullOrEmpty(Whatsappsents.ButtonOneText) ? Whatsappsents.ButtonOneText : "NA",
                                                       ButtonTwoText = Whatsappsents != null && !String.IsNullOrEmpty(Whatsappsents.ButtonTwoText) ? Whatsappsents.ButtonTwoText : "NA",
                                                       IsFailed = Convert.ToByte(WhatsappSent.IsFailed),
                                                       IsUnsubscribed = WhatsappSent.IsUnsubscribed,
                                                       P5WhatsAppUniqueID = WhatsappSent.P5WhatsappUniqueID
                                                   }).ToList();
                }
                else
                {
                    individualWhatsappSentsList = (from WhatsappSent in responseDetails
                                                   select new IndividualWhatsAppSent
                                                   {
                                                       Id = WhatsappSent.Id,
                                                       TemplateId = WhatsappSent.WhatsappTemplateId,
                                                       TemplateName = "NA",
                                                       CampaignName = "NA",
                                                       Templatetype = "NA",
                                                       Sent = Convert.ToByte(WhatsappSent.IsSent),
                                                       Delivered = Convert.ToByte(WhatsappSent.IsDelivered),
                                                       Read = Convert.ToByte(WhatsappSent.IsRead),
                                                       Click = Convert.ToByte(WhatsappSent.IsClicked),
                                                       ReasonForNotDelivery = WhatsappSent.ErrorMessage,
                                                       SentDate = WhatsappSent.SentDate,
                                                       PhoneNumber = Helper.MaskPhoneNumber(WhatsappSent.PhoneNumber),
                                                       TemplateContent = WhatsappSent.MessageContent,
                                                       CampaignJobName = WhatsappSent.CampaignJobName,
                                                       MediaFileURL = "NA",
                                                       ButtonOneText = "NA",
                                                       ButtonTwoText = "NA",
                                                       IsFailed = Convert.ToByte(WhatsappSent.IsFailed),
                                                       IsUnsubscribed = WhatsappSent.IsUnsubscribed,
                                                       P5WhatsAppUniqueID = WhatsappSent.P5WhatsappUniqueID
                                                   }).ToList();
                }
            }
            if (WhatsappClickDetails != null && WhatsappClickDetails.Count > 0)
            {
                List<IndividualWhatsAppSent> Addresponsedetailstolist = new List<IndividualWhatsAppSent>();

                for (int i = 0; i < individualWhatsappSentsList.Count; i++)
                {


                    IndividualWhatsAppSent Addresponsedetails = new IndividualWhatsAppSent();
                    List<WhatsappClick> WhatsappurlsWhatsappClick = new List<WhatsappClick>();
                    WhatsappurlsWhatsappClick = (from p in WhatsappClickDetails
                                                 where p.P5WhatsappUniqueID == individualWhatsappSentsList[i].P5WhatsAppUniqueID
                                                 select p).ToList();


                    string uniqueurls = "";
                    int clickcount = 0;
                    for (int j = 0; j < WhatsappurlsWhatsappClick.Count; j++)
                    {
                        uniqueurls += WhatsappurlsWhatsappClick[j].UrlLink + ",";
                        clickcount = clickcount + 1;
                    }
                    if (uniqueurls != "")
                        uniqueurls = uniqueurls.Remove(uniqueurls.Length - 1);
                    else
                        uniqueurls = "NA";
                    if (WhatsappurlsWhatsappClick.Count > 0)
                    {
                        Addresponsedetails.Id = individualWhatsappSentsList[i].Id;
                        Addresponsedetails.TemplateId = individualWhatsappSentsList[i].TemplateId;
                        Addresponsedetails.TemplateName = individualWhatsappSentsList[i].TemplateName;
                        Addresponsedetails.CampaignName = individualWhatsappSentsList[i].CampaignName;
                        Addresponsedetails.Sent = individualWhatsappSentsList[i].Sent;
                        Addresponsedetails.Delivered = individualWhatsappSentsList[i].Delivered;
                        Addresponsedetails.Read = individualWhatsappSentsList[i].Read;
                        Addresponsedetails.Click = individualWhatsappSentsList[i].Click;
                        Addresponsedetails.ReasonForNotDelivery = individualWhatsappSentsList[i].ReasonForNotDelivery;
                        Addresponsedetails.SentDate = individualWhatsappSentsList[i].SentDate;
                        Addresponsedetails.PhoneNumber = individualWhatsappSentsList[i].PhoneNumber;
                        Addresponsedetails.TemplateContent = individualWhatsappSentsList[i].TemplateContent;
                        Addresponsedetails.CampaignJobName = individualWhatsappSentsList[i].CampaignJobName;
                        Addresponsedetails.Templatetype = individualWhatsappSentsList[i].Templatetype;
                        Addresponsedetails.MediaFileURL = individualWhatsappSentsList[i].MediaFileURL;

                        Addresponsedetails.ButtonOneText = individualWhatsappSentsList[i].ButtonOneText;
                        Addresponsedetails.ButtonTwoText = individualWhatsappSentsList[i].ButtonTwoText;
                        Addresponsedetails.IsFailed = individualWhatsappSentsList[i].IsFailed;
                        Addresponsedetails.IsUnsubscribed = individualWhatsappSentsList[i].IsUnsubscribed;
                        Addresponsedetails.UrlLink = uniqueurls;
                        Addresponsedetails.UniqueClick = clickcount;
                        individualWhatsappSentsList[i] = Addresponsedetails;


                    }
                }

            }
            return individualWhatsappSentsList;
        }
    }
}
