using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.CaptureForm.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;

namespace Plumb5.Areas.CaptureForm.Controllers
{
    [Area("CaptureForm")]
    public class SettingsController : BaseController
    {
        public SettingsController(IConfiguration _configuration) : base(_configuration)
        { }
        public ActionResult Index()
        {
            return View("Settings");
        }
        [HttpPost]
        public async Task<JsonResult> GetList([FromBody] Settings_GetListDto objDto)
        {
            try
            {
                bool? ToogleStatus = null;
                List<FormExtraLinks> formExtraLinks = null;
                using (var objDL = DLFormExtraLinks.GetDLFormExtraLinks(objDto.AdsId, SQLProvider))
                {
                    formExtraLinks = await objDL.GET(ToogleStatus);
                }
                return Json(formExtraLinks);
            }
            catch
            {
                return null;
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> SaveOrUpdateDetails([FromBody] Settings_SaveOrUpdateDetailsDto objDto)
        {
            bool isUpdate = false, updateStatus = false;
            if (objDto.formExtraLinks.Id > 0)
            {
                objDto.formExtraLinks.UserInfoUserId = objDto.UserId;
                isUpdate = true;
                using (var objDL = DLFormExtraLinks.GetDLFormExtraLinks(objDto.AdsId,SQLProvider))
                {
                    updateStatus =await objDL.Update(objDto.formExtraLinks);
                }
            }
            else
            {
                objDto.formExtraLinks.UserInfoUserId = objDto.UserId;
                using (var objDL = DLFormExtraLinks.GetDLFormExtraLinks(objDto.AdsId,SQLProvider))
                {
                    objDto.formExtraLinks.Id =await objDL.Save(objDto.formExtraLinks);
                }
            }
            return Json(new { isUpdate = isUpdate, updateStatus = updateStatus, formExtraLinks = objDto.formExtraLinks });
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> Delete([FromBody] Settings_DeleteDto objDto)
        {
            bool result = false;
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            using (var objDL =  DLFormExtraLinks.GetDLFormExtraLinks(objDto.AdsId,SQLProvider))
            {
                result = await objDL.Delete(objDto.Id);
            }

            if (result == true)
            {
                //LogMessage = "FormExtraLinks has been deleted successfully";
                SaveDownloadFilesToAws AwsFileDelete = new SaveDownloadFilesToAws(objDto.AdsId, "ClientWebScripts/CustomizedScripts");
                string imagename = objDto.LinkUrl.Split('/').Last();
                AwsFileDelete.DeleteFile(imagename, AwsFileDelete.bucketname);
            }
            return Json(result);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> ToogleStatus([FromBody] Settings_ToogleStatusDto objDto)
        {
            objDto.formExtraLinks.UserInfoUserId = objDto.UserId;
            using (var objDL =DLFormExtraLinks.GetDLFormExtraLinks(objDto.AdsId,SQLProvider))
            {
                return Json(await objDL.ToogleStatus(objDto.formExtraLinks));
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> UploadFormFile()
        {
            DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            string filePath = String.Empty;

           
            if (Request.Form.Files.Count > 0)
            {
                var httpPostedFile = Request.Form.Files["UploadedFormFile"];
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
                        Tuple<string, string> tuple = awsUpload.UploadClientFiles(fileName, httpPostedFile.OpenReadStream());
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
    }
}
