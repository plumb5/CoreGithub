using Microsoft.AspNetCore.Mvc;
using P5GenralML;
using P5GenralDL;
using Plumb5.Controllers;
using System.Globalization;
using System.Data;
using System.Collections;
using Microsoft.DotNet.Scaffolding.Shared.CodeModifier.CodeChange;
using Newtonsoft.Json;
using Plumb5GenralFunction;
using Microsoft.Identity.Client;
using System.Text.RegularExpressions;
using System.Reflection.PortableExecutable;
using NPOI.SS.Formula.Functions;
using System.Web;
using Plumb5.Areas.Chat.Dto;

namespace Plumb5.Areas.Chat.Controllers
{
    [Area("Chat")]
    public class ConfigurationController : BaseController
    {
        public ConfigurationController(IConfiguration _configuration) : base(_configuration)
        { }
        public ActionResult Index()
        {
            return View("Configuration");
        }

        #region ChatSetting

        public async Task<JsonResult> GetChatSetting()
        {
            DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            using (var objDL = DLChatSetting.GetDLChatSetting(account.AdsId, SQLProvider))
            {
                return Json(await objDL.GET());
            }

        }

        [Log]
        public async Task<JsonResult> SaveOrUpdateChatSetting([FromBody] Configuration_SaveOrUpdateChatSettingDto ConfigurationDto)
        {
            using (var objDL = DLChatSetting.GetDLChatSetting(ConfigurationDto.AdsId, SQLProvider))
            {
                short Id = await objDL.Save(ConfigurationDto.ChatSetting);
                return Json(Id);
            }

        }

        #endregion

        #region ChatExtraLinks

        public async Task<JsonResult> GetChatExtraLinksList([FromBody] Configuration_GetChatExtraLinksListDto ConfigurationDto)
        {
            bool? ToogleStatus = null;

            List<ChatExtraLinks> ChatExtraLinks = null;
            using (var objDL = DLChatExtraLinks.GetDLChatExtraLinks(ConfigurationDto.AdsId, SQLProvider))
            {
                ChatExtraLinks = await objDL.GET(ToogleStatus);
            }


            return Json(ChatExtraLinks);
        }

        [Log]
        public async Task<JsonResult> SaveOrUpdateChatExtraLinksDetails([FromBody] Configuration_SaveOrUpdateChatExtraLinksDetailsdto ConfigurationDto)
        {
            bool result = false;
            if (ConfigurationDto.ChatExtraLinks.Id <= 0)
            {
                ConfigurationDto.ChatExtraLinks.UserInfoUserId = ConfigurationDto.UserId;
                using (var objDL = DLChatExtraLinks.GetDLChatExtraLinks(ConfigurationDto.AdsId, SQLProvider))
                {
                    ConfigurationDto.ChatExtraLinks.Id = await objDL.Save(ConfigurationDto.ChatExtraLinks);
                }

                return Json(ConfigurationDto.ChatExtraLinks);
            }
            else if (ConfigurationDto.ChatExtraLinks.Id > 0)
            {
                ConfigurationDto.ChatExtraLinks.UserInfoUserId = ConfigurationDto.UserId;
                using (var objDL = DLChatExtraLinks.GetDLChatExtraLinks(ConfigurationDto.AdsId, SQLProvider))
                {
                    result = await objDL.Update(ConfigurationDto.ChatExtraLinks);
                    return Json(result);
                }

            }
            return Json(ConfigurationDto.ChatExtraLinks);
        }

        [Log]
        public async Task<JsonResult> DeleteChatExtraLinks([FromBody] Configuration_DeleteChatExtraLinksDto ConfigurationDto)
        {
            bool result = false;
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            using (var objDL = DLChatExtraLinks.GetDLChatExtraLinks(ConfigurationDto.AdsId, SQLProvider))
            {
                result = await objDL.Delete(ConfigurationDto.Id);
            }

            if (result == true)
            {
                SaveDownloadFilesToAws AwsFileDelete = new SaveDownloadFilesToAws(ConfigurationDto.AdsId, "ClientWebScripts/CustomizedScripts");
                string imagename = ConfigurationDto.LinkUrl.Split('/').Last();
                AwsFileDelete.DeleteFile(imagename, AwsFileDelete.bucketname);
            }
            return Json(result);
        }

        [Log]
        public async Task<JsonResult> ToogleChatExtraLinksStatus([FromBody] Configuration_ToogleChatExtraLinksStatusDto ConfigurationDto)
        {
            bool result = false;
            using (var objDL = DLChatExtraLinks.GetDLChatExtraLinks(ConfigurationDto.AdsId, SQLProvider))
            {
                result = await objDL.ToogleStatus(ConfigurationDto.ChatExtraLinks);
            }
            return Json(result);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> UploadFile()
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            string filePath = String.Empty;
            if (HttpContext.Request.Form.Files.Any())
            {
                var httpPostedFile = HttpContext.Request.Form.Files["UploadedFormFile"];
                if (httpPostedFile != null)
                {
                    string fileExtension = Path.GetExtension(httpPostedFile.FileName).ToLower();
                    List<string> fileExtensionList = new List<string>() { ".js", ".css" };
                    if (fileExtensionList.Contains(fileExtension))
                    {
                        string domainname = account.DomainName;
                        string predomain = account.DomainName.Substring(0, domainname.IndexOf(".", StringComparison.Ordinal));
                        string domain = domainname.Remove(0, domainname.IndexOf(".", StringComparison.Ordinal) + 1);
                        string dbName = !predomain.Contains("www") ? predomain + "_" + domain.Replace(".", "_") + "_" + account.AdsId : domain.Replace("www.", "").Replace(".", "_") + "_" + account.AdsId;
                        dbName = dbName.Replace("-", "");
                        string fileName = dbName + "_" + httpPostedFile.FileName;
                        SaveDownloadFilesToAws awsUpload = new SaveDownloadFilesToAws(account.AdsId, "ClientWebScripts/CustomizedScripts");
                        Tuple<string, string> tuple = await awsUpload.UploadClientFiles(fileName, httpPostedFile.OpenReadStream());
                        if (tuple != null && !String.IsNullOrEmpty(tuple.Item2))
                        {
                            filePath = tuple.Item2;
                        }
                    }
                }
            }
            return Json(new
            {
                filePath
            });
        }

