using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.Blazor;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Journey.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;

namespace Plumb5.Areas.Journey.Controllers
{
    [Area("Journey")]
    public class RulesController : BaseController
    {
        public RulesController(IConfiguration _configuration) : base(_configuration)
        { }

        public IActionResult Index()
        {
            return View("Rules");
        }

        [HttpPost]
        public async Task<JsonResult> GetMaxCount([FromBody] Rules_GetMaxCountDto details)
        {
            int returnVal;
            using (var objDL = DLWorkFlowRule.GetDLWorkFlowRule(details.accountId, SQLProvider))
            {
                returnVal = await objDL.GetMaxCount(details.RuleName);
            }
            return Json(new
            {
                returnVal
            });
        }
        [HttpPost]
        public async Task<JsonResult> GetRulesData([FromBody] Rules_GetRulesDataDto details)
        {
            List<MLWorkFlowSetRules> WorkflowDetails = null;
            ArrayList data = new ArrayList() { details.RuleName };
            HttpContext.Session.SetString("Rules", JsonConvert.SerializeObject(data));

            using (var objDL = DLWorkFlowRule.GetDLWorkFlowRule(details.accountId, SQLProvider))
            {
                WorkflowDetails = await objDL.GetAllRules(details.OffSet, details.FetchNext, details.RuleName);
            }

            return Json(WorkflowDetails);
        }

        [HttpPost]
        public async Task<IActionResult> ExportRules([FromBody] Rules_ExportRulesDto details)
        {
            System.Data.DataSet dataSet = new System.Data.DataSet("General");

            List<MLWorkFlowSetRules> RuleDetails = null;

            var RuleName = "";

            if (HttpContext.Session.GetString("Rules") != null)
            {
                ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("Rules"));
                RuleName = Convert.ToString(data[0]);
            }

            using (var objDL = DLWorkFlowRule.GetDLWorkFlowRule(details.accountId, SQLProvider))
            {
                RuleDetails = await objDL.GetAllRules(details.OffSet, details.FetchNext, RuleName);
            }

            string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(details.accountId, SQLProvider);
            var NewListData = RuleDetails.Select(x => new
            {
                x.TriggerHeading,
                x.TriggerStatus,
                ScheduledDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.TriggerCreateDate)).ToString()
            });

            System.Data.DataTable dtt = new System.Data.DataTable();
            dtt = NewListData.CopyToDataTable();
            dataSet.Tables.Add(dtt);

            string FileName = "Rules_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + details.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (details.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(dataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

            return Json(new { Status = true, MainPath });
        }

        [HttpPost]
        [Log]
        public async Task<JsonResult> DeleteRules([FromBody] Rules_DeleteRulesDto details)
        {
            using (var obj = DLWorkFlowRule.GetDLWorkFlowRule(details.AccountId, SQLProvider))
            {
                var result =await obj.Delete(details.RuleId);
                var getdata = JsonConvert.SerializeObject(result, Formatting.Indented);
                return Json(getdata);
            }
        }

        [Log]
        public async Task<JsonResult> UpdateRulesStatus([FromBody] Rules_UpdateRulesStatusDto details)
        {
            MLWorkFlowSetRules setRuledetails = new MLWorkFlowSetRules();
            setRuledetails.RuleId = details.RuleId;
            setRuledetails.TriggerStatus = details.Status;
            using (var obj = DLWorkFlowRule.GetDLWorkFlowRule(details.AccountId, SQLProvider))
            {
                return Json(await obj.ToogleStatus(setRuledetails));
            }
        }
    }
}
