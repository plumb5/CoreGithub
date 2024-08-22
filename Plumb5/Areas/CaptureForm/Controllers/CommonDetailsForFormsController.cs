using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using NPOI.HSSF.UserModel;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.CaptureForm.Dto;
using Plumb5.Areas.CaptureForm.Models;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Globalization;
using System.Net;
using System.Net.Mail;

namespace Plumb5.Areas.CaptureForm.Controllers
{
    [Area("CaptureForm")]
    public class CommonDetailsForFormsController : BaseController
    {
        public CommonDetailsForFormsController(IConfiguration _configuration) : base(_configuration)
        { }

        //
        // GET: /CaptureForm/CommonDetailsForForms/

        public ActionResult Index()
        {
            return View();
        }

        public class GenericObject
        {
            public string value { get; set; }
            public string label { get; set; }
            public string assignedValue { get; set; }
        }

        [HttpPost]
        public async Task<JsonResult> GetTemplate()
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
                LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

                MailTemplate template = new MailTemplate() { UserInfoUserId = user.UserId };
                using (var GetTemplate = DLMailTemplate.GetDLMailTemplate(account.AdsId, SQLProvider))
                {
                    List<string> fieldName = new List<string>() { "Id", "Name", "SpamScore" };
                    List<MailTemplate> templateList = await GetTemplate.GET(template, 0, 0, null, fieldName);
                    return Json(new { Data = templateList });
                }
            }
            return null;
        }

        [HttpPost]
        public async Task<JsonResult> GetGroups()
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
                LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));


                List<int> UserInfoUserIdList = (user.Members != null && user.Members.Count > 0) ? user.Members.Select(x => x.UserInfoUserId).ToList<int>() : null;
                using (var GetGroups = DLGroups.GetDLGroups(account.AdsId, SQLProvider))
                {
                    Groups group = new Groups() { UserInfoUserId = user.UserId };
                    List<Groups> groupsList = await GetGroups.GetDetails(group, 0, 0, null);
                    return Json(new { Data = groupsList });
                }

                //return Json(groupsList, JsonRequestBehavior.AllowGet);

            }
            return null;
        }

        [HttpPost]
        public async Task<JsonResult> GetCityName([FromBody] CommonDetailsForForms_CommonDto commonDetails)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                using (var GetGCityList = DLIpligenceCityList.GetDLIpligenceCityList(SQLProvider))
                {
                    List<IpligenceCityList> CityList = await GetGCityList.GET(commonDetails.value);
                    List<GenericObject> CityNameList = new List<GenericObject>();

                    foreach (IpligenceCityList City in CityList)
                    {
                        CityNameList.Add(new GenericObject() { value = City.CityName, label = City.CityName });
                    }

                    //return Json(CityNameList, JsonRequestBehavior.AllowGet);
                    return Json(new { Data = CityNameList });
                }
            }
            return null;
        }

        [HttpPost]
        public async Task<JsonResult> GetStateName([FromBody] CommonDetailsForForms_CommonDto commonDetails)
        {
            DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                using (var objGetstateList = DLIpligenceStateList.GetDLIpligenceStateList(account.AdsId, SQLProvider))
                {
                    List<P5GenralML.IpligenceDAS> StateList = await objGetstateList.GetStateList(commonDetails.value);
                    List<GenericObject> StateNameList = new List<GenericObject>();

                    if (StateList != null && StateList.Count() > 0)
                    {
                        for (int i = 0; i < StateList.Count(); i++)
                            StateNameList.Add(new GenericObject() { value = StateList[i].state_name, label = StateList[i].state_name });
                    }

                    return Json(new { Data = StateNameList });
                }
            }
            return null;
        }

        [HttpPost]
        public async Task<JsonResult> GetEvetList([FromBody] CommonDetailsForForms_CommonDto commonDetails)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

                List<GenericObject> EventNameTag = new List<GenericObject>();
                using (var objEvent = DLEventSetting.GetDLEventSetting(account.AdsId, SQLProvider))
                {
                    List<EventSetting> eventDetailsList = await objEvent.GET(commonDetails.value);

                    if (eventDetailsList != null && eventDetailsList.Count > 0)
                    {
                        foreach (var eventDetails in eventDetailsList)
                        {
                            List<string> EventName = eventDetails.EventName.Split(',').Select(tag => tag.ToString().Trim()).Where(tag => !string.IsNullOrEmpty(tag.Trim())).ToList();

                            foreach (string Tagname in EventName)
                            {
                                EventNameTag.Add(new GenericObject() { value = Tagname, label = Tagname });
                            }
                        }
                    }

                    // return Json(EventNameTag, JsonRequestBehavior.AllowGet);
                    return Json(new { Data = EventNameTag });
                }
            }
            return null;
        }

        [HttpPost]
        public async Task<JsonResult> GetProductList([FromBody] CommonDetailsForForms_CommonDto commonDetails)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

                using (var objEvent = DLProduct.GetDLProduct(account.AdsId, SQLProvider))
                {
                    List<Product> products = (await objEvent.GET(commonDetails.value, 0, 10)).ToList();
                    List<GenericObject> productList = new List<GenericObject>();
                    foreach (Product product in products)
                    {
                        productList.Add(new GenericObject() { value = product.Id.ToString(), label = product.Name });
                    }

                    //return Json(productList, JsonRequestBehavior.AllowGet);
                    return Json(new { Data = productList });
                }
            }
            return null;
        }

        [HttpPost]
        public async Task<JsonResult> GetFormsList()
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
                LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
                List<int> UserInfoUserIdList = (user.Members != null && user.Members.Count > 0) ? user.Members.Select(x => x.UserInfoUserId).ToList<int>() : null;
                FormDetails formDetail = new FormDetails() { UserInfoUserId = user.UserId };
                List<string> fields = new List<string>() { "Id", "Heading", "FormType", "FormIdentifier", "EmbeddedFormOrPopUpFormOrTaggedForm" };

                var objDLform = DLFormDetails.GetDLFormDetails(account.AdsId, SQLProvider);
                List<FormDetails> formsList = await objDLform.GET(formDetail, -1, -1, null, fields, false, UserInfoUserIdList, user.IsSuperAdmin);

                //return Json(formsList, JsonRequestBehavior.AllowGet);
                return Json(new
                {
                    Data = formsList
                });
            }
            return null;
        }

        [HttpPost]
        public async Task<JsonResult> GetInPageFormsList()
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
                LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
                List<int> UserInfoUserIdList = (user.Members != null && user.Members.Count > 0) ? user.Members.Select(x => x.UserInfoUserId).ToList<int>() : null;
                FormDetails formDetail = new FormDetails() { OnPageOrInPage = false, UserInfoUserId = user.UserId };
                List<string> fields = new List<string>() { "Id", "Heading", "FormType" };
                using var objDLform = DLFormDetails.GetDLFormDetails(account.AdsId, SQLProvider);
                List<FormDetails> formsList = await objDLform.GET(formDetail, -1, -1, null, fields, false, UserInfoUserIdList, user.IsSuperAdmin);

                formsList = formsList.Where(x => x.FormType != 19).ToList();

                //return Json(formsList, JsonRequestBehavior.AllowGet);
                return Json(new
                {
                    Data = formsList
                });

            }
            return null;
        }

        [HttpPost]
        public async Task<JsonResult> UserNameList()
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
                DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

                List<MLUserHierarchy> userHierarchy = null;

                using (var objUserHierarchy = DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
                {
                    userHierarchy = await objUserHierarchy.GetHisUsers(user.UserId, account.AdsId);
                }

                //using (DLUserGroupMembers objUserGroup = new DLUserGroupMembers())
                //{
                //    foreach (int UGroupId in user.UserGroupIdList)
                //        userHierarchy = userHierarchy.Union(objUserGroup.GetHisUsers(UGroupId)).ToList();
                //}

                // return Json(userHierarchy, JsonRequestBehavior.AllowGet);
                return Json(new
                {
                    Data = userHierarchy
                });
            }
            return null;
        }

        [HttpPost]
        public async Task<JsonResult> LmsStage()
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
                using var objDL = DLLmsStage.GetDLLmsStage(account.AdsId, SQLProvider);
                List<LmsStage> lmsStageList = new List<LmsStage>();

                lmsStageList = await objDL.GetAllList();

                // return Json(lmsStageList, JsonRequestBehavior.AllowGet);
                return Json(new
                {
                    Data = lmsStageList
                });
            }
            return null;
        }

        [HttpPost]
        public async Task<JsonResult> GetFields([FromBody] CommonDetailsForForms_GetFields commonDetails)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
                List<FormFields> formFields = new List<FormFields>();
                FormDetails formDetails = new FormDetails();
                formDetails.Id = commonDetails.FormId;

                using (var objFormField = DLFormFields.GetDLFormFields(account.AdsId, SQLProvider))
                {
                    formFields = (await objFormField.GET(commonDetails.FormId)).ToList();

                    if (formFields != null && formFields.Count() > 0)
                    {
                        formFields = formFields.OrderBy(s => s.FieldPriority).ToList();

                        int PhoneNumberFieldIndex = -1;

                        if (formFields.Any(x => x.FieldType == 3))
                            PhoneNumberFieldIndex = formFields.Select((field, index) => new { field, index }).First(x => x.field.FieldType == 3).index;

                        if (PhoneNumberFieldIndex > -1)
                            formFields[PhoneNumberFieldIndex].PhoneValidationType = WebUtility.HtmlDecode(formFields[PhoneNumberFieldIndex].PhoneValidationType);
                    }
                }

                using (var objformDetails = DLFormDetails.GetDLFormDetails(account.AdsId, SQLProvider))
                {
                    formDetails = await objformDetails.GETDetails(formDetails);
                }
                //return Json(new { formFields = formFields, formDetails = formDetails }, JsonRequestBehavior.AllowGet);
                return Json(new
                {
                    Data = new { formFields = formFields, formDetails = formDetails }
                });
            }
            return null;
        }

        [HttpPost]
        public async Task<JsonResult> LeadUnSeenMaxCount()
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                DomainInfo domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

                using (var objDL = DLLeadUnSeen.GetDLLeadUnSeen(domainDetails.AdsId, SQLProvider))
                {
                    //return Json(objDL.LeadUnSeenMaxCount(), JsonRequestBehavior.AllowGet);
                    return Json(new
                    {
                        Data = await objDL.LeadUnSeenMaxCount()
                    });
                }
            }
            return null;
        }

        [HttpPost]
        public async Task<JsonResult> GetActiveEmailIds()
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
                LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
                List<string> ListOfFromEmailds = new List<string>();
                FromEmailIdConfig fromemailConfig = new FromEmailIdConfig(account.AdsId, SQLProvider);

                List<MailConfigForSending> listOfEmailIds = await fromemailConfig.GetActiveEmails();

                ListOfFromEmailds = (from p in listOfEmailIds
                                     where p.FromEmailId == user.EmailId || p.ShowFromEmailIdBasedOnUserLogin == true
                                     select p.FromEmailId).ToList();

                //return Json(ListOfFromEmailds, JsonRequestBehavior.AllowGet);
                return Json(ListOfFromEmailds);
            }
            return null;
        }

        [HttpPost]
        public async Task<JsonResult> GetUserLoginFullDetails()
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

                UserInfo? userInfo = null;
                using (var objUserInfo = DLUserInfo.GetDLUserInfo(SQLProvider))
                {
                    userInfo = await objUserInfo.GetDetail(user.UserId);
                }
                //return Json(userInfo, JsonRequestBehavior.AllowGet);
                return Json(new
                {
                    Data = userInfo
                });
            }
            return null;
        }

        [HttpPost]
        public async Task<JsonResult> GetSmsTemplate()
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
                LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
                List<int> UserInfoUserIdList = (user.Members != null && user.Members.Count > 0) ? user.Members.Select(x => x.UserInfoUserId).ToList<int>() : null;
                using var GetTemplate = DLSmsTemplate.GetDLSmsTemplate(account.AdsId, SQLProvider);

                List<SmsTemplate> templateList = (await GetTemplate.GetAllTemplate(user.UserId, UserInfoUserIdList, user.IsSuperAdmin)).ToList();

                //return Json(templateList, JsonRequestBehavior.AllowGet);
                return Json(new
                {
                    Data = templateList
                });
            }
            return null;
        }

        [HttpPost]
        public async Task<JsonResult> GetWhatsAppTemplate()
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
                LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
                List<int> UserInfoUserIdList = (user.Members != null && user.Members.Count > 0) ? user.Members.Select(x => x.UserInfoUserId).ToList<int>() : null;
                using var GetTemplate = DLWhatsAppTemplates.GetDLWhatsAppTemplates(account.AdsId, SQLProvider);

                List<WhatsAppTemplates> templateList = await GetTemplate.GetAllTemplate(user.UserId, UserInfoUserIdList, user.IsSuperAdmin);

                //return Json(templateList, JsonRequestBehavior.AllowGet);
                return Json(new
                {
                    Data = templateList
                });
            }
            return null;
        }

        [HttpPost]
        public async Task<JsonResult> GetTopOneIdBasedOnFormType([FromBody] CommonDetailsForForms_GetTopOneIdBasedOnFormType commonDetails)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
                FormDetails? TopOneDesignDetails = new FormDetails();
                List<FormFields> fieldlist = new List<FormFields>();
                List<FormBanner> formBannerList = new List<FormBanner>();

                using var objDL = DLFormDetails.GetDLFormDetails(account.AdsId, SQLProvider);

                if ((commonDetails.FormType == 12 || commonDetails.FormType == 9 || commonDetails.FormType == 18) && HttpContext.Session.GetString("CaptureFormDesignFieldsList" + commonDetails.SessionUID) != null)
                {
                    fieldlist = JsonConvert.DeserializeObject<List<FormFields>>(HttpContext.Session.GetString("CaptureFormDesignFieldsList" + commonDetails.SessionUID));
                }

                if (HttpContext.Session.GetString("CaptureFormDesignBannerList" + commonDetails.SessionUID) != null)
                {
                    formBannerList = JsonConvert.DeserializeObject<List<FormBanner>>(HttpContext.Session.GetString("CaptureFormDesignBannerList" + commonDetails.SessionUID));
                }

                if (HttpContext.Session.GetString("CaptureFormDesignData" + commonDetails.SessionUID) != null)
                {
                    TopOneDesignDetails = JsonConvert.DeserializeObject<FormDetails>(HttpContext.Session.GetString("CaptureFormDesignData" + commonDetails.SessionUID));

                    var result = new { Message = "Widgets", DesignDetails = TopOneDesignDetails, FieldDetails = fieldlist, BannerDetails = formBannerList };

                    return Json(new
                    {
                        Data = result
                    });
                }
                else
                {
                    TopOneDesignDetails.Id = await objDL.GetTopOneIdBasedOnFormType(commonDetails.FormType);

                    if (TopOneDesignDetails.Id > 0)
                    {
                        TopOneDesignDetails = await objDL.GETDetails(TopOneDesignDetails);
                    }

                    var result = new { Message = "TopOneDesign", Data = TopOneDesignDetails };

                    return Json(new
                    {
                        Data = result
                    });
                }
            }
            return null;
        }

        [HttpPost]
        public async Task<JsonResult> GetAccountDetails()
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
                using (var objDL = DLAccount.GetDLAccount(SQLProvider))
                {
                    //return Json(objDL.GetAccountDetails(account.AdsId), JsonRequestBehavior.AllowGet);
                    Account? accounts = await objDL.GetAccountDetails(account.AdsId);
                    if (accounts != null)
                    {
                        Account accountss = new Account();
                        accountss.AccountId = accounts.AccountId; accountss.TrackerDomain = accounts.TrackerDomain;
                        return Json(new
                        {
                            Data = accountss
                        });
                    }
                    else
                    {
                        return Json(new
                        {
                            Data = accounts
                        });
                    }
                }
            }
            return null;
        }

        [HttpPost]
        public async Task<JsonResult> GetProductCategoryList([FromBody] CommonDetailsForForms_CommonDto commonDetails)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

                using var objEvent = DLProduct.GetDLProduct(account.AdsId, SQLProvider);
                List<Product> products = (await objEvent.GetCategories(commonDetails.value)).ToList();
                List<GenericObject> productList = new List<GenericObject>();
                foreach (Product product in products)
                {
                    productList.Add(new GenericObject() { value = product.Name.ToString(), label = product.Name });
                }

                //return Json(productList, JsonRequestBehavior.AllowGet);
                return Json(new
                {
                    Data = productList
                });

            }
            return null;
        }

        [HttpPost]
        public async Task<JsonResult> GetProductSubCategoryList([FromBody] CommonDetailsForForms_CommonDto commonDetails)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

                using var objEvent = DLProduct.GetDLProduct(account.AdsId, SQLProvider);
                List<Product> products = (await objEvent.GetSubCategories(commonDetails.value)).ToList();
                List<GenericObject> productList = new List<GenericObject>();
                foreach (Product product in products)
                {
                    productList.Add(new GenericObject() { value = product.Name.ToString(), label = product.Name });
                }

                //return Json(productList, JsonRequestBehavior.AllowGet);
                return Json(new
                {
                    Data = productList
                });
            }
            return null;
        }

        [HttpPost]
        public JsonResult SetCustomDesignSession([FromBody] CommonDetailsForForms_SetCustomDesignSession commonDetails)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                try
                {
                    string SessionUID = DateTime.Now.ToFileTime().ToString();

                    if (commonDetails.formFieldsList != null && commonDetails.formFieldsList.Count() > 0)
                        HttpContext.Session.SetString("CaptureFormDesignFieldsList" + SessionUID, JsonConvert.SerializeObject(Helper.GetListEncodeProperties(commonDetails.formFieldsList)));
                    else
                        HttpContext.Session.SetString("CaptureFormDesignFieldsList" + SessionUID, JsonConvert.SerializeObject(commonDetails.formFieldsList));

                    if (commonDetails.formDetails != null && (commonDetails.formDetails.FormType == 12 || commonDetails.formDetails.FormType == 9 || commonDetails.formDetails.FormType == 18))
                        HttpContext.Session.SetString("CaptureFormDesignData" + SessionUID, JsonConvert.SerializeObject(Helper.GetSingleEncodeProperties(commonDetails.formDetails)));
                    else
                        HttpContext.Session.SetString("CaptureFormDesignData" + SessionUID, JsonConvert.SerializeObject(commonDetails.formDetails));

                    HttpContext.Session.SetString("CaptureFormDesignBannerList" + SessionUID, JsonConvert.SerializeObject(commonDetails.formBannerList));

                    return Json(new { Status = true, SessionUID = SessionUID });
                }
                catch
                {
                    return Json(new { Status = false, SessionUID = "" });
                }
            }
            return null;
        }

        [HttpPost]
        public async Task<JsonResult> PurchaseFeature()
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                DomainInfo domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
                List<Purchase> Details = null;
                object data;
                int UserId = 0;
                using (var account = DLAccount.GetDLAccount(SQLProvider))
                {
                    UserId = (await account.GetAccountDetails(domainDetails.AdsId)).UserInfoUserId;
                }

                using (var obj = DLPurchase.GetDLPurchase(SQLProvider))
                {
                    Details = await obj.GetDetail(UserId);

                    data = from feature in Details
                           where feature.FeatureId == 14
                           select feature;

                }
                return Json(data);
            }
            return null;
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> SaveOrUpdateFormFields([FromBody] FormFields formfields)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            bool result = false;
            //#region Logs 
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(account.AdsId, user.UserId, user.UserName, user.EmailId, "CommonDetailsForForms", "CaptureForm", "SaveOrUpdateFormFields", Helper.GetIP(), JsonConvert.SerializeObject(formfields));
            //#endregion

            using (var objbFormFields = DLFormFields.GetDLFormFields(account.AdsId, SQLProvider))
            {
                if (formfields.Id <= 0)
                {
                    formfields.Id = await objbFormFields.Save(formfields);
                    result = formfields.Id > 0 ? true : false;

                    //if (result == true)
                    //    LogMessage = "Form details saved successfully";
                    //else
                    //    LogMessage = "Unable to save Form details  ";

                }
                else if (formfields.Id > 0)
                {
                    result = await objbFormFields.Update(formfields);

                    //if (result == true)
                    //    LogMessage = "Form details updated successfully";
                    //else
                    //    LogMessage = "Unable to update Form details  ";
                }
            }
            //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { formfields = formfields, result = result }), LogMessage);
            return Json(new { formfields = formfields, result = result });
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> SaveOrUpdateCampaignDetails([FromBody] CommonDetailsForForms_SaveOrUpdateCampaignDetails commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            bool Status = false;

            if (HttpContext.Session.GetString("UserInfo") != null && commonDetails.Id > 0)
            {
                using (var objbFormFields = DLFormDetails.GetDLFormDetails(account.AdsId, SQLProvider))
                    Status = await objbFormFields.UpdateCampaignIdentifier(commonDetails.Id, commonDetails.ClientCampaignIdentifier, commonDetails.CamapignId, commonDetails.CampaignIdentiferName, commonDetails.IsOtpForm, commonDetails.OTPFormId, commonDetails.IsWebOrMobileForm, commonDetails.OTPGenerationLimits, commonDetails.OTPPageRestrictions, commonDetails.IsClickToCallForm, commonDetails.IsVerifiedEmail, commonDetails.IsAutoWhatsApp, commonDetails.BlockEmailIds);
            }

            return Json(Status);
        }

        [HttpPost]
        public async Task<JsonResult> GetCampaignIdentifierDetails([FromBody] CommonDetailsForForms_CommonDto commonDetails)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

                List<GenericObject> campaignIdentifierList = new List<GenericObject>();
                CampaignIdentifier identifier = new CampaignIdentifier();
                identifier.Name = commonDetails.value;
                using var objEvent = DLCampaignIdentifier.GetDLCampaignIdentifier(account.AdsId, SQLProvider);
                List<CampaignIdentifier> campaignDetailsList = await objEvent.GetList(identifier, 0, 0);

                if (campaignDetailsList != null && campaignDetailsList.Count() > 0)
                {
                    foreach (CampaignIdentifier campaignDetails in campaignDetailsList)
                    {
                        campaignIdentifierList.Add(new GenericObject() { value = campaignDetails.Name.ToString(), label = campaignDetails.Name, assignedValue = campaignDetails.Id.ToString() });
                    }
                }

                return Json(new
                {
                    Data = campaignIdentifierList
                });
            }
            return null;
        }

        [HttpPost]
        public async Task<JsonResult> GetCampaignIdentifierDetailsList()
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
                CampaignIdentifier identifier = new CampaignIdentifier();
                using var objcampaign = DLCampaignIdentifier.GetDLCampaignIdentifier(account.AdsId, SQLProvider);
                List<CampaignIdentifier> campaignDetailsList = await objcampaign.GetList(identifier, 0, 0);

                return Json(new
                {
                    Data = campaignDetailsList
                });
            }
            return null;
        }

        [HttpPost]
        public async Task<JsonResult> GetOTPForms([FromBody] CommonDetailsForForms_GetOTPForms commonDetails)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
                LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

                using var objDL = DLFormDetails.GetDLFormDetails(account.AdsId, SQLProvider);
                List<FormDetails> OtpFormList = await objDL.GetOTPForms(commonDetails.FormType);

                return Json(OtpFormList);
            }
            return null;
        }

        [HttpPost]
        public ActionResult GetFormRespondedNamesByContactId([FromBody] CommonDetailsForForms_GetFormRespondedNamesByContactId commonDetails)
        {
            DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            using (var objDL = DLFormResponses.GetDLFormResponses(account.AdsId, SQLProvider))
            {
                var getdata = JsonConvert.SerializeObject(objDL.GetFormRespondedNameByContactId(commonDetails.ContactId), Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetSmsSendingSettingDetails()
        {
            DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            using var objsmssendingsetting = DLSmsSendingSetting.GetDLSmsSendingSetting(account.AdsId, SQLProvider);
            SmsSendingSetting smssendingsetting = new SmsSendingSetting();
            List<SmsSendingSetting> smssendingdetails = (await objsmssendingsetting.GetList(smssendingsetting)).ToList();

            return Json(new
            {
                Data = smssendingdetails
            });
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> SendTestMail(string toEmailId, string ccEmailId, string subject, string message)
        {
            LoginInfo? userdetails = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            DomainInfo domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            bool Status = false;
            //SendPriorityMail SendMail = new SendPriorityMail(domainDetails.AdsId);
            int count = 0;

            if (!String.IsNullOrEmpty(toEmailId) && Helper.IsValidEmailAddress(toEmailId) && !String.IsNullOrEmpty(subject) && !String.IsNullOrEmpty(message))
            {
                MailMessage mailMsg = new MailMessage();
                mailMsg.Subject = subject;
                mailMsg.Body = message;
                mailMsg.IsBodyHtml = true;
                mailMsg.To.Add(toEmailId.Trim());
                count++;

                if (!string.IsNullOrEmpty(userdetails.EmailId))
                {
                    mailMsg.CC.Add(userdetails.EmailId.Trim());
                    mailMsg.ReplyToList.Add(new MailAddress(userdetails.EmailId.Trim()));
                    count++;
                }

                if (!string.IsNullOrEmpty(ccEmailId))
                {
                    mailMsg.CC.Add(new MailAddress(ccEmailId));
                    count++;
                }
            }
            return Json(Status);
        }

        [HttpPost]
        public async Task<JsonResult> GetFormDetails([FromBody] CommonDetailsForForms_GetFormDetails commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            using GenralFormDetails saveForm = new GenralFormDetails(commonDetails.accountId, user.UserId, SQLProvider);

            if (user != null)
            {
                await saveForm.GetFormDetailsRules(commonDetails.FormId);
                await saveForm.GetFormField(commonDetails.FormId);
            }
            else
            {
                saveForm.Status = false;
                saveForm.ErrorMessage = "Session Expired";
            }

            return Json(saveForm);
        }

        [HttpPost]
        public async Task<JsonResult> GetFormsListBasedOnType([FromBody] CommonDetailsForForms_GetFormsListBasedOnType commonDetails)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                DateTime FromDateTime = DateTime.ParseExact(commonDetails.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                DateTime ToDateTime = DateTime.ParseExact(commonDetails.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                FormDetails formDetails = new FormDetails() { EmbeddedFormOrPopUpFormOrTaggedForm = commonDetails.EmbeddedFormOrPopUpFormOrTaggedForm };
                List<FormDetails> formsList = new List<FormDetails>();
                using (var objDLform = DLFormDetails.GetDLFormDetails(commonDetails.AdsId, SQLProvider))
                {
                    formsList = await objDLform.GET(formDetails, -1, -1, null, null, false, null, null, FromDateTime, ToDateTime);
                }
                return Json(new
                {
                    Data = formsList
                });
            }
            return null;
        }

        [HttpPost]
        public async Task<JsonResult> GetAllFieldDetails([FromBody] CommonDetailsForForms_GetAllFieldDetails commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            List<int> UserInfoUserIdList = (user.Members != null && user.Members.Count > 0) ? user.Members.Select(x => x.UserInfoUserId).ToList<int>() : null;
            using (var objBAL = DLContactExtraField.GetDLContactExtraField(commonDetails.AccountId, SQLProvider))
            {
                return Json(await objBAL.GetList(user.UserId, UserInfoUserIdList));
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetUser([FromBody] CommonDetailsForForms_GetUser commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            List<MLUserHierarchy> userHierarchyList = new List<MLUserHierarchy>();

            using (var objUser = DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
            {
                userHierarchyList = await objUser.GetHisUsers(user.UserId, commonDetails.accountId);
                userHierarchyList.Add(await objUser.GetHisDetails(user.UserId));
            }

            userHierarchyList = userHierarchyList.GroupBy(x => x.UserInfoUserId).Select(x => x.First()).ToList();

            return Json(userHierarchyList);
        }
        [HttpPost]
        public async Task<ActionResult> GetLMSGroupList(int accountId)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            using (var objGroup = DLLmsGroup.GetDLLmsGroup(domainDetails.AdsId, SQLProvider))
            {
                return Json(await objGroup.GetLMSGroupList());
            }
        }
    }
}
