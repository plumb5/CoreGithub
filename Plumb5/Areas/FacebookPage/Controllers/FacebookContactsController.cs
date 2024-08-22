using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.FacebookPage.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;

namespace Plumb5.Areas.FacebookPage.Controllers
{
    [Area("FacebookPage")]
    public class FacebookContactsController : BaseController
    {
        public FacebookContactsController(IConfiguration _configuration) : base(_configuration)
        { }
        public ActionResult Index()
        {
            return View("FacebookContacts");
        }
        [HttpPost]
        public async Task<JsonResult> MaxCount([FromBody] FacebookContacts_MaxCountDto objDto)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            int returnVal;
            using (var objDL = DLContact.GetContactDetails(domainDetails.AdsId,SQLProvider))
            {
                returnVal =await objDL.FacebookContactsMaxCount(objDto.contact, objDto.GroupId);
            }
            return Json(new
            {
                returnVal
            });
        }
        [HttpPost]
        public async Task<JsonResult> GetDetails([FromBody] FacebookContacts_GetDetailsDto objDto)
        {
            ArrayList data = new ArrayList() { objDto.contact };
            HttpContext.Session.SetString("ContactDetails", JsonConvert.SerializeObject(data));

            if (objDto.GroupId != 0)
            HttpContext.Session.SetString("GroupId", JsonConvert.SerializeObject(objDto.GroupId));

            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            using (var objDL =  DLContact.GetContactDetails(domainDetails.AdsId,SQLProvider))
            {
                List<string> fieldsName = new List<string>() { "ContactId", "Name", "EmailId", "PhoneNumber", "IsVerifiedMailId", "IsVerifiedContactNumber", "CreatedDate", "FacebookUrl" };
                var contactList =await objDL.FacebookContactDetails(objDto.contact, objDto.FetchNext, objDto.OffSet, objDto.GroupId, fieldsName);

                contactList = (from item in contactList
                               let name = item.Name = !string.IsNullOrEmpty(item.Name) ? Helper.MaskName(item.Name) : item.Name
                               let email = item.EmailId = !string.IsNullOrEmpty(item.EmailId) ? Helper.MaskEmailAddress(item.EmailId) : item.EmailId
                               let phonenumber = item.PhoneNumber = !string.IsNullOrEmpty(item.PhoneNumber) ? Helper.MaskPhoneNumber(item.PhoneNumber) : item.PhoneNumber
                               let facebookurl = item.FacebookUrl
                               let createddate = item.CreatedDate.ToString()
                               select item).ToList();

                return Json(new
                {
                    Data = contactList,
                    MaxJsonLength = Int32.MaxValue
                });

            }
        }
        [HttpPost]
        public async Task<JsonResult> GetGroupNameByContacts([FromBody] FacebookContacts_GetGroupNameByContactsDto objDto)
        {
            List<Groups> finalgroupList = new List<Groups>();
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            foreach (var ContactId in objDto.contact)
            {
                using (var objDL = DLContact.GetContactDetails(domainDetails.AdsId, SQLProvider))
                {
                   // List<Groups> groupList = new List<Groups>();
                    var groupList =await objDL.BelongToWhichGroup(ContactId);
                    finalgroupList.AddRange(groupList);
                }
            }
            return Json(finalgroupList);
        }
        [HttpPost]
        public async Task<ActionResult> GetGroupName()
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            List<int> UserInfoUserIdList = (user.Members != null && user.Members.Count > 0) ? user.Members.Select(x => x.UserInfoUserId).ToList<int>() : null;
            List<Groups> groupList = null;

            using (var objDL =DLGroups.GetDLGroups(domainDetails.AdsId,SQLProvider))
            {
                Groups group = new Groups();
                group.UserInfoUserId = user.UserId;
                groupList =await objDL.GetGroupList(group);
            }

