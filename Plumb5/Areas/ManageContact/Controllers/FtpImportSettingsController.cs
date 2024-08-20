using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.Blazor;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.ManageContact.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using Renci.SshNet;
using System.Net;

namespace Plumb5.Areas.ManageContact.Controllers
{
    [Area("ManageContact")]
    public class FtpImportSettingsController : BaseController
    {
        public FtpImportSettingsController(IConfiguration _configuration) : base(_configuration)
        { }

        public IActionResult Index()
        {
            return View("FtpImportSettings");
        }

        [HttpPost]
        public async Task<IActionResult> MaxCount([FromBody] FtpImportSettings_MaxCountDto details)
        {
            int returnVal;
            using (var objBL = DLFtpImportSettings.GetDLFtpImportSettings(details.accountId, SQLProvider))
            {
                returnVal = await objBL.MaxCount();
            }
            return Json(new
            {
                returnVal
            });
        }

        [HttpPost]
        public async Task<IActionResult> GetDetails([FromBody] FtpImportSettings_GetDetailsDto details)
        {
            List<FtpImportSettings> ftpImportSettingsdetails = null;
            using (var objBL = DLFtpImportSettings.GetDLFtpImportSettings(details.accountId, SQLProvider))
            {
                ftpImportSettingsdetails = await objBL.GetDetails(details.OffSet, details.FetchNext);
            }
            return Json(ftpImportSettingsdetails);
        }

        [HttpPost]
        public async Task<JsonResult> SaveOrUpdateDetails([FromBody] FtpImportSettings_SaveOrUpdateDetailsDto details)
        {
            if (details.FtpImportSettings.Id <= 0)
            {
                using (var objBL = DLFtpImportSettings.GetDLFtpImportSettings(details.accountId, SQLProvider))
                {
                    details.FtpImportSettings.Id = await objBL.Save(details.FtpImportSettings);

                }
            }
            else if (details.FtpImportSettings.Id > 0)
            {
                using (var objBL = DLFtpImportSettings.GetDLFtpImportSettings(details.accountId, SQLProvider))
                {
                    if (!await objBL.Update(details.FtpImportSettings))
                        details.FtpImportSettings.Id = -1;
                }
            }
            return Json(details.FtpImportSettings);
        }

        [HttpPost]
        public async Task<JsonResult> Delete([FromBody] FtpImportSettings_DeleteDto details)
        {
            using (var objBL = DLFtpImportSettings.GetDLFtpImportSettings(details.accountId, SQLProvider))
            {
                return Json(await objBL.Delete(details.Id));
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetFtpImportSettingsDetailsForUpdate([FromBody] FtpImportSettings_GetFtpImportSettingsDetailsForUpdateDto details)
        {
            using (var objBL = DLFtpImportSettings.GetDLFtpImportSettings(details.AccountId, SQLProvider))
                return Json(objBL.GetFtpImportSettingsDetails(details.Id));
        }
        [HttpPost]
        public async Task<JsonResult> TestConnection([FromBody] FtpImportSettings_TestConnectionDto details)
        {
            bool status = false;

            try
            {
                if (details.Protocol.ToLower() == "ftp")
                {
                    FtpWebRequest request = (FtpWebRequest)WebRequest.Create("ftp://" + details.ServerIp);
                    // request.EnableSsl = true;
                    request.Method = WebRequestMethods.Ftp.PrintWorkingDirectory;
                    request.Credentials = new NetworkCredential(details.UserId, details.Password);
                    request.Proxy = null;
                    request.KeepAlive = false;
                    request.UseBinary = true;
                    request.UsePassive = true;
                    request.Timeout = -1;
                    FtpWebResponse response = (FtpWebResponse)request.GetResponse();
                    if (response.SupportsHeaders)
                        status = true;
                    //request.Abort();
                }
                else
                {
                    using (SftpClient sftp = new SftpClient(details.ServerIp, details.UserId, details.Password))
                    {
                        sftp.Connect();
                        if (sftp.IsConnected)
                            status = true;

                        sftp.Disconnect();
                    }
                }
            }
            catch (Exception ex)
            {
                status = false;
                using (ErrorUpdation objError = new ErrorUpdation("FTPIMPORTSETTING"))
                {
                    objError.AddError(ex.ToString(), "", DateTime.Now.ToString(), "FTPIMPORTSETTING-->TestConnection", "");
                }
            }
            return Json(status);
        }


        [HttpPost]
        public async Task<JsonResult> GetFTPConnectionList([FromBody] FtpImportSettings_GetFTPConnectionListDto details)
        {
            using (var objBL = DLFtpImportSettings.GetDLFtpImportSettings(details.accountId, SQLProvider))
            {
                return Json(await objBL.GetDetailsList());
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetFtpDirectory([FromBody] FtpImportSettings_GetFtpDirectoryDto details)
        {
            string[] directories = null;
            bool result = true;
            string message = string.Empty;
            FtpImportSettings ftpImportSettings = null;
            try
            {
                using (var objBL = DLFtpImportSettings.GetDLFtpImportSettings(details.accountId, SQLProvider))
                {
                    ftpImportSettings = objBL.GetFtpImportSettingsDetails(details.connectionId);
                }

                if (ftpImportSettings != null && ftpImportSettings.Id > 0)
                {
                    FtpFileTransfer ftp = new FtpFileTransfer(ftpImportSettings.ServerIP, ftpImportSettings.UserName, ftpImportSettings.Password);
                    if (ftpImportSettings.Protocol.ToLower().Contains("sftp"))
                    {
                        if (string.IsNullOrEmpty(details.path))
                            directories = ftp.DirectoryListSimpleWithSFTP(ftpImportSettings.FolderPath);
                        else
                            directories = ftp.DirectoryListSimpleWithSFTP(ftpImportSettings.FolderPath + "/" + details.path);
                    }
                    else
                    {
                        if (string.IsNullOrEmpty(details.path))
                            directories = ftp.DirectoryListSimple(ftpImportSettings.FolderPath);
                        else
                            directories = ftp.DirectoryListSimple(details.path);
                    }

                }
            }
            catch (Exception ex)
            {
                result = false;
                message = ex.Message;
            }

            return Json(new { result = result, message = message, directories = directories });
        }
    }
}
