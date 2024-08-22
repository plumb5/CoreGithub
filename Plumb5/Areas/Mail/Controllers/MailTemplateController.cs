using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Mail.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Text;

namespace Plumb5.Areas.Mail.Controllers
{
    [Area("Mail")]
    public class MailTemplateController : BaseController
    {
        public MailTemplateController(IConfiguration _configuration) : base(_configuration)
        { }

        //
        // GET: /Mail/MailTemplate/

        public IActionResult Index()
        {
            return View("MailTemplate");
        }

        [HttpPost]
        public async Task<JsonResult> GetMailCampaignList([FromBody] MailTemplate_GetMailCampaignListDto commonDetails)
        {
            using (var objDLform = DLCampaignIdentifier.GetDLCampaignIdentifier(commonDetails.accountId, SQLProvider))
            {
                return Json(await objDLform.GetList(new CampaignIdentifier(), 0, 0));
            }
        }

        [HttpPost]
        public async Task<IActionResult> GetMaxCount([FromBody] MailTemplate_GetMaxCountDto commonDetails)
        {
            int returnVal = 0;
            using (var objDL = DLMailTemplate.GetDLMailTemplate(commonDetails.AdsId, SQLProvider))
            {
                returnVal = await objDL.GetMaxCount(commonDetails.mailTemplate);
            }

            return Json(new { returnVal });
        }

