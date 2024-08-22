using Microsoft.AspNetCore.Mvc;
using P5GenralDL;
using P5GenralML;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Text;
using Microsoft.AspNetCore.Http;
using Plumb5.Areas.Mail.Dto;

namespace Plumb5.Areas.Mail.Controllers
{
    [Area("Mail")]
    public class DownloadTemplateController : BaseController
    {
        public DownloadTemplateController(IConfiguration _configuration) : base(_configuration)
        { }
        //public IActionResult Index()
        //{
        //    return View();
        //}

        public async Task Index(int accountId, int TemplateId)
        {
            try
            {
                MailTemplate mailTemplate;
                using (var objMailTemplate = DLMailTemplate.GetDLMailTemplate(accountId, SQLProvider))
                {
                    mailTemplate = objMailTemplate.GETDetails(new MailTemplate() { Id = TemplateId });
                }

                if (mailTemplate != null && mailTemplate.Id > 0)
                {
                    MailTemplateFile mailTemplateFile;
                    using (var objDL = DLMailTemplateFile.GetDLMailTemplateFile(accountId, SQLProvider))
                    {
                        mailTemplateFile = await objDL.GetSingleFileType(new MailTemplateFile() { TemplateId = TemplateId, TemplateFileType = ".HTML" });
                    }

                    string HtmlContent;
                    if (mailTemplateFile != null && mailTemplateFile.TemplateFileContent != null)
                    {
                        HtmlContent = Encoding.UTF8.GetString(mailTemplateFile.TemplateFileContent);

                        string PhyPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"].ToString() + "\\TempFiles\\" + "Campaign-" + accountId + "-" + TemplateId;
                        string foldername = "Campaign-" + accountId + "-" + TemplateId;
                        SaveDownloadFilesToAws awsUpload = new SaveDownloadFilesToAws(accountId, TemplateId);
                        bool result = await awsUpload.ListingContentAndDownloadFiles(foldername, PhyPath, awsUpload.bucketname);
                        string ZipedFolderName = string.Empty;
                        string disCampaignFolder = AllConfigURLDetails.KeyValueForConfig["MAINPATH"].ToString() + "\\TempFiles\\";
                        if (result)
                        {
                            string SourceFolderName = disCampaignFolder + "Campaign-" + accountId + "-" + TemplateId;
                            ZipedFolderName = Helper.Zip(SourceFolderName, disCampaignFolder);
                        }

                        if (String.IsNullOrEmpty(ZipedFolderName))
                        {
                            ZipedFolderName = "Campaign_" + accountId + "_" + TemplateId + "_" + mailTemplateFile.TemplateFileName;
                            using (StreamWriter sw = new StreamWriter(disCampaignFolder + ZipedFolderName))
                            {
                                sw.Write(HtmlContent);
                                sw.Close();
                            }
                        }

                        string filename = (disCampaignFolder + ZipedFolderName);
                        FileInfo fileInfo = new FileInfo(filename);
                        if (fileInfo.Exists)
                        {
                            long sz = fileInfo.Length;

                            Response.Clear();
                            Response.ContentType = "application/octet-stream";
                            Response.Headers["Content-Disposition"] = "attachment; filename=" + Path.GetFileName(filename);
                            Response.ContentLength = sz;
                            Response.SendFileAsync(filename).Wait();



                            //Response.ClearContent();
                            //Response.ContentType = "application/octet-stream";
                            //Response.AddHeader("Content-Disposition", string.Format("attachment; filename = {0}", Path.GetFileName(filename)));
                            //Response.AddHeader("Content-Length", sz.ToString("F0"));
                            //Response.TransmitFile(filename);
                            //Response.End();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
