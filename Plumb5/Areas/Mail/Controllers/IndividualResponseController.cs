using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Mail.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;
using System.Globalization;

namespace Plumb5.Areas.Mail.Controllers
{
    [Area("Mail")]
    public class IndividualResponseController : BaseController
    {
        public IndividualResponseController(IConfiguration _configuration) : base(_configuration)
        { }
        public ActionResult Index()
        {
            return View("IndividualResponse");
        }

        public async Task<JsonResult> IndividualMaxCount([FromBody] IndividualResponse_IndividualMaxCountDto objData)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            DateTime FromDateTime = DateTime.ParseExact(objData.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(objData.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            int returnVal;
            using (var objDL = DLMailSent.GetDLMailSent(domainDetails.AdsId, SQLProvider))
            {
                returnVal = await objDL.IndividualMaxCount(objData.mailCampaignId, FromDateTime, ToDateTime, objData.EmailId);
            }
            return Json(new
            {
                returnVal
            });
        }

        public async Task<JsonResult> GetIndividualResponseData([FromBody] IndividualResponse_GetIndividualResponseDataDto objData)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            List<MailSent> responsedetails = null;
            List<MailTemplate> templateDetails = null;
            List<CampaignIdentifier> campaignDetails = null;

            DateTime FromDateTime = DateTime.ParseExact(objData.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(objData.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            ArrayList data = new ArrayList() { objData.mailCampaignId, FromDateTime, ToDateTime, objData.EmailId };
            HttpContext.Session.SetString("IndividualResponses", JsonConvert.SerializeObject(data));


            using (var objDL = DLMailSent.GetDLMailSent(domainDetails.AdsId, SQLProvider))
            {
                responsedetails = await objDL.GetIndividualResponseData(objData.mailCampaignId, FromDateTime, ToDateTime, objData.OffSet, objData.FetchNext, objData.EmailId);

                if (responsedetails != null && responsedetails.Count > 0)
                {
                    for (int i = 0; i < responsedetails.Count; i++)
                        responsedetails[i].EmailId = Helper.MaskEmailAddress(responsedetails[i].EmailId);

                }

            }
            //if (responsedetails != null && responsedetails.Count > 0)
            //{
            //    using (DLMailTemplate objDL = new DLMailTemplate(domainDetails.AdsId))
            //    {
            //        templateDetails = objDL.GetAllTemplateList(responsedetails.Select(x => x.MailTemplateId).Distinct());
            //    }


            //    using (DLCampaignIdentifier objDL = new DLCampaignIdentifier(domainDetails.AdsId))
            //    {
            //        campaignDetails = objDL.GetCustomisedCampaignDetails(responsedetails.Select(x => x.MailCampaignId).Distinct());
            //    }

            //    var tempdetails = (from template in templateDetails
            //                       join campaign in campaignDetails on template.MailCampaignId equals campaign.Id into template_campaign
            //                       from campaign in template_campaign.DefaultIfEmpty()
            //                       select new
            //                       {
            //                           TemplateId = template.Id,
            //                           CampaignId = campaign == null ? 0 : (campaign.Id),
            //                           TemaplateName = template.Name,
            //                           CampaignName = campaign == null ? "NA" : (string.IsNullOrEmpty(campaign.Name) ? "NA" : campaign.Name)
            //                       });


            //    var responsedata = (from response in responsedetails
            //                        join temp in tempdetails on response.MailTemplateId equals temp.TemplateId into response_campaign
            //                        from template in response_campaign.DefaultIfEmpty()
            //                        select new
            //                        {
            //                            Id = response.Id,
            //                            P5MailUniqueID = response.P5MailUniqueID,
            //                            TemplateId = template.TemplateId,
            //                            TemplateName = template.TemaplateName,
            //                            CampaignName = template.CampaignName,
            //                            EmailId = Helper.MaskEmailAddress(response.EmailId),
            //                            SendStatus = response.SendStatus,
            //                            Open = response.Opened,
            //                            Click = response.Clicked,
            //                            Unsubscribe = response.Unsubscribe,
            //                            Forword = response.Forward,
            //                            Bounced = response.IsBounced,
            //                            SentDate = response.SentDate,
            //                            ErrorMessage = response.ErrorMessage,
            //                            Subject = response.Subject,
            //                            FromName = response.FromName,
            //                            FromEmailId = response.FromEmailId,
            //                            ReplayToEmailId = response.ReplayToEmailId

            //                        }
            //                    ).ToList();

            //    return Json(responsedata);
            //}
            return Json(responsedetails);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> Export([FromBody] IndividualResponse_ExportDto objData)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
                // Create a DataSet and put both tables in it.
                System.Data.DataSet dataSet = new System.Data.DataSet("General");

                int mailCampaignId = 0;
                string EmailId = null;
                if (HttpContext.Session.GetString("IndividualResponses") != null)
                {
                    ArrayList data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("IndividualResponses")); ;
                    mailCampaignId = Convert.ToInt32(data[0]);
                    EmailId = Convert.ToString(data[3]);
                }


                List<MailSent> responsedetails = null;
                List<MailClick> MailClickDetails = null;
                DateTime FromDateTime = DateTime.ParseExact(objData.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                DateTime ToDateTime = DateTime.ParseExact(objData.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                List<MLIndividualMailSent> individualMailSentsList = null;
                using (var objBL = DLMailSent.GetDLMailSent(domainDetails.AdsId, SQLProvider))
                {

                    responsedetails = await objBL.GetIndividualResponseData(mailCampaignId, FromDateTime, ToDateTime, objData.OffSet, objData.FetchNext, EmailId);

                }

                if (responsedetails.Count > 0)
                {
                    using (var objBL = DLMailClick.GetDLMailClick(domainDetails.AdsId, SQLProvider))
                    {
                        MailClickDetails = await objBL.GetMailClick(responsedetails.Select(x => x.P5MailUniqueID).Distinct());
                    }

                    individualMailSentsList = (from Mailsent in responsedetails

                                               select new MLIndividualMailSent
                                               {
                                                   Id = Mailsent.Id,
                                                   FromName = Mailsent.FromName,
                                                   FromEmailId = Mailsent.FromEmailId,
                                                   Subject = Mailsent.Subject,
                                                   SendStatus = Mailsent.SendStatus,
                                                   IsBounced = Mailsent.IsBounced,
                                                   Opened = Mailsent.Opened,
                                                   Clicked = Mailsent.Clicked,
                                                   SentDate = Mailsent.SentDate,
                                                   ContactId = Mailsent.ContactId,
                                                   ErrorMessage = Mailsent.ErrorMessage,
                                                   P5MailUniqueID = Mailsent.P5MailUniqueID,
                                                   Emaild = Mailsent.EmailId,
                                               }).ToList();
                }


                if (MailClickDetails != null && MailClickDetails.Count > 0)
                {
                    List<MailSent> Addresponsedetailstolist = new List<MailSent>();

                    for (int i = 0; i < responsedetails.Count; i++)
                    {


                        MLIndividualMailSent Addresponsedetails = new MLIndividualMailSent();
                        List<MailClick> mailurlsClick = new List<MailClick>();
                        mailurlsClick = (from p in MailClickDetails
                                         where p.P5MailUniqueID == individualMailSentsList[i].P5MailUniqueID
                                         select p).ToList();


                        string uniqueurls = "";
                        int clickcount = 0;
                        for (int j = 0; j < mailurlsClick.Count; j++)
                        {
                            uniqueurls += mailurlsClick[j].UrlLink + ",";
                            clickcount = clickcount + 1;
                        }
                        if (uniqueurls != "")
                            uniqueurls = uniqueurls.Remove(uniqueurls.Length - 1);
                        else
                            uniqueurls = "NA";
                        if (mailurlsClick.Count > 0)
                        {
                            Addresponsedetails.Id = individualMailSentsList[i].Id;
                            Addresponsedetails.FromName = individualMailSentsList[i].FromName;
                            Addresponsedetails.FromEmailId = individualMailSentsList[i].FromEmailId;
                            Addresponsedetails.Subject = individualMailSentsList[i].Subject;
                            Addresponsedetails.SendStatus = individualMailSentsList[i].SendStatus;
                            Addresponsedetails.IsBounced = individualMailSentsList[i].IsBounced;
                            Addresponsedetails.Opened = individualMailSentsList[i].Opened;
                            Addresponsedetails.Clicked = individualMailSentsList[i].Clicked;
                            Addresponsedetails.SentDate = individualMailSentsList[i].SentDate;
                            Addresponsedetails.Urllinks = uniqueurls;
                            Addresponsedetails.ContactId = individualMailSentsList[i].ContactId;
                            Addresponsedetails.ErrorMessage = individualMailSentsList[i].ErrorMessage;
                            Addresponsedetails.SentDate = individualMailSentsList[i].SentDate;
                            Addresponsedetails.Emaild = individualMailSentsList[i].Emaild;
                            Addresponsedetails.UniqueClick = clickcount;
                            individualMailSentsList[i] = Addresponsedetails;

                        }
                    }

                }
                string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(domainDetails.AdsId, SQLProvider);
                var NewListData = individualMailSentsList.Select(x => new
                {
                    x.FromName,
                    x.FromEmailId,
                    x.Subject,
                    Sent = x.SendStatus == 1 ? "Yes" : "No",
                    Bounced = x.IsBounced == 1 ? "Yes" : "No",
                    Opened = x.Opened == 1 ? "Yes" : "No",
                    Click = x.Clicked == 1 ? "Yes" : "No",
                    UrlLink = string.IsNullOrEmpty(x.Urllinks) ? "NA" : x.Urllinks,
                    //UniqueClick = x.ContactId,
                    ErrorMessage = string.IsNullOrEmpty(x.ErrorMessage) ? "NA" : x.ErrorMessage,
                    SentDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.SentDate)).ToString(),
                    EmailId = Helper.MaskEmailAddress(x.Emaild)
                });

                System.Data.DataTable dtt = new System.Data.DataTable();
                dtt = NewListData.CopyToDataTable();
                dataSet.Tables.Add(dtt);

                string FileName = DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + objData.FileType;

                string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;


                if (objData.FileType.ToLower() == "csv")
                    Helper.SaveDataSetToCSV(dataSet, MainPath);
                else
                    Helper.SaveDataSetToExcel(dataSet, MainPath);

                MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

                return Json(new { Status = true, MainPath });
            }
            else
            {
                return Json(new { Status = false });
            }
        }
    }
}
