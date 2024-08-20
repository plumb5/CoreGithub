using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.WebPush.Dto;
using Plumb5.Areas.WebPush.Models;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Drawing;
using System.Drawing.Imaging;

namespace Plumb5.Areas.WebPush.Controllers
{
    [Area("WebPush")]
    public class CreateTemplateController : BaseController
    {
        public CreateTemplateController(IConfiguration _configuration) : base(_configuration)
        { }

        //
        // GET: /WebPush/CreateTemplate/

        public IActionResult Index()
        {

            if (HttpContext.Session.GetString("TemplateData") == null)
            {
                return RedirectToAction("../Template");
            }
            return View("CreateTemplate");
        }

        [HttpPost]
        public async Task<JsonResult> GetAllFieldDetails([FromBody] CreateTemplateDto_GetAllFieldDetails commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            List<int> UserInfoUserIdList = (user.Members != null && user.Members.Count > 0) ? user.Members.Select(x => x.UserInfoUserId).ToList<int>() : null;
            using (var objBAL = DLContactExtraField.GetDLContactExtraField(commonDetails.accountId, SQLProvider))
            {
                return Json(await objBAL.GetList(user.UserId, UserInfoUserIdList));
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> SaveOrUpdateTemplate([FromBody] CreateTemplateDto_SaveOrUpdateTemplate commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            if (HttpContext.Session.GetString("TemplateData") != null)
            {

                var filterdata = JsonConvert.DeserializeObject<WebPushTemplate>(HttpContext.Session.GetString("TemplateData"));
                commonDetails.webpushTemplate.CampaignId = Convert.ToInt32(filterdata.CampaignId.ToString());
                commonDetails.webpushTemplate.TemplateName = filterdata.TemplateName.ToString();
                commonDetails.webpushTemplate.TemplateDescription = filterdata.TemplateDescription.ToString();
                commonDetails.webpushTemplate.UserInfoUserId = user.UserId;
                //Session["TemplateData"] = null;
            }


            try
            {
                WebPushValidation webObj = new WebPushValidation();
                if (webObj.WebPushTemplateValidation(commonDetails.webpushTemplate))
                {
                    using (var objDL = DLWebPushTemplate.GetDLWebPushTemplate(commonDetails.accountId, SQLProvider))
                    {
                        if (commonDetails.webpushTemplate.Id <= 0)
                        {
                            commonDetails.webpushTemplate.Id = await objDL.Save(commonDetails.webpushTemplate);
                        }

                        else if (commonDetails.webpushTemplate.Id > 0)
                        {
                            bool result = await objDL.Update(commonDetails.webpushTemplate);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return Json(new { Status = false, Error = ex.Message });
            }

            return Json(new { Status = true, Result = commonDetails.webpushTemplate });
        }

        [HttpPost]
        public async Task<JsonResult> CreateTemplateNext([FromBody] CreateTemplateDto_CreateTemplateNext commonDetails)
        {
            using var objDL = DLWebPushTemplate.GetDLWebPushTemplate(commonDetails.accountId, SQLProvider);
            WebPushTemplate? chkwebpushtemplate = await objDL.GetDetailsByName(commonDetails.webpushTemplate.TemplateName);

            if (chkwebpushtemplate == null || (chkwebpushtemplate != null && chkwebpushtemplate.Id == commonDetails.webpushTemplate.Id))
            {
                HttpContext.Session.SetString("TemplateData", JsonConvert.SerializeObject(commonDetails.webpushTemplate));
                return Json(new { Status = true });
            }
            else { return Json(new { Status = false }); }
        }


       
        [HttpPost]
        [Log]
        public async Task<JsonResult> SaveImage()
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
                   
                    int width = int.Parse(Request.Form["width"].ToString());
                    int height = int.Parse(Request.Form["height"].ToString());
                   
                    var imagesToBeResized = Image.FromStream(Request.Form.Files[0].OpenReadStream());
                    var newbm = new Bitmap(imagesToBeResized, new Size(width, height));

                    Stream InputStream = new MemoryStream();
                    newbm.Save(InputStream, System.Drawing.Imaging.ImageFormat.Png);

                    SaveDownloadFilesToAws awsUpload = new SaveDownloadFilesToAws(domainDetails.AdsId, "ClientImages");
                    Tuple<string, string> tuple = awsUpload.UploadClientFiles(fileName, InputStream);

                    string IconImageName = "";
                    if (tuple != null && !String.IsNullOrEmpty(tuple.Item2))
                    {
                        IconImageName = tuple.Item2;
                    }

                    var getdata = JsonConvert.SerializeObject(IconImageName, Formatting.Indented);
                    //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Status = IconImageName.ToString(), Message = "Image Saved" }), LogMessage);
                    return Json(new { getdata });

                }
                else
                {
                    var getdata = JsonConvert.SerializeObject("0", Formatting.Indented);
                    //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Status = getdata.ToString(), Message = "Unable to save image" }), LogMessage);
                    return Json(new { getdata });
                }
            }
            catch (Exception ex)
            {
                var getdata = JsonConvert.SerializeObject("0", Formatting.Indented);
                //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Status = getdata.ToString(), Message = "Unable to save image " + ex.ToString() }), LogMessage);
               
                return Json(new { getdata });
            }
        }


        public static Bitmap ResizeBitmap(Bitmap originalBitmap, int requiredHeight, int requiredWidth)
        {
            int[] heightWidthRequiredDimensions;

            // Pass dimensions to worker method depending on image type required
            heightWidthRequiredDimensions = WorkDimensions(originalBitmap.Height, originalBitmap.Width, requiredHeight, requiredWidth);


            Bitmap resizedBitmap = new Bitmap(heightWidthRequiredDimensions[1],heightWidthRequiredDimensions[0]);

            const float resolution = 72;

            resizedBitmap.SetResolution(resolution, resolution);

            Graphics graphic = Graphics.FromImage((Image)resizedBitmap);

            graphic.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
            graphic.DrawImage(originalBitmap, 0, 0, resizedBitmap.Width, resizedBitmap.Height);

            graphic.Dispose();
            originalBitmap.Dispose();
            //resizedBitmap.Dispose(); // Still in use


            return resizedBitmap;
        }


        private static int[] WorkDimensions(int originalHeight, int originalWidth, int requiredHeight, int requiredWidth)
        {
            int imgHeight = 0;
            int imgWidth = 0;

            imgWidth = requiredHeight;
            imgHeight = requiredWidth;


            int requiredHeightLocal = originalHeight;
            int requiredWidthLocal = originalWidth;

            double ratio = 0;

            // Check height first
            // If original height exceeds maximum, get new height and work ratio.
            if (originalHeight > imgHeight)
            {
                ratio = double.Parse(((double)imgHeight / (double)originalHeight).ToString());
                requiredHeightLocal = imgHeight;
                requiredWidthLocal = (int)((decimal)originalWidth * (decimal)ratio);
            }

            // Check width second. It will most likely have been sized down enough
            // in the previous if statement. If not, change both dimensions here by width.
            // If new width exceeds maximum, get new width and height ratio.
            if (requiredWidthLocal >= imgWidth)
            {
                ratio = double.Parse(((double)imgWidth / (double)originalWidth).ToString());
                requiredWidthLocal = imgWidth;
                requiredHeightLocal = (int)((double)originalHeight * (double)ratio);
            }

            int[] heightWidthDimensionArr = { requiredHeightLocal, requiredWidthLocal };

            return heightWidthDimensionArr;
        }
    }
}
