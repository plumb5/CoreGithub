using IP5GenralDL;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.ManageContact.Dto;
using Plumb5.Areas.ManageContact.Models;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;
using System.Globalization;
using System.Text;

namespace Plumb5.Areas.ManageContact.Controllers
{
    [Area("ManageContact")]
    public class ContactController : BaseController
    {
        public ContactController(IConfiguration _configuration) : base(_configuration)
        { }

        //
        // GET: /ManageContact/Contact/

        public ActionResult Index()
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            ViewBag.AdsId = domainDetails.AdsId;
            return View("Contact");
        }

        [HttpPost]
        public async Task<JsonResult> MaxCount([FromBody] Contact_MaxCountDto commonDetails)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            int returnVal;
            using (var objDL = DLContact.GetContactDetails(domainDetails.AdsId, SQLProvider))
            {
                returnVal = await objDL.MaxCount(commonDetails.contact, commonDetails.GroupId);
            }
            return Json(new
            {
                returnVal
            });
        }

        [HttpPost]
        public async Task<JsonResult> MaxCountMasterFilter([FromBody] Contact_MaxCountMasterFilter commonDetails)

        {
            Nullable<DateTime> FromDateTime = null;
            Nullable<DateTime> ToDateTime = null;
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            int UserInfoUserId = user.UserId;
            int UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;
            if (!string.IsNullOrEmpty(commonDetails.FromDate))
                FromDateTime = DateTime.ParseExact(commonDetails.FromDate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            if (!string.IsNullOrEmpty(commonDetails.ToDate))
                ToDateTime = DateTime.ParseExact(commonDetails.ToDate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            int returnVal;
            int newgroupid = 0;

            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            using (var objBL = DLContact.GetContactDetails(domainDetails.AdsId, SQLProvider))

            {
                returnVal = await objBL.MaxCountMasterFilter(commonDetails.contact, commonDetails.OffSet, commonDetails.FetchNext, UserInfoUserId, UserGroupId, commonDetails.filteredgroupid, FromDateTime, ToDateTime);
            }
            if (returnVal > 0)
            {
                if (commonDetails.creategroupchk == 1)
                {

                    Groups group = new Groups();

                    group.UserInfoUserId = UserInfoUserId;
                    group.UserGroupId = UserGroupId;
                    group.Name = commonDetails.Newgroupname;
                    group.GroupDescription = commonDetails.Newgroupdescription;

                    using (var objBAL = DLGroups.GetDLGroups(domainDetails.AdsId, SQLProvider))
                    {
                        newgroupid = await objBAL.Save(group);
                    }

                    int StartCount = 0;
                    int EndCount = 0;

                    if (newgroupid > 0)
                    {
                        using (var objDL = DLContact.GetContactDetails(domainDetails.AdsId, SQLProvider))
                        {
                            bool result = await objDL.SearchAndAddtoGroup(UserInfoUserId, UserGroupId, commonDetails.contact, StartCount, EndCount, newgroupid, FromDateTime, ToDateTime);

                            //return Json(result);
                        }
                    }
                }
            }

            return Json(new { returnVal, newgroupid });

        }

        [HttpPost]
        public async Task<JsonResult> GetDetails([FromBody] Contact_GetDetails commonDetails)
        {
            ArrayList data = new ArrayList() { commonDetails.contact };
            HttpContext.Session.SetString("ContactDetails", JsonConvert.SerializeObject(data));

            if (commonDetails.GroupId != 0)
                HttpContext.Session.SetInt32("GroupId", Convert.ToInt32(commonDetails.GroupId));


            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            using (var objDL = DLContact.GetContactDetails(domainDetails.AdsId, SQLProvider))
            {
                List<string> fieldsName = new List<string>() { "ContactId", "Name", "EmailId", "PhoneNumber", "IsVerifiedMailId", "IsVerifiedContactNumber", "CreatedDate" };
                List<Contact> contactList = (await objDL.GetAllContact(commonDetails.contact, commonDetails.FetchNext, commonDetails.OffSet, commonDetails.GroupId, fieldsName)).ToList();

                contactList = (from item in contactList
                               let name = item.Name = !string.IsNullOrEmpty(item.Name) ? Helper.MaskName(item.Name) : item.Name
                               let email = item.EmailId = !string.IsNullOrEmpty(item.EmailId) ? Helper.MaskEmailAddress(item.EmailId) : item.EmailId
                               let phonenumber = item.PhoneNumber = !string.IsNullOrEmpty(item.PhoneNumber) ? Helper.MaskPhoneNumber(item.PhoneNumber) : item.PhoneNumber
                               let createddate = item.CreatedDate.ToString()
                               select item).ToList();

                return Json(contactList);
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetCustomContactDetails([FromBody] Contact_GetCustomContactDetails commonDetails)
        {

            Nullable<DateTime> FromDateTime = null;
            Nullable<DateTime> ToDateTime = null;
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            int UserInfoUserId = user.UserId;
            int UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;
            if (!string.IsNullOrEmpty(commonDetails.FromDate))
                FromDateTime = DateTime.ParseExact(commonDetails.FromDate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            if (!string.IsNullOrEmpty(commonDetails.ToDate))
                ToDateTime = DateTime.ParseExact(commonDetails.ToDate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            ArrayList data = new ArrayList() { commonDetails.contact };
            HttpContext.Session.SetString("ContactDetails", JsonConvert.SerializeObject(data));

            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            using (var objBL = DLContact.GetContactDetails(domainDetails.AdsId, SQLProvider))
            {
                List<string> fieldsName = new List<string>() { "ContactId", "Name", "EmailId", "PhoneNumber", "IsVerifiedMailId", "IsVerifiedContactNumber", "CreatedDate", "IsWhatsAppOptIn" };
                List<Contact> contactList = (await objBL.GetCustomContactDetails(commonDetails.contact, commonDetails.OffSet, commonDetails.FetchNext, UserInfoUserId, UserGroupId, commonDetails.groupid, FromDateTime, ToDateTime, fieldsName)).ToList();

                contactList = (from item in contactList
                               let name = item.Name = !string.IsNullOrEmpty(item.Name) ? Helper.MaskName(item.Name) : item.Name
                               let email = item.EmailId = !string.IsNullOrEmpty(item.EmailId) ? Helper.MaskEmailAddress(item.EmailId) : item.EmailId
                               let phonenumber = item.PhoneNumber = !string.IsNullOrEmpty(item.PhoneNumber) ? Helper.MaskPhoneNumber(item.PhoneNumber) : item.PhoneNumber
                               let createddate = item.CreatedDate.ToString()
                               select item).ToList();

                return Json(contactList);
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> Export([FromBody] Contact_ExportDto commonDetails)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                int GroupId = 0;
                if (HttpContext.Session.GetInt32("GroupId") != null)
                {
                    GroupId = Convert.ToInt32(HttpContext.Session.GetInt32("GroupId"));
                }
                Contact contact = new Contact();
                if (HttpContext.Session.GetString("ContactDetails") != null)
                {
                    ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("ContactDetails")); ;
                    contact = (Contact)data[0];
                }

                System.Data.DataSet dataSet = new System.Data.DataSet("General");
                DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
                List<string> fieldsName = new List<string>() { "ContactId", "Name", "EmailId", "PhoneNumber", "AlternateEmailIds", "AlternatePhoneNumbers", "IsVerifiedMailId", "IsVerifiedContactNumber", "Age", "Gender", "MaritalStatus", "Education", "Occupation", "Interests", "Location", "CreatedDate" };
                List<Contact> contactList = null;
                using (var objDL = DLContact.GetContactDetails(domainDetails.AdsId, SQLProvider))
                {
                    contactList = (await objDL.GetAllContact(contact, commonDetails.FetchNext, commonDetails.OffSet, GroupId, fieldsName)).ToList();
                }

                string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(domainDetails.AdsId, SQLProvider);
                var contactLists = (from item in contactList
                                    select new
                                    {
                                        Name = !String.IsNullOrEmpty(item.Name) ? Helper.MaskName(item.Name) : item.Name,
                                        Email = !String.IsNullOrEmpty(item.EmailId) ? Helper.MaskEmailAddress(item.EmailId) : item.EmailId,
                                        PhoneNumber = !String.IsNullOrEmpty(item.PhoneNumber) ? Helper.MaskPhoneNumber(item.PhoneNumber) : item.PhoneNumber,
                                        CreatedDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(item.CreatedDate)).ToString()
                                    }).ToList();

                System.Data.DataTable dtt = new System.Data.DataTable();
                dtt = contactLists.CopyToDataTableExport();
                dataSet.Tables.Add(dtt);

                string FileName = "GroupContacts_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;
                string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

                if (commonDetails.FileType.ToLower() == "csv")
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

        [Log]
        [HttpPost]
        public async Task<ActionResult> AddToInvalidate([FromBody] Contact_AddToInvalidateDo commonDetails)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            //#region Logs 
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(domainDetails.AdsId, user.UserId, user.UserName, user.EmailId, "Contacts", "Mail", "AddToInvalidate", Helper.GetIP(), JsonConvert.SerializeObject(new { contact = contact }));
            //#endregion

            using (var objDL = DLContact.GetContactDetails(domainDetails.AdsId, SQLProvider))
            {
                var result = await objDL.AddToInvalidateList(commonDetails.contact);
                //if (result)
                //    LogMessage = "The contact status has been changed to Invalidate";
                //else
                //    LogMessage = "Unable to change the status to Invalidate";

                //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { result = result }), LogMessage);
                return Json(result);
            }
        }

        [Log]
        [HttpPost]
        public async Task<ActionResult> AddToUnsubscribe([FromBody] Contact_AddToUnsubscribe commonDetails)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            //#region Logs 
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(domainDetails.AdsId, user.UserId, user.UserName, user.EmailId, "Contacts", "Mail", "AddToUnsubscribeList", Helper.GetIP(), JsonConvert.SerializeObject(new { contact = contact }));
            //#endregion

            int UserInfoUserId = user.UserId;

            using (var objDL = DLContact.GetContactDetails(domainDetails.AdsId, SQLProvider))
            {
                bool result = false;
                if (commonDetails.emilchk == true)
                {
                    result = await objDL.AddToUnsubscribeList(commonDetails.contact);
                }
                if (commonDetails.smschk == true)
                {
                    result = await objDL.AddToSmsUnsubscribeList(commonDetails.contact);
                }

                //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { result = result }), LogMessage);
                return Json(result);
            }
        }

        [HttpPost]
        public async Task<ActionResult> GetGroupName()
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            List<int> UserInfoUserIdList = (user.Members != null && user.Members.Count > 0) ? user.Members.Select(x => x.UserInfoUserId).ToList<int>() : null;
            List<Groups> groupList = null;

            using (var objDL = P5GenralDL.DLGroups.GetDLGroups(domainDetails.AdsId, SQLProvider))
            {
                Groups group = new Groups();
                group.UserInfoUserId = user.UserId;
                groupList = await objDL.GetGroupList(group);
            }

            return Json(groupList);
        }

        [HttpPost]
        public async Task<JsonResult> GetGroupNameByContacts([FromBody] Contact_GetGroupNameByContacts commonDetails)
        {
            List<Groups> finalgroupList = new List<Groups>();
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            foreach (var ContactId in commonDetails.contact)
            {
                using (var objDL = DLContact.GetContactDetails(domainDetails.AdsId, SQLProvider))
                {
                    List<Groups> groupList = new List<Groups>();
                    groupList = (await objDL.BelongToWhichGroup(ContactId)).ToList();
                    finalgroupList.AddRange(groupList);
                }
            }
            return Json(finalgroupList);
        }

        [Log]
        [HttpPost]
        public async Task<ActionResult> AddToGroup([FromBody] Contact_AddToGroup commondetails)
        {
            try
            {
                LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
                DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

                int UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;
                List<int> groupId = new List<int>();

                foreach (var GroupId in commondetails.Groups)
                    groupId.Add(int.Parse(GroupId));

                using (GeneralAddToGroups generalAddToGroups = new GeneralAddToGroups(domainDetails.AdsId, SQLProvider))
                    await generalAddToGroups.AddToGroupMemberAndRespectiveModule(user.UserId, UserGroupId, groupId.ToArray(), commondetails.contact);

                var getdata = JsonConvert.SerializeObject(true, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch (Exception e)
            {
                return null;
            }
        }

        [Log]
        [HttpPost]
        public async Task<ActionResult> DeleteFromGroup([FromBody] Contact_DeleteFromGroupDto commondetailsDto)
        {
            try
            {
                LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
                DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

                foreach (var GroupId in commondetailsDto.Groups)
                {
                    GroupMember objGroupMembers = new GroupMember();
                    objGroupMembers.GroupId = GroupId;
                    objGroupMembers.UserInfoUserId = user.UserId;
                    objGroupMembers.UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;
                    foreach (var ContactId in commondetailsDto.contact)
                    {
                        objGroupMembers.ContactId = ContactId;

                        using (var objGroupMember = DLGroupMember.GetDLGroupMember(domainDetails.AdsId, SQLProvider))
                        {
                            await objGroupMember.DeleteByContactId(objGroupMembers);
                        }
                    }
                }

                var getdata = JsonConvert.SerializeObject(true, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch (Exception e)
            {
                return null;
            }
        }

        //[Log]
        //[Notifications(Heading = "Lead Management", ActionDetails = "Lead has been created / updated successfully")]
        //public JsonResult AddOrUpdateContact(int AdsId, Contact contact, int UserInfoUserId, string[] answerList, int OldUserInfoUserId)
        //{
        //    LoginInfo user = (LoginInfo)Session["UserInfo"];

        //    bool isValidEmailId = false, isValidPhoneNumber = false, UpdatedStatus = false, IsSuperAdmin = false, Status = false, FinalStatus = false;
        //    int ContactId = 0, ContactIdForEmailCheck = 0, ContactIdForPhoneCheck = 0;
        //    DLContact objContact = new DLContact(AdsId);
        //    LeadAddOrUpdate leadAddOrUpdate = new LeadAddOrUpdate();
        //    Contact mLContact = new Contact();

        //    if (user.IsSuperAdmin == 1)
        //        IsSuperAdmin = true;

        //    contact.LastModifyByUserId = user.UserId;

        //    //Validating PhoneNumber
        //    string PhoneNumber = contact.PhoneNumber;
        //    if (!String.IsNullOrEmpty(contact.PhoneNumber))
        //    {
        //        mLContact.PhoneNumber = contact.PhoneNumber;
        //        isValidPhoneNumber = Helper.IsValidPhoneNumber(ref PhoneNumber);
        //    }

        //    //Validating EmailId
        //    if (!String.IsNullOrEmpty(contact.EmailId))
        //    {
        //        mLContact.EmailId = contact.EmailId;
        //        isValidEmailId = Helper.IsValidEmailAddress(contact.EmailId);
        //    }

        //    if (isValidEmailId || isValidPhoneNumber)
        //    {
        //        EmailVerifyProviderSetting _emailVerifyProviderSetting = new EmailVerifyProviderSetting();

        //        using (DLEmailVerifyProviderSetting objEmVPS = new DLEmailVerifyProviderSetting(AdsId))
        //        {
        //            _emailVerifyProviderSetting = objEmVPS.GetActiveprovider();
        //        }

        //        if (_emailVerifyProviderSetting != null && _emailVerifyProviderSetting.IsActive.HasValue && _emailVerifyProviderSetting.IsActive.Value && !String.IsNullOrEmpty(_emailVerifyProviderSetting.APIUrl) && !String.IsNullOrEmpty(_emailVerifyProviderSetting.ApiKey))
        //            contact.IsVerifiedMailId = -1;
        //        else
        //            contact.IsVerifiedMailId = 1;

        //        if (!String.IsNullOrEmpty(contact.EmailId))
        //        {
        //            var result = leadAddOrUpdate.EmailCheck(contact.EmailId, 0, AdsId, user.UserId);
        //            ContactIdForEmailCheck = result.Item2;
        //            if (!result.Item1 || result.Item2 <= 0)
        //                FinalStatus = true;
        //            else if (result.Item1 && result.Item2 <= 0)
        //                FinalStatus = true;
        //        }

        //        if (!String.IsNullOrEmpty(contact.PhoneNumber))
        //        {
        //            var result = leadAddOrUpdate.PhoneNumberCheck(contact.PhoneNumber, 0, AdsId, user.UserId);
        //            ContactIdForPhoneCheck = result.Item2;
        //            if (!result.Item1 || result.Item2 <= 0)
        //                FinalStatus = true;
        //            else if (result.Item1 && result.Item2 <= 0)
        //                FinalStatus = true;
        //        }

        //        if (contact.ContactId == 0)
        //        {
        //            if (FinalStatus)
        //            {
        //                ContactId = mLContact.ContactId = contact.ContactId = objContact.Save(contact);
        //            }
        //            else
        //                ContactId = -1;
        //        }
        //        else if (contact.ContactId > 0 && (isValidEmailId || isValidPhoneNumber))
        //        {
        //            if (FinalStatus)
        //            {
        //                if (objContact.Update(contact))
        //                {

        //                    ContactId = contact.ContactId;
        //                    Status = UpdatedStatus = true;
        //                }
        //                else
        //                    ContactId = -1;
        //            }
        //            else
        //                ContactId = -1;
        //        }
        //    }

        //    if (FinalStatus && ContactId > 0)
        //    {
        //        Status = leadAddOrUpdate.LeadNoteSavingAssignSalesManageCustom(UserInfoUserId, OldUserInfoUserId, ContactId, contact, answerList, AdsId, user.UserId);
        //        mLContact = objContact.GetContactDetails(mLContact);
        //    }

        //    if (contact.LmsGroupId > 0)
        //    {
        //        LmsGroupMembers groupMember = new LmsGroupMembers() { LmsGroupId = contact.LmsGroupId, ContactId = ContactId };
        //        using (DLLmsGroupMembers objDL = new DLLmsGroupMembers(AdsId))
        //        {
        //            objDL.Save(groupMember);
        //        }
        //    }

        //    mLContact.Name = !String.IsNullOrEmpty(mLContact.Name) ? Helper.MaskName(mLContact.Name) : mLContact.Name;
        //    mLContact.EmailId = !String.IsNullOrEmpty(mLContact.EmailId) ? Helper.MaskEmailAddress(mLContact.EmailId) : mLContact.EmailId;
        //    mLContact.PhoneNumber = !String.IsNullOrEmpty(mLContact.PhoneNumber) ? Helper.MaskPhoneNumber(mLContact.PhoneNumber) : mLContact.PhoneNumber;

        //    return Json(new { Status = Status, Id = ContactId, mLContact = mLContact, UpdatedStatus = UpdatedStatus, IsSuperAdmin = IsSuperAdmin, ContactIdForEmailCheck = ContactIdForEmailCheck, ContactIdForPhoneCheck = ContactIdForPhoneCheck });
        //}

        [Log]
        [HttpPost]
        public async Task<JsonResult> VerifyEmailContact([FromBody] Contact_VerifyEmailContactDto commonDetails)
        {
            string ErrorMessage = string.Empty; bool result = false; int IsVerifiedMailId = -1;
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            //#region Logs 
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(accountId, user.UserId, user.UserName, user.EmailId, "ManageContact", "Contact", "VerifyEmailContact", Helper.GetIP(), JsonConvert.SerializeObject(new { ContactId = ContactId }));
            //#endregion

            EmailVerifyProviderSetting? emailVerifyProviderSetting = null;
            using (var objDL = DLEmailVerifyProviderSetting.GetDLEmailVerifyProviderSetting(commonDetails.accountId, SQLProvider))
                emailVerifyProviderSetting = await objDL.GetActiveprovider();

            if (emailVerifyProviderSetting != null)
            {
                Contact? contact = new Contact { ContactId = commonDetails.ContactId };
                List<string> fieldName = new List<string> { "ContactId", "EmailId", "IsVerifiedMailId" };
                using (var objDL = DLContact.GetContactDetails(commonDetails.accountId, SQLProvider))
                {
                    contact = await objDL.GetContactDetails(contact, fieldName);
                    if (contact != null && !String.IsNullOrEmpty(contact.EmailId))
                    {
                        List<Contact> contacts = new List<Contact>();
                        contacts.Add(contact);
                        IBulkVerifyEmailContact EmailVerifierGeneralBaseFactory = Plumb5GenralFunction.EmailVerifyGeneralBaseFactory.GetEmailVerifierVendor(commonDetails.accountId, emailVerifyProviderSetting);
                        EmailVerifierGeneralBaseFactory.VerifyBulkContact(contacts);

                        if (EmailVerifierGeneralBaseFactory.VendorResponses != null && EmailVerifierGeneralBaseFactory.VendorResponses.Count > 0)
                        {
                            if (EmailVerifierGeneralBaseFactory.VendorResponses[0].IsVerifiedMailId != null && EmailVerifierGeneralBaseFactory.VendorResponses[0].IsVerifiedMailId != -1)
                            {
                                IsVerifiedMailId = Convert.ToInt32(EmailVerifierGeneralBaseFactory.VendorResponses[0].IsVerifiedMailId);
                                objDL.MakeItNotVerified(commonDetails.ContactId, IsVerifiedMailId);
                                result = true;
                                ErrorMessage = "Email contact has been verified successfully";
                            }
                            else
                            {
                                result = false;
                                ErrorMessage = "Unable to verify a email, please try again after some time";
                            }
                        }
                        else
                        {
                            result = false;
                            ErrorMessage = "Response not found from the vendor, please try again";
                        }
                    }
                    else
                    {
                        result = false;
                        ErrorMessage = "Email Id not found to verify the email contact";
                    }
                }
            }
            else
            {
                result = false;
                ErrorMessage = "Please configure a email verifier vendor";
            }
            //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Result = result, ErrorMessage = ErrorMessage }), LogMessage);
            return Json(new { Result = result, ErrorMessage = ErrorMessage, IsVerifiedMailId = IsVerifiedMailId });
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> VerifyEmailContactList([FromBody] Contact_VerifyEmailContactListDto commonDetails)
        {
            string ErrorMessage = string.Empty; string Message = string.Empty; bool result = false;
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            int SuccessCount = 0;
            int FailureCount = 0;

            EmailVerifyProviderSetting? emailVerifyProviderSetting = null;
            using (var objDL = DLEmailVerifyProviderSetting.GetDLEmailVerifyProviderSetting(commonDetails.accountId, SQLProvider))
                emailVerifyProviderSetting = await objDL.GetActiveprovider();

            if (emailVerifyProviderSetting != null)
            {

                List<string> fieldName = new List<string> { "ContactId", "EmailId", "IsVerifiedMailId" };
                using (var objDL = DLContact.GetContactDetails(commonDetails.accountId, SQLProvider))
                {
                    List<Contact> contactlist = new List<Contact>();
                    foreach (var eachContact in commonDetails.ContactId)
                    {
                        Contact? contact = new Contact { ContactId = eachContact };
                        contact = await objDL.GetContactDetails(contact, fieldName);
                        contactlist.Add(contact);
                    }

                    if (contactlist != null && contactlist.Count > 0)
                    {

                        //IBulkVerifyEmailContact EmailVerifierGeneralBaseFactory = Plumb5GenralFunction.EmailVerifyGeneralBaseFactory.GetEmailVerifierVendor(accountId, emailVerifyProviderSetting);
                        //EmailVerifierGeneralBaseFactory.VerifyBulkContact(contactlist);

                        //if (EmailVerifierGeneralBaseFactory.VendorResponses != null && EmailVerifierGeneralBaseFactory.VendorResponses.Count > 0)
                        //{
                        //    for (int i = 0; i < EmailVerifierGeneralBaseFactory.VendorResponses.Count; i++)
                        //    {
                        //        int IsVerifiedMailId = -1;
                        //        if (!String.IsNullOrEmpty(EmailVerifierGeneralBaseFactory.VendorResponses[i].EmailId) && EmailVerifierGeneralBaseFactory.VendorResponses[i].IsVerifiedMailId != null && EmailVerifierGeneralBaseFactory.VendorResponses[i].IsVerifiedMailId != -1)
                        //        {
                        //            IsVerifiedMailId = Convert.ToInt32(EmailVerifierGeneralBaseFactory.VendorResponses[i].IsVerifiedMailId);
                        //            objDL.MakeItNotVerified(EmailVerifierGeneralBaseFactory.VendorResponses[i].ContactId, IsVerifiedMailId);
                        //            SuccessCount++;
                        //        }
                        //        else
                        //        {
                        //            FailureCount++;
                        //        }
                        //    }
                        //    result = true;
                        //    Message = "Out of " + contactlist.Count + "," + SuccessCount + " has been verified successfully";
                        //}
                        //else
                        //{
                        //    result = false;
                        //    ErrorMessage = "Unable to verify a email, please try again after some time";
                        //}
                    }
                }
            }
            else
            {
                result = false;
                ErrorMessage = "Please configure a email verifier vendor";
            }
            return Json(new { Result = result, ErrorMessage = ErrorMessage, Message = Message });
        }

        [HttpPost]
        public async Task<JsonResult> GetContactPropertyList([FromBody] Contact_GetContactPropertyListDto commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            List<MLContactFieldEditSetting> ContactPropertyList = null;
            using (var objDL = DLContactFieldEditSetting.GetDLContactFieldEditSetting(commonDetails.AccountId, SQLProvider))
            {
                ContactPropertyList = await objDL.GetFullList();
            }

            if (ContactPropertyList != null && ContactPropertyList.Count > 0)
            {
                if (ContactPropertyList.Any(x => x.PropertyName == "LmsGroupId"))
                {
                    List<LmsGroup> LmsGroupList = new List<LmsGroup>();

                    using (var objGroup = DLLmsGroup.GetDLLmsGroup(commonDetails.AccountId, SQLProvider))
                    {
                        LmsGroupList = (await objGroup.GetLMSGroupList()).ToList();
                    }
                    var UserInfoKeyValue = "";
                    if (LmsGroupList != null && LmsGroupList.Count > 0)
                    {

                        UserInfoKeyValue = "[";
                        foreach (var item in LmsGroupList)
                        {
                            UserInfoKeyValue += "{\"Name\":\"" + item.Name + "\",\"Value\":\"" + item.Id + "\"},";

                        }

                        UserInfoKeyValue = UserInfoKeyValue.TrimEnd(',') + "]";
                    }
                    ContactPropertyList.Where(x => x.PropertyName == "LmsGroupId").First().FieldOption = UserInfoKeyValue;
                }

                if (ContactPropertyList.Any(x => x.PropertyName == "UserInfoUserId"))
                {
                    List<MLUserHierarchy> userHierarchyList = new List<MLUserHierarchy>();

                    List<MLLmsAdvancedSettings> advancedsettingsdetails = null;

                    using (var objBL = DLLmsAdvancedSettings.GetLmsAdvancedSettings(commonDetails.AccountId, SQLProvider))
                        advancedsettingsdetails = await objBL.GetDetailsAdvancedSettings("HANDLEBY");

                    if (advancedsettingsdetails != null && advancedsettingsdetails.Count() > 0)
                    {
                        using (var objUser = DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
                        {
                            userHierarchyList = await objUser.GetHisUsers(user.UserId, commonDetails.AccountId, Convert.ToInt32(advancedsettingsdetails[0].Value));
                            userHierarchyList.Add(await objUser.GetHisDetails(user.UserId));
                        }
                    }
                    else
                    {
                        int getallusers = 0;
                        if (user.IsSuperAdmin == 1)
                            getallusers = 1;

                        using (var objUser = DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
                        {
                            userHierarchyList = await objUser.GetHisUsers(user.UserId, commonDetails.AccountId, getallusers);
                            userHierarchyList.Add(await objUser.GetHisDetails(user.UserId));
                        }
                    }

                    var UserInfoKeyValue = "";
                    if (userHierarchyList != null && userHierarchyList.Count > 0)
                    {
                        userHierarchyList = userHierarchyList.GroupBy(x => x.UserInfoUserId).Select(x => x.First()).ToList();

                        UserInfoKeyValue = "[";
                        foreach (var item in userHierarchyList)
                        {
                            if (item.ActiveStatus)
                            {
                                UserInfoKeyValue += "{\"Name\":\"" + item.FirstName + "(" + item.EmailId + ")\",\"Value\":\"" + item.UserInfoUserId + "\"},";
                            }
                        }

                        UserInfoKeyValue = UserInfoKeyValue.TrimEnd(',') + "]";
                    }
                    ContactPropertyList.Where(x => x.PropertyName == "UserInfoUserId").First().FieldOption = UserInfoKeyValue;
                }

                if (ContactPropertyList.Any(x => x.PropertyName == "Score"))
                {
                    List<LmsStage> AllStageList = new List<LmsStage>();
                    List<LmsStage> newLmsStageList = new List<LmsStage>();

                    using (var objStage = DLLmsStage.GetDLLmsStage(commonDetails.AccountId, SQLProvider))
                    {
                        AllStageList = await objStage.GetAllList();
                    }

                    if (user.IsSuperAdmin != 1)
                    {
                        newLmsStageList = AllStageList.Where(x => x.UserGroupId == "0").ToList();

                        foreach (int GroupId in user.UserGroupIdList)
                        {
                            if (AllStageList.Any(x => x.UserGroupId == GroupId.ToString()))
                            {
                                newLmsStageList = newLmsStageList.Union(AllStageList.Where(x => x.UserGroupId == GroupId.ToString())).ToList();
                            }
                        }
                    }
                    else
                    {
                        newLmsStageList = AllStageList;
                    }
                    var StageKeyValue = "";
                    if (newLmsStageList != null && newLmsStageList.Count > 0)
                    {
                        StageKeyValue = "[";
                        foreach (var item in newLmsStageList)
                        {
                            StageKeyValue += "{\"Name\":\"" + item.Stage + "\",\"Value\":\"" + item.Score + "\"},";
                        }

                        StageKeyValue = StageKeyValue.TrimEnd(',') + "]";
                    }
                    ContactPropertyList.Where(x => x.PropertyName == "Score").First().FieldOption = StageKeyValue;
                }
            }

            return Json(ContactPropertyList);
        }

        [HttpPost]
        public async Task<JsonResult> GetLmsCustomFieldList([FromBody] Contact_GetContactPropertyListDto commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            List<LmsCustomFields> LmsCustomPropertyList = null;

            using (var objDL = DLLmsCustomFields.GetDLLmsCustomFields(commonDetails.AccountId, SQLProvider))
            {
                LmsCustomPropertyList = await objDL.GetDetails();
            }

            return Json(new { Data = LmsCustomPropertyList });
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> SaveOrUpdateContact([FromBody] Contact_SaveOrUpdateContact commonDetails)
        {
            //-1-> Not Valid Email/Phone, -2 Not Valid Email, -3 Not Valid Phone, -4 Other Contact with this Email/Phone,-5 contacts already exists with same source
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            bool isValidPhoneNumber = false;
            bool isValidEmailId = false;
            bool isSaveContact = true;
            bool oldcontactwithnewsource = false;
            int UserContactId = 0;
            int lmsid = -1;
            Contact? NewContact = new Contact();
            EmailVerifyProviderSetting EmailVerifierSettings = new EmailVerifyProviderSetting();
            MLLeadsDetails? leaddetails = new MLLeadsDetails();

            string PhoneNumber = commonDetails.contact.PhoneNumber;
            if (!string.IsNullOrEmpty(commonDetails.contact.PhoneNumber))
            {
                isValidPhoneNumber = Helper.IsValidPhoneNumber(ref PhoneNumber);
            }

            if (!string.IsNullOrEmpty(commonDetails.contact.EmailId))
            {
                isValidEmailId = Helper.IsValidEmailAddress(commonDetails.contact.EmailId);
            }

            if (isValidEmailId || isValidPhoneNumber)
            {
                if (!string.IsNullOrEmpty(commonDetails.contact.EmailId) && !isValidEmailId)
                {
                    UserContactId = -2;
                    isSaveContact = false;
                }

                if (!string.IsNullOrEmpty(commonDetails.contact.PhoneNumber) && !isValidPhoneNumber)
                {
                    UserContactId = -3;
                    isSaveContact = false;
                }
                else
                {
                    commonDetails.contact.PhoneNumber = PhoneNumber;
                }

                if (isSaveContact)
                {
                    List<Contact> ExistingContactList = null;
                    using (var objDL = DLContact.GetContactDetails(commonDetails.AccountId, SQLProvider))
                    {
                        ExistingContactList = (await objDL.CheckEmailOrPhoneExistence(commonDetails.contact.EmailId, commonDetails.contact.PhoneNumber, new List<string>() { "ContactId" })).ToList();
                    }

                    if (commonDetails.LmsSourceType == 1 || commonDetails.LmsSourceType == 2)
                    {
                        //condition----new contact with new source
                        using var objBLContact = DLContact.GetContactDetails(commonDetails.AccountId, SQLProvider);
                        int repeatleadcontactid = await objBLContact.CheckEmailIdPhoeNumberExists(commonDetails.contact.EmailId, commonDetails.contact.PhoneNumber);

                        if (repeatleadcontactid > 0)
                        {
                            commonDetails.contact.RepeatLeadCount = 1;

                            //condtion ---- old contact with new source
                            int checklmssourcewithsamecontact;
                            using (var objDL = DLLmsGroupMembers.GetDLLmsGroupMembers(commonDetails.AccountId, SQLProvider))
                                checklmssourcewithsamecontact = await objDL.CheckLmsSource(commonDetails.contact.ContactId, commonDetails.contact.LmsGroupId, commonDetails.LmsSourceType);

                            //old contact with new source = -1
                            if (checklmssourcewithsamecontact == -1)
                                oldcontactwithnewsource = true;
                        }
                        else
                        {
                            commonDetails.contact.RepeatLeadCount = 0;
                        }
                    }

                    if (ExistingContactList != null && ExistingContactList.Count > 0)
                    {
                        if (commonDetails.contact.ContactId == 0)
                        {
                            UserContactId = -4;
                            isSaveContact = false;
                        }
                        else
                        {
                            for (int i = 0; i < ExistingContactList.Count; i++)
                            {
                                if (ExistingContactList[i].ContactId != commonDetails.contact.ContactId)
                                {
                                    UserContactId = -4;
                                    isSaveContact = false;
                                    break;
                                }
                            }
                        }
                    }
                }

                if (isSaveContact)
                {
                    if (commonDetails.IsVerifiedEmail)
                    {
                        using (var objBL = DLEmailVerifyProviderSetting.GetDLEmailVerifyProviderSetting(commonDetails.AccountId, SQLProvider))
                            EmailVerifierSettings = await objBL.GetActiveprovider();

                        if (EmailVerifierSettings == null)
                            commonDetails.contact.IsVerifiedMailId = 1;
                        else
                            commonDetails.contact.IsVerifiedMailId = -1;
                    }
                    else
                    {
                        commonDetails.contact.IsVerifiedMailId = -1;
                    }

                    commonDetails.contact.LastModifyByUserId = user.UserId;

                    if (!(commonDetails.contact.UserInfoUserId > 0))
                    {
                        if (commonDetails.contact.LmsGroupId > 0)
                            commonDetails.contact.UserInfoUserId = user.UserId;
                    }

                    if (!(commonDetails.contact.Score > -1))
                    {
                        commonDetails.contact.Score = -1;
                    }

                    using (var objDL = DLContact.GetContactDetails(commonDetails.AccountId, SQLProvider))
                    {
                        if (commonDetails.contact.ContactId > 0)
                        {
                            commonDetails.contact.ContactId = UserContactId = await objDL.Save(commonDetails.contact);
                        }
                        else
                        {
                            commonDetails.contact.ContactId = UserContactId = await objDL.Save(commonDetails.contact);
                            if (commonDetails.contact.ContactId > 0)
                            {
                                StringBuilder notidetails = new StringBuilder("New Contact has been created successfully - ");

                                if (isValidEmailId)
                                    notidetails.Append(" EmailId : " + commonDetails.contact.EmailId + "");

                                if (isValidPhoneNumber)
                                    notidetails.Append(" PhoneNumber : " + commonDetails.contact.PhoneNumber + "");

                                Notifications notifications = new Notifications()
                                {
                                    UserInfoUserId = commonDetails.contact.UserInfoUserId,
                                    Heading = "Contact",
                                    Details = notidetails.ToString(),
                                    PageUrl = "Contact",
                                    IsThatSeen = false,
                                    ContactId = commonDetails.contact.ContactId
                                };

                                using (var objDLNotifications = DLNotifications.GetDLNotifications(commonDetails.AccountId, SQLProvider))
                                {
                                    await objDLNotifications.Save(notifications);
                                }
                            }
                        }
                    }

                    if (EmailVerifierSettings != null && EmailVerifierSettings.Id > 0)
                    {
                        if (!string.IsNullOrEmpty(commonDetails.contact.EmailId) && commonDetails.contact.ContactId > 0 && commonDetails.IsVerifiedEmail)
                        {
                            try
                            {

                                Contact? verifycontact = new Contact { ContactId = commonDetails.contact.ContactId };
                                List<string> fieldName = new List<string> { "ContactId", "EmailId", "IsVerifiedMailId" };
                                using (var objBL = DLContact.GetContactDetails(commonDetails.AccountId, SQLProvider))
                                {
                                    verifycontact = await objBL.GetContactDetails(verifycontact, fieldName);
                                    if (commonDetails.contact != null && !String.IsNullOrEmpty(verifycontact.EmailId))
                                    {
                                        List<Contact> contacts = new List<Contact>();
                                        contacts.Add(verifycontact);
                                        IBulkVerifyEmailContact EmailVerifierGeneralBaseFactory = Plumb5GenralFunction.EmailVerifyGeneralBaseFactory.GetEmailVerifierVendor(commonDetails.AccountId, EmailVerifierSettings);
                                        EmailVerifierGeneralBaseFactory.VerifyBulkContact(contacts);

                                        if (EmailVerifierGeneralBaseFactory.VendorResponses != null && EmailVerifierGeneralBaseFactory.VendorResponses.Count > 0)
                                        {
                                            if (EmailVerifierGeneralBaseFactory.VendorResponses[0].IsVerifiedMailId != null && EmailVerifierGeneralBaseFactory.VendorResponses[0].IsVerifiedMailId != -1)
                                            {
                                                int IsVerifiedMailId = Convert.ToInt32(EmailVerifierGeneralBaseFactory.VendorResponses[0].IsVerifiedMailId);
                                                objBL.MakeItNotVerified(commonDetails.contact.ContactId, IsVerifiedMailId);
                                            }
                                        }
                                    }
                                }
                            }
                            catch (Exception ex)
                            {
                                using (ErrorUpdation objError = new ErrorUpdation("CreateContact_IsVerifiedEmail"))
                                    objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "CreateContact->SaveContact->IsVerifiedEmail", ex.ToString(), true);
                            }
                        }
                    }

                    if (commonDetails.contact.ContactId > 0)
                    {
                        if (commonDetails.contact.LmsGroupId > 0)
                        {
                            string publishervalue = null;

                            if (commonDetails.lmsgrpmemberid <= 0)
                                publishervalue = "plumb5";
                            else if (oldcontactwithnewsource)
                                publishervalue = "plumb5";

                            using (var objDL = DLLmsGroupMembers.GetDLLmsGroupMembers(commonDetails.AccountId, SQLProvider))
                                lmsid = await objDL.CheckAndSaveLmsGroup(commonDetails.contact.ContactId, commonDetails.contact.UserInfoUserId, commonDetails.contact.LmsGroupId, commonDetails.LmsSourceType, commonDetails.lmsgrpmembers, commonDetails.lmsgrpmemberid, commonDetails.contact.Score, commonDetails.contact.LeadLabel, publishervalue);

                            using (var bLContact = DLContact.GetContactDetails(commonDetails.AccountId, SQLProvider))
                                await bLContact.UpdateLmsGroupId(commonDetails.contact.ContactId, commonDetails.contact.LmsGroupId);

                            if (commonDetails.LmsSourceType == 0 || commonDetails.LmsSourceType == 2)
                            {
                                if (lmsid == 0)
                                {
                                    UserContactId = -5;
                                    isSaveContact = false;
                                }
                            }

                            if (commonDetails.OldUserInfoUserId != commonDetails.contact.UserInfoUserId || oldcontactwithnewsource)
                            {
                                LeadAddOrUpdate leadAddOrUpdate = new LeadAddOrUpdate(SQLProvider);
                                int[] lmsEachLeadIdList = new int[] { commonDetails.contact.ContactId };
                                await leadAddOrUpdate.AssignSalesPerson(lmsEachLeadIdList, commonDetails.contact.UserInfoUserId, commonDetails.AccountId, true, commonDetails.contact.LmsGroupId, lmsid);
                            }
                        }

                        if (commonDetails.contact.Remarks != null && !string.IsNullOrEmpty(commonDetails.contact.Remarks))
                        {
                            using (var objDLNotes = DLNotes.GetDLNotes(commonDetails.AccountId, SQLProvider))
                            {
                                await objDLNotes.Save(new Notes() { ContactId = commonDetails.contact.ContactId, Content = commonDetails.contact.Remarks });
                            }
                        }

                        if (commonDetails.GroupId > 0)
                        {
                            int[] ContactIds = { commonDetails.contact.ContactId };
                            int[] GroupIds = { commonDetails.GroupId };

                            using (var objGroups = new GeneralAddToGroups(commonDetails.AccountId, SQLProvider))
                            {
                                await objGroups.AddToGroupMemberAndRespectiveModule(user.UserId, 0, GroupIds, ContactIds);
                            }
                        }

                        using (var objDL = DLContact.GetContactDetails(commonDetails.AccountId, SQLProvider))
                        {
                            NewContact = await objDL.GetContactDetails(new Contact() { ContactId = commonDetails.contact.ContactId });
                        }

                        using (var objDL = DLLmsCustomReport.GetDLLmsCustomReport(commonDetails.AccountId, SQLProvider))
                            leaddetails = await objDL.GetLmsGrpDetailsByContactId(commonDetails.contact.ContactId, commonDetails.contact.LmsGroupId);

                        if (leaddetails != null && leaddetails.ContactId > 0)
                        {
                            NewContact.LeadLabel = leaddetails.LeadLabel;
                            NewContact.Score = leaddetails.Score;
                        }

                        NewContact.Name = !String.IsNullOrEmpty(NewContact.Name) ? Helper.MaskName(NewContact.Name) : NewContact.Name;
                        NewContact.EmailId = !String.IsNullOrEmpty(NewContact.EmailId) ? Helper.MaskEmailAddress(NewContact.EmailId) : NewContact.EmailId;
                        NewContact.PhoneNumber = !String.IsNullOrEmpty(NewContact.PhoneNumber) ? Helper.MaskPhoneNumber(NewContact.PhoneNumber) : NewContact.PhoneNumber;
                    }
                }
            }
            else
            {
                UserContactId = -1;
                isSaveContact = false;
            }

            return Json(new { UserContactId, ContactDetails = NewContact, IsSuperAdmin = user.IsSuperAdmin == 1 ? true : false, oldcontactwithnewsource = oldcontactwithnewsource, lmsid = lmsid, leaddetails = leaddetails });
        }

        [HttpPost]
        public async Task<JsonResult> GetContactDetailsForUpdate([FromBody] Contact_GetContactDetailsForUpdateDto commonDetails)
        {
            MLLeadsDetails? leaddetails = new MLLeadsDetails();

            Contact? contactDetails = null;
            using (var objDL = DLContact.GetContactDetails(commonDetails.AccountId, SQLProvider))
                contactDetails = await objDL.GetContactDetails(commonDetails.contact);

            using (var objDL = DLLmsCustomReport.GetDLLmsCustomReport(commonDetails.AccountId, SQLProvider))
                leaddetails = await objDL.GetLmsGrpDetailsByContactId(commonDetails.contact.ContactId, commonDetails.LmsGroupId);

            return Json(new { contactDetails, leaddetails });
        }

        [HttpPost]
        public async Task<JsonResult> GetLmsContactDetailsForUpdate([FromBody] Contact_GetLmsContactDetailsForUpdate commonDetails)
        {
            using (var objDL = DLLmsCustomReport.GetDLLmsCustomReport(commonDetails.AccountId, SQLProvider))
                return Json(await objDL.GetLmsGrpDetailsByContactId(commonDetails.ContactId, commonDetails.LmsGroupId));
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> ContactsExport([FromBody] Contact_ContactsExportDto commonDetails)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                // Create a DataSet and put both tables in it.
                System.Data.DataSet dataSet = new System.Data.DataSet("General");

                int GroupId = 0;
                List<Contact> contactDetails = new List<Contact>();
                Contact contact = new Contact();
                List<MLContactFieldEditSetting> ContactPropertyList = new List<MLContactFieldEditSetting>();
                LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
                int UserId = user.UserId;
                if (HttpContext.Session.GetString("ContactDetails") != null)
                {
                    ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("ContactDetails"));
                    contact = JsonConvert.DeserializeObject<Contact>(data[0].ToString());
                }

                if (HttpContext.Session.GetString("GroupId") != null)
                {
                    GroupId = Convert.ToInt32(HttpContext.Session.GetInt32("GroupId"));
                }

                using (var objDL = DLContactFieldEditSetting.GetDLContactFieldEditSetting(commonDetails.AccountId, SQLProvider))
                {
                    ContactPropertyList = await objDL.GetFullList();
                }
                List<string> fieldsName = new List<string>();

                if (ContactPropertyList != null && ContactPropertyList.Count > 0)
                {
                    foreach (var fields in ContactPropertyList)
                    {
                        fieldsName.Add(fields.PropertyName);
                    }

                }
                fieldsName.Add("CreatedDate");
                fieldsName.Add("UpdatedDate");
                using (var objDL = DLContact.GetContactDetails(commonDetails.AccountId, SQLProvider))
                {
                    contactDetails = (await objDL.GetAllContact(contact, commonDetails.FetchNext, commonDetails.OffSet, GroupId, fieldsName)).ToList();
                }

                for (int i = 0; i < contactDetails.Count; i++)
                {
                    contactDetails[i].Name = !String.IsNullOrEmpty(contactDetails[i].Name) ? Helper.MaskName(contactDetails[i].Name) : contactDetails[i].Name;
                    contactDetails[i].EmailId = !String.IsNullOrEmpty(contactDetails[i].EmailId) ? Helper.MaskEmailAddress(contactDetails[i].EmailId) : contactDetails[i].EmailId;
                    contactDetails[i].PhoneNumber = !String.IsNullOrEmpty(contactDetails[i].PhoneNumber) ? Helper.MaskPhoneNumber(contactDetails[i].PhoneNumber) : contactDetails[i].PhoneNumber;
                }

                ManageExport manageExport = new ManageExport(SQLProvider);
                await manageExport.Export(commonDetails.AccountId, UserId, contactDetails, ContactPropertyList, commonDetails.FileType);

                return Json(new { Status = true, manageExport.MainPath });
            }
            else
            {
                return Json(new { Status = false });
            }
        }
    }
}
