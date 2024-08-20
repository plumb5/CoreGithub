using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Prospect.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;
using System.Data;

namespace Plumb5.Areas.Prospect.Controllers
{
    [Area("Prospect")]
    public class LeadSourceController : BaseController
    {
        public LeadSourceController(IConfiguration _configuration) : base(_configuration)
        { }
        public ActionResult Index()
        {
            DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            ViewBag.AdsId = account.AdsId;
            return View("LeadSource");
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> SaveUpdateLmsGroup([FromBody] LeadSource_SaveUpdateLmsGroupDto objDto)
        {
            bool Status = false;
            LmsGroup lmsGroup = new LmsGroup() { Id = objDto.LmsGroupId, UserInfoUserId = objDto.UserId, Name = objDto.Name, GroupType = 3 };
            using (var objlmsGroup = DLLmsGroup.GetDLLmsGroup(objDto.AccountId,SQLProvider))
            {
                if (objDto.LmsGroupId > 0)
                {
                    Status =await objlmsGroup.Update(lmsGroup);
                }
                else
                {
                    lmsGroup.Id = await objlmsGroup.Save(lmsGroup);
                    if (lmsGroup.Id > 0)
                        Status = true;
                }
            }
            return Json(new { Status = Status, Group = lmsGroup });
        }
        [HttpPost]
        public async Task<ActionResult> GetMaxCount([FromBody] LeadSource_GetMaxCountDto objDto)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            List<MLUserHierarchy> userHierarchy = null;

            using (var objUserHierarchy = DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
            {
                userHierarchy = await objUserHierarchy.GetHisUsers(user.UserId, objDto.accountId);
            }

            List<int> usersId = new List<int>();
            if (userHierarchy != null)
                usersId = userHierarchy.Select(x => x.UserInfoUserId).Distinct().ToList();

            usersId.Add(user.UserId);

            string userId = string.Join(",", usersId.ToArray());

            if (String.IsNullOrEmpty(userId))
            {
                userId = user.UserId.ToString();
            }

            using (var objGroup = DLLmsGroup.GetDLLmsGroup(objDto.accountId,SQLProvider))
            {
                return Json(await objGroup.GetMaxCount(userId, objDto.lmsgroup));
            }
        }
        [HttpPost]
        public async Task<ActionResult> GetAllDetails([FromBody] LeadSource_GetAllDetailsDto objDto)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            ArrayList data = new ArrayList() { objDto.lmsgroup };
            HttpContext.Session.SetString("LmsGroupDetails", JsonConvert.SerializeObject(data));

            List<MLUserHierarchy> userHierarchy = null;

            using (var objUserHierarchy = DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
            {
                userHierarchy =await objUserHierarchy.GetHisUsers(user.UserId, objDto.accountId);
            }

            List<int> usersId = new List<int>();
            if (userHierarchy != null)
                usersId = userHierarchy.Select(x => x.UserInfoUserId).Distinct().ToList();

            usersId.Add(user.UserId);

            string userId = string.Join(",", usersId.ToArray());

            if (String.IsNullOrEmpty(userId))
            {
                userId = user.UserId.ToString();
            }

            using (var objGroup = DLLmsGroup.GetDLLmsGroup(objDto.accountId,SQLProvider))
            {
                return Json(await objGroup.GetListLmsGroup(objDto.OffSet, objDto.FetchNext, userId, objDto.lmsgroup));
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> Delete([FromBody] LeadSource_DeleteDto objDto)
        {
            //LoginInfo user = (LoginInfo)Session["UserInfo"];

            //#region Logs 
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(accountId, user.UserId, user.UserName, user.EmailId, "LeadSource", "Prospect", "Delete", Helper.GetIP(), JsonConvert.SerializeObject(new { lmsGroupId = lmsGroupId }));
            //#endregion

            using (var objGroup = DLLmsGroup.GetDLLmsGroup(objDto.accountId,SQLProvider))
            {
                bool result;
                result = await objGroup.Delete(objDto.lmsGroupId);

                //if (result == true)
                //    LogMessage = "LmsGroup has been deleted successfully";
                //else
                //    LogMessage = "Unable to delete the lms group";

                //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { result = result }), LogMessage);
                return Json(result);
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> LmsGroupExport([FromBody] LeadSource_LmsGroupExportDto objDto)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                DataSet dataSet = new DataSet();
                LmsGroup lmsgroup = new LmsGroup();
                List<MLLmsGroup> lmsgroupdetailslist = new List<MLLmsGroup>();

                if (HttpContext.Session.GetString("LmsGroupDetails") != null)
                {
                    ArrayList data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("LmsGroupDetails"));
                    lmsgroup = JsonConvert.DeserializeObject<LmsGroup>(data[0].ToString()); 
                }

                List<MLUserHierarchy> userHierarchy = null;

                using (var objUserHierarchy = DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
                {
                    userHierarchy = await objUserHierarchy.GetHisUsers(user.UserId, objDto.AccountId);
                }

                List<int> usersId = new List<int>();
                if (userHierarchy != null)
                    usersId = userHierarchy.Select(x => x.UserInfoUserId).Distinct().ToList();

                usersId.Add(user.UserId);

                string userId = string.Join(",", usersId.ToArray());

                if (String.IsNullOrEmpty(userId))
                {
                    userId = user.UserId.ToString();
                }

                using (var objGroup = DLLmsGroup.GetDLLmsGroup(objDto.AccountId,SQLProvider))
                {
                    lmsgroupdetailslist = (await objGroup.GetListLmsGroup(objDto.OffSet, objDto.FetchNext, userId, lmsgroup)).ToList();
                }

                var NewListData = lmsgroupdetailslist.Select(async x => new
                {
                    Name = x.Name,
                    LeadCount = x.LeadCount,
                    CreatedDate = Helper.ConvertFromUTCToLocalTimeZone(await Helper.GetAccountTimeZoneFromCachedMemory(objDto.AccountId,SQLProvider), Convert.ToDateTime(x.CreatedDate)).ToString()
                });

                System.Data.DataTable dtt = new System.Data.DataTable();
                dtt = NewListData.CopyToDataTableExport();
                dataSet.Tables.Add(dtt);

                string FileName = "LmsGroupDetails_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + objDto.FileType;
                string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

                if (objDto.FileType.ToLower() == "csv")
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
        public async Task<JsonResult> SaveOrUpdate([FromBody] LeadSource_SaveOrUpdateDto objDto)
        {
            int Id = 0;

            using (var objDL = DLLmsSourceType.GetDLLmsSourceType(objDto.AccountId,SQLProvider))
            {

                // Id = objDL.SaveOrUpdate(lmssourcetype);
                if (objDto.lmssourcetype.Id == 0)
                {
                    Id =await objDL.Save(objDto.lmssourcetype);
                }
                else
                {
                    Id =await objDL.Update(objDto.lmssourcetype);
                }

            }

            return Json(Id);
        }
        [HttpPost]
        public async Task<JsonResult> GetLmsSorceType([FromBody] LeadSource_GetLmsSorceTypeDto objDto)
        {

            List<LmsSourceType> lmssortypedetails = null;
            using (var objBL =DLLmsSourceType.GetDLLmsSourceType(objDto.accountId,SQLProvider))
            {
                lmssortypedetails =await objBL.GetLmsSorceType();
            }

            return Json(lmssortypedetails);
        }
    }
}
