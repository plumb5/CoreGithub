using Microsoft.AspNetCore.Mvc;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Mail.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;

namespace Plumb5.Areas.Mail.Controllers
{
    [Area("Mail")]
    public class DesignUploadTemplateWithEditorController : BaseController
    {
        public DesignUploadTemplateWithEditorController(IConfiguration _configuration) : base(_configuration)
        { }
        public ActionResult Index(int TemplateId)
        {
            return View("DesignUploadTemplateWithEditor");
        }
        [HttpPost]
        public async Task<JsonResult> GetContactCustomField([FromBody] DesignUploadTemplateWithEditor_GetContactCustomFieldDto objDto)
        {
            using (var objDL = DLContactExtraField.GetDLContactExtraField(objDto.accountId, SQLProvider))
            {
                return Json(await objDL.GetList());
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetTemplateDetails([FromBody] DesignUploadTemplateWithEditor_GetTemplateDetailsDto objDto)
        {
            bool Status = false;
            MailTemplate mailTemplate;
            using (var objDL = DLMailTemplate.GetDLMailTemplate(objDto.accountId, SQLProvider))
            {
                mailTemplate = objDL.GETDetails(new MailTemplate()
                {
                    Id = objDto.TemplateId,
                    IsBeeTemplate = false
                });
            }

            if (mailTemplate != null)
            {
                MailTemplateFile mailTemplateFile;
                using (var objDL = DLMailTemplateFile.GetDLMailTemplateFile(objDto.accountId, SQLProvider))
                {
                    mailTemplateFile = await objDL.GetSingleFileType(new MailTemplateFile() { TemplateId = objDto.TemplateId, TemplateFileType = ".HTML" });
                }

                if (mailTemplateFile != null)
                {
                    SaveDownloadFilesToAws awsUpload = new SaveDownloadFilesToAws(objDto.accountId, objDto.TemplateId);
                    string HtmlContent = await awsUpload.GetFileContentString(mailTemplateFile.TemplateFileName, awsUpload._bucketName);
                    if (HtmlContent != null && HtmlContent != string.Empty)
                    {
                        Status = true;
                        return Json(new { Status, mailTemplate, HtmlContent });
                    }
                }
            }

            return Json(new { Status });
        }
        [HttpPost]
        public async Task<JsonResult> UploadImage([FromBody] DesignUploadTemplateWithEditor_UploadImageDto objDto)
        {
            bool Status = false;
            string Message = "";
            try
            {
                var UploadedFile = Request.Form.Files;
                if (UploadedFile.Count > 0 && UploadedFile != null)
                {
                    var FileName = Path.GetFileNameWithoutExtension(UploadedFile[0].FileName);
                    var fileExtension = Path.GetExtension(UploadedFile[0].FileName);
                    List<string> fileExtensionList = new List<string>() { ".jpeg", ".jpg", ".gif", ".bmp", ".png" };

                    if (fileExtensionList.Contains(fileExtension))
                    {
                        Stream fileStream = UploadedFile[0].OpenReadStream();
                        List<string> presentExtensionList = Helper.GetFileExtensionFromFileStream(fileStream);

                        if (presentExtensionList != null && fileExtensionList.Any(presentExtensionList.Contains))
                        {
                            string ImageName = FileName + "_" + DateTime.Now.ToString("yyyyMMddHHmmssFFF") + fileExtension;
                            SaveDownloadFilesToAws awsUpload = new SaveDownloadFilesToAws(objDto.accountId, objDto.mailTemplateId);
                            await awsUpload.UploadFileStream(ImageName, fileStream);
                            return Json(new { Status = true, ImageName });
                        }
                        else
                        {
                            Status = false;
                            Message = "Invalid file format found";
                        }
                    }
                    else
                    {
                        Status = false;
                        Message = "Invalid file format found";
                    }
                }
            }
            catch (Exception ex)
            {
                Status = false;
                Message = ex.Message.ToString();
            }

            return Json(new { Status, Message });
        }
        [HttpPost]
        public async Task<JsonResult> DeleteImage([FromBody] DesignUploadTemplateWithEditor_DeleteImageDto objDto)
        {
            bool Status = false;
            string Message = "";
            try
            {
                SaveDownloadFilesToAws awsUpload = new SaveDownloadFilesToAws(objDto.accountId, objDto.mailTemplateId);
                Status = await awsUpload.DeleteFile(objDto.imageName, awsUpload.bucketname);
            }
            catch (Exception ex)
            {
                Status = false;
                Message = ex.Message.ToString();
            }

            return Json(new { Status, Message });
        }
    }
}
