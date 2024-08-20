using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Globalization;
using Plumb5.Areas.CaptureForm.Models;
using System.Reflection;
using Plumb5.Areas.ManageContact.Dto;

namespace Plumb5.Areas.ManageContact.Controllers
{
    [Area("ManageContact")]
    public class CustomFieldController : BaseController
    {
        public CustomFieldController(IConfiguration _configuration) : base(_configuration)
        { }

        public IActionResult Index()
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo")); 
            ViewBag.AdsId = domainDetails.AdsId;
            return View("CustomField");
        }
        [HttpPost]
        public async Task<JsonResult> GetAllFieldDetails()
        {
            DomainInfo? domain = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = new LoginInfo() { UserId = 1, UserName = "support", EmailId = "support@plumb5.com", IsSuperAdmin = Convert.ToInt32(1) };
 
            List<int> UserInfoUserIdList = (user.Members != null && user.Members.Count > 0) ? user.Members.Select(x => x.UserInfoUserId).ToList<int>() : null;
            using (var objDAL =   DLContactExtraField.GetDLContactExtraField(domain.AdsId,SQLProvider))
            {
                return Json((await objDAL.GetList(user.UserId, UserInfoUserIdList) ).ToList());
            }
        }

        [HttpPost]
        public async Task<JsonResult> SaveOrUpdateDetails([FromBody]CustomField_SaveOrUpdateDetailsDto CustomFielddto)
        { 
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = new LoginInfo() { UserId = 1, UserName = "support", EmailId = "support@plumb5.com", IsSuperAdmin = Convert.ToInt32(1) };

            //#region Logs   
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(domainDetails.AdsId, user.UserId, user.UserName, user.EmailId, "ContactField", "Mail", "SaveOrUpdateDetails", Helper.GetIP(), JsonConvert.SerializeObject(new { fieldConfig = fieldConfig }));
            //#endregion

            bool Result = false;
            if (CustomFielddto.fieldConfig.Id <= 0)
            {
                CustomFielddto.fieldConfig.UserInfoUserId = user.UserId;
                CustomFielddto.fieldConfig.UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;
                using (var objDL =   DLContactExtraField.GetDLContactExtraField(domainDetails.AdsId,SQLProvider))
                {
                    CustomFielddto.fieldConfig.Id = await objDL.Save(CustomFielddto.fieldConfig);
                    if (CustomFielddto.fieldConfig.Id > 0)
                    {
                        Result = true;
                        //LogMessage = "The contact extra field '" + fieldConfig.FieldName + "' has been created";
                    }
                    //else
                    //{
                    //    LogMessage = "Unable to create contact extra field '" + fieldConfig.FieldName + "'";
                    //}
                }
            }
            else if (CustomFielddto.fieldConfig.Id > 0)
            {
                using (var objDL =   DLContactExtraField.GetDLContactExtraField(domainDetails.AdsId,SQLProvider))
                {
                    Result = await objDL.Update(CustomFielddto.fieldConfig);
                    //if (Result)
                    //    LogMessage = "The contact extra field '" + fieldConfig.FieldName + "' has been updated";
                    //else
                    //    LogMessage = "Unable to update contact extra field '" + fieldConfig.FieldName + "'";
                }
            }
            //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { ContactFields = fieldConfig, Result = Result }), LogMessage);
            return Json(new { ContactFields = CustomFielddto.fieldConfig, Result = Result } );
        }

        [HttpPost]
        public async Task<JsonResult> Delete([FromBody] CustomField_DeleteDto CustomFielddto)
        {
            DomainInfo? domain = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
             
            //#region Logs  
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(domain.AdsId, userInfo.UserId, userInfo.UserName, userInfo.EmailId, "ContactField", "Mail", "Delete", Helper.GetIP(), JsonConvert.SerializeObject(new { Id = Id }));
            //#endregion

            using (var objDL =   DLContactExtraField.GetDLContactExtraField(domain.AdsId,SQLProvider))
            {
                bool result = await objDL.Delete(CustomFielddto.Id);

                //if (result)
                //    LogMessage = "The contact extra feild '" + ExtraFieldDetails.FieldName + "' has been deleted";
                //else
                //    LogMessage = "Unable to delete contact extra feild '" + ExtraFieldDetails + "'";

                //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { result = result }), LogMessage);
                return Json(result );
            }
        }

        [HttpPost]
        public async Task<JsonResult> ChangeEditableStatus([FromBody] CustomField_ChangeEditableStatusDto CustomFielddto)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = new LoginInfo() { UserId = 1, UserName = "support", EmailId = "support@plumb5.com", IsSuperAdmin = Convert.ToInt32(1) };

            //#region Logs 
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(domainDetails.AdsId, userInfo.UserId, userInfo.UserName, userInfo.EmailId, "ContactField", "Mail", "ChangeEditableStatus", Helper.GetIP(), JsonConvert.SerializeObject(new { fieldConfig = fieldConfig }));
            //#endregion
            using (var objDL = DLContactExtraField.GetDLContactExtraField(domainDetails.AdsId, SQLProvider))
            {
                bool result = await objDL.ChangeEditableStatus(CustomFielddto.fieldConfig);
                //if (result)
                //    LogMessage = "The contact extra feild status has been changed";
                //else
                //    LogMessage = "Unable to change the contact extra feild";

                //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { result = result }), LogMessage);
                return Json(result );
            }
        }

        public JsonResult GetProperties()
        {
            Contact obj = new Contact();
            List<string> Fields = new List<string>();
            foreach (PropertyInfo prop in obj.GetType().GetProperties())
            {
                Fields.Add(prop.Name.ToString());
            }
            return Json(Fields );
        }
        [HttpPost]
        public async Task<JsonResult> GetUserDetails()
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? userInfo = new LoginInfo() { UserId = 1, UserName = "support", EmailId = "support@plumb5.com", IsSuperAdmin = Convert.ToInt32(1) };

            UserInfo details = null;
            string Apikey = null; int AdsIs = 0;
            using (var userDetails =   DLUserInfo.GetDLUserInfo(SQLProvider))
            {
                details = await userDetails.GetDetail(userInfo.UserId);
                if (details != null)
                {
                    Apikey = details.ApiKey;
                    AdsIs = domainDetails.AdsId;
                }
            }

            return Json(new { Apikey = Apikey, AdsIs = AdsIs } );
        }


    }
}