        [HttpPost]
        public async Task<IActionResult> GetTemplateList([FromBody] MailTemplate_GetTemplateListDto commonDetails)
        {
            HttpContext.Session.SetString("MailTemplate", JsonConvert.SerializeObject(commonDetails.mailTemplate));
            List<MLMailTemplate> mailTemplateList;

            using (var objDL = DLMailTemplate.GetDLMailTemplate(commonDetails.AdsId, SQLProvider))
            {
                mailTemplateList = await objDL.GetList(commonDetails.mailTemplate, commonDetails.OffSet, commonDetails.FetchNext);
            }

            return Json(mailTemplateList);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> Delete([FromBody] MailTemplate_DeleteDto commonDetails)
        {
            using (var objDL = DLMailTemplate.GetDLMailTemplate(commonDetails.AdsId, SQLProvider))
            {
                return Json(await objDL.Delete(commonDetails.Id));
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetArchiveTemplate([FromBody] MailTemplate_GetArchiveTemplateDto commonDetails)
        {
            MailTemplate? template = null;
            using (var bLobj = DLMailTemplate.GetDLMailTemplate(commonDetails.accountId, SQLProvider))
            {
                template = await bLobj.GetArchiveTemplate(commonDetails.TemplateName, commonDetails.IsBeeTemplate);
            }
            return Json(new { Template = template });
        }

        [HttpPost]
        public async Task<JsonResult> UpdateArchiveStatus([FromBody] MailTemplate_UpdateArchiveStatusDto commonDetails)
        {
            bool result = false;
            using (var bLobj = DLMailTemplate.GetDLMailTemplate(commonDetails.accountId, SQLProvider))
            {
                result = await bLobj.UpdateArchiveStatus(commonDetails.Id);
            }
            return Json(result);
        }


        [Log]
        [HttpPost]
        public async Task<JsonResult> SaveEditedTemplate([FromBody] MailTemplate_SaveEditedTemplateDto commonDetails)
        {
            bool UpdateStatus = false;
            using (var objDL = DLMailTemplate.GetDLMailTemplate(commonDetails.accountId, SQLProvider))
            {
                UpdateStatus = await objDL.UpdateBasicDetails(commonDetails.mailTemplate);
            }
            if (!UpdateStatus)
            {
                commonDetails.mailTemplate.Id = -1;
            }

            return Json(commonDetails.mailTemplate);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> DuplicateTemplate([FromBody] MailTemplate_DuplicateTemplateDto commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            commonDetails.mailTemplate.UserInfoUserId = user.UserId;
            commonDetails.mailTemplate.UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;

            using (var objDL = DLMailTemplate.GetDLMailTemplate(commonDetails.accountId, SQLProvider))
            {
                commonDetails.mailTemplate.Id = await objDL.Save(commonDetails.mailTemplate);
            }

            if (commonDetails.mailTemplate.Id > 0)
            {
                List<MailTemplateFile> mailTemplateFileList;

                using (var objDL = DLMailTemplateFile.GetDLMailTemplateFile(commonDetails.accountId, SQLProvider))
                {
                    mailTemplateFileList = await objDL.GetTemplateFiles(new MailTemplateFile() { TemplateId = commonDetails.SourceTemplateId });
                }

                if (mailTemplateFileList != null && mailTemplateFileList.Count > 0)
                {
                    SaveDownloadFilesToAws awsUpload = new SaveDownloadFilesToAws(commonDetails.accountId, commonDetails.mailTemplate.Id);
                    for (int i = 0; i < mailTemplateFileList.Count; i++)
                    {
                        MailTemplateFile eachFile = mailTemplateFileList[i];

                        MailTemplateFile TemplateFile = new MailTemplateFile()
                        {
                            TemplateId = commonDetails.mailTemplate.Id,
                            TemplateFileType = eachFile.TemplateFileType,
                            TemplateFileName = eachFile.TemplateFileName,
                            TemplateFileContent = eachFile.TemplateFileContent
                        };

                        Stream stream = new MemoryStream(eachFile.TemplateFileContent);

                        await SaveMailTemplateFile(commonDetails.accountId, TemplateFile);
                        awsUpload.UploadFileStream(eachFile.TemplateFileName, stream);
                    }
                }
            }
            return Json(commonDetails.mailTemplate);
        }


        private async Task SaveMailTemplateFile(int accountId, MailTemplateFile TemplateFile)
        {
            using (var objDL = DLMailTemplateFile.GetDLMailTemplateFile(accountId, SQLProvider))
            {
                await objDL.Save(TemplateFile);
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetAllTemplateList([FromBody] MailTemplate_GetAllTemplateListDto commonDetails)
        {
            MailTemplate template = new MailTemplate();
            List<MailTemplate> mailTemplateList = null;
            List<string> fields = new List<string>() { "Id", "Name", "MailCampaignId", "SubjectLine" };
            using (var objDL = DLMailTemplate.GetDLMailTemplate(commonDetails.accountId, SQLProvider))
            {
                mailTemplateList = await objDL.GET(template, 0, 0, null, fields);
                return Json(mailTemplateList);
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetTemplateDetails([FromBody] MailTemplate_GetTemplateDetailsDto commonDetails)
        {
            using (var objDL = DLMailTemplate.GetDLMailTemplate(commonDetails.accountId, SQLProvider))
            {
                IList<int> mailTemplateid = new List<int>() { commonDetails.TemplateId };
                return Json(await objDL.GetAllTemplateList(mailTemplateid));
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetMailCampaign([FromBody] MailTemplate_GetMailCampaignDto commonDetails)
        {
            CampaignIdentifier mailCampaign = new CampaignIdentifier();
            using var objDLform = DLCampaignIdentifier.GetDLCampaignIdentifier(commonDetails.AdsId, SQLProvider);
            List<CampaignIdentifier> CampaignDetails = await objDLform.GetList(mailCampaign, 0, 0);
            return Json(CampaignDetails);
        }

        [Log]
        [HttpPost]
        public async Task<IActionResult> Export([FromBody] MailTemplate_ExportDto commonDetails)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                System.Data.DataSet dataSet = new System.Data.DataSet("General");

                LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
                DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

                MailTemplate? mailTemplate = null;
                List<MLMailTemplate> mailTemplateList;

                if (HttpContext.Session.GetString("MailTemplate") != null)
                {
                    mailTemplate = JsonConvert.DeserializeObject<MailTemplate>(HttpContext.Session.GetString("MailTemplate"));
                }

                using (var objDL = DLMailTemplate.GetDLMailTemplate(commonDetails.AccountId, SQLProvider))
                {
                    mailTemplateList = await objDL.GetList(mailTemplate, commonDetails.OffSet, commonDetails.FetchNext);
                }
                string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(domainDetails.AdsId, SQLProvider);
                var NewListData = mailTemplateList.Select(x => new
                {
                    TemplateName = x.Name,
                    x.CampaignName,
                    UpdatedDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.UpdatedDate)).ToString(),
                    x.SpamScore
                });

                System.Data.DataTable dtt = new System.Data.DataTable();
                dtt = NewListData.CopyToDataTableExport();
                dataSet.Tables.Add(dtt);

                string FileName = DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;

                string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

                if (commonDetails.FileType.ToLower() == "csv")
                    Helper.SaveDataSetToCSV(dataSet, MainPath);
                else
                    Helper.SaveDataSetToExcel(dataSet, MainPath);

                MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

                return Json(new { Status = true, MainPath });
            }
            else
            {
                return Json(new { Status = false });
            }
        }

        [HttpPost]
        public async Task<JsonResult> CheckCounselorTags([FromBody] MailTemplate_CheckCounselorTagsDto commonDetails)
        {
            string JsonContent = null;
            bool result = false;
            MailTemplateFile? templateFile = null;

            using (var objDL = DLMailTemplateFile.GetDLMailTemplateFile(commonDetails.accountId, SQLProvider))
            {
                templateFile = await objDL.GetSingleFileType(new MailTemplateFile() { TemplateId = commonDetails.MailTemplateId, TemplateFileType = ".HTML" });
            }

            if (templateFile != null && templateFile.TemplateFileContent != null)
            {
                JsonContent = Encoding.UTF8.GetString(templateFile.TemplateFileContent);
                if (JsonContent.Contains("[{*Signatory") && JsonContent.Contains("*}]"))
                {
                    result = true;
                }
            }
            return Json(result);
        }
    }
}
