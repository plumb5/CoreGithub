using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Sms.Dto;
using Plumb5.Areas.WhatsApp.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Text;

namespace Plumb5.Areas.WhatsApp.Controllers
{
    [Area("WhatsApp")]
    public class WhatsAppTemplatesController : BaseController
    {
        public WhatsAppTemplatesController(IConfiguration _configuration) : base(_configuration)
        { }
        public ActionResult Index()
        {
            return View("WhatsAppTemplates");
        }

        public ActionResult CreateWhatsAppTemplates()
        {
            return View("CreateWhatsAppTemplates");
        }
        [HttpPost]
        public async Task<JsonResult> GetCampaignList([FromBody] WhatsAppTemplates_GetCampaignListDto objDto)
        {
            using (var objDLform = DLCampaignIdentifier.GetDLCampaignIdentifier(objDto.accountId, SQLProvider))
            {
                return Json(await objDLform.GetList(new CampaignIdentifier(), 0, 0));
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetMaxCount([FromBody] WhatsAppTemplates_GetMaxCountDto objDto)
        {
            int returnVal = 0;
            using (var objDL = DLWhatsAppTemplates.GetDLWhatsAppTemplates(objDto.AccountId, SQLProvider))
            {
                returnVal = await objDL.GetMaxCount(objDto.whatsAppTemplate);
            }
            return Json(new { returnVal });
        }

        //public async Task<JsonResult> SaveTemplate(int AccountId, WhatsAppTemplates whatsAppTemplate)
        //{
        //    int returnVal = 0;
        //    using (DLWhatsAppTemplates objDL =DLWhatsAppTemplates(AccountId))
        //    {
        //        returnVal = objDL.Save(whatsAppTemplate);
        //    }
        //    return Json(new { returnVal });
        //}
        [HttpPost]
        public async Task<JsonResult> SaveTemplate([FromBody] WhatsAppTemplates_SaveTemplateDto objDto)
        {
            int returnVal = 0;
            //save TemplateUrl and get id
            string[] dynUrls = { "UserAttributes", "ButtonOneDynamicURLSuffix", "ButtonTwoDynamicURLSuffix" };
            var myUrlList = new List<KeyValuePair<string, int>>();
            foreach (string col in dynUrls)
            {

                var data = objDto.whatsAppTemplate.GetType().GetProperty(col);
                if ((data != null && data.GetValue(objDto.whatsAppTemplate, null) != null) && data.GetValue(objDto.whatsAppTemplate, null).ToString().ToLower().IndexOf("http") > -1)
                {
                    var verReplaceData = new List<string>();
                    var getdata = data.GetValue(objDto.whatsAppTemplate, null).ToString().Split(',');
                    foreach (var getUrl in getdata)
                    {
                        if (getUrl.ToLower().IndexOf("http") > -1)
                        {
                            int tempurlId = 0;
                            using (var objDLurl = DLWhatsappTemplateUrl.GetDLWhatsappTemplateUrl(objDto.AccountId, SQLProvider))
                            {
                                tempurlId = await objDLurl.GetUrlByIdUrl(objDto.whatsAppTemplate.Id, getUrl);
                            }
                            int templateurlsId = tempurlId == 0 ? await CreateWhatsappTemplateUrl(objDto.AccountId, objDto.whatsAppTemplate.Id, tempurlId, getUrl) : tempurlId;
                            myUrlList.Add(new KeyValuePair<string, int>(getUrl, templateurlsId));
                            verReplaceData.Add("[{*" + templateurlsId + "*}]");
                        }
                        else
                        {
                            verReplaceData.Add(getUrl);
                        }
                    }
                    data.SetValue(objDto.whatsAppTemplate, string.Join(",", verReplaceData), null);
                }
            }

            using (var objDL = DLWhatsAppTemplates.GetDLWhatsAppTemplates(objDto.AccountId, SQLProvider))
            {
                returnVal = await objDL.Save(objDto.whatsAppTemplate);
            }

            //update save TemplateUrl by templateid 
            foreach (var col in myUrlList)
            {
                updateTemplateUrl(objDto.AccountId, objDto.whatsAppTemplate.Id, col.Value, col.Key);
            }

            return Json(new { returnVal });
        }
        [HttpPost]
        public async Task<int> CreateWhatsappTemplateUrl(int AccountId, int templateId, int templateurlsid, string buttonUrl)
        {
            int TemplateUrlid = templateurlsid;
            if (buttonUrl.ToLower().IndexOf("http") > -1)
            {
                WhatsAppTemplateUrl TemplateUrls = new WhatsAppTemplateUrl();
                TemplateUrls.WhatsAppTemplatesId = templateId;
                TemplateUrls.UrlContent = buttonUrl;
                using (var objDL = DLWhatsappTemplateUrl.GetDLWhatsappTemplateUrl(AccountId, SQLProvider))
                {
                    if (templateId == 0 || templateurlsid == 0)
                    { TemplateUrlid = await objDL.SaveWhatsappTemplateUrl(TemplateUrls); }
                    else
                    {
                        TemplateUrls.Id = TemplateUrlid;
                        objDL.Update(TemplateUrls);
                    }

                }
            }

            return TemplateUrlid;
        }

        [HttpPost]
        public async Task<JsonResult> GetTemplateUrlList([FromBody] WhatsAppTemplates_GetTemplateUrlListDto objDto)
        {
            using (var objBLform = DLWhatsappTemplateUrl.GetDLWhatsappTemplateUrl(objDto.AccountId, SQLProvider))
            {
                return Json(await objBLform.GetDetail(objDto.WhatsAppTemplatesId));
            }
        }
        [HttpPost]
        public void updateTemplateUrl(int AccountId, int templateId, int templateurlsid, string buttonUrl)
        {
            if (templateurlsid != 0)
            {
                using (var objDLurl = DLWhatsappTemplateUrl.GetDLWhatsappTemplateUrl(AccountId, SQLProvider))
                {
                    WhatsAppTemplateUrl TemplateUrls = new WhatsAppTemplateUrl();
                    TemplateUrls.WhatsAppTemplatesId = templateId;
                    if (templateurlsid != 0)
                    {
                        TemplateUrls.Id = templateurlsid;
                        TemplateUrls.UrlContent = buttonUrl;
                        objDLurl.Update(TemplateUrls);
                    }
                }
            }
        }
        [HttpPost]
        public async Task<JsonResult> UpdateTemplate([FromBody] WhatsAppTemplates_UpdateTemplateDto objDto)
        {
            bool returnVal = false;
            using (var objDL = DLWhatsAppTemplates.GetDLWhatsAppTemplates(objDto.AccountId, SQLProvider))
            {
                returnVal = await objDL.Update(objDto.whatsAppTemplate);
            }
            return Json(new { returnVal });
        }
        [HttpPost]
        public async Task<JsonResult> GetReport([FromBody] WhatsAppTemplates_GetReportDto objDto)
        {
            HttpContext.Session.SetString("WhatsAppTemplate", JsonConvert.SerializeObject(objDto.whatsAppTemplate));

            List<MLWhatsAppTemplates> mLWhatsAppTemplates = new List<MLWhatsAppTemplates>();

            using (var objDL = DLWhatsAppTemplates.GetDLWhatsAppTemplates(objDto.AccountId, SQLProvider))
            {
                mLWhatsAppTemplates = await objDL.GetList(objDto.whatsAppTemplate, objDto.OffSet, objDto.FetchNext);
            }

            return Json(new
            {
                Data = mLWhatsAppTemplates,
                MaxJsonLength = Int32.MaxValue,
            });


        }
        [HttpPost]
        public async Task<JsonResult> GetSingle([FromBody] WhatsAppTemplates_GetSingleDto objDto)
        {
            WhatsAppTemplates mLWhatsAppTemplates = new WhatsAppTemplates();

            using (var objDL = DLWhatsAppTemplates.GetDLWhatsAppTemplates(objDto.AccountId, SQLProvider))
            {
                mLWhatsAppTemplates = await objDL.GetSingle(objDto.Id);
            }
            return Json(new
            {
                Data = mLWhatsAppTemplates,
                MaxJsonLength = Int32.MaxValue,
            });

        }
        [HttpPost]
        public async Task<JsonResult> GetUserAttributes([FromBody] WhatsAppTemplates_GetUserAttributesDto objDto)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            List<int> UserInfoUserIdList = (user.Members != null && user.Members.Count > 0) ? user.Members.Select(x => x.UserInfoUserId).ToList<int>() : null;
            using (var objBAL = DLContactExtraField.GetDLContactExtraField(objDto.accountId, SQLProvider))
            {
                return Json(await objBAL.GetList(user.UserId, UserInfoUserIdList));
            }
        }

        [Log]
        [HttpPost]
        public async Task<ActionResult> Export([FromBody] WhatsAppTemplates_ExportDto objDto)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                System.Data.DataSet dataSet = new System.Data.DataSet("General");
                DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
                LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
                WhatsAppTemplates whatsAppTemplate = null;
                List<MLWhatsAppTemplates> mLWhatsAppTemplates;

                if (HttpContext.Session.GetString("WhatsAppTemplate") != null)
                {
                    whatsAppTemplate = JsonConvert.DeserializeObject<WhatsAppTemplates>(HttpContext.Session.GetString("WhatsAppTemplate"));
                }

                using (var objDL = DLWhatsAppTemplates.GetDLWhatsAppTemplates(objDto.AccountId, SQLProvider))
                {
                    mLWhatsAppTemplates = await objDL.GetList(whatsAppTemplate, objDto.OffSet, objDto.FetchNext);
                }

                string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(domainDetails.AdsId, SQLProvider);
                var NewListData = mLWhatsAppTemplates.Select(x => new
                {
                    TemplateName = x.Name,
                    x.CampaignName,
                    x.TemplateType,
                    UpdatedDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.UpdatedDate)).ToString()
                });

