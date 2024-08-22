using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.MobileInApp.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Drawing;

namespace Plumb5.Areas.MobileInApp.Controllers
{
    [Area("MobileInApp")]
    public class CreateCampaignController : BaseController
    {
        public CreateCampaignController(IConfiguration _configuration) : base(_configuration)
        { }

        //
        // GET: /MobileInApp/CreateCampaign/

        public IActionResult Index()
        {
            return View("CreateCampaign");
        }

        [HttpPost]
        public async Task<JsonResult> GetCampaignList([FromBody] CreateCampaign_GetCampaignList commonDetails)
        {
            using (var objCampaign = DLCampaignIdentifier.GetDLCampaignIdentifier(commonDetails.accountId, SQLProvider))
            {
                return Json(await objCampaign.GetList(new CampaignIdentifier(), 0, 0));
            }
        }

        [HttpPost]
        public async Task<IActionResult> GetGroupList([FromBody] CreateCampaign_GetGroupList commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            List<int> UserInfoUserIdList = (user.Members != null && user.Members.Count > 0) ? user.Members.Select(x => x.UserInfoUserId).ToList<int>() : null;
            List<Groups> groupList = null;

            using (var objDL = DLGroups.GetDLGroups(commonDetails.accountId, SQLProvider))
            {
                groupList = await objDL.GetGroupList(new Groups { UserInfoUserId = user.UserId });
            }

            return Json(groupList);
        }

        [HttpPost]
        public async Task<JsonResult> SaveOrUpdate([FromBody] CreateCampaign_SaveOrUpdate commonDetails)
        {
            int InAppCampaignId = 0;
            bool UpdatedStatus = false;

            #region MobileInAppCampagn Saving
            using (var objInAppCampaign = DLMobileInAppCampaign.GetDLMobileInAppCampaign(commonDetails.AccountId, SQLProvider))
            {
                if (commonDetails.mobileInAppCampaign.Id > 0)//Update
                {
                    InAppCampaignId = commonDetails.mobileInAppCampaign.Id;
                    await objInAppCampaign.Update(commonDetails.mobileInAppCampaign);
                }
                else//Save
                {
                    InAppCampaignId = await objInAppCampaign.Save(commonDetails.mobileInAppCampaign);
                }
            }
            #endregion
            #region MobileInAppCampagnRules SaveOrUpdate
            if (InAppCampaignId > 0)
            {
                using (var objFromsBAL = DLMobileInAppCampaignRules.GetDLMobileInAppCampaignRules(commonDetails.AccountId, SQLProvider))
                {
                    commonDetails.rulesData.InAppCampaignId = InAppCampaignId;
                    await objFromsBAL.Save(commonDetails.rulesData);

                }
            }
            #endregion
            #region MobileInAppCaptureformFields
            if ((commonDetails.CaptureFormFields != null) && commonDetails.CaptureFormFields.Count() > 0)
            {
                using (var objFieldsBAL = DLMobileInAppFormFields.GetDLMobileInAppFormFields(commonDetails.AccountId, SQLProvider))
                {
                    await objFieldsBAL.DeleteFields(InAppCampaignId);

                    MobileInAppFormFields inAppFormFields = new MobileInAppFormFields() { UserInfoUserId = 0, InAppCampaignId = InAppCampaignId };
                    foreach (var field in commonDetails.CaptureFormFields)
                    {
                        inAppFormFields.Name = field[0];
                        inAppFormFields.ContactMappingField = field[1];

                        await objFieldsBAL.Save(inAppFormFields);
                    }
                }

            }
            #endregion
            return Json(new { InAppCampaignId, UpdatedStatus });
        }

        [HttpPost]
        public async Task<JsonResult> GetInAppCampaignDetails([FromBody] CreateCampaign_GetInAppCampaignDetails commonDetails)
        {
            MobileInAppCampaign? InappCampaignDetails = null;
            MobileInAppCampaignRules? InAppCampaignRules = null;
            using (var objDL = DLMobileInAppCampaign.GetDLMobileInAppCampaign(commonDetails.accountId, SQLProvider))
            {
                InappCampaignDetails = await objDL.GetDetail(commonDetails.InAppCampaignId);
            }
            using (var objDLRules = DLMobileInAppCampaignRules.GetDLMobileInAppCampaignRules(commonDetails.accountId, SQLProvider))
            {
                InAppCampaignRules = await objDLRules.Get(commonDetails.InAppCampaignId);
            }
            return Json(new { InappCampaignDetails, InAppCampaignRules });

        }

        [HttpPost]
        public async Task<IActionResult> SaveImage()
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            try
            {
                var upload = this.Request.Form.Files[0];
                var fileName = Request.Form.Files[0] != null ? Request.Form.Files[0].FileName : "";
                var fileExtension = System.IO.Path.GetExtension(Request.Form.Files[0] != null ? Request.Form.Files[0].FileName : "").ToLower();
                if (fileExtension == ".jpg" || fileExtension == ".png" || fileExtension == ".jpeg")
                {
                    var imageName = DateTime.Now.ToString("ddMMyyyyhhmmss") + "_" + Guid.NewGuid().ToString().Substring(0, 8) + fileExtension;

                    var filePath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "/images/ClientImages/";

                    //var filePath = "D:\\Plumb5UI\\EngagementUnilever\\Plumb5\\images\\ClientImages\\";

                    await upload?.CopyToAsync(this.Request.Form.Files[0].OpenReadStream());
                    Bitmap bm = new Bitmap(filePath + imageName);
                    Stream InputStream = new MemoryStream();
                    bm.Save(InputStream, System.Drawing.Imaging.ImageFormat.Png);

                    SaveDownloadFilesToAws awsUpload = new SaveDownloadFilesToAws(domainDetails.AdsId, "ClientImages");
                    Tuple<string, string> tuple = await awsUpload.UploadClientFiles(fileExtension, InputStream);

                    string IconImageName = "";
                    if (tuple != null && !String.IsNullOrEmpty(tuple.Item2))
                    {
                        IconImageName = tuple.Item2;
                    }

                    //newbm.Save(resize_file, ImageFormat.Png);



                    var getdata = JsonConvert.SerializeObject(IconImageName, Formatting.Indented);
                    //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Status = IconImageName.ToString(), Message = "Image Saved" }), LogMessage);
                    return Content(getdata, "application/json");

                }
                else
                {
                    var getdata = JsonConvert.SerializeObject("0", Formatting.Indented);
                    //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Status = getdata.ToString(), Message = "Unable to save image" }), LogMessage);
                    return Content(getdata, "application/json");
                }
            }
            catch (Exception ex)
            {
                var getdata = JsonConvert.SerializeObject("0", Formatting.Indented);
                //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Status = getdata.ToString(), Message = "Unable to save image " + ex.ToString() }), LogMessage);
                return Content(getdata, "application/json");
            }
        }
    }
}
