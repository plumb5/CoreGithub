using P5GenralDL;
using P5GenralML;
using Plumb5GenralFunction;
using System.ComponentModel.DataAnnotations;

namespace Plumb5.Areas.Sms.Models
{
    public class IndividualSmsSent
    {
        public Int64 Id { get; set; }
        public int TemplateId { get; set; }
        public string TemplateName { get; set; }
        public string CampaignName { get; set; }
        public short? Sent { get; set; }
        public short Delivered { get; set; }
        public bool Click { get; set; }
        public string ReasonForNotDelivery { get; set; }
        public DateTime? SentDate { get; set; }
        public string PhoneNumber { get; set; }
        public string MessageContent { get; set; }
        public string CampaignJobName { get; set; }
        public bool IsPromotionalOrTransactionalType { get; set; }
        public short NotDeliverStatus { get; set; }
        public string UrlLink { get; set; }
        public int UniqueClick { get; set; }
        public string ErrorMessage { get; set; }
        public bool IsResponseChecked { get; set; }
        public string P5SMSUniqueID { get; set; }
        public Int16 Units { get; set; }
    }

    public class IndividualSmsSentDetails
    {
        #region Members
        public string PhoneNumber { get; set; }
        public string SmsContent { get; set; }
        public string TemplateName { get; set; }

        [DisplayFormat(DataFormatString = "{0:MMM dd yyyy hh:mm:ss tt}", ApplyFormatInEditMode = true)]
        public Nullable<DateTime> SentDate { get; set; }

        #endregion Members
        readonly int AdsId = 0; 

        public IndividualSmsSentDetails(int adsid,string Sqlprovider)
        {
            AdsId = adsid;
             
        }

        public IndividualSmsSentDetails()
        {

        }

        public async Task<List<IndividualSmsSentDetails>> GetIndividualSmsHistoryDetails(List<SmsTrackForIndividual> smstrackdetails,string Sqlprovider)
        {
            List<SmsTemplate> smstemplist = new List<SmsTemplate>();
            List<IndividualSmsSentDetails> data;

            List<int> smstemplateids = (from p in smstrackdetails
                                        where p.SmsTemplateId != 0
                                        select p.SmsTemplateId).Distinct().ToList();

            if (smstemplateids != null && smstemplateids.Count > 0)
            {
                using (var objDL =  DLSmsTemplate.GetDLSmsTemplate(AdsId, Sqlprovider))
                {
                    smstemplist =(await  objDL.GetAllTemplate(smstemplateids)).ToList();
                }
            }

            data = (from SmsTrackForIndividual in smstrackdetails
                    join SmsTemplate in smstemplist on SmsTrackForIndividual.SmsTemplateId equals SmsTemplate.Id
                    into UserInformationValues
                    from output in UserInformationValues.DefaultIfEmpty(new SmsTemplate())
                    select new IndividualSmsSentDetails
                    {
                        PhoneNumber = Helper.MaskPhoneNumber(SmsTrackForIndividual.PhoneNumber),
                        SmsContent = String.IsNullOrEmpty(SmsTrackForIndividual.SmsContent) ? "NA" : SmsTrackForIndividual.SmsContent,
                        TemplateName = String.IsNullOrEmpty(output.Name) ? "NA" : output.Name,
                        SentDate = SmsTrackForIndividual.SentDate
                    }).ToList();

            return data;
        }

