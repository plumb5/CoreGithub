using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.WebPush.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.IO;

namespace Plumb5.Areas.WebPush.Controllers
{
    [Area("WebPush")]
    public class RssFeedController : BaseController
    {
        public RssFeedController(IConfiguration _configuration) : base(_configuration)
        { }

        //
        // GET: /WebPush/RssFeed/

        public IActionResult Index()
        {
            return View("RssFeed");
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> Save(int Id, string? CampaignName, string? RssUrl, string? CheckRssFeedEvery, bool IsAdvancedOptions, bool IsAutoHide, bool IsAndroidBadgeDefaultOrCustom, string? ImageUrl, string? UploadedIconFileName, int GroupId, int CampaignId)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            WebPushRssFeed webPushRssFeed = new WebPushRssFeed();
            webPushRssFeed.Id = Id;
            webPushRssFeed.CampaignName = CampaignName;
            webPushRssFeed.RssUrl = RssUrl;
            webPushRssFeed.CheckRssFeedEvery = CheckRssFeedEvery;
            webPushRssFeed.IsAdvancedOptions = IsAdvancedOptions;
            webPushRssFeed.IsAutoHide = IsAutoHide;
            webPushRssFeed.IsAndroidBadgeDefaultOrCustom = IsAndroidBadgeDefaultOrCustom;
            webPushRssFeed.ImageUrl = ImageUrl;
            webPushRssFeed.UploadedIconFileName = UploadedIconFileName;
            webPushRssFeed.GroupId = GroupId;
            webPushRssFeed.CampaignId = CampaignId;

            RssFeedDto_GetRssFeedDetails commonDetails = new RssFeedDto_GetRssFeedDetails(domainDetails.AdsId, webPushRssFeed);

            commonDetails.webPushRssFeed.UserInfoUserId = user.UserId;
            var httpPostedFile = HttpContext.Request.Form.Files;

            //#region Logs 
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(AccountId, user.UserId, user.UserName, user.EmailId, "WebPush", "RssFeedController", "Save", Helper.GetIP(), JsonConvert.SerializeObject(new { webPushRssFeed = webPushRssFeed }));
            //#endregion

            int WebPushRssFeedId = 0;
            using (var objDL = DLWebPushRssFeed.GetDLWebPushRssFeed(domainDetails.AdsId, SQLProvider))
            {
                if (httpPostedFile != null && httpPostedFile.Count > 0)
                {
                    SaveDownloadFilesToAws awsUpload = new SaveDownloadFilesToAws(domainDetails.AdsId, "ClientImages");
                    string fileExtension = httpPostedFile[0].FileName;
                    using var stream = httpPostedFile[0].OpenReadStream();
                    Tuple<string, string> tuple = await awsUpload.UploadClientFiles(fileExtension, stream);

                    if (tuple != null && !String.IsNullOrEmpty(tuple.Item2))
                    {
                        commonDetails.webPushRssFeed.UploadedIconUrl = tuple.Item2;
                    }
                }

                if (commonDetails.webPushRssFeed != null && commonDetails.webPushRssFeed.Id > 0)
                {
                    bool Result = await objDL.Update(commonDetails.webPushRssFeed);
                    if (Result)
                    {
                        WebPushRssFeedId = commonDetails.webPushRssFeed.Id;
                        //LogMessage = "Updated successfully";
                    }
                    else
                    {
                        WebPushRssFeedId = commonDetails.webPushRssFeed.Id;
                        //LogMessage = "Unable to updated web push rss feed";
                    }

                }
                else
                {
                    WebPushRssFeedId = await objDL.Save(commonDetails.webPushRssFeed);
                    //if (WebPushRssFeedId > 0)
                    //    LogMessage = "Save successfully";
                    //else
                    //    LogMessage = "Unable to save web push rss feed";
                }
            }

            //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { WebPushRssFeedId = WebPushRssFeedId }), LogMessage);
            return Json(WebPushRssFeedId);
        }