                System.Data.DataTable dtt = new System.Data.DataTable();
                dtt = NewListData.CopyToDataTableExport();
                dataSet.Tables.Add(dtt);

                string FileName = "WhatsAppTemplates_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + objDto.FileType;

                string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

                if (objDto.FileType.ToLower() == "csv")
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
        [HttpPost]
        public async Task<ActionResult> GetGroupList([FromBody] WhatsAppTemplates_GetGroupListDto objDto)
        {
            Groups groupdata = new Groups();
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            List<int> UserInfoUserIdList = (user.Members != null && user.Members.Count > 0) ? user.Members.Select(x => x.UserInfoUserId).ToList<int>() : null;
            List<Groups> groupList = null;

            using (var objDL = DLGroups.GetDLGroups(objDto.accountId, SQLProvider))
            {
                groupdata.UserInfoUserId = user.UserId;
                groupList = await objDL.GetGroupList(groupdata);
            }

            return Json(groupList);
        }

        [Log]
        [HttpPost]
        public async Task<ActionResult> SaveUploadFile()
        {
            DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            string filePath = String.Empty;
            try
            {

                var httpPostedFile = this.Request.Form.Files[0];
                if (httpPostedFile != null)
                {
                    string fileExtension = Path.GetExtension(httpPostedFile.FileName).ToLower();
                    List<string> fileExtensionList = new List<string>() { ".pdf", ".jpg", ".png", ".jpeg", ".mp4" };
                    if (fileExtensionList.Contains(fileExtension))
                    {
                        string fileName = httpPostedFile.FileName;

                        SaveDownloadFilesToAws awsUpload = new SaveDownloadFilesToAws(account.AdsId, "ClientImages/WhatsApp");
                        Tuple<string, string> tuple = awsUpload.UploadClientFiles(fileName, httpPostedFile.OpenReadStream());
                        if (tuple != null && !String.IsNullOrEmpty(tuple.Item2))
                        {
                            filePath = tuple.Item2;
                        }
                        var getdata = JsonConvert.SerializeObject(filePath, Formatting.Indented);
                        return Content(getdata, "application/json");
                    }
                    else
                    {
                        var getdata = JsonConvert.SerializeObject("0", Formatting.Indented);
                        return Content(getdata, "application/json");
                    }
                }
                else
                {
                    var getdata = JsonConvert.SerializeObject("0", Formatting.Indented);
                    return Content(getdata, "application/json");
                }

            }
            catch (Exception ex)
            {
                var getdata = JsonConvert.SerializeObject("0", Formatting.Indented);
                return Content(getdata, "application/json");
            }

        }



