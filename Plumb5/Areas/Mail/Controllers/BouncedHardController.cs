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
    public class BouncedHardController : BaseController
    {
        public BouncedHardController(IConfiguration _configuration) : base(_configuration)
        { }
        //
        // GET: /Mail/BouncedHard/

        public IActionResult Index()
        {
            return View("BouncedHard");
        }
        [HttpPost]
        public async Task<JsonResult> GetGroupList([FromBody] BouncedHard_GetGroupListDto BouncedHardDto)
        {
            using (var objDL =   DLGroups.GetDLGroups(BouncedHardDto.accountId, SQLProvider))
            {
                return Json(await objDL.GetGroupList(new Groups()) );
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetMaxCount([FromBody] BouncedHard_GetMaxCountDto BouncedHardDto)
        {
            using (var objDL =   DLMailBouncedContacts.GetDLMailBouncedContacts(BouncedHardDto.accountId, SQLProvider))
            {
                return Json(await objDL.GetMaxCount(BouncedHardDto.MailBounced, BouncedHardDto.GroupId));
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetBouncedContactList([FromBody] BouncedHard_GetBouncedContactListDto BouncedHardDto)
        {
            List<MLMailBouncedContact> bouncedContacts = new List<MLMailBouncedContact>();
            using (var objDL =   DLMailBouncedContacts.GetDLMailBouncedContacts(BouncedHardDto.accountId, SQLProvider))
            {
                bouncedContacts = (await objDL.GetBouncedContacts(BouncedHardDto.MailBounced, BouncedHardDto.OffSet, BouncedHardDto.FetchNext, BouncedHardDto.GroupId)).ToList();

                if (bouncedContacts != null && bouncedContacts.Count > 0)
                {
                    for (int i = 0; i < bouncedContacts.Count; i++)
                        bouncedContacts[i].Emailid = Helper.MaskEmailAddress(bouncedContacts[i].Emailid);
                }
            }
            return Json(bouncedContacts );
        }

        [HttpPost]
        public async Task<ActionResult> AddToGroup([FromBody] BouncedHard_AddToGroupDto BouncedHardDto)
        {
            try
            {
                List<Int64> addedId = new List<Int64>();
                //DomainInfo domainDetails = (DomainInfo)Session["AccountInfo"];
                LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
                int UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;
                List<int> groupId = new List<int>();

                foreach (var GroupId in BouncedHardDto.Groups)
                    groupId.Add(int.Parse(GroupId));

                using (GeneralAddToGroups generalAddToGroups = new GeneralAddToGroups(BouncedHardDto.accountId,SQLProvider))
                {
                    Tuple<List<Int64>, List<Int64>, List<Int64>> tuple =await  generalAddToGroups.AddToGroupMemberAndRespectiveModule(user.UserId, UserGroupId, groupId.ToArray(), BouncedHardDto.contact);
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
        public async Task<ActionResult> DeleteFromGroup([FromBody] BouncedHard_DeleteFromGroupDto BouncedHardDto)
        {
            try
            {
                //DomainInfo domainDetails = (DomainInfo)Session["AccountInfo"];
                LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
                foreach (var GroupId in BouncedHardDto.Groups)
                {
                    GroupMember objGroupMembers = new GroupMember();
                    objGroupMembers.GroupId = GroupId;
                    objGroupMembers.UserInfoUserId = user.UserId;
                    objGroupMembers.UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;
                    foreach (var ContactId in BouncedHardDto.contact)
                    {
                        objGroupMembers.ContactId = ContactId;

                        using (var objGroupMember = DLGroupMember.GetDLGroupMember(BouncedHardDto.accountId,SQLProvider))
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
        public async Task<JsonResult>  DeleteBounceRecord([FromBody] BouncedHard_DeleteBounceRecordDto BouncedHardDto)
        {
            if (BouncedHardDto.bounceList != null && BouncedHardDto.bounceList.Count > 0)
            {
                for (int i = 0; i < BouncedHardDto.bounceList.Count; i++)
                {
                    using (var objDL =   DLMailBouncedContacts.GetDLMailBouncedContacts(BouncedHardDto.accountId,SQLProvider))
                    {
                        await objDL.Delete(BouncedHardDto.bounceList[i].Id);
                    }
                }

                return Json(new { Status = true }  );
            }
            return Json(new { Status = false }  );
        }
         
        [Log]
        [HttpPost]
        public async Task<JsonResult> Export([FromBody] BouncedHard_ExportDto BouncedHardDto)
        {
            try
            {
                List<MLMailBouncedContact> bounceList;
                using (var objDL =   DLMailBouncedContacts.GetDLMailBouncedContacts(BouncedHardDto.accountId,SQLProvider))
                {
                    bounceList = (await objDL.GetBouncedContacts(BouncedHardDto.MailBounced, 0, 0, BouncedHardDto.GroupId)).ToList();
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

                    string FileName = "HardBounce_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + BouncedHardDto.FileType;

                    string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

                    if (BouncedHardDto.FileType.ToLower() == "csv")
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
        public async Task<JsonResult> ExportUnsubscribedContacts([FromBody] BouncedHard_ExportUnsubscribedContactsDto BouncedHardDto)
        {
            try
            {
                List<string> fieldNames = new List<string>() { "Name", "LastName", "EmailId", "ContactId" };
                List<Contact> contactList = null;

                using (var objDL =   DLContact.GetContactDetails(BouncedHardDto.accountId,SQLProvider))
                {
                    contactList =(await  objDL.GET(new Contact() { Unsubscribe = 1 }, 0, 0, 0, 0, null, fieldNames, false)).ToList();
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

                    string FileName = "OptOut_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + BouncedHardDto.FileType;

                    string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

                    if (BouncedHardDto.FileType.ToLower() == "csv")
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