        #endregion

        #region AgentProfileImage

        public async Task<JsonResult> GetAgentList()
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            List<ChatUser> ChatUserList = null;

            ChatUser ChatUser = new ChatUser();
            ChatUser.IsAdmin = 1;
            using (var objDL = DLChatUser.GETDLChatUser(domainDetails.AdsId, SQLProvider))
            {
                ChatUserList = await objDL.GetList(ChatUser, 0, 0, null, null);
            }

            return Json(ChatUserList);
        }

        [Log]
        public async Task<JsonResult> UpdateAgentImage([FromBody] Configuration_UpdateAgentImageDto ConfigurationDto)
        {
            bool result = false;
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            ChatUser ChatUser = new ChatUser();
            ChatUser.Id = ConfigurationDto.AgentId;
            ChatUser.Name = ConfigurationDto.AgentName;
            ChatUser.AgentProfileImageUrl = ConfigurationDto.AgentProfileImageUrl;
            using (var objDL = DLChatUser.GETDLChatUser(domainDetails.AdsId, SQLProvider))
            {
                result = await objDL.Update(ChatUser);
            }
            return Json(result);
        }

        [Log]
        public async Task<JsonResult> DeleteAgentImage([FromBody] Configuration_DeleteAgentImageDto ConfigurationDto)
        {
            bool result = false;
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            ChatUser ChatUser = new ChatUser();
            ChatUser.Id = ConfigurationDto.AgentId;
            ChatUser.AgentProfileImageUrl = "";

            using (var objDL = DLChatUser.GETDLChatUser(domainDetails.AdsId, SQLProvider))
            {
                result = await objDL.Update(ChatUser);
            }
            return Json(result);
        }

        #endregion

        #region ChatBotSetting

        public async Task<JsonResult> GetGroupList([FromBody] Configuration_GetGroupListDto ConfigurationDto)
        {
            List<MLGroups> GroupDetails = null;
            using (var objDL = DLGroups.GetDLGroups(ConfigurationDto.accountId, SQLProvider))
            {
                GroupDetails = await objDL.GetGroupsByStaticOrDynamic(1);
            }
            return Json(GroupDetails);
        }

        public async Task<JsonResult> GetUserList([FromBody] Configuration_GetUserListDto ConfigurationDto)
        {
            List<MLUserHierarchy> userHierarchyList = new List<MLUserHierarchy>();
            using (var objUser = DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
            {
                userHierarchyList = await objUser.GetHisUsers(ConfigurationDto.UserId, ConfigurationDto.accountId);
                userHierarchyList.Add(await objUser.GetHisDetails(ConfigurationDto.UserId));
            }

            userHierarchyList = userHierarchyList.GroupBy(x => x.UserInfoUserId).Select(x => x.First()).ToList();

            return Json(userHierarchyList);
        }

        public async Task<JsonResult> GetLmsGroupsList([FromBody] Configuration_GetLmsGroupsListDto ConfigurationDto)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            List<MLUserHierarchy> userHierarchy = null;
            using (var objUserHierarchy = DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
            {
                userHierarchy = await objUserHierarchy.GetHisUsers(user.UserId, ConfigurationDto.accountId);
            }

            List<int> usersId = new List<int>();
            if (userHierarchy != null)
                usersId = userHierarchy.Select(x => x.UserInfoUserId).Distinct().ToList();

            usersId.Add(user.UserId);

            string userId = string.Join(",", usersId.ToArray());

            if (string.IsNullOrEmpty(userId))
            {
                userId = user.UserId.ToString();
            }

            using (var objGroup = DLLmsGroup.GetDLLmsGroup(ConfigurationDto.accountId, SQLProvider))
            {
                return Json(await objGroup.GetListLmsGroup(0, 0, userId));
            }
        }

        [Log]
        public async Task<JsonResult> SaveUpdateChatBotSetting([FromBody] Configuration_SaveUpdateChatBotSettingDto ConfigurationDto)
        {
            bool Status = false;
            if (ConfigurationDto.responseSetting.Id > 0)
            {
                using (var objDL = DLChatBotResponseSetting.GetDLChatBotResponseSetting(ConfigurationDto.accountId, SQLProvider))
                {
                    Status = await objDL.Update(ConfigurationDto.responseSetting);
                }
            }
            else
            {
                using (var objDL = DLChatBotResponseSetting.GetDLChatBotResponseSetting(ConfigurationDto.accountId, SQLProvider))
                {
                    ConfigurationDto.responseSetting.Id = await objDL.Save(ConfigurationDto.responseSetting);
                }
                if (ConfigurationDto.responseSetting.Id > 0)
                {
                    Status = true;
                }
            }

            return Json(new { Status, ConfigurationDto.responseSetting });
        }

        public async Task<JsonResult> GetChatBotSetting([FromBody] Configuration_GetChatBotSettingDto ConfigurationDto)
        {
            using (var objDL = DLChatBotResponseSetting.GetDLChatBotResponseSetting(ConfigurationDto.accountId, SQLProvider))
            {
                return Json(await objDL.GetDetails());
            }
        }

        #endregion ChatBotSetting
    }
}