        [Log]
        [HttpPost]
        public async Task<JsonResult> Delete([FromBody] WhatsAppTemplates_DeleteDto objDto)
        {
            WhatsAppTemplateUrl whatsapptemplaterUrl = new WhatsAppTemplateUrl();
            whatsapptemplaterUrl.WhatsAppTemplatesId = objDto.Id;
            bool result = false;
            var obj = DLWhatsappTemplateUrl.GetDLWhatsappTemplateUrl(objDto.AdsId, SQLProvider);
            using (var objBL = DLWhatsAppTemplates.GetDLWhatsAppTemplates(objDto.AdsId, SQLProvider))
            {
                result = await objBL.Delete(objDto.Id);
                obj.Delete(whatsapptemplaterUrl);
                return Json(result);
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> SendIndividualTestWhatsAapp([FromBody] WhatsAppTemplates_SendIndividualTestWhatsAappDto objDto)
        {
            WhatsAppConfiguration whatsappConfiguration = new WhatsAppConfiguration();
            bool SentStatus = false;
            string Message = "";
            string ResponseId = "";
            string UserAttributeMessageDetails = "";
            string UserButtonOneDynamicURLDetails = "";
            string UserButtonTwoDynamicURLDetails = "";
            string MediaURLDetails = "";
            string langcode = "";
            WhatsappSent watsAppSent = new WhatsappSent();
            string P5WhatsappUniqueID = Guid.NewGuid().ToString();
            List<WhatsAppTemplateUrl> whatsappUrlList = new List<WhatsAppTemplateUrl>();

            using (var objDL = DLWhatsAppConfiguration.GetDLWhatsAppConfiguration(objDto.accountId, SQLProvider))
            {
                whatsappConfiguration = await objDL.GetConfigurationDetailsForSending(objDto.WhatsAppConfigurationNameId);
            }

            if (whatsappConfiguration != null && whatsappConfiguration.Id > 0)
            {
                Contact contactDetails = new Contact() { PhoneNumber = objDto.PhoneNumber };

                using (var objDL = DLContact.GetContactDetails(objDto.accountId, SQLProvider))
                {
                    contactDetails = await objDL.GetDetails(contactDetails, null, true);
                }

                if (contactDetails == null)
                    contactDetails = new Contact() { PhoneNumber = objDto.PhoneNumber, CountryCode = whatsappConfiguration.CountryCode };

                if (contactDetails != null && string.IsNullOrEmpty(contactDetails.CountryCode))
                    contactDetails.CountryCode = whatsappConfiguration.CountryCode;

                WhatsAppTemplates whatsapptemplateDetails;

                using (var objDLTemplate = DLWhatsAppTemplates.GetDLWhatsAppTemplates(objDto.accountId, SQLProvider))
                {
                    whatsapptemplateDetails = await objDLTemplate.GetSingle(objDto.WhatsAppTemplateId);
                }

                using (var objsmstempUrl = DLWhatsappTemplateUrl.GetDLWhatsappTemplateUrl(objDto.accountId, SQLProvider))
                {
                    whatsappUrlList = await objsmstempUrl.GetDetail(objDto.WhatsAppTemplateId);
                }

                if (whatsapptemplateDetails != null)
                {
                    WhatsAppLanguageCodes whatsapplanguagecodes;

                    using (var objDLTemplate = DLWhatsAppLanguageCodes.GetDLWhatsAppLanguageCodes(objDto.accountId, SQLProvider))
                    {
                        whatsapplanguagecodes = await objDLTemplate.GetWhatsAppShortenLanguageCode(whatsappConfiguration.ProviderName, whatsapptemplateDetails.TemplateLanguage);
                    }

                    UserAttributeMessageDetails = "";
                    UserButtonOneDynamicURLDetails = "";
                    UserButtonTwoDynamicURLDetails = "";

                    HelperForSMS HelpSMS = new HelperForSMS(objDto.accountId, SQLProvider);
                    HelperForWhatsApp HelpWhatsApp = new HelperForWhatsApp(objDto.accountId, SQLProvider);
                    StringBuilder UserAttrBodydata = new StringBuilder();
                    StringBuilder UserButtonOneBodydata = new StringBuilder();
                    StringBuilder UserButtonTwoBodydata = new StringBuilder();
                    StringBuilder MediaUrlBodyData = new StringBuilder();

                    if (!string.IsNullOrEmpty(whatsapptemplateDetails.UserAttributes))
                    {
                        UserAttrBodydata.Append(whatsapptemplateDetails.UserAttributes);
                        HelpWhatsApp.ReplaceMessageWithWhatsAppUrl("campaign", UserAttrBodydata, 0, contactDetails.ContactId, whatsappUrlList, P5WhatsappUniqueID, 0, true);
                        //HelpSMS.ReplaceContactDetails(UserAttrBodydata, contactDetails, accountId, "", WhatsAppTemplateId, 0, P5WhatsappUniqueID, "whatsapp", whatsapptemplateDetails.ConvertLinkToShortenUrl);
                        await HelpSMS.ReplaceContactDetails(UserAttrBodydata, contactDetails, objDto.accountId, "", objDto.WhatsAppTemplateId, 0, P5WhatsappUniqueID, "whatsapp", whatsapptemplateDetails.ConvertLinkToShortenUrl);

                        UserAttributeMessageDetails = UserAttrBodydata.ToString();
                    }

                    if (!string.IsNullOrEmpty(whatsapptemplateDetails.ButtonOneDynamicURLSuffix))
                    {
                        UserButtonOneBodydata.Append(whatsapptemplateDetails.ButtonOneDynamicURLSuffix);

                        ConvertWhatsAppURLToShortenCode helpconvert = new ConvertWhatsAppURLToShortenCode(objDto.accountId, SQLProvider);
                        helpconvert.GenerateShortenLinkByUrl(UserButtonOneBodydata, contactDetails, Convert.ToInt32(objDto.WhatsAppTemplateId), 0, P5WhatsappUniqueID);
                        HelpWhatsApp.ReplaceMessageWithWhatsAppUrl("campaign", UserButtonOneBodydata, 0, contactDetails.ContactId, whatsappUrlList, P5WhatsappUniqueID, 0);
                        await HelpSMS.ReplaceContactDetails(UserButtonOneBodydata, contactDetails, objDto.accountId, "", objDto.WhatsAppTemplateId, 0, P5WhatsappUniqueID, "whatsapp", whatsapptemplateDetails.ConvertLinkToShortenUrl);
                        UserButtonOneDynamicURLDetails = UserButtonOneBodydata.ToString();
                    }

                    if (!string.IsNullOrEmpty(whatsapptemplateDetails.ButtonTwoDynamicURLSuffix))
                    {
                        UserButtonTwoBodydata.Append(whatsapptemplateDetails.ButtonTwoDynamicURLSuffix);
                        ConvertWhatsAppURLToShortenCode helpconvert = new ConvertWhatsAppURLToShortenCode(objDto.accountId, SQLProvider);
                        helpconvert.GenerateShortenLinkByUrl(UserButtonTwoBodydata, contactDetails, Convert.ToInt32(objDto.WhatsAppTemplateId), 0, P5WhatsappUniqueID);
                        HelpWhatsApp.ReplaceMessageWithWhatsAppUrl("campaign", UserButtonTwoBodydata, 0, contactDetails.ContactId, whatsappUrlList, P5WhatsappUniqueID);
                        await HelpSMS.ReplaceContactDetails(UserButtonTwoBodydata, contactDetails, objDto.accountId, "", objDto.WhatsAppTemplateId, 0, P5WhatsappUniqueID, "whatsapp", whatsapptemplateDetails.ConvertLinkToShortenUrl);
                        UserButtonTwoDynamicURLDetails = UserButtonTwoBodydata.ToString();
                    }

                    if (!string.IsNullOrEmpty(whatsapptemplateDetails.MediaFileURL))
                    {
                        MediaUrlBodyData.Append(whatsapptemplateDetails.MediaFileURL);
                        //HelpSMS.ReplaceContactDetails(MediaUrlBodyData, contactDetails);
                        await HelpSMS.ReplaceContactDetails(MediaUrlBodyData, contactDetails, objDto.accountId, "", objDto.WhatsAppTemplateId, 0, P5WhatsappUniqueID, "whatsapp", whatsapptemplateDetails.ConvertLinkToShortenUrl);

                        MediaURLDetails = MediaUrlBodyData.ToString();
                    }

                    if (whatsapplanguagecodes != null && !string.IsNullOrEmpty(whatsapplanguagecodes.ShortenLanguageCode))
                        langcode = whatsapplanguagecodes.ShortenLanguageCode;

                    if (UserAttributeMessageDetails.Contains("[{*") && UserAttributeMessageDetails.Contains("*}]"))
                    {
                        SentStatus = false;
                        Message = "User Attributes dynamic content not replaced";
                    }
                    else if (UserButtonOneDynamicURLDetails.Contains("[{*") && UserButtonOneDynamicURLDetails.Contains("*}]"))
                    {
                        SentStatus = false;
                        Message = "Template button one dynamic url content not replaced";
                    }
                    else if (UserButtonTwoDynamicURLDetails.Contains("[{*") && UserButtonTwoDynamicURLDetails.Contains("*}]"))
                    {
                        SentStatus = false;
                        Message = "Template button two dynamic url content not replaced";
                    }
                    else
                    {
                        List<MLWhatsappSent> whatsappSentList = new List<MLWhatsappSent>();

                        MLWhatsappSent mlwatsappsent = new MLWhatsappSent()
                        {
                            MediaFileURL = MediaURLDetails,
                            CountryCode = contactDetails.CountryCode,
                            PhoneNumber = contactDetails.PhoneNumber,
                            WhiteListedTemplateName = whatsapptemplateDetails.WhitelistedTemplateName,
                            LanguageCode = langcode,
                            UserAttributes = UserAttributeMessageDetails,
                            ButtonOneText = whatsapptemplateDetails.ButtonOneText,
                            ButtonTwoText = whatsapptemplateDetails.ButtonTwoText,
                            ButtonOneDynamicURLSuffix = UserButtonOneDynamicURLDetails,
                            ButtonTwoDynamicURLSuffix = UserButtonTwoDynamicURLDetails,
                            CampaignJobName = "campaign",
                            ContactId = contactDetails.ContactId,
                            GroupId = 0,
                            MessageContent = whatsapptemplateDetails.TemplateContent,
                            WhatsappSendingSettingId = 0,
                            WhatsappTemplateId = objDto.WhatsAppTemplateId,
                            VendorName = whatsappConfiguration.ProviderName,
                            P5WhatsappUniqueID = P5WhatsappUniqueID
                        };
                        whatsappSentList.Add(mlwatsappsent);

                        IBulkWhatsAppSending WhatsAppGeneralBaseFactory = Plumb5GenralFunction.WhatsAppGeneralBaseFactory.GetWhatsAppVendor(objDto.accountId, whatsappConfiguration, "campaign");
                        SentStatus = WhatsAppGeneralBaseFactory.SendWhatsApp(whatsappSentList);
                        Message = WhatsAppGeneralBaseFactory.ErrorMessage;

                        if (SentStatus && WhatsAppGeneralBaseFactory.VendorResponses != null && WhatsAppGeneralBaseFactory.VendorResponses.Count > 0)
                        {
                            ResponseId = WhatsAppGeneralBaseFactory.VendorResponses[0].ResponseId;
                            Helper.Copy(WhatsAppGeneralBaseFactory.VendorResponses[0], watsAppSent);

                            watsAppSent.UserAttributes = UserAttributeMessageDetails;
                            watsAppSent.ButtonOneDynamicURLSuffix = UserButtonOneDynamicURLDetails;
                            watsAppSent.ButtonTwoDynamicURLSuffix = UserButtonTwoDynamicURLDetails;
                            watsAppSent.MediaFileURL = MediaURLDetails;
                            watsAppSent.IsDelivered = 0;
                            watsAppSent.IsClicked = 0;
                            watsAppSent.P5WhatsappUniqueID = P5WhatsappUniqueID;
                            watsAppSent.WhatsAppConfigurationNameId = whatsappConfiguration.WhatsAppConfigurationNameId;

                            using (var objDL = DLWhatsAppSent.GetDLWhatsAppSent(objDto.accountId, SQLProvider))
                            {
                                await objDL.Save(watsAppSent);
                            }
                        }
                        else
                        {
                            SentStatus = false;
                            Message = "WhatsApp Message has not been sent - " + Message + "";
                        }
                    }
                }
                else
                {
                    SentStatus = false;
                    Message = "Template not found";
                }
            }
            else
            {
                SentStatus = false;
                Message = "You have not configured for WhatsApp";
            }
            return Json(new { SentStatus, Message, ResponseId });
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> SendGroupTestWhatsAapp([FromBody] WhatsAppTemplates_SendGroupTestWhatsAappDto objDto)
        {
            WhatsAppSendingSetting whatsappSendingSetting = objDto.whatsappSendingSetting;
            WhatsAppConfiguration whatsappConfiguration = new WhatsAppConfiguration();
            bool SentStatus = false;
            string Message = "";
            string ResponseId = "";
            string UserAttributeMessageDetails = "";
            string UserButtonOneDynamicURLDetails = "";
            string UserButtonTwoDynamicURLDetails = "";
            string MediaURLDetails = "";
            string langcode = "";
            string MessageContent = "";
            WhatsappSent watsAppSent = new WhatsappSent();
            List<MLWhatsappSent> whatsappSentList = new List<MLWhatsappSent>();
            List<WhatsAppTemplateUrl> whatsappUrlList = new List<WhatsAppTemplateUrl>();

            int SentCount = 0;
            int FailureCount = 0;
            int UnsubscribedCount = 0;
            List<Tuple<string, string>> whatsappSuccessContactList = new List<Tuple<string, string>>();
            List<Tuple<string, string>> whatsappErrorContactList = new List<Tuple<string, string>>();

            using (var objDL = DLWhatsAppConfiguration.GetDLWhatsAppConfiguration(objDto.accountId, SQLProvider))
            {
                whatsappConfiguration = await objDL.GetConfigurationDetailsForSending(whatsappSendingSetting.WhatsAppConfigurationNameId);
            }

            if (whatsappConfiguration != null && whatsappConfiguration.Id > 0)
            {
                List<GroupMember> GroupMemberList;
                using (var objDL = DLGroupMember.GetDLGroupMember(objDto.accountId, SQLProvider))
                {
                    GroupMemberList = await objDL.GET(new GroupMember() { GroupId = whatsappSendingSetting.GroupId }, -1, -1, "");
                }

                if (GroupMemberList != null && GroupMemberList.Count > 0)
                {
                    List<int> ContactIdList = GroupMemberList.Select(x => x.ContactId).Distinct().ToList();
                    if (ContactIdList != null && ContactIdList.Count > 0 && ContactIdList.Count <= 30)
                    {
                        LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

                        string SendingSettingName = ("Test_" + Helper.GenerateUniqueNumber() + "_" + whatsappSendingSetting.Name);

                        whatsappSendingSetting.Name = SendingSettingName.Length > 50 ? SendingSettingName.Substring(0, 50) : SendingSettingName;
                        whatsappSendingSetting.UserInfoUserId = user.UserId;
                        whatsappSendingSetting.UserGroupId = user.UserGroupIdList.Count > 0 ? user.UserGroupIdList[0] : 0;
                        whatsappSendingSetting.ScheduledStatus = 1;
                        whatsappSendingSetting.TotalContact = ContactIdList.Count;
                        whatsappSendingSetting.ScheduledDate = DateTime.Now;

                        using (var objDL = DLWhatsAppSendingSetting.GetDLWhatsAppSendingSetting(objDto.accountId, SQLProvider))
                        {
                            whatsappSendingSetting.Id = await objDL.Save(whatsappSendingSetting);
                        }

                        if (whatsappSendingSetting.Id > 0)
                        {
                            List<Contact> contactList;
                            using (var objblcontact = DLContact.GetContactDetails(objDto.accountId, SQLProvider))
                            {
                                contactList = await objblcontact.GetAllContactList(ContactIdList, true);
                            }

                            string ProviderName = whatsappConfiguration.ProviderName.ToLower();
                            string CountryCode = "";

                            if (!string.IsNullOrEmpty(whatsappConfiguration.CountryCode))
                                CountryCode = whatsappConfiguration.CountryCode;

                            WhatsAppTemplates whatsapptemplateDetails;

                            using (var objDLTemplate = DLWhatsAppTemplates.GetDLWhatsAppTemplates(objDto.accountId, SQLProvider))
                            {
                                whatsapptemplateDetails = await objDLTemplate.GetSingle(whatsappSendingSetting.WhatsAppTemplateId);
                            }

                            using (var objsmstempUrl = DLWhatsappTemplateUrl.GetDLWhatsappTemplateUrl(objDto.accountId, SQLProvider))
                            {
                                whatsappUrlList = await objsmstempUrl.GetDetail(whatsappSendingSetting.WhatsAppTemplateId);
                            }

                            if (whatsapptemplateDetails != null)
                            {
                                WhatsAppLanguageCodes whatsapplanguagecodes;

                                using (var objDLTemplate = DLWhatsAppLanguageCodes.GetDLWhatsAppLanguageCodes(objDto.accountId, SQLProvider))
                                {
                                    whatsapplanguagecodes = await objDLTemplate.GetWhatsAppShortenLanguageCode(whatsappConfiguration.ProviderName, whatsapptemplateDetails.TemplateLanguage);
                                }

                                HelperForSMS HelpSMS = new HelperForSMS(objDto.accountId, SQLProvider);
                                HelperForWhatsApp HelpWhatsApp = new HelperForWhatsApp(objDto.accountId, SQLProvider);

                                List<WhatsappSent> smsSentList = new List<WhatsappSent>();

                                for (int i = 0; i < contactList.Count; i++)
                                {
                                    UserAttributeMessageDetails = string.Empty;
                                    UserButtonOneDynamicURLDetails = string.Empty;
                                    UserButtonTwoDynamicURLDetails = string.Empty;

                                    string P5WhatsappUniqueID = Guid.NewGuid().ToString();
                                    StringBuilder UserAttrBodydata = new StringBuilder();
                                    StringBuilder UserButtonOneBodydata = new StringBuilder();
                                    StringBuilder UserButtonTwoBodydata = new StringBuilder();
                                    StringBuilder MediaUrlBodyData = new StringBuilder();

                                    StringBuilder Bodydata = new StringBuilder();
                                    Bodydata.Clear().Append(MessageContent);
                                    //HelpSMS.ReplaceContactDetails(Bodydata, contactList[i]);
                                    HelpSMS.ReplaceContactDetails(Bodydata, contactList[i], objDto.accountId, "", whatsappSendingSetting.WhatsAppTemplateId, 0, P5WhatsappUniqueID, "whatsapp", whatsapptemplateDetails.ConvertLinkToShortenUrl);

                                    string ReplacedMessageContent = Bodydata.ToString();

                                    if (!string.IsNullOrEmpty(whatsapptemplateDetails.MediaFileURL))
                                    {
                                        MediaUrlBodyData.Append(whatsapptemplateDetails.MediaFileURL);
                                        //HelpSMS.ReplaceContactDetails(MediaUrlBodyData, contactList[i]);
                                        HelpSMS.ReplaceContactDetails(Bodydata, contactList[i], objDto.accountId, "", whatsappSendingSetting.WhatsAppTemplateId, 0, P5WhatsappUniqueID, "whatsapp", whatsapptemplateDetails.ConvertLinkToShortenUrl);

                                        MediaURLDetails = MediaUrlBodyData.ToString();
                                    }

                                    if (!string.IsNullOrEmpty(whatsapptemplateDetails.UserAttributes))
                                    {
                                        string UserAttributes = whatsapptemplateDetails.UserAttributes;
                                        UserAttrBodydata.Clear().Append(UserAttributes);
                                        HelpWhatsApp.ReplaceMessageWithWhatsAppUrl("campaign", UserAttrBodydata, whatsappSendingSetting.Id, contactList[i].ContactId, whatsappUrlList, P5WhatsappUniqueID, 0, true);
                                        HelpSMS.ReplaceContactDetails(UserAttrBodydata, contactList[i], objDto.accountId, "", whatsappSendingSetting.WhatsAppTemplateId, 0, P5WhatsappUniqueID, "whatsapp", whatsapptemplateDetails.ConvertLinkToShortenUrl);
                                        UserAttributeMessageDetails = UserAttrBodydata.ToString();
                                    }

                                    if (!string.IsNullOrEmpty(whatsapptemplateDetails.ButtonOneDynamicURLSuffix))
                                    {
                                        string ButtonOneMessage = whatsapptemplateDetails.ButtonOneDynamicURLSuffix;

                                        UserButtonOneBodydata.Clear().Append(ButtonOneMessage);
                                        ConvertWhatsAppURLToShortenCode helpconvert = new ConvertWhatsAppURLToShortenCode(objDto.accountId, SQLProvider);
                                        helpconvert.GenerateShortenLinkByUrl(UserButtonOneBodydata, contactList[i], Convert.ToInt32(whatsapptemplateDetails.Id), whatsappSendingSetting.Id, P5WhatsappUniqueID);
                                        HelpWhatsApp.ReplaceMessageWithWhatsAppUrl("campaign", UserButtonOneBodydata, whatsappSendingSetting.Id, contactList[i].ContactId, whatsappUrlList, P5WhatsappUniqueID, 0);
                                        HelpSMS.ReplaceContactDetails(UserButtonOneBodydata, contactList[i], objDto.accountId, "", whatsappSendingSetting.WhatsAppTemplateId, 0, P5WhatsappUniqueID, "whatsapp", whatsapptemplateDetails.ConvertLinkToShortenUrl);
                                        UserButtonOneDynamicURLDetails = UserButtonOneBodydata.ToString();
                                    }

                                    if (!string.IsNullOrEmpty(whatsapptemplateDetails.ButtonTwoDynamicURLSuffix))
                                    {
                                        string ButtonTwoMessage = whatsapptemplateDetails.ButtonTwoDynamicURLSuffix;
                                        UserButtonTwoBodydata.Clear().Append(ButtonTwoMessage);
                                        ConvertWhatsAppURLToShortenCode helpconvert = new ConvertWhatsAppURLToShortenCode(objDto.accountId, SQLProvider);
                                        helpconvert.GenerateShortenLinkByUrl(UserButtonTwoBodydata, contactList[i], Convert.ToInt32(whatsapptemplateDetails.Id), whatsappSendingSetting.Id, P5WhatsappUniqueID);
                                        HelpWhatsApp.ReplaceMessageWithWhatsAppUrl("campaign", UserButtonTwoBodydata, whatsappSendingSetting.Id, contactList[i].ContactId, whatsappUrlList, P5WhatsappUniqueID, 0);
                                        HelpSMS.ReplaceContactDetails(UserButtonTwoBodydata, contactList[i], objDto.accountId, "", whatsappSendingSetting.WhatsAppTemplateId, 0, P5WhatsappUniqueID, "whatsapp", whatsapptemplateDetails.ConvertLinkToShortenUrl);
                                        UserButtonTwoDynamicURLDetails = UserButtonTwoBodydata.ToString();
                                    }

                                    if (whatsapplanguagecodes != null && !string.IsNullOrEmpty(whatsapplanguagecodes.ShortenLanguageCode))
                                        langcode = whatsapplanguagecodes.ShortenLanguageCode;

                                    if (UserAttributeMessageDetails.Contains("[{*") && UserAttributeMessageDetails.Contains("*}]"))
                                    {
                                        FailureCount++;
                                        whatsappErrorContactList.Add(new Tuple<string, string>(Helper.MaskPhoneNumber(contactList[i].PhoneNumber), "User Attributes dynamic content not replaced"));

                                        WhatsappSent watsappsent = new WhatsappSent()
                                        {
                                            MediaFileURL = MediaURLDetails,
                                            PhoneNumber = contactList[i].PhoneNumber,
                                            UserAttributes = UserAttributeMessageDetails,
                                            ButtonOneDynamicURLSuffix = UserButtonOneDynamicURLDetails,
                                            ButtonTwoDynamicURLSuffix = UserButtonTwoDynamicURLDetails,
                                            CampaignJobName = "campaign",
                                            ContactId = contactList[i].ContactId,
                                            GroupId = whatsappSendingSetting.GroupId,
                                            MessageContent = whatsapptemplateDetails.TemplateContent,
                                            WhatsappSendingSettingId = whatsappSendingSetting.Id,
                                            WhatsappTemplateId = whatsapptemplateDetails.Id,
                                            VendorName = whatsappConfiguration.ProviderName,
                                            SentDate = DateTime.Now,
                                            IsDelivered = 0,
                                            IsClicked = 0,
                                            ErrorMessage = "Template dynamic content not replaced",
                                            SendStatus = 0,
                                            WorkFlowDataId = 0,
                                            WorkFlowId = 0,
                                            IsFailed = 1,
                                            P5WhatsappUniqueID = P5WhatsappUniqueID,
                                            WhatsAppConfigurationNameId = whatsappConfiguration.WhatsAppConfigurationNameId
                                        };

                                        using (var objDL = DLWhatsAppSent.GetDLWhatsAppSent(objDto.accountId, SQLProvider))
                                        {
                                            await objDL.Save(watsappsent);
                                        }
                                    }
                                    else if (UserButtonOneDynamicURLDetails.Contains("[{*") && UserButtonOneDynamicURLDetails.Contains("*}]"))
                                    {
                                        FailureCount++;
                                        whatsappErrorContactList.Add(new Tuple<string, string>(Helper.MaskPhoneNumber(contactList[i].PhoneNumber), "Template button one dynamic url content not replaced"));

                                        WhatsappSent watsappsent = new WhatsappSent()
                                        {
                                            MediaFileURL = MediaURLDetails,
                                            PhoneNumber = contactList[i].PhoneNumber,
                                            UserAttributes = UserAttributeMessageDetails,
                                            ButtonOneDynamicURLSuffix = UserButtonOneDynamicURLDetails,
                                            ButtonTwoDynamicURLSuffix = UserButtonTwoDynamicURLDetails,
                                            CampaignJobName = "campaign",
                                            ContactId = contactList[i].ContactId,
                                            GroupId = whatsappSendingSetting.GroupId,
                                            MessageContent = whatsapptemplateDetails.TemplateContent,
                                            WhatsappSendingSettingId = whatsappSendingSetting.Id,
                                            WhatsappTemplateId = whatsapptemplateDetails.Id,
                                            VendorName = whatsappConfiguration.ProviderName,
                                            SentDate = DateTime.Now,
                                            IsDelivered = 0,
                                            IsClicked = 0,
                                            ErrorMessage = "Template dynamic content not replaced",
                                            SendStatus = 0,
                                            WorkFlowDataId = 0,
                                            WorkFlowId = 0,
                                            IsFailed = 1,
                                            P5WhatsappUniqueID = P5WhatsappUniqueID,
                                            WhatsAppConfigurationNameId = whatsappConfiguration.WhatsAppConfigurationNameId
                                        };

                                        using (var objDL = DLWhatsAppSent.GetDLWhatsAppSent(objDto.accountId, SQLProvider))
                                        {
                                            await objDL.Save(watsappsent);
                                        }
                                    }
                                    else if (UserButtonTwoDynamicURLDetails.Contains("[{*") && UserButtonTwoDynamicURLDetails.Contains("*}]"))
                                    {
                                        FailureCount++;
                                        whatsappErrorContactList.Add(new Tuple<string, string>(Helper.MaskPhoneNumber(contactList[i].PhoneNumber), "Template button two dynamic url content not replaced"));

                                        WhatsappSent watsappsent = new WhatsappSent()
                                        {
                                            MediaFileURL = MediaURLDetails,
                                            PhoneNumber = contactList[i].PhoneNumber,
                                            UserAttributes = UserAttributeMessageDetails,
                                            ButtonOneDynamicURLSuffix = UserButtonOneDynamicURLDetails,
                                            ButtonTwoDynamicURLSuffix = UserButtonTwoDynamicURLDetails,
                                            CampaignJobName = "campaign",
                                            ContactId = contactList[i].ContactId,
                                            GroupId = whatsappSendingSetting.GroupId,
                                            MessageContent = whatsapptemplateDetails.TemplateContent,
                                            WhatsappSendingSettingId = whatsappSendingSetting.Id,
                                            WhatsappTemplateId = whatsapptemplateDetails.Id,
                                            VendorName = whatsappConfiguration.ProviderName,
                                            SentDate = DateTime.Now,
                                            IsDelivered = 0,
                                            IsClicked = 0,
                                            ErrorMessage = "Template dynamic content not replaced",
                                            SendStatus = 0,
                                            WorkFlowDataId = 0,
                                            WorkFlowId = 0,
                                            IsFailed = 1,
                                            P5WhatsappUniqueID = P5WhatsappUniqueID,
                                            WhatsAppConfigurationNameId = whatsappConfiguration.WhatsAppConfigurationNameId
                                        };

                                        using (var objDL = DLWhatsAppSent.GetDLWhatsAppSent(objDto.accountId, SQLProvider))
                                        {
                                            await objDL.Save(watsappsent);
                                        }
                                    }
                                    else
                                    {
                                        MLWhatsappSent mlwatsappsent = new MLWhatsappSent()
                                        {
                                            MediaFileURL = MediaURLDetails,
                                            CountryCode = !string.IsNullOrEmpty(contactList[i].CountryCode) ? contactList[i].CountryCode : !string.IsNullOrEmpty(CountryCode) ? CountryCode : "91",
                                            PhoneNumber = contactList[i].PhoneNumber,
                                            WhiteListedTemplateName = whatsapptemplateDetails.WhitelistedTemplateName,
                                            LanguageCode = langcode,
                                            UserAttributes = UserAttributeMessageDetails,
                                            ButtonOneText = whatsapptemplateDetails.ButtonOneText,
                                            ButtonTwoText = whatsapptemplateDetails.ButtonTwoText,
                                            ButtonOneDynamicURLSuffix = UserButtonOneDynamicURLDetails,
                                            ButtonTwoDynamicURLSuffix = UserButtonTwoDynamicURLDetails,
                                            CampaignJobName = "campaign",
                                            ContactId = contactList[i].ContactId,
                                            GroupId = whatsappSendingSetting.GroupId,
                                            MessageContent = whatsapptemplateDetails.TemplateContent,
                                            WhatsappSendingSettingId = whatsappSendingSetting.Id,
                                            WhatsappTemplateId = whatsapptemplateDetails.Id,
                                            VendorName = whatsappConfiguration.ProviderName,
                                            P5WhatsappUniqueID = P5WhatsappUniqueID
                                        };
                                        whatsappSentList.Add(mlwatsappsent);
                                    }
                                }

                                if (whatsappSentList != null && whatsappSentList.Count > 0)
                                {
                                    IBulkWhatsAppSending WhatsAppGeneralBaseFactory = Plumb5GenralFunction.WhatsAppGeneralBaseFactory.GetWhatsAppVendor(objDto.accountId, whatsappConfiguration, "campaign");
                                    SentStatus = WhatsAppGeneralBaseFactory.SendWhatsApp(whatsappSentList);
                                    string ErrorMessage = WhatsAppGeneralBaseFactory.ErrorMessage;

                                    if (WhatsAppGeneralBaseFactory.VendorResponses != null && WhatsAppGeneralBaseFactory.VendorResponses.Count > 0)
                                    {
                                        for (int i = 0; i < WhatsAppGeneralBaseFactory.VendorResponses.Count; i++)
                                        {
                                            WhatsappSent watsappsent = new WhatsappSent();

                                            ResponseId = WhatsAppGeneralBaseFactory.VendorResponses[i].ResponseId;
                                            Helper.Copy(WhatsAppGeneralBaseFactory.VendorResponses[i], watsAppSent);
                                            watsAppSent.SentDate = DateTime.Now;
                                            watsAppSent.IsDelivered = 0;
                                            watsAppSent.IsClicked = 0;
                                            watsAppSent.P5WhatsappUniqueID = WhatsAppGeneralBaseFactory.VendorResponses[i].P5WhatsappUniqueID;
                                            watsAppSent.WhatsAppConfigurationNameId = whatsappConfiguration.WhatsAppConfigurationNameId;

                                            if (WhatsAppGeneralBaseFactory.VendorResponses[i].SendStatus == 0)
                                            {
                                                FailureCount++;
                                                whatsappErrorContactList.Add(new Tuple<string, string>(Helper.MaskPhoneNumber(WhatsAppGeneralBaseFactory.VendorResponses[i].PhoneNumber), WhatsAppGeneralBaseFactory.VendorResponses[i].ErrorMessage));
                                            }
                                            else if (WhatsAppGeneralBaseFactory.VendorResponses[i].SendStatus == 1)
                                            {
                                                SentCount++;
                                                whatsappSuccessContactList.Add(new Tuple<string, string>(Helper.MaskPhoneNumber(WhatsAppGeneralBaseFactory.VendorResponses[i].PhoneNumber), WhatsAppGeneralBaseFactory.VendorResponses[i].ResponseId));
                                            }
                                            else
                                            {
                                                FailureCount++;
                                                whatsappErrorContactList.Add(new Tuple<string, string>(Helper.MaskPhoneNumber(WhatsAppGeneralBaseFactory.VendorResponses[i].PhoneNumber), ErrorMessage));
                                            }

                                            using (var objDL = DLWhatsAppSent.GetDLWhatsAppSent(objDto.accountId, SQLProvider))
                                            {
                                                await objDL.Save(watsAppSent);
                                            }
                                        }

                                        // Update WhatsAppSendingSetting TotalSent and TotalNotSent Count
                                        using (var objDLStats = DLWhatsAppSendingSetting.GetDLWhatsAppSendingSetting(objDto.accountId, SQLProvider))
                                        {
                                            await objDLStats.UpdateSentCount(whatsappSendingSetting.Id, SentCount, FailureCount);
                                        }
                                    }
                                    Message = "Out of " + contactList.Count + "," + SentCount + " has been sent successfully, " + FailureCount + " has been not sent, and " + UnsubscribedCount + " has been opted out from the channel.";
                                }
                                else
                                {
                                    Message = "Out of " + contactList.Count + "," + SentCount + " has been sent successfully, " + FailureCount + " has been not sent, and " + UnsubscribedCount + " has been opted out from the channel.";
                                }
                            }
                            else
                            {
                                Message = "Template Not Found";
                            }

                        }
                        else
                        {
                            Message = "With this identifier name already test campaign has been sent";
                        }
                    }
                    else
                    {
                        Message = "Total contact in the test group should be less than 30";
                    }
                }
                else
                {
                    Message = "There are no contacts in the selected group to send whatsapp.";
                }

            }
            else
            {
                Message = "You have not configured for whatsapp";
            }

            return Json(new
            {
                SentCount,
                FailureCount,
                UnsubscribedCount,
                Message,
                MessageContent,
                SuccessList = whatsappSuccessContactList,
                ErrorList = whatsappErrorContactList
            });
        }
        [HttpPost]
        public async Task<JsonResult> CheckCounselorTags([FromBody] WhatsAppTemplates_CheckCounselorTagsDto objDto)
        {
            bool result = false;
            string MessageContent = "", MediaFileURL = "", UserAttributes = "", ButtonOneDynamicURLSuffix = "", ButtonTwoDynamicURLSuffix = "", ButtonOneText = "", ButtonTwoText = "";
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            WhatsAppTemplates appTemplate = null;
            using (var objDL = DLWhatsAppTemplates.GetDLWhatsAppTemplates(domainDetails.AdsId, SQLProvider))
                appTemplate = await objDL.GetSingle(objDto.whatsappTemplate.Id);


            MessageContent = System.Web.HttpUtility.HtmlDecode(appTemplate.TemplateContent);
            UserAttributes = System.Web.HttpUtility.HtmlDecode(appTemplate.UserAttributes);
            ButtonOneDynamicURLSuffix = System.Web.HttpUtility.HtmlDecode(appTemplate.ButtonOneDynamicURLSuffix);
            ButtonTwoDynamicURLSuffix = System.Web.HttpUtility.HtmlDecode(appTemplate.ButtonTwoDynamicURLSuffix);
            MediaFileURL = System.Web.HttpUtility.HtmlDecode(appTemplate.MediaFileURL);
            ButtonOneText = System.Web.HttpUtility.HtmlDecode(appTemplate.ButtonOneText);
            ButtonTwoText = System.Web.HttpUtility.HtmlDecode(appTemplate.ButtonTwoText);

            if ((!String.IsNullOrEmpty(MessageContent) && MessageContent.Contains("[{*Signatory") && MessageContent.Contains("*}]")) || (!String.IsNullOrEmpty(UserAttributes) && UserAttributes.Contains("[{*Signatory") && UserAttributes.Contains("*}]")) || (!String.IsNullOrEmpty(ButtonOneDynamicURLSuffix) && ButtonOneDynamicURLSuffix.Contains("[{*Signatory") && ButtonOneDynamicURLSuffix.Contains("*}]")) || (!String.IsNullOrEmpty(ButtonTwoDynamicURLSuffix) && ButtonTwoDynamicURLSuffix.Contains("[{*Signatory") && ButtonTwoDynamicURLSuffix.Contains("*}]")) || (!String.IsNullOrEmpty(MediaFileURL) && MediaFileURL.Contains("[{*Signatory") && MediaFileURL.Contains("*}]")) || (!String.IsNullOrEmpty(ButtonOneText) && ButtonOneText.Contains("[{*Signatory") && ButtonOneText.Contains("*}]")) || (!String.IsNullOrEmpty(ButtonTwoText) && ButtonTwoText.Contains("[{*Signatory") && ButtonTwoText.Contains("*}]")))
            {
                result = true;
            }

            return Json(result);
        }
        [HttpPost]
        public async Task<ActionResult> GetTemplate([FromBody] WhatsAppTemplates_GetTemplateDto objDto)
        {
            WhatsAppTemplates whatsappTemplate = null;
            using (var objBL = DLWhatsAppTemplates.GetDLWhatsAppTemplates(objDto.accountId, SQLProvider))
            {
                whatsappTemplate = await objBL.GetTemplateArchive(objDto.TemplateName);
            }

            var getdata = JsonConvert.SerializeObject(whatsappTemplate, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");
        }
        [HttpPost]
        public async Task<JsonResult> UpdateTemplateStatus([FromBody] WhatsAppTemplates_UpdateTemplateStatusDto objDto)
        {
            bool result = false;

            using (var objBL = DLWhatsAppTemplates.GetDLWhatsAppTemplates(objDto.accountId, SQLProvider))
            {
                result = await objBL.UpdateTemplateStatus(objDto.TemplateId);
            }

            return Json(result);
        }
    }
}