        [HttpPost]
        public async Task<JsonResult> GetRssFeedDetails([FromBody] RssFeedDto_GetRssFeedDetails commonDetails)
        {
            WebPushRssFeed? webPushRssFeedDetails = null;
            using (var objDL = DLWebPushRssFeed.GetDLWebPushRssFeed(commonDetails.AccountId, SQLProvider))
            {
                webPushRssFeedDetails = await objDL.GeDetails(commonDetails.webPushRssFeed);
            }

            return Json(webPushRssFeedDetails);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> SendIndividaulWebPushRssFeedTest([FromBody] RssFeedDto_SendIndividaulWebPushRssFeedTest commonDetails)
        {
            ResponseMessage responseMessage = new ResponseMessage();
            List<Tuple<string, string>> wepushResponseUserList = new List<Tuple<string, string>>();
            WebPushUser? webPushUser = new WebPushUser() { MachineId = commonDetails.MachineId };
            using (var user = DLWebPushUser.GetDLWebPushUser(commonDetails.AccountId, SQLProvider))
                webPushUser = await user.GetWebPushInfo(webPushUser);

            if (webPushUser != null)
            {
                RssFeedApi RssFeedApi = new RssFeedApi();
                RSSFeedModel rSSFeedModel = RssFeedApi.GetRssDetails(commonDetails.webPushRssFeed);
                SendWebPushForRssTest sendWebPushForTest = new SendWebPushForRssTest(commonDetails.AccountId, commonDetails.webPushRssFeed, SQLProvider);
                responseMessage = await sendWebPushForTest.SendWebPush(webPushUser, rSSFeedModel);
                wepushResponseUserList.Add(new Tuple<string, string>(webPushUser.MachineId, responseMessage.Message));
            }
            else
            {
                responseMessage.Status = false;
                responseMessage.Message = "The user does not exists, try again with another user";
            }

            return Json(new { ResponseMessage = responseMessage, WepushResponseUserList = wepushResponseUserList });
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> SendGroupWebPushRssFeedTest([FromBody] RssFeedDto_SendGroupWebPushRssFeedTest commonDetails)
        {
            ResponseMessage responseMessage = new ResponseMessage();
            List<Tuple<string, string>> wepushResponseUserList = new List<Tuple<string, string>>();

            List<WebPushUser> userList = null;
            using (var webPushGroupMembers = DLWebPushGroupMembers.GetDLWebPushGroupMembers(commonDetails.AccountId, SQLProvider))
            {
                userList = await webPushGroupMembers.GetGroupWebPushInfoList(commonDetails.GroupId);
            }

            if (userList != null && userList.Count > 0)
            {
                List<WebPushUser> userLists = userList.Take(10).ToList();
                RssFeedApi RssFeedApi = new RssFeedApi();
                RSSFeedModel rSSFeedModel = RssFeedApi.GetRssDetails(commonDetails.webPushRssFeed);
                foreach (var user in userLists)
                {
                    WebPushUser? webPushUser = new WebPushUser() { MachineId = user.MachineId };
                    using (var users = DLWebPushUser.GetDLWebPushUser(commonDetails.AccountId, SQLProvider))
                        webPushUser = await users.GetWebPushInfo(webPushUser);

                    if (webPushUser != null)
                    {
                        SendWebPushForRssTest sendWebPushForTest = new SendWebPushForRssTest(commonDetails.AccountId, commonDetails.webPushRssFeed, SQLProvider);
                        ResponseMessage eachResponseMessage = await sendWebPushForTest.SendWebPush(webPushUser, rSSFeedModel);
                        if (eachResponseMessage.Status)
                        {
                            wepushResponseUserList.Add(new Tuple<string, string>(webPushUser.MachineId, eachResponseMessage.Message));
                        }
                        else
                        {
                            wepushResponseUserList.Add(new Tuple<string, string>(webPushUser.MachineId, eachResponseMessage.Message));
                        }
                    }
                    else
                    {
                        responseMessage.Status = false;
                        responseMessage.Message = "The user does not exists, try again with another user";
                    }
                }
            }
            else
            {
                responseMessage.Status = false;
                responseMessage.Message = "There is no user(s) in the group, try again with another group";
            }

            return Json(new { ResponseMessage = responseMessage, WepushResponseUserList = wepushResponseUserList });
        }

        [HttpPost]
        public JsonResult ValidateRSSFeedURL([FromBody] RssFeedDto_ValidateRSSFeedURL commonDetails)
        {
            bool result = false;
            string ErrorMessage = string.Empty;
            try
            {
                RssFeedApi RssFeedApi = new RssFeedApi();
                Tuple<RSSFeedModel, string> rSSFeedModel = RssFeedApi.GetRssDetails(commonDetails.RssFeedUrl);
                if (rSSFeedModel.Item1 != null && !String.IsNullOrEmpty(rSSFeedModel.Item1.Title) && !String.IsNullOrEmpty(rSSFeedModel.Item1.Description))
                {
                    result = true;
                    ErrorMessage = rSSFeedModel.Item2;
                }
                else
                {
                    ErrorMessage = rSSFeedModel.Item2;
                }
            }
            catch
            {
                result = false;
            }

            return Json(new { result, ErrorMessage });
        }
    }
}
