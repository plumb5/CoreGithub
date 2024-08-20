using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Sms.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Reflection;

namespace Plumb5.Areas.Sms.Controllers
{
    [Area("Sms")]
    public class ContactFieldController : BaseController
    {
        public ContactFieldController(IConfiguration _configuration) : base(_configuration)
        { }
        public ActionResult Index()
        {
            return View("ContactField");
        }
        [HttpPost]
        public async Task<JsonResult> GetAllFieldDetails()
        {
            DomainInfo? domain = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            List<int> UserInfoUserIdList = (user.Members != null && user.Members.Count > 0) ? user.Members.Select(x => x.UserInfoUserId).ToList<int>() : null;
            using (var objBAL = DLContactExtraField.GetDLContactExtraField(domain.AdsId,SQLProvider))
            {
                return Json(await objBAL.GetList(user.UserId, UserInfoUserIdList));
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> SaveOrUpdateDetails([FromBody] ContactField_SaveOrUpdateDetailsDto objDto)
        {
            ContactExtraField fieldConfig = objDto.fieldConfigData;

            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            //#region Logs   
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(domainDetails.AdsId, user.UserId, user.UserName, user.EmailId, "ContactField", "Sms", "SaveOrUpdateDetails", Helper.GetIP(), JsonConvert.SerializeObject(new { fieldConfig = fieldConfig }));
            //#endregion
            bool Result = false;
            if (fieldConfig.Id <= 0)
            {
                fieldConfig.UserInfoUserId = user.UserId;
                fieldConfig.UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;
                using (var objDL = DLContactExtraField.GetDLContactExtraField(domainDetails.AdsId,SQLProvider))
                {
                    fieldConfig.Id =await objDL.Save(fieldConfig);
                    //if (fieldConfig.Id > 0)
                    //    LogMessage = "The contact extra field '" + fieldConfig.FieldName + "' has been create";
                    //else
                    //    LogMessage = "Unable to create contact extra field '" + fieldConfig.FieldName + "'";
                }
            }
            else if (fieldConfig.Id > 0)
            {
                using (var objDL = DLContactExtraField.GetDLContactExtraField(domainDetails.AdsId,SQLProvider))
                {
                    Result =await objDL.Update(fieldConfig);
                    //if (Result)
                    //    LogMessage = "The contact extra field '" + fieldConfig.FieldName + "' has been updated";
                    //else
                    //    LogMessage = "Unable to update contact extra field '" + fieldConfig.FieldName + "'";
                }
            }
            //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { ContactFields = fieldConfig, Result = Result }), LogMessage);
            return Json(new { ContactFields = fieldConfig, Result = Result });
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> Delete([FromBody] ContactField_DeleteDto objDto)
        {
            DomainInfo? domain = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? userInfo = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            //#region Logs  
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(domain.AdsId, userInfo.UserId, userInfo.UserName, userInfo.EmailId, "ContactField", "Sms", "Delete", Helper.GetIP(), JsonConvert.SerializeObject(new { Id = Id }));
            //#endregion

            ContactExtraField ExtraFieldDetails;
            using (var objDL = DLContactExtraField.GetDLContactExtraField(domain.AdsId,SQLProvider))
            {
                ExtraFieldDetails =await objDL.GetDetails(new ContactExtraField() { Id = objDto.Id });
            }

            using (var objBAL =DLContactExtraField.GetDLContactExtraField(domain.AdsId,SQLProvider))
            {
                bool result = await objBAL.Delete(objDto.Id);

                //if (result)
                //    LogMessage = "The contact extra feild '" + ExtraFieldDetails.FieldName + "' has been deleted";
                //else
                //    LogMessage = "Unable to delete contact extra feild '" + ExtraFieldDetails + "'";

                //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { result = result }), LogMessage);
                return Json(result);
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> ChangeEditableStatus([FromBody] ContactField_ChangeEditableStatusDto objDto)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? userInfo = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            //#region Logs 
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(domainDetails.AdsId, userInfo.UserId, userInfo.UserName, userInfo.EmailId, "ContactField", "Sms", "ChangeEditableStatus", Helper.GetIP(), JsonConvert.SerializeObject(new { fieldConfig = fieldConfig }));
            //#endregion
            using (var objDL = DLContactExtraField.GetDLContactExtraField(domainDetails.AdsId,SQLProvider))
            {
                bool result = await objDL.ChangeEditableStatus(objDto.fieldConfig);
                //if (result)
                //    LogMessage = "The contact extra feild status has been changed";
                //else
                //    LogMessage = "Unable to change the contact extra feild";

                //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { result = result }), LogMessage);
                return Json(result);
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetProperties()
        {
            Contact obj = new Contact();
            List<string> Fields = new List<string>();
            foreach (PropertyInfo prop in obj.GetType().GetProperties())
            {
                Fields.Add(prop.Name.ToString());
            }
            return Json(Fields);
        }
        [HttpPost]
        public async Task<JsonResult> GetUserDetails()
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? userInfo = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            UserInfo details = null;
            string Apikey = null; int AdsIs = 0;
            using (var userDetails = DLUserInfo.GetDLUserInfo(SQLProvider))
            {
                details = await userDetails.GetDetail(userInfo.UserId);
                if (details != null)
                {
                    Apikey = details.ApiKey;
                    AdsIs = domainDetails.AdsId;
                }
            }

            return Json(new { Apikey = Apikey, AdsIs = AdsIs });
        }
    }
}