        public async Task<List<IndividualSmsSent>> GetIndividualSmsResponseData(int AdsId, DateTime FromDateTime, DateTime ToDateTime, int OffSet, int FetchNext, string Phonenumber,string SqlProvider)
        {
            List<IndividualSmsSent> individualSmsSentsList = null;

            //IndividualSmsSent Addresponsedetailstolist = new IndividualSmsSent();

            List<MLSmsSent> responseDetails = null;
            List<SmsTemplate> templateDetails = null;
            List<SmsCampaign> campaignDetails = null;
            List<SmsClick> SmsClickDetails = null;
            using (var objBL =  DLSmsSent.GetDLSmsSent(AdsId, SqlProvider))
            {
                responseDetails = (await objBL.GetIndividualResponseData(FromDateTime, ToDateTime, OffSet, FetchNext, Phonenumber)).ToList();
            }

            if (responseDetails != null && responseDetails.Count > 0)
            {
                using (var objBL =   DLSmsTemplate.GetDLSmsTemplate(AdsId, SqlProvider))
                {
                    templateDetails = (await objBL.GetAllTemplate(responseDetails.Select(x => x.SmsTemplateId).Distinct())).ToList();
                }
                using (var objBL =  DLSmsClick.GetDLSmsClick(AdsId, SqlProvider))
                {
                    SmsClickDetails = await objBL.GetSmsClick(responseDetails.Select(x => x.P5SMSUniqueID).Distinct());
                }

                //using (DLSmsCampaign obBL = new DLSmsCampaign(AdsId))
                //{
                //    campaignDetails = obBL.GetCustomisedCampaignDetails(templateDetails.Select(x => x.SmsCampaignId).Distinct());
                //}

                //if (templateDetails != null && templateDetails.Count > 0 && campaignDetails != null && campaignDetails.Count > 0)
                //{
                //    individualSmsSentsList = (from Smssent in responseDetails
                //                              join Template in templateDetails on Smssent.SmsTemplateId equals Template.Id
                //                              join Campaign in campaignDetails on Template.SmsCampaignId equals Campaign.Id
                //                              select new IndividualSmsSent
                //                              {
                //                                  Id = Smssent.Id,
                //                                  TemplateId = Smssent.SmsTemplateId,
                //                                  TemplateName = Template.Name,
                //                                  CampaignName = Campaign.Name,
                //                                  Sent = Smssent.SendStatus,
                //                                  Delivered = Smssent.IsDelivered,
                //                                  Click = Convert.ToBoolean(Smssent.IsClicked),
                //                                  ReasonForNotDelivery = Smssent.ReasonForNotDelivery,
                //                                  SentDate = Smssent.SentDate,
                //                                  PhoneNumber = Helper.MaskPhoneNumber(Smssent.PhoneNumber),
                //                                  MessageContent = Smssent.MessageContent,
                //                                  CampaignJobName = Smssent.CampaignJobName,
                //                                  IsPromotionalOrTransactionalType = Template.IsPromotionalOrTransactionalType,
                //                                  NotDeliverStatus = Smssent.NotDeliverStatus,
                //                                  P5SMSUniqueID = Smssent.P5SMSUniqueID,
                //                                  ErrorMessage = string.IsNullOrEmpty(Smssent.ReasonForNotDelivery) ? "NA" : Smssent.ReasonForNotDelivery,
                //                                  IsResponseChecked = Smssent.IsResponseChecked

                //                              }).ToList();
                //}
                //else if (templateDetails != null && templateDetails.Count > 0 && campaignDetails == null)
                //{
                //    individualSmsSentsList = (from Smssent in responseDetails
                //                              join Template in templateDetails on Smssent.SmsTemplateId equals Template.Id
                //                              select new IndividualSmsSent
                //                              {
                //                                  Id = Smssent.Id,
                //                                  TemplateId = Smssent.SmsTemplateId,
                //                                  TemplateName = Template.Name,
                //                                  CampaignName = "NA",
                //                                  Sent = Smssent.SendStatus,
                //                                  Delivered = Smssent.IsDelivered,
                //                                  Click = Convert.ToBoolean(Smssent.IsClicked),
                //                                  ReasonForNotDelivery = Smssent.ReasonForNotDelivery,
                //                                  SentDate = Smssent.SentDate,
                //                                  PhoneNumber = Helper.MaskPhoneNumber(Smssent.PhoneNumber),
                //                                  MessageContent = Smssent.MessageContent,
                //                                  CampaignJobName = Smssent.CampaignJobName,
                //                                  IsPromotionalOrTransactionalType = Template.IsPromotionalOrTransactionalType,
                //                                  NotDeliverStatus = Smssent.NotDeliverStatus,
                //                                  P5SMSUniqueID = Smssent.P5SMSUniqueID,
                //                                  ErrorMessage = string.IsNullOrEmpty(Smssent.ReasonForNotDelivery) ? "NA" : Smssent.ReasonForNotDelivery,
                //                                  IsResponseChecked = Smssent.IsResponseChecked
                //                              }).ToList();
                //}
                //else
                //{
                individualSmsSentsList = (from Smssent in responseDetails
                                          select new IndividualSmsSent
                                          {
                                              Id = Smssent.Id,
                                              TemplateId = Smssent.SmsTemplateId,
                                              TemplateName = templateDetails != null && templateDetails.Where(x => x.Id == Smssent.SmsTemplateId).ToList().Count > 0 ? templateDetails.Where(x => x.Id == Smssent.SmsTemplateId).ToList()[0].Name : "NA",
                                              CampaignName = "NA",
                                              Sent = Smssent.SendStatus,
                                              Delivered = Smssent.IsDelivered,
                                              Click = Convert.ToBoolean(Smssent.IsClicked),
                                              ReasonForNotDelivery = Smssent.ReasonForNotDelivery,
                                              SentDate = Smssent.SentDate,
                                              PhoneNumber = Helper.MaskPhoneNumber(Smssent.PhoneNumber),
                                              MessageContent = Smssent.MessageContent,
                                              CampaignJobName = Smssent.CampaignJobName,
                                              IsPromotionalOrTransactionalType = true,
                                              NotDeliverStatus = Smssent.NotDeliverStatus,
                                              P5SMSUniqueID = Smssent.P5SMSUniqueID,
                                              ErrorMessage = string.IsNullOrEmpty(Smssent.ReasonForNotDelivery) ? "NA" : Smssent.ReasonForNotDelivery,
                                              IsResponseChecked = Smssent.IsResponseChecked,
                                              Units = Smssent.MessageParts,
                                          }).ToList();
                //}

            }
            if (SmsClickDetails != null && SmsClickDetails.Count > 0)
            {
                List<IndividualSmsSent> Addresponsedetailstolist = new List<IndividualSmsSent>();

                for (int i = 0; i < individualSmsSentsList.Count; i++)
                {


                    IndividualSmsSent Addresponsedetails = new IndividualSmsSent();
                    List<SmsClick> smsurlsSmsClick = new List<SmsClick>();
                    smsurlsSmsClick = (from p in SmsClickDetails
                                       where p.P5SMSUniqueID == individualSmsSentsList[i].P5SMSUniqueID
                                       select p).ToList();


                    string uniqueurls = "";
                    int clickcount = 0;
                    for (int j = 0; j < smsurlsSmsClick.Count; j++)
                    {
                        uniqueurls += smsurlsSmsClick[j].UrlLink + ",";
                        clickcount = clickcount + 1;
                    }
                    if (uniqueurls != "")
                        uniqueurls = uniqueurls.Remove(uniqueurls.Length - 1);
                    else
                        uniqueurls = "NA";
                    if (smsurlsSmsClick.Count > 0)
                    {
                        Addresponsedetails.Id = individualSmsSentsList[i].Id;
                        Addresponsedetails.TemplateId = individualSmsSentsList[i].TemplateId;
                        Addresponsedetails.TemplateName = individualSmsSentsList[i].TemplateName;
                        Addresponsedetails.CampaignName = individualSmsSentsList[i].CampaignName;
                        Addresponsedetails.Sent = individualSmsSentsList[i].Sent;
                        Addresponsedetails.Delivered = individualSmsSentsList[i].Delivered;
                        Addresponsedetails.Click = individualSmsSentsList[i].Click;
                        Addresponsedetails.ReasonForNotDelivery = individualSmsSentsList[i].ReasonForNotDelivery;
                        Addresponsedetails.SentDate = individualSmsSentsList[i].SentDate;
                        Addresponsedetails.PhoneNumber = individualSmsSentsList[i].PhoneNumber;
                        Addresponsedetails.MessageContent = individualSmsSentsList[i].MessageContent;
                        Addresponsedetails.CampaignJobName = individualSmsSentsList[i].CampaignJobName;
                        Addresponsedetails.IsPromotionalOrTransactionalType = individualSmsSentsList[i].IsPromotionalOrTransactionalType;
                        Addresponsedetails.NotDeliverStatus = individualSmsSentsList[i].NotDeliverStatus;

                        Addresponsedetails.ErrorMessage = individualSmsSentsList[i].ReasonForNotDelivery;
                        Addresponsedetails.IsResponseChecked = individualSmsSentsList[i].IsResponseChecked;
                        Addresponsedetails.UrlLink = uniqueurls;
                        Addresponsedetails.UniqueClick = clickcount;
                        Addresponsedetails.Units = individualSmsSentsList[i].Units;
                        individualSmsSentsList[i] = Addresponsedetails;


                    }
                }

            }

            return individualSmsSentsList;
        }
    }
}