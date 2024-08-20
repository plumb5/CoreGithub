using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.Blazor;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.ManageContact.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Reflection;

namespace Plumb5.Areas.ManageContact.Controllers
{
    [Area("ManageContact")]
    public class ContactFieldController : BaseController
    {
        public ContactFieldController(IConfiguration _configuration) : base(_configuration)
        { }
        public IActionResult Index()
        {
            return View("ContactField");
        }

        [HttpPost]
        public async Task<JsonResult> GetAllFieldDetails()
        {
            DomainInfo? domain = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            List<int> UserInfoUserIdList = (user.Members != null && user.Members.Count > 0) ? user.Members.Select(x => x.UserInfoUserId).ToList<int>() : null;

            using (var objBAL = DLContactExtraField.GetDLContactExtraField(domain.AdsId, SQLProvider))
            {
                return Json(await objBAL.GetList(user.UserId, UserInfoUserIdList));
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> SaveOrUpdateDetails([FromBody] ContactField_SaveOrUpdateDetailsDto details)
        {
            DomainInfo? domain = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            bool Result = false;
            if (details.fieldConfig.Id <= 0)
            {
                details.fieldConfig.UserInfoUserId = user.UserId;
                details.fieldConfig.UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;
                using (var objDL = DLContactExtraField.GetDLContactExtraField(domain.AdsId, SQLProvider))
                {
                    details.fieldConfig.Id = await objDL.Save(details.fieldConfig);
                }
            }
            else if (details.fieldConfig.Id > 0)
            {
                using (var objDL = DLContactExtraField.GetDLContactExtraField(domain.AdsId, SQLProvider))
                {
                    Result = await objDL.Update(details.fieldConfig);
                }
            }
            return Json(new { ContactFields = details.fieldConfig, Result = Result });
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> Delete([FromBody] ContactField_DeleteDto details)
        {
            DomainInfo? domain = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            using (var objDL = DLContactExtraField.GetDLContactExtraField(domain.AdsId, SQLProvider))
            {
                bool result = await objDL.Delete(details.Id);
                return Json(result);
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> ChangeEditableStatus([FromBody] ContactField_ChangeEditableStatusDto details)
        {
            DomainInfo? domain = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            using (var objDL = DLContactExtraField.GetDLContactExtraField(domain.AdsId, SQLProvider))
            {
                bool result = await objDL.ChangeEditableStatus(details.fieldConfig);

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
            DomainInfo? domain = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            UserInfo details = null;
            string Apikey = null; int AdsIs = 0;
            using (var userDetails = DLUserInfo.GetDLUserInfo(SQLProvider))
            {
                details = await userDetails.GetDetail(user.UserId);
                if (details != null)
                {
                    Apikey = details.ApiKey;
                    AdsIs = domain.AdsId;
                }
            }

            return Json(new { Apikey = Apikey, AdsIs = AdsIs });
        }
    }
}
