using P5GenralML;
using Plumb5.Models;
using P5GenralDL;
using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

namespace Plumb5.Controllers
{
    public class LicensingController : Controller
    {
        //
        // GET: /Licensing/

        private readonly string? SQLProvider;
        public LicensingController(IConfiguration _configuration)
        {
            SQLProvider = _configuration["SqlProvider"];
        }

        public ActionResult Index()
        {
            return View("License");
        }

        public async Task<JsonResult> UpdateNewLicense(Licensing licensing)
        {
            int LicenseKeyTry = 0;
            if (HttpContext.Session.GetString("License") == null)
                HttpContext.Session.SetString("License", Convert.ToString(1));
            bool status = false;
            string ErrorMessage = string.Empty;
            if (HttpContext.Session.GetString("License") != null)
            {
                LicenseKeyTry = Convert.ToInt32(HttpContext.Session.GetString("License"));
                if (LicenseKeyTry > 5)
                {
                    return Json(new { Status = false, Error = "You have reached maximum attempt, Please try after sometime" });
                }
            }
            if (String.IsNullOrEmpty(licensing.LicensingKey) || licensing.LicensingKey.Length <= 20)
            {
                if (HttpContext.Session.GetString("License") != null)
                {
                    LicenseKeyTry = Convert.ToInt32(HttpContext.Session.GetString("License"));
                }
                LicenseKeyTry = LicenseKeyTry + 1;
                HttpContext.Session.SetString("License", Convert.ToString(LicenseKeyTry));

                return Json(new { Status = false, Error = "Invalid license key" });
            }
            else if (!licensing.LicensingKey.Contains("-"))
            {
                if (HttpContext.Session.GetString("License") != null)
                {
                    LicenseKeyTry = Convert.ToInt32(HttpContext.Session.GetString("License"));
                }
                LicenseKeyTry = LicenseKeyTry + 1;
                HttpContext.Session.SetString("License", Convert.ToString(LicenseKeyTry));
                return Json(new { Status = false, Error = "Invalid license key" });
            }

            try
            {
                using (var objDLLicensing = DLLicensing.GetDLLicensing(SQLProvider))
                {
                    licensing.LicensingActive = true;
                    licensing.Id = await objDLLicensing.Save(licensing);
                }

                if (licensing.Id > 0)
                {
                    //P5License.InitializeP5License();
                    status = true;
                }
            }
            catch (Exception ex)
            {
                ErrorMessage = ex.ToString();
            }
            return Json(new { Status = status, Error = ErrorMessage });
        }
    }
}
