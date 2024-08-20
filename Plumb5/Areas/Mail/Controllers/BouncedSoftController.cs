using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Mail.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;

namespace Plumb5.Areas.Mail.Controllers
{
    [Area("Mail")]
    public class BouncedSoftController : BaseController
    {
        public BouncedSoftController(IConfiguration _configuration) : base(_configuration)
        { }
        //
        // GET: /Mail/BouncedSoft/

        public IActionResult Index()
        {
            return View("BouncedSoft");
        }
        [HttpPost]
        public async Task<JsonResult> GetGroupList([FromBody] BouncedSoft_GetGroupListDto BouncedSoftDto)
        {
            using (var objDL =   DLGroups.GetDLGroups(BouncedSoftDto.accountId, SQLProvider))
            {
                return Json(await objDL.GetGroupList(new Groups()) );
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetMaxCount([FromBody] BouncedSoft_GetMaxCountDto BouncedSoftDto)
        {
            using (var objDL =   DLMailBouncedContacts.GetDLMailBouncedContacts(BouncedSoftDto.accountId,SQLProvider))
            {
                return Json(await objDL.GetMaxCount(BouncedSoftDto.MailBounced, BouncedSoftDto.GroupId));
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetBouncedContactList([FromBody] BouncedSoft_GetBouncedContactListDto BouncedSoftDto)
        {
            List<MLMailBouncedContact> mailBouncedContacts = new List<MLMailBouncedContact>();
            using (var objDL = DLMailBouncedContacts.GetDLMailBouncedContacts(BouncedSoftDto.accountId, SQLProvider))
            {
                mailBouncedContacts = (await objDL.GetBouncedContacts(BouncedSoftDto.MailBounced, BouncedSoftDto.OffSet, BouncedSoftDto.FetchNext, BouncedSoftDto.GroupId)).ToList();

                if (mailBouncedContacts != null && mailBouncedContacts.Count > 0)
                {
                    for (int i = 0; i < mailBouncedContacts.Count; i++)
                        mailBouncedContacts[i].Emailid = Helper.MaskEmailAddress(mailBouncedContacts[i].Emailid);
                }
            }
            return Json(mailBouncedContacts );
        }
        [HttpPost]
        public async Task<JsonResult> GetGroupNameByContacts([FromBody] BouncedSoft_GetGroupNameByContactsDto BouncedSoftDto)
        {
            List<Groups> finalgroupList = new List<Groups>();
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            foreach (var ContactId in BouncedSoftDto.contact)
            {
                using (var objDL =   DLContact.GetContactDetails(domainDetails.AdsId,SQLProvider))
                {
                    List<Groups> groupList = new List<Groups>();
                    groupList = (await objDL.BelongToWhichGroup(ContactId)).ToList();
                    finalgroupList.AddRange(groupList);
                }
            }
            return Json(finalgroupList );
        }

        [Log]
        [HttpPost]
        public async Task<ActionResult> AddToGroup([FromBody] BouncedSoft_AddToGroupDto BouncedSoftDto)
        {
            try
            {
                List<Int64> addedId = new List<Int64>();
                //DomainInfo domainDetails = (DomainInfo)Session["AccountInfo"];
                LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
                int UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;
                List<int> groupId = new List<int>();

                foreach (var GroupId in BouncedSoftDto.Groups)
                    groupId.Add(int.Parse(GroupId));

                using (GeneralAddToGroups generalAddToGroups = new GeneralAddToGroups(BouncedSoftDto.accountId,SQLProvider))
                {
                    Tuple<List<Int64>, List<Int64>, List<Int64>> tuple = await generalAddToGroups.AddToGroupMemberAndRespectiveModule(user.UserId, UserGroupId, groupId.ToArray(), BouncedSoftDto.contact);
                    addedId = tuple.Item1.Where(x => x > 0).ToList();
                }

                return Json(addedId );
            }
            catch (Exception e)
            {
                return null;
            }
        }

        [Log]
        [HttpPost]
        public async Task<ActionResult>  DeleteFromGroup([FromBody] BouncedSoft_DeleteFromGroupDto BouncedSoftDto)
        {
            try
            {
                //DomainInfo domainDetails = (DomainInfo)Session["AccountInfo"];
                LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
                foreach (var GroupId in BouncedSoftDto.Groups)
                {

                    GroupMember objGroupMembers = new GroupMember();
                    objGroupMembers.GroupId = GroupId;
                    objGroupMembers.UserInfoUserId = user.UserId;
                    objGroupMembers.UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;
                    foreach (var ContactId in BouncedSoftDto.contact)
                    {
                        objGroupMembers.ContactId = ContactId;

                        using (var objGroupMember =   DLGroupMember.GetDLGroupMember(BouncedSoftDto.accountId,SQLProvider))
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
        public async Task<JsonResult> DeleteBounceRecord([FromBody] BouncedSoft_DeleteBounceRecordDto BouncedSoftDto)
        {
            if (BouncedSoftDto.bounceList != null && BouncedSoftDto.bounceList.Count > 0)
            {
                for (int i = 0; i < BouncedSoftDto.bounceList.Count; i++)
                {
                    using (var objDL =   DLMailBouncedContacts.GetDLMailBouncedContacts(BouncedSoftDto.accountId,SQLProvider))
                    {
                        await objDL.Delete(BouncedSoftDto.bounceList[i].Id);
                    }
                }

                return Json(new { Status = true } );
            }
            return Json(new { Status = false } );
        }

        

        [Log]
        [HttpPost]
        public async Task<JsonResult> Export([FromBody] BouncedSoft_ExportDto BouncedSoftDto)
        {
            try
            {
                List<MLMailBouncedContact> bounceList;
                using (var objDL =   DLMailBouncedContacts.GetDLMailBouncedContacts(BouncedSoftDto.accountId,SQLProvider))
                {
                    bounceList = (await objDL.GetBouncedContacts(BouncedSoftDto.MailBounced, 0, 0, BouncedSoftDto.GroupId)).ToList();
                }

                if (bounceList != null && bounceList.Count > 0)
                {
                    var NewListData = bounceList.Select(x => new
                    {
                        Emailid = !String.IsNullOrEmpty(x.Emailid) ? Helper.MaskEmailAddress(x.Emailid) : x.Emailid,
                        x.BounceType,
                        x.Category,
                        x.ReasonForBounce,
                        x.Errorcode,
                        x.BounceDate
                    });

                    System.Data.DataSet dataSet = new System.Data.DataSet("General");
                    System.Data.DataTable dtt = new System.Data.DataTable();
                    dtt = NewListData.CopyToDataTableExport();
                    dataSet.Tables.Add(dtt);

                    string FileName = "SoftBounce_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + BouncedSoftDto.FileType;

                    string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

                    if (BouncedSoftDto.FileType.ToLower() == "csv")
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

        [Log]
        [HttpPost]
        public async Task<JsonResult> ExportUnsubscribedContacts([FromBody] BouncedSoft_ExportUnsubscribedContactsDto BouncedSoftDto)
        {
            try
            {
                List<string> fieldNames = new List<string>() { "Name", "LastName", "EmailId", "ContactId" };
                List<Contact> contactList = null;

                using (var objDL =   DLContact.GetContactDetails(BouncedSoftDto.accountId,SQLProvider))
                {
                    contactList = (await objDL.GET(new Contact() { Unsubscribe = 1 }, 0, 0, 0, 0, null, fieldNames, false)).ToList();
                }

                if (contactList != null && contactList.Count > 0)
                {
                    var NewListData = contactList.Select(x => new
                    {
                        FirstName = !String.IsNullOrEmpty(x.Name) ? Helper.MaskName(x.Name) : x.Name,
                        LastName = !String.IsNullOrEmpty(x.LastName) ? Helper.MaskName(x.LastName) : x.LastName,
                        EmailId = !String.IsNullOrEmpty(x.EmailId) ? Helper.MaskEmailAddress(x.EmailId) : x.EmailId
                    });

                    System.Data.DataSet dataSet = new System.Data.DataSet("General");
                    System.Data.DataTable dtt = new System.Data.DataTable();
                    dtt = NewListData.CopyToDataTableExport();
                    dataSet.Tables.Add(dtt);

                    string FileName = "OptOut_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + BouncedSoftDto.FileType;

                    string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

                    if (BouncedSoftDto.FileType.ToLower() == "csv")
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
