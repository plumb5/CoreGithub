using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Journey.Dto;
using Plumb5.Controllers;
using Plumb5.Models;

namespace Plumb5.Areas.Journey.Controllers
{
    [Area("Journey")]
    public class CreateRuleController : BaseController
    {
        public CreateRuleController(IConfiguration _configuration) : base(_configuration)
        { }

        //
        // GET: /Journey/CreateRule/

        public IActionResult Index()
        {
            return View("CreateRule");
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> SaveBasicDetails([FromBody] CreateRule_SaveBasicDetailsDto commonDetails)
        {
            bool Status = false;
            string Message = "";
            WorkFlowSetRules? setRule = null;

            using (var objGetRuleDetais = DLWorkFlowRule.GetDLWorkFlowRule(commonDetails.AdsId, SQLProvider))
            {
                if (commonDetails.setRules.RuleId > 0)
                {
                    await objGetRuleDetais.Update(commonDetails.setRules);
                }
                else
                {
                    setRule = await objGetRuleDetais.GetDetails(commonDetails.setRules);

                    if (setRule == null)
                    {
                        commonDetails.setRules.RuleId = await objGetRuleDetais.Save(commonDetails.setRules);
                    }
                }
            }

            if (commonDetails.setRules.RuleId > 0)
            {
                Status = true;
                Message = "Created successfully";
            }
            else if (commonDetails.setRules.RuleId <= 0)
            {
                Status = false;
                Message = "With this name already rule exists";
            }

            return Json(new { Status = Status, Message = Message, RuleId = commonDetails.setRules.RuleId });
        }

        [HttpPost]
        public async Task<JsonResult> GetRuleDetails([FromBody] CreateRule_GetRuleDetailsDto commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            WorkFlowSetRules? setRule = new WorkFlowSetRules();

            using (var objDL = DLWorkFlowRule.GetDLWorkFlowRule(commonDetails.AdsId, SQLProvider))
            {
                setRule.RuleId = commonDetails.RuleId;
                setRule = await objDL.GetDetails(setRule);

                if (setRule != null && setRule.IsBelong > 0)
                {
                    GetGroupIdNames grpnames = new GetGroupIdNames(SQLProvider);
                    string grpreturnvalues = await grpnames.GetGroupNames(commonDetails.AdsId, user.UserId, setRule.BelongsToGroup);

                    if (!string.IsNullOrEmpty(grpreturnvalues))
                    {
                        if (grpreturnvalues.LastIndexOf("#") > 0)
                            setRule.BelongsToGroup = grpreturnvalues.Substring(0, grpreturnvalues.Length - 2);
                        else
                            setRule.BelongsToGroup = grpreturnvalues.ToString();
                    }
                }

                if (setRule != null)
                {
                    return Json(new { Status = true, triggerMailSms = setRule });
                }
                else
                {
                    return Json(new { Status = false, triggerMailSms = setRule });
                }
            }
        }
    }
}
