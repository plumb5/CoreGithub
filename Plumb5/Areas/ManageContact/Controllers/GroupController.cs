using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.Blazor;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.ManageContact.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;
using System.Data;
using System.Globalization;
using System.Reflection;

namespace Plumb5.Areas.ManageContact.Controllers
{
    [Area("ManageContact")]
    public class GroupController : BaseController
    {
        public GroupController(IConfiguration _configuration) : base(_configuration)
        { }
        public IActionResult Index()
        {
            return View("Group");
        }

        [HttpPost]
        public async Task<IActionResult> GetGroupReportCount([FromBody] Group_GetGroupReportCountDto details)
        {
            int returnVal;
            using (var objDL = DLGroups.GetDLGroups(details.accountId, SQLProvider))
            {
                returnVal = await objDL.MaxCount(details.group);
            }
            return Json(new
            {
                returnVal
            });
        }

        [HttpPost]
        public async Task<IActionResult> BindGroupDetails([FromBody] Group_BindGroupDetailsDto details)
        {
            List<MLGroups> groupdetails = null;
            ArrayList data = new ArrayList() { details.group };
            HttpContext.Session.SetString("GroupDetails", JsonConvert.SerializeObject(data));

            using (var objDL = DLGroups.GetDLGroups(details.accountId, SQLProvider))
            {
                groupdetails = await objDL.BindGroupsDetails(details.group, details.FetchNext, details.OffSet);
            }
            return Json(groupdetails);
        }

        [HttpPost]
        public async Task<IActionResult> GetGroupsDetails([FromBody] Group_GetGroupsDetailsDto details)
        {
            MLGroups groupdetails = null;

            using (var objDL = DLGroups.GetDLGroups(details.accountId, SQLProvider))
            {
                groupdetails = await objDL.GetGroupsDetails(details.GroupId);
            }
            return Json(groupdetails);
        }

        [HttpPost]
        public async Task<IActionResult> GetContactInfoDetails([FromBody] Group_GetContactInfoDetailsDto details)
        {
            MLGroups groupdetails = null;

            using (var objDL = DLGroups.GetDLGroups(details.accountId, SQLProvider))
            {
                groupdetails = await objDL.GetContactInfoDetails();
            }
            return Json(groupdetails);
        }

        [HttpPost]
        public async Task<JsonResult> GetGroupsByStaticOrDynamic([FromBody] Group_GetGroupsByStaticOrDynamicDto details)
        {
            List<MLGroups> groupdetails = null;

            using (var objDL = DLGroups.GetDLGroups(details.accountId, SQLProvider))
            {
                groupdetails = await objDL.GetGroupsByStaticOrDynamic(details.GroupType);
            }
            return Json(new { GroupDetails = groupdetails });
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> GroupExport([FromBody] Group_GroupExportDto details)
        {
            DataSet dataSet = new DataSet();
            List<MLGroups> groupdetails = null;
            MLGroups group = new MLGroups();
            if (HttpContext.Session.GetString("GroupDetails") != null)
            {
                ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("GroupDetails"));
                group = JsonConvert.DeserializeObject<MLGroups>(data[0].ToString());
                //group = (MLGroups)data[0];
            }
            using (var objDL = DLGroups.GetDLGroups(details.AccountId, SQLProvider))
            {
                groupdetails = await objDL.GetGroupDetailsForExport(group, details.OffSet, details.FetchNext);
            }
            string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(details.AccountId, SQLProvider);
            var NewListData = groupdetails.Select(x => new
            {
                x.Name,
                Description = x.GroupDescription,
                x.Total,
                InValidMail = x.InValid,
                VerifiedMail = x.Verified,
                UnVerifiedMail = x.UnVerified,
                x.MailSubscribe,
                MailUnSubscribe = x.Unsubscribe,
                x.SmsSubscribe,
                x.SmsUnsubscribe,
                x.WhatsAppSubscribe,
                x.WhatsAppUnsubscribe,
                CreatedDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.CreatedDate.ToString())).ToString(),
            });
            System.Data.DataTable dtt = new System.Data.DataTable();
            dtt = NewListData.CopyToDataTableExport();
            dataSet.Tables.Add(dtt);

            string FileName = "ManageGroup_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + details.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (details.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(dataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
            return Json(new { Status = true, MainPath });
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> GroupContactExport([FromBody] Group_GroupContactExportDto details)
        {
            DataSet dataSet = new DataSet();
            DataTable MainDataTable = new DataTable();
            List<MLGroupContacts> contactList = null;

            using (var objDL = DLGroups.GetDLGroups(details.accountId, SQLProvider))
            {
                contactList = await objDL.BindGroupAllContacts(details.GroupId);
            }
            System.Data.DataTable dtt = new System.Data.DataTable();
            dtt = contactList.CopyToDataTableExport();
            dataSet.Tables.Add(dtt);

            string FileName = "ManageGroup_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + details.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (details.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(dataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
            return Json(new { Status = true, MainPath });
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> SaveOrUpdateDetails([FromBody] Group_SaveOrUpdateDetailsDto details)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            details.group.UserInfoUserId = user.UserId;
            details.group.UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;
            //#region Logs 
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(accountId, 0, "", "", "Group", "", "SaveOrUpdateDetails", Helper.GetIP(), JsonConvert.SerializeObject(new { group = group }));
            //#endregion
            if (details.group.Id <= 0)
            {
                using (var objDL = DLGroups.GetDLGroups(details.accountId, SQLProvider))
                {
                    details.group.Id = await objDL.Save(details.group);
                }
            }
            else if (details.group.Id > 0)
            {
                using (var objDL = DLGroups.GetDLGroups(details.accountId, SQLProvider))
                {
                    if (!await objDL.Update(details.group))
                    {
                        details.group.Id = -1;
                    }
                }
            }
            return Json(new { Group = details.group, UserName = "" });
        }
        public async Task<ActionResult> GetGroupsCountByGroupId([FromBody] Group_GetGroupsCountByGroupIdDto details)
        {
            MLGroups groupDetails;

            using (var objDL = DLGroups.GetDLGroups(details.accountId, SQLProvider))
            {
                groupDetails = await objDL.GetGroupsCountByGroupId(details.GroupId);
            }

            if (groupDetails == null)
            {
                groupDetails = new MLGroups()
                {
                    Id = details.GroupId,
                    Total = 0,
                    InValid = 0,
                    UnVerified = 0,
                    Unsubscribe = 0,
                    Verified = 0
                };
            }
            return Json(groupDetails);
        }


        [Log]
        [HttpPost]
        public async Task<JsonResult> SearchAndAddtoGroup([FromBody] Group_SearchAndAddtoGroupDto details)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            int UserInfoUserId = user.UserId;
            int UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;

            Nullable<DateTime> FromDateTime = null;
            Nullable<DateTime> ToDateTime = null;

            if (!string.IsNullOrEmpty(details.FromDate))
                FromDateTime = DateTime.ParseExact(details.FromDate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            if (!string.IsNullOrEmpty(details.ToDate))
                ToDateTime = DateTime.ParseExact(details.ToDate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            //#region Logs     
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(accountId, 0, "", "", "ManageContacts", "Group", "SearchAndAddtoGroup", Helper.GetIP(), JsonConvert.SerializeObject(new { contact = contact, GroupId = GroupId }));
            //#endregion

            using (var objDL = DLContact.GetContactDetails(details.accountId, SQLProvider))
            {
                bool result = await objDL.SearchAndAddtoGroup(UserInfoUserId, UserGroupId, details.contact, details.StartCount, details.EndCount, details.GroupId, FromDateTime, ToDateTime);
                //if (result)
                //    LogMessage = "The contact has been filtered and added to the group";
                //else
                //    LogMessage = "Unable to add contact into the group";

                //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { result = result }), LogMessage);
                return Json(result);
            }
        }

        [Log]
        public async Task<JsonResult> RemoveContactFromOtherGroup([FromBody] Group_RemoveContactFromOtherGroupDto details)
        {

            //#region Logs  
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(accountId, 0, "", "", "ManagContacts", "Groups", "RemoveContactFromOtherGroup", Helper.GetIP(), JsonConvert.SerializeObject(new { GroupId = GroupId }));
            //#endregion

            using (var objDL = DLGroupMember.GetDLGroupMember(details.accountId, SQLProvider))
            {
                bool result = await objDL.RemoveContactFromOtherGroup(details.GroupId);
                //if (result)
                //    LogMessage = "The contacts has been removed from other group";
                //else
                //    LogMessage = "Unable to remove contacts from the other group";

                //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { result = result }), LogMessage);
                return Json(result);
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> DuplicateContactsToNewGroup([FromBody] Group_DuplicateContactsToNewGroupDto details)
        {

            //#region Logs  
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(accountId, 0, "", "", "ManagContacts", "Groups", "RemoveContactFromOtherGroup", Helper.GetIP(), JsonConvert.SerializeObject(new { GroupId = GroupId, NewGroupId = NewGroupId }));
            //#endregion

            using (var objDL = DLGroupMember.GetDLGroupMember(details.accountId, SQLProvider))
            {
                var result = objDL.DuplicateContactsToNewGroup(details.GroupId, details.NewGroupId);
                //if (result > 0)
                //    LogMessage = "The contacts has been removed from other group";
                //else
                //    LogMessage = "Unable to remove contacts from the other group";

                //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { result = result }), LogMessage);
                return Json(result);
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> Delete([FromBody] Group_DeleteDto details)
        {

            //#region Logs   
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(accountId, 0, "", "", "Group", "", "Delete", Helper.GetIP(), JsonConvert.SerializeObject(new { Id = Id }));
            //#endregion
            Groups groupDetails;
            using (var objDL = DLGroups.GetDLGroups(details.accountId, SQLProvider))
            {
                groupDetails = await objDL.Get(new Groups() { Id = details.Id });
            }

            using (var objDL = DLGroups.GetDLGroups(details.accountId, SQLProvider))
            {
                bool result = await objDL.Delete(details.Id);

                if (result && groupDetails.GroupType == 2)
                {
                    using (var bLSegmentBuilder = DLSegmentBuilder.GetDLSegmentBuilder(details.accountId, SQLProvider))
                    {
                        bLSegmentBuilder.UpdateDeleteStatus(details.Id);
                    }
                }
                //if (result)
                //    LogMessage = "The group '" + groupDetails.Name + "' has been deleted";
                //else
                //    LogMessage = "Unable to delete a group '" + groupDetails.Name + "'";

                //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { result = result }), LogMessage);
                return Json(result);
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> ValidateGroup([FromBody] Group_ValidateGroupDto details)
        {
            DomainInfo domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            DateTime CreateDate = DateTime.Now;
            details.contactEmailValidationOverView.CreatedDate = CreateDate;
            details.contactEmailValidationOverView.UpdatedDate = CreateDate;
            details.contactEmailValidationOverView.Updated_At = CreateDate;
            details.contactEmailValidationOverView.Status = "In Queue";

            int result = 0;
            using (var objDL = DLContactEmailValidationOverView.GetDLContactEmailValidationOverView(domainDetails.AdsId, SQLProvider))
            {
                result = await objDL.Save(details.contactEmailValidationOverView);
            }

            details.contactEmailValidationOverView.Id = result;
            return Json(new { ContactEmailValidationOverView = details.contactEmailValidationOverView, UserName = user.UserName });
        }
        [HttpPost]
        public async Task<JsonResult> GetProperties([FromBody] Group_GetPropertiesDto details)
        {
            MLGroupAddContact obj = new MLGroupAddContact();
            List<FieldDetails> Fields = new List<FieldDetails>();
            List<string> OptionList = new List<string>();
            string optionsvalue = "", FieldTypes = "";
            foreach (PropertyInfo prop in obj.GetType().GetProperties())
            {
                optionsvalue = ""; FieldTypes = "";
                FieldTypes = prop.PropertyType.Name.ToString();
                if (prop.PropertyType.IsEnum)
                {

                    //var a = Helper.GetDisplayValues(new Martial());

                    //foreach (var value in )
                    //{
                    //    var description = Helper.GetDisplayValue(value);
                    //}


                    foreach (FieldInfo fInfo in prop.PropertyType.GetFields(BindingFlags.Public | BindingFlags.Static))
                    {
                        OptionList.Add(fInfo.Name);
                    }
                    optionsvalue = String.Join(",", OptionList.ToArray());
                    OptionList.Clear();
                    FieldTypes = "enum";
                }

                Fields.Add(new FieldDetails { FieldName = prop.Name.ToString(), FieldType = FieldTypes, FieldValue = optionsvalue, CustomFieldName = "" });
            }

            List<ContactExtraField> ContactExtraFieldList = new List<ContactExtraField>();
            using (var objBAL = DLContactExtraField.GetDLContactExtraField(details.AccountId, SQLProvider))
            {
                ContactExtraFieldList = await objBAL.GetList();
            }

            if (ContactExtraFieldList != null && ContactExtraFieldList.Count() > 0)
            {
                for (int i = 0; i < ContactExtraFieldList.Count(); i++)
                {
                    if (ContactExtraFieldList[i].FieldType == 1 || ContactExtraFieldList[i].FieldType == 2)
                        Fields.Add(new FieldDetails { FieldName = ContactExtraFieldList[i].FieldName.ToString(), FieldType = "String", FieldValue = ContactExtraFieldList[i].SubFields, CustomFieldName = "CustomField" + (i + 1) + "" });
                    else if (ContactExtraFieldList[i].FieldType == 3 || ContactExtraFieldList[i].FieldType == 4 || ContactExtraFieldList[i].FieldType == 5)
                        Fields.Add(new FieldDetails { FieldName = ContactExtraFieldList[i].FieldName.ToString(), FieldType = "enum", FieldValue = ContactExtraFieldList[i].SubFields, CustomFieldName = "CustomField" + (i + 1) + "" });
                    else if (ContactExtraFieldList[i].FieldType == 6)
                        Fields.Add(new FieldDetails { FieldName = ContactExtraFieldList[i].FieldName.ToString(), FieldType = "DateTime", FieldValue = ContactExtraFieldList[i].SubFields, CustomFieldName = "CustomField" + (i + 1) + "" });
                }
            }
            return Json(Fields);
        }
        [HttpPost]
        public async Task<JsonResult> GetTotalUniqueRecipientsCount([FromBody] Group_GetTotalUniqueRecipientsCountDto details)
        {
            using (var objDL = DLGroupMember.GetDLGroupMember(details.accountId, SQLProvider))
            {
                return Json(await objDL.GetTotalUniqueRecipientsCount(details.ListOfGroupId));
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> MergeDistinctContactIntoGroup([FromBody] Group_MergeDistinctContactIntoGroupDto details)
        {
            DomainInfo domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            bool Result = false;
            //#region Logs  
            string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(accountId, 0, "", "", "ManagContacts", "Groups", "MergeDistinctContactIntoGroup", Helper.GetIP(), JsonConvert.SerializeObject(new { ListOfGroupId = ListOfGroupId, Group = group }));
            //#endregion

            using (var objDL = DLGroups.GetDLGroups(details.accountId, SQLProvider))
            {
                details.group.UserInfoUserId = user.UserId;
                details.group.Id = await objDL.Save(details.group);
                if (details.group.Id > 0)
                {
                    using (var groupMember = DLGroupMember.GetDLGroupMember(details.accountId, SQLProvider))
                    {
                        Result = await groupMember.MergeDistinctContactIntoGroup(details.ListOfGroupId, details.group.Id, user.UserId);
                    }

                    if (Result)
                        LogMessage = "The group '" + details.group.Name + "' has been created and inserted into group";
                    else
                        LogMessage = "Unable to create a group '" + details.group.Name + "', Please try again after sometime";
                }
                else
                {
                    LogMessage = "The group '" + details.group.Name + "' already exists, please try another name";
                }
            }
            //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Group = group, LogMessage = LogMessage, Result = Result, GroupId = group.Id }), LogMessage);
            return Json(new { LogMessage = LogMessage, Result = Result, GroupId = details.group.Id });
        }
        [HttpPost]
        public async Task<IActionResult> GetGroupList([FromBody] Group_GetGroupListDto details)
        {
            LoginInfo user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            List<int> UserInfoUserIdList = (user.Members != null && user.Members.Count > 0) ? user.Members.Select(x => x.UserInfoUserId).ToList<int>() : null;
            List<Groups> groupList = null;

            using (var objDL = DLGroups.GetDLGroups(details.accountId, SQLProvider))
            {
                groupList = await objDL.GetGroupList(new Groups { UserInfoUserId = user.UserId });
            }

            return Json(groupList);
        }
        [HttpPost]
        public async Task<IActionResult> MoveGroupsContact([FromBody] Group_MoveGroupsContactDto details)
        {
            try
            {
                //Insert to GroupMember
                using (var objGroupMember = DLGroupMember.GetDLGroupMember(details.accountId, SQLProvider))
                {
                    await objGroupMember.MoveGroupsContact(details.UserId, details.selectedGroups, details.newGroupId);
                }
                //Remove From GroupMember
                using (var objGroupMember = DLGroupMember.GetDLGroupMember(details.accountId, SQLProvider))
                {
                    await objGroupMember.RemoveFromSelectedGroups(details.selectedGroups);
                }
                return Json(true);
            }
            catch (Exception ex)
            {
                return null;
            }

        }
        [HttpPost]
        public async Task<IActionResult> MergeGroupContacts([FromBody] Group_MergeGroupContactsDto details)
        {
            LoginInfo user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            details.groups.UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;

            //Insert to Groups table
            using (var objDL = DLGroups.GetDLGroups(details.accountId, SQLProvider))
            {
                details.groups.Id = await objDL.Save(details.groups);
            }
            if (details.groups.Id > 0)
            {
                //Insert to GroupMember
                using (var objGroupMember = DLGroupMember.GetDLGroupMember(details.accountId, SQLProvider))
                {
                    objGroupMember.MoveGroupsContact(details.groups.UserInfoUserId, details.selectedGroups, details.groups.Id);
                }
            }
            return Json(details.groups);
        }
        [HttpPost]
        public async Task<IActionResult> CopyGroupsContact([FromBody] Group_CopyGroupsContactDto details)
        {
            try
            {
                //Insert to GroupMember
                using (var objGroupMember = DLGroupMember.GetDLGroupMember(details.accountId, SQLProvider))
                {
                    await objGroupMember.MoveGroupsContact(details.UserId, details.selectedGroups, details.newGroupId);
                }

                return Json(true);
            }
            catch (Exception ex)
            {
                return null;
            }

        }
        [HttpPost]
        public async Task<JsonResult> CreateControlGroup([FromBody] Group_CreateControlGroupDto details)
        {
            int result = -1, groupexist = 0;
            using (var objBL = DLGroups.GetDLGroups(details.accountId, SQLProvider))
            {
                groupexist = await objBL.CheckGroupNameExistance(details.Controlgroupinfo);
            }
            if (groupexist == 0)
            {
                List<GroupMember> GroupMemberList;
                //Get all the contact for the group
                using (var objDL = DLGroupMember.GetDLGroupMember(details.accountId, SQLProvider))
                {
                    GroupMemberList = await objDL.GET(new GroupMember() { GroupId = details.Controlgroupinfo.GroupId }, -1, -1, "");
                }
                //Randomly pick the contact and create new list
                List<GroupMember> randomControlGroupList = new List<GroupMember>();
                randomControlGroupList = GetRandomElements(GroupMemberList, details.Controlgroupinfo.ControlGroupCount);

                //Create new control group
                DataTable dtControlGroup = new DataTable();
                //DataTable table = new DataTable();
                dtControlGroup.Columns.Add("contactid", typeof(int));
                foreach (int cid in randomControlGroupList.Select(l => l.ContactId))
                {
                    DataRow row = dtControlGroup.NewRow();
                    row["contactid"] = cid;
                    dtControlGroup.Rows.Add(row);
                }
                //dtControlGroup = randomControlGroupList.Select(l => l.ContactId).CopyToDataTableExport();
                int ControlGroupId = 0, NonControlGroupId = 0;
                Groups Ctrlgroups = new Groups();
                Ctrlgroups.Name = details.Controlgroupinfo.ControlGroupName;
                Ctrlgroups.GroupDescription = details.Controlgroupinfo.ControlGroupDescription;
                using (var objBL = DLGroups.GetDLGroups(details.accountId, SQLProvider))
                {
                    ControlGroupId = await objBL.Save(Ctrlgroups);
                    if (ControlGroupId > 0)
                        result = 1;
                }
                if (ControlGroupId > 0)
                {
                    try
                    {
                        //Add Contact to the newly Created Control Group
                        List<Int64> ControlgroupaddedId = new List<Int64>();
                        using (var objGroupMember = DLGroupMember.GetDLGroupMember(details.accountId, SQLProvider))
                        {
                            Int64 id = await objGroupMember.BulkInsertionToGroupMember(ControlGroupId, dtControlGroup);
                        }
                    }
                    catch (Exception ex)
                    {

                    }
                }

                //Create new NonControl group
                if (details.Controlgroupinfo.IsNotControlGroupChecked)
                {

                    List<GroupMember> NonControlGroupMemberList = new List<GroupMember>();
                    NonControlGroupMemberList = GroupMemberList.Except(randomControlGroupList).ToList();

                    DataTable dtNonControlGroup = new DataTable();
                    dtNonControlGroup.Columns.Add("contactid", typeof(int));
                    foreach (int cid in NonControlGroupMemberList.Select(l => l.ContactId))
                    {
                        DataRow row = dtNonControlGroup.NewRow();
                        row["contactid"] = cid;
                        dtNonControlGroup.Rows.Add(row);
                    }
                    //dtNonControlGroup = NonControlGroupMemberList.Select(l => l.ContactId).CopyToDataTableExport();
                    //int[] NonControlGroupContacts = NonControlGroupMemberList.Select(l => l.ContactId).ToArray();
                    Groups ntctrlgroups = new Groups();
                    ntctrlgroups.Name = details.Controlgroupinfo.NonControlGroupName;
                    ntctrlgroups.GroupDescription = details.Controlgroupinfo.NonControlGroupDescription;
                    using (var objBL = DLGroups.GetDLGroups(details.accountId, SQLProvider))
                    {
                        NonControlGroupId = await objBL.Save(ntctrlgroups);
                    }
                    ////Add Contact to the newly Created non Control Group
                    if (NonControlGroupId > 0)
                    {
                        using (var objGroupMember = DLGroupMember.GetDLGroupMember(details.accountId, SQLProvider))
                        {
                            Int64 id = await objGroupMember.BulkInsertionToGroupMember(NonControlGroupId, dtNonControlGroup);
                        }
                    }
                }
                //Insert data to the ControlGroups table
                using (var objBL = DLControlGroups.GetDLControlGroups(details.accountId, SQLProvider))
                {
                    details.Controlgroupinfo.ControlGroupId = ControlGroupId;
                    details.Controlgroupinfo.NonControlGroupId = NonControlGroupId;
                    result = await objBL.Save(details.Controlgroupinfo);
                }
            }
            return Json(result);
        }
        private static List<GroupMember> GetRandomElements(List<GroupMember> listOfNumber, int elementsCount)
        {
            return listOfNumber.OrderBy(x => Guid.NewGuid()).Take(elementsCount).ToList();
        }
        [HttpPost]
        public async Task<JsonResult> GetUserGroupList()
        {
            List<MLUserGroupWithHierarchy> permissionsList = new List<MLUserGroupWithHierarchy>();
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                int MainUserId = 0;
                var Login = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

                if (Login.IsSuperAdmin == 0)
                {
                    using (var obj = P5GenralDL.DLUserInfo.GetDLUserInfo(SQLProvider))
                    {
                        MainUserId = await obj.MainUserId(Login.UserId);
                    }
                }
                var objBL = DLUserGroup.GetDLUserGroup(SQLProvider);
                permissionsList = await objBL.GetUserGroupPermissionsList("", 0, 0, Convert.ToInt32(MainUserId == 0 ? Login.UserId : MainUserId));
            }
            return Json(permissionsList);
        }
        [HttpPost]
        public async Task<JsonResult> AutoEmailValidation([FromBody] Group_AutoEmailValidationDto details)
        {
            bool result = false;
            using (var objDL = DLContact.GetContactDetails(details.accountId, SQLProvider))
            {
                result = await objDL.UpdateIsVerifiedMailId(details.GroupId);
            }
            return Json(result);
        }
        [HttpPost]
        public async Task<IActionResult> GroupMemberMaxCount([FromBody] Group_GroupMemberMaxCountDto details)
        {
            System.Data.DataSet DataSet = new System.Data.DataSet("General");
            int maxcount = 0;
            using (var objBL = DLGroupMember.GetDLGroupMember(details.accountId, SQLProvider))
            {
                maxcount = await objBL.GroupMemberMaxCount(details.GroupId);
            }
            return Json(new
            {
                maxcount
            });
        }
        [HttpPost]
        public async Task<IActionResult> GroupMemberCountsReport([FromBody] Group_GroupMemberCountsReportDto details)
        {
            System.Data.DataSet DataSet = new System.Data.DataSet("General");
            using (var objBL = DLGroupMember.GetDLGroupMember(details.accountId, SQLProvider))
            {
                DataSet = await objBL.GroupMemberCountsReport(details.GroupId, details.OffSet, details.FetchNext);
            }
            var getdata = JsonConvert.SerializeObject(DataSet, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");
        }
        [HttpPost]
        public async Task<IActionResult> GetGroupEmailVerfiedCount([FromBody] Group_GetGroupEmailVerfiedCountDto details)
        {
            System.Data.DataSet DataSet = new System.Data.DataSet("General");
            using (var objBL = DLGroups.GetDLGroups(details.accountId, SQLProvider))
            {
                DataSet = await objBL.GetGroupEmailVerfiedCount(details.group);
            }
            var getdata = JsonConvert.SerializeObject(DataSet, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");

        }
    }
}