            return Json(groupList);
        }

        [Log]
        [HttpPost]
        public async Task<ActionResult> AddToGroup([FromBody] FacebookContacts_AddToGroupDto objDto)
        {
            try
            {
                DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
                LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
                int UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;
                List<int> groupId = new List<int>();

                foreach (var GroupId in objDto.Groups)
                    groupId.Add(int.Parse(GroupId));

                //using (var generalAddToGroups = new GeneralAddToGroups(domainDetails.AdsId))
                //    generalAddToGroups.AddToGroupMemberAndRespectiveModule(user.UserId, UserGroupId, groupId.ToArray(), contact);

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
        public async Task<ActionResult> DeleteFromGroup([FromBody] FacebookContacts_DeleteFromGroupDto objDto)
        {
            try
            {
                DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
                LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
                foreach (var GroupId in objDto.Groups)
                {

                    GroupMember objGroupMembers = new GroupMember();
                    objGroupMembers.GroupId = GroupId;
                    objGroupMembers.UserInfoUserId = user.UserId;
                    objGroupMembers.UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;
                    foreach (var ContactId in objDto.contact)
                    {
                        objGroupMembers.ContactId = ContactId;

                        using (var objGroupMember =  DLGroupMember.GetDLGroupMember(domainDetails.AdsId,SQLProvider))
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
        [Log]
        [HttpPost]
        public async Task<ActionResult> AddToUnsubscribe([FromBody] FacebookContacts_AddToUnsubscribeDto objDto)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            int UserInfoUserId = user.UserId;

            using (var objDL = DLContact.GetContactDetails(domainDetails.AdsId,SQLProvider))
            {
                bool result = false;
                if (objDto.emilchk == true)
                {
                    result =await objDL.AddToUnsubscribeList(objDto.contact);
                }
                if (objDto.smschk == true)
                {
                    result =await objDL.AddToSmsUnsubscribeList(objDto.contact);
                }

                return Json(result);
            }
        }

        [Log]
        [HttpPost]
        public async Task<ActionResult> AddToInvalidate([FromBody] FacebookContacts_AddToInvalidateDto objDto)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            using (var objDL = DLContact.GetContactDetails(domainDetails.AdsId,SQLProvider))
            {
                var result =await objDL.AddToInvalidateList(objDto.contact);

                return Json(result);
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> VerifyEmailContact([FromBody] FacebookContacts_VerifyEmailContactDto objDto)
        {
            string ErrorMessage = string.Empty; bool result = false; int IsVerifiedMailId = -1;
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            EmailVerifyProviderSetting emailVerifyProviderSetting = null;
            using (var objDL = DLEmailVerifyProviderSetting.GetDLEmailVerifyProviderSetting(objDto.accountId, SQLProvider))
                emailVerifyProviderSetting =await objDL.GetActiveprovider();

            if (emailVerifyProviderSetting != null)
            {
                Contact contact = new Contact { ContactId = objDto.ContactId };
                List<string> fieldName = new List<string> { "ContactId", "EmailId", "IsVerifiedMailId" };
                using (var objDL = DLContact.GetContactDetails(objDto.accountId,SQLProvider))
                {
                    contact =await objDL.GetContactDetails(contact, fieldName);
                    //if (contact != null && !String.IsNullOrEmpty(contact.EmailId))
                    //{
                    //    List<Contact> contacts = new List<Contact>();
                    //    contacts.Add(contact);
                    //    IBulkVerifyEmailContact EmailVerifierGeneralBaseFactory = Plumb5GenralFunction.EmailVerifyGeneralBaseFactory.GetEmailVerifierVendor(accountId, emailVerifyProviderSetting);
                    //    EmailVerifierGeneralBaseFactory.VerifyBulkContact(contacts);

                    //    if (EmailVerifierGeneralBaseFactory.VendorResponses != null && EmailVerifierGeneralBaseFactory.VendorResponses.Count > 0)
                    //    {
                    //        if (EmailVerifierGeneralBaseFactory.VendorResponses[0].IsVerifiedMailId != null && EmailVerifierGeneralBaseFactory.VendorResponses[0].IsVerifiedMailId != -1)
                    //        {
                    //            IsVerifiedMailId = Convert.ToInt32(EmailVerifierGeneralBaseFactory.VendorResponses[0].IsVerifiedMailId);
                    //            objDL.MakeItNotVerified(ContactId, IsVerifiedMailId);
                    //            result = true;
                    //            ErrorMessage = "Email contact has been verified successfully";
                    //        }
                    //        else
                    //        {
                    //            result = false;
                    //            ErrorMessage = "Unable to verify a email, please try again after some time";
                    //        }
                    //    }
                    //    else
                    //    {
                    //        result = false;
                    //        ErrorMessage = "Response not found from the vendor, please try again";
                    //    }
                    //}
                    //else
                    //{
                    //    result = false;
                    //    ErrorMessage = "Email Id not found to verify the email contact";
                    //}
                }
            }
            else
            {
                result = false;
                ErrorMessage = "Please configure a email verifier vendor";
            }
            return Json(new { Result = result, ErrorMessage = ErrorMessage, IsVerifiedMailId = IsVerifiedMailId });
        }
    }
}
