using Plumb5.Controllers;
using Plumb5GenralFunction; 
using System.Text; 
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using System.Collections; 
using Plumb5.Areas.Mail.Dto;

namespace Plumb5.Areas.Mail.Controllers
{
    [Area("Mail")]
    public class UnsubscribedController : BaseController
    {
        public UnsubscribedController(IConfiguration _configuration) : base(_configuration)
        { }
        //
        // GET: /Mail/Unsubscribed/

        public IActionResult Index()
        {
            return View("Unsubscribed");
        }
        public async Task<JsonResult> GetGroupList([FromBody] Unsubscribed_GetGroupListDto UnsubscribedDto)
        {
            using (var objDL =   DLGroups.GetDLGroups(UnsubscribedDto.accountId, SQLProvider))
            {
                return Json(await objDL.GetGroupList(new Groups()) );
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetMaxCount([FromBody] Unsubscribed_GetMaxCountDto UnsubscribedDto)
        {
            ArrayList data = new ArrayList() { UnsubscribedDto.GroupId };
            HttpContext.Session.SetString("MailUnScubscribeGroupId", JsonConvert.SerializeObject(data)); 
            using (var objDL =   DLContact.GetContactDetails(UnsubscribedDto.accountId,SQLProvider))
            {
                return Json(await objDL.MailUnSubscribeMaxCount(UnsubscribedDto.GroupId) );
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetUnSubScribedContactList([FromBody] Unsubscribed_GetUnSubScribedContactListDto UnsubscribedDto)
        {
            List<Contact> contactList = null;

            using (var objDL = DLContact.GetContactDetails(UnsubscribedDto.accountId, SQLProvider))
            {
                contactList = (await objDL.GetMailUnSubscribeDetails(UnsubscribedDto.OffSet, UnsubscribedDto.FetchNext, UnsubscribedDto.GroupId)).ToList();
            }
            return Json(contactList );
        }
        [HttpPost]
        public async Task<JsonResult> GetGroupNameByContacts([FromBody] Unsubscribed_GetGroupNameByContactsDto UnsubscribedDto)
        {
            List<Groups> finalgroupList = new List<Groups>();
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
             
            foreach (var ContactId in UnsubscribedDto.contact)
            {
                using (var objDL = DLContact.GetContactDetails(domainDetails.AdsId, SQLProvider)) 
                {
                    List<Groups> groupList = new List<Groups>();
                    groupList =(await  objDL.BelongToWhichGroup(ContactId)).ToList();
                    finalgroupList.AddRange(groupList);
                }
            }
            return Json(finalgroupList );
        }
        [HttpPost]
        public async Task<ActionResult>  AddToGroup([FromBody] Unsubscribed_AddToGroupDto UnsubscribedDto)
        {
            try
            {
                List<Int64> addedId = new List<Int64>();
                //DomainInfo domainDetails = (DomainInfo)Session["AccountInfo"];
                LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo")); 
                int UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;
                List<int> groupId = new List<int>();

                foreach (var GroupId in UnsubscribedDto.Groups)
                    groupId.Add(int.Parse(GroupId));

                using (GeneralAddToGroups generalAddToGroups = new GeneralAddToGroups(UnsubscribedDto.accountId,SQLProvider))
                {
                    Tuple<List<Int64>, List<Int64>, List<Int64>> tuple = await generalAddToGroups.AddToGroupMemberAndRespectiveModule(user.UserId, UserGroupId, groupId.ToArray(), UnsubscribedDto.contact);
                    addedId = tuple.Item1.Where(x => x > 0).ToList();
                }

                return Json(addedId );
            }
            catch (Exception e)
            {
                return null;
            }
        }
        [HttpPost]
        public async Task<ActionResult> DeleteFromGroup([FromBody] Unsubscribed_DeleteFromGroupDto UnsubscribedDto)
        {
            try
            {
                //DomainInfo domainDetails = (DomainInfo)Session["AccountInfo"];
                LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
                foreach (var GroupId in UnsubscribedDto.Groups)
                {

                    GroupMember objGroupMembers = new GroupMember();
                    objGroupMembers.GroupId = GroupId;
                    objGroupMembers.UserInfoUserId = user.UserId;
                    objGroupMembers.UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;
                    foreach (var ContactId in UnsubscribedDto.contact)
                    {
                        objGroupMembers.ContactId = ContactId;

                        using (var objGroupMember =   DLGroupMember.GetDLGroupMember(UnsubscribedDto.accountId,SQLProvider))
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
        [HttpPost]
        public async Task<JsonResult>  UpdateUnSubscribRecord([FromBody] Unsubscribed_UpdateUnSubscribRecordDto UnsubscribedDto)
        {
            foreach (var ContactId in UnsubscribedDto.contact)
            {
                using (var objDL =   DLContact.GetContactDetails(UnsubscribedDto.accountId,SQLProvider))
                {
                    await objDL.UpdateMailUnSubscribedContact(ContactId);
                }
            }
            return Json(new { Status = false } );
        }
        [HttpPost]
        public async Task<JsonResult> GetUnsubscribedDetails([FromBody] Unsubscribed_GetUnsubscribedDetailsDto UnsubscribedDto)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo")); 
            Contact contactDetails = new Contact() { EmailId = UnsubscribedDto.EmailId, Unsubscribe = UnsubscribedDto.Unsubscribe };
            List<Contact> GetContactList = new List<Contact>();
            List<string> details = new List<string>() { "Name", "EmailId", "ContactId" };
            ArrayList data = new ArrayList() { contactDetails };
            HttpContext.Session.SetString("Unsubscribed", JsonConvert.SerializeObject(data));
            
            using (var getDetails =   DLContact.GetContactDetails(domainDetails.AdsId,SQLProvider))
            {
                GetContactList = (await getDetails.GET(contactDetails, 20, 0, 0, 0, null, details, false)).ToList();
                if (GetContactList != null && GetContactList.Count > 0)
                {
                    for (int i = 0; i < GetContactList.Count; i++)
                    {
                        GetContactList[i].Name = String.IsNullOrEmpty(GetContactList[i].Name) ? GetContactList[i].Name : Helper.MaskName(GetContactList[i].Name);
                        GetContactList[i].EmailId = String.IsNullOrEmpty(GetContactList[i].EmailId) ? GetContactList[i].EmailId : Helper.MaskEmailAddress(GetContactList[i].EmailId);
                    }
                }
            }
            return Json(GetContactList );
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> Export([FromBody] Unsubscribed_ExportDto UnsubscribedDto)
        {
            if (HttpContext.Session.GetString("UserInfo") != null) 
            {
                DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

                // Create a DataSet and put both tables in it.
                System.Data.DataSet dataSet = new System.Data.DataSet("General");
                List<string> details = new List<string>() { "Name", "EmailId", "ContactId" };
                List<Contact> unsubscribeddetails = null;
                Contact unsubscribeddetail = new Contact();
                if (HttpContext.Session.GetString("UserUnsubscribedInfo") != null) 
                {
                    ArrayList data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("Unsubscribed")) ; 
                    unsubscribeddetail = (Contact)data[0];
                }

                using (var objDL =   DLContact.GetContactDetails(domainDetails.AdsId,SQLProvider))
                {
                    unsubscribeddetails = (await objDL.GET(unsubscribeddetail, UnsubscribedDto.FetchNext, UnsubscribedDto.OffSet, 0, 0, null, details, false)).ToList();
                }

                var NewListData = unsubscribeddetails.Select(x => new
                {
                    x.Name,
                    x.EmailId
                });

                System.Data.DataTable dtt = new System.Data.DataTable();
                dtt = NewListData.CopyToDataTable();
                dataSet.Tables.Add(dtt);

                string FileName = DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + UnsubscribedDto.FileType;

                string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

                Helper.SaveDataSetToExcel(dataSet, MainPath);
                MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

                return Json(new { Status = true, MainPath } );
            }
            else
            {
                return Json(new { Status = false } );
            }
        }
        [HttpPost]
        public async Task<JsonResult> ExportUnsubscribeDetails([FromBody] Unsubscribed_ExportUnsubscribeDetailsDto UnsubscribedDto)
        {
            int GroupId = 0;
            string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(UnsubscribedDto.AccountId,SQLProvider);
            if (HttpContext.Session.GetString("MailUnScubscribeGroupId") != null) 
            {
                ArrayList data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("MailUnScubscribeGroupId")); 
                GroupId = Convert.ToInt32(data[0]);
            }
            try
            {
                List<Contact> contactList = null;

                using (var objDL =   DLContact.GetContactDetails(UnsubscribedDto.AccountId,SQLProvider))
                {
                    contactList = (await objDL.GetMailUnSubscribeDetails(UnsubscribedDto.OffSet, UnsubscribedDto.FetchNext, GroupId)).ToList();
                }
                if (contactList != null && contactList.Count > 0)
                {
                    var NewListData = contactList.Select(x => new
                    {
                        EmailId = !String.IsNullOrEmpty(x.EmailId) ? Helper.MaskEmailAddress(x.EmailId) : x.EmailId,
                        CreatedDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.CreatedDate)).ToString(),
                    });

                    System.Data.DataSet dataSet = new System.Data.DataSet("General");
                    System.Data.DataTable dtt = new System.Data.DataTable();
                    dtt = NewListData.CopyToDataTableExport();
                    dataSet.Tables.Add(dtt);

                    string FileName = "MailUnsubscribedContacts_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + UnsubscribedDto.FileType;

                    string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

                    if (UnsubscribedDto.FileType.ToLower() == "csv")
                        Helper.SaveDataSetToCSV(dataSet, MainPath);
                    else
                        Helper.SaveDataSetToExcel(dataSet, MainPath);

                    MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

                    return Json(new { Status = true, MainPath } );
                }
            }
            catch
            {

            }
            return Json(new { Status = false } );
        }
    }
}

