using Microsoft.AspNetCore.Mvc;
using P5GenralDL;
using P5GenralML;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Web;
using Microsoft.AspNetCore.Http;
using Plumb5.Areas.Mail.Dto;
namespace Plumb5.Areas.Mail.Controllers
{
    [Area("Mail")]
    public class TemplateAttachmentController : BaseController
    {
        public TemplateAttachmentController(IConfiguration _configuration) : base(_configuration)
        { }
        //
        // GET: /Mail/TemplateAttachment/

        public IActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public JsonResult GetTemplateAttachment([FromBody] TemplateAttachment_GetTemplateAttachmentDto TemplateAttachmentDto)
        {
            List<MailTemplateAttachment> attachmentList;
            using (var objDL = DLMailTemplateAttachment.GetDLMailTemplateAttachment(TemplateAttachmentDto.accountId, SQLProvider))
            {
                attachmentList = objDL.GetAttachments(TemplateAttachmentDto.MailTemplateId);
            }
            return Json(new
            {
                Data = attachmentList,
                MaxJsonLength = Int32.MaxValue
            });
        }
        [HttpPost]
        public async Task<JsonResult> DownLoadAttachment([FromBody] TemplateAttachment_DownLoadAttachmentDto TemplateAttachmentDto)
        {
            string FileName = DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "_" + TemplateAttachmentDto.AttachmentName;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            SaveDownloadFilesToAws awsUpload = new SaveDownloadFilesToAws(TemplateAttachmentDto.accountId, TemplateAttachmentDto.MailTemplateId);
            awsUpload.DownloadFiles(TemplateAttachmentDto.AttachmentName, MainPath, awsUpload.bucketname);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
            return Json(new { Status = true, MainPath });
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> DeleteTemplate([FromBody] TemplateAttachment_DeleteTemplateDto TemplateAttachmentDto)
        {
            bool status = false;

            using (var objDL = DLMailTemplateAttachment.GetDLMailTemplateAttachment(TemplateAttachmentDto.accountId, SQLProvider))
            {
                status = await objDL.Delete(TemplateAttachmentDto.MailTemplateId, TemplateAttachmentDto.AttachmentId);
            }

            if (status)
            {
                SaveDownloadFilesToAws awsUpload = new SaveDownloadFilesToAws(TemplateAttachmentDto.accountId, TemplateAttachmentDto.MailTemplateId);
                awsUpload.DeleteFile(TemplateAttachmentDto.AttachmentName, awsUpload.bucketname);
            }

            return Json(status);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> SaveAttachment([FromBody] TemplateAttachment_SaveAttachmentDto TemplateAttachmentDto)
        {
            bool Status = false;
            string Message = "";
            var uploadedfiles = Request.Form.Files;
            List<string> fileExtensionList = new List<string>() { ".jpeg", ".jpg", ".gif", ".bmp", ".png", ".html", ".htm", ".pdf", ".xls", ".xlsx", ".doc", ".docx", ".ppt", ".pptx", ".txt" };

            for (int i = 0; i < uploadedfiles.Count; i++)
            {
                string fileExtension = Path.GetExtension(uploadedfiles[i].FileName).ToLower();

                if (fileExtensionList.Contains(fileExtension))
                {
                    List<string> presentExtensionList = Helper.GetFileExtensionFromFileStream(uploadedfiles[i].OpenReadStream());

                    if (presentExtensionList != null && fileExtensionList.Any(presentExtensionList.Contains))
                    {
                        Status = true;
                    }
                    else
                    {
                        Status = false;
                        Message = "Please upload only valid file type.";
                        break;
                    }
                }
                else
                {
                    Status = false;
                    Message = "Please upload only valid file type.";
                    break;
                }
            }

            if (!Status)
            {
                return Json(new { Status, Message });
            }

            List<MailTemplateAttachment> AttachmentList = new List<MailTemplateAttachment>();
            SaveDownloadFilesToAws awsUpload = new SaveDownloadFilesToAws(TemplateAttachmentDto.accountId, TemplateAttachmentDto.MailTemplateId);
            using (var objDL = DLMailTemplateAttachment.GetDLMailTemplateAttachment(TemplateAttachmentDto.accountId, SQLProvider))
            {
                for (int i = 0; i < uploadedfiles.Count; i++)
                {
                    Stream fileStream = uploadedfiles[i].OpenReadStream();
                    StreamReader reader = new StreamReader(fileStream);

                    MailTemplateAttachment mailTemplateAttachment = new MailTemplateAttachment()
                    {
                        MailTemplateId = TemplateAttachmentDto.MailTemplateId,
                        AttachmentFileName = uploadedfiles[i].FileName,
                        AttachmentFileType = Path.GetExtension(uploadedfiles[i].FileName),
                        FileSize = (decimal)(uploadedfiles[i].ContentType.Length),
                        AttachmentFileContent = Helper.ConvertHtmlStringToBytesFromPhysical(HtmlContent: reader.ReadToEnd()),
                    };

                    mailTemplateAttachment.AttachmentResponseId = await awsUpload.UploadFileStream(uploadedfiles[i].FileName, fileStream);
                    mailTemplateAttachment.Id = await objDL.Save(mailTemplateAttachment);
                    AttachmentList.Add(mailTemplateAttachment);
                }
            }
            return Json(new
            {
                Data = new { Status, AttachmentList },
                MaxJsonLength = Int32.MaxValue,
            });

        }
    }
}
