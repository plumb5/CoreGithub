using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.Blazor;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Journey.Dto;
using Plumb5.Areas.WebPush.Models;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Data;
using System.Globalization;
using System.Net;
using System.Text.RegularExpressions;

namespace Plumb5.Areas.Journey.Controllers
{
    [Area("Journey")]
    public class CreateWorkflowController : BaseController
    {
        public CreateWorkflowController(IConfiguration _configuration) : base(_configuration)
        { }

        private int Id = 0;
        //
        // GET: /Journey/CreateWorkflow/

        public async Task<ActionResult> Index()
        {
            return View("CreateWorkflow");
        }

        [HttpPost]
        [Log]
        public async Task<JsonResult> StoreBasicDetails([FromBody] CreateWorkflow_StoreBasicDetails commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            using (var obj = DLWorkFlow.GetDLWorkFlow(commonDetails.accountId, SQLProvider))
            {
                commonDetails.WorkFlowBasicDetails.UserName = user.UserName;
                if (commonDetails.WorkFlowBasicDetails.WorkFlowId > 0)
                {
                    await obj.Update(commonDetails.WorkFlowBasicDetails);
                }
                else { Id = await obj.Save(commonDetails.WorkFlowBasicDetails); }
            }
            return Json(Id);
        }

        [HttpPost]
        public async Task<ActionResult> GetMaxCountOfWorkflow([FromBody] CreateWorkflow_GetMaxCountOfWorkflow commonDetails)
        {
            using (var obj = DLWorkFlow.GetDLWorkFlow(commonDetails.accountId, SQLProvider))
            {
                P5GenralML.WorkFlow ObjMl = new P5GenralML.WorkFlow();
                int Count = await obj.GetMaxCount();

                var getdata = JsonConvert.SerializeObject(Count, Formatting.Indented);
                return Content(getdata.ToString());

            }
        }

        [HttpPost]
        public async Task<ActionResult> CheckWorkflowTitle([FromBody] CreateWorkflow_CheckWorkflowTitle commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            using (var obj = DLWorkFlow.GetDLWorkFlow(commonDetails.accountId, SQLProvider))
            {
                var ChkTitle = await obj.CheckWorkflowTitle(commonDetails.WorkFlowBasicDetails);

                return Content(ChkTitle.ToString());

            }
        }


        [HttpPost]
        public async Task<ActionResult> GetWorkflowByWorkflowId([FromBody] CreateWorkflow_GetWorkflowByWorkflowId commonDetails)
        {
            using (var obj = DLWorkFlow.GetDLWorkFlow(commonDetails.accountId, SQLProvider))
            {
                P5GenralML.WorkFlow ObjMl = new P5GenralML.WorkFlow();
                ObjMl.WorkFlowId = commonDetails.WorkflowId;
                var Count = await obj.GetDetails(ObjMl);
                Count.Flowchart = WebUtility.HtmlDecode(Count.Flowchart);
                Count.ArrayConfig = WebUtility.HtmlDecode(Count.ArrayConfig);
                var getdata = JsonConvert.SerializeObject(Count, Formatting.Indented);
                return Content(getdata.ToString());
            }
        }

        [HttpPost]
        public async Task<ActionResult> GetWorkFlowById([FromBody] CreateWorkflow_GetWorkFlowById commonDetails)
        {
            using (var obj = DLWorkFlow.GetDLWorkFlow(commonDetails.accountId, SQLProvider))
            {
                P5GenralML.WorkFlow ObjMl = new P5GenralML.WorkFlow();
                ObjMl.WorkFlowId = commonDetails.WorkflowId;
                var dsworkflow = await obj.GetDetails(ObjMl);
                dsworkflow.Flowchart = WebUtility.HtmlDecode(dsworkflow.Flowchart);
                dsworkflow.ArrayConfig = WebUtility.HtmlDecode(dsworkflow.ArrayConfig);
                var getdata = JsonConvert.SerializeObject(dsworkflow, Formatting.Indented);
                return Content(getdata.ToString());
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> UpdateWorkflowchart([FromBody] CreateWorkflow_UpdateWorkflowchart commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            using (var obj = DLWorkFlow.GetDLWorkFlow(commonDetails.accountId, SQLProvider))
            {
                commonDetails.WorkFlowBasicDetails.UserName = user.UserName;
                await obj.Update(commonDetails.WorkFlowBasicDetails);

            }
            return Json(0);
        }

        [HttpPost]
        public async Task<ActionResult> GetTemplateforEdit([FromBody] CreateWorkflow_GetTemplateforEdit commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            dynamic? DsResponces = "";
            if (commonDetails.NodeText.Contains("dateandtime"))
            {
                using (var obj = DLWorkFlowData.GetDLWorkFlowData(commonDetails.accountId, SQLProvider))
                {
                    DsResponces = await obj.GetDateandTime(commonDetails.ConfigureId, commonDetails.NodeText);
                }
            }
            if (commonDetails.NodeText.ToLower() == "sms")
            {
                using (var obj = DLWorkFlowSMS.GetDLWorkFlowSMS(commonDetails.accountId, SQLProvider))
                {
                    DsResponces = await obj.GetSmsDetails(commonDetails.ConfigureId);
                }
            }
            if (commonDetails.NodeText.ToLower() == "mail")
            {
                using (var obj = DLWorkFlowMail.GetDLWorkFlowMail(commonDetails.accountId, SQLProvider))
                {
                    DsResponces = await obj.GetMailDetails(commonDetails.ConfigureId);
                }
            }

            if (commonDetails.NodeText.ToLower() == "apppush")
            {
                using (var obj = DLWorkFlowMobile.GetDLWorkFlowMobile(commonDetails.accountId, SQLProvider))
                {
                    DsResponces = await obj.GetDetails(commonDetails.ConfigureId);
                }
            }

            if (commonDetails.NodeText.ToLower() == "webpush")
            {
                using (var obj = DLWorkFlowWebPush.GetDLWorkFlowWebPush(commonDetails.accountId, SQLProvider))
                {
                    DsResponces = await obj.GetDetails(commonDetails.ConfigureId);
                }
            }

            if (commonDetails.NodeText.ToLower() == "whatsapp")
            {
                using (var obj = DLWorkFlowWhatsApp.GetDLWorkFlowWhatsApp(commonDetails.accountId, SQLProvider))
                {
                    DsResponces = await obj.GetDetails(commonDetails.ConfigureId);
                }
            }

            if (commonDetails.NodeText.ToLower() == "segment")
            {
                using (var obj = DLWorkFlowData.GetDLWorkFlowData(commonDetails.accountId, SQLProvider))
                {
                    WorkFlowData ObjML = new WorkFlowData();
                    ObjML.WorkFlowId = commonDetails.ConfigureId;
                    DsResponces = await obj.GetDetails(ObjML);
                }
            }

            if (commonDetails.NodeText.ToLower() == "webhook")
            {
                using (var obj = DLWorkFlowWebHook.GetDLWorkFlowWebHook(commonDetails.accountId, SQLProvider))
                {
                    DsResponces = await obj.GetWebHookDetails(commonDetails.ConfigureId);
                }
            }

            var getdata = JsonConvert.SerializeObject(DsResponces, Formatting.Indented);
            return Content(getdata.ToString());
        }

        [HttpPost]
        public async Task<ActionResult> GetruleforEdit([FromBody] CreateWorkflow_GetruleforEdit commonDetails)
        {
            P5GenralML.WorkFlowData ObjMl = new P5GenralML.WorkFlowData();
            dynamic? DsResponces = "";
            using (var obj = DLWorkFlowData.GetDLWorkFlowData(commonDetails.accountId, SQLProvider))
            {
                ObjMl.WorkFlowId = commonDetails.workflowId;
                DsResponces = obj.GetruleforEdit(commonDetails.workflowId);
            }
            var getdata = JsonConvert.SerializeObject(DsResponces, Formatting.Indented);
            return Content(getdata.ToString());
        }


        [Log]
        [HttpPost]
        public async Task<JsonResult> UpdateDateTime([FromBody] CreateWorkflow_UpdateDateTime commonDetails)
        {
            using (var obj = DLWorkFlowData.GetDLWorkFlowData(commonDetails.accountId, SQLProvider))
            {
                await obj.UpdateDateandTime(commonDetails.DatetimeConfig);
            }
            return Json(0);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> UpdateAudience([FromBody] CreateWorkflow_UpdateAudience commonDetails)
        {
            using (var obj = DLWorkFlowData.GetDLWorkFlowData(commonDetails.accountId, SQLProvider))
            {
                await obj.UpdateGroupsIndividual(commonDetails.AudienceConfig);
            }
            return Json(0);
        }

        [HttpPost]
        public async Task<JsonResult> GetgroupsCount([FromBody] CreateWorkflow_GetgroupsCount commonDetails)
        {
            using var ObjGBl = DLWorkFlowGroup.GetDLWorkFlowGroup(commonDetails.accountId, SQLProvider);
            Id = await ObjGBl.GetTotalCount(commonDetails.GrpIds);
            return Json(Id);
        }


        [HttpPost]
        public async Task<ActionResult> chkbelongstogrp([FromBody] CreateWorkflow_chkbelongstogrp commonDetails)
        {
            using (var obj = DLWorkFlowData.GetDLWorkFlowData(commonDetails.accountId, SQLProvider))
            {
                P5GenralML.WorkFlowData ObjMl = new P5GenralML.WorkFlowData();
                ObjMl.WorkFlowId = commonDetails.WorkflowId;
                var Count = obj.GetDetails(ObjMl);
                var getdata = JsonConvert.SerializeObject(Count, Formatting.Indented);
                return Content(getdata.ToString());
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> SaveFlowchart([FromBody] CreateWorkflow_SaveFlowchart commonDetails)
        {
            DataSet dsWorkflowdata = new DataSet();
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            P5GenralML.WorkFlowData ObjMl = new P5GenralML.WorkFlowData();
            using var objDL = DLWorkFlowData.GetDLWorkFlowData(domainDetails.AdsId, SQLProvider);
            System.Xml.XmlDocument xd1 = new System.Xml.XmlDocument();
            string lcHtml = commonDetails.json.Replace("\"_id\" : , ", "\"_id\" : 0, ");
            xd1 = JsonConvert.DeserializeXmlNode("{\"root\":" + lcHtml + "}", "root");
            dsWorkflowdata.ReadXml(new System.Xml.XmlNodeReader(xd1));

            if (dsWorkflowdata.Tables[0].Rows.Count != 0)
            {
                for (var i = 0; i < dsWorkflowdata.Tables[0].Rows.Count; i++)
                {
                    ObjMl.WorkFlowId = int.Parse(dsWorkflowdata.Tables[0].Rows[i]["WorkFlowId"].ToString());
                    if (i == 0)
                    { await objDL.Delete(ObjMl.WorkFlowId); }
                    string ChannelName = dsWorkflowdata.Tables[0].Rows[i]["Channel"].ToString();
                    ObjMl.Channel = dsWorkflowdata.Tables[0].Rows[i]["Channel"].ToString();
                    ChannelName = ChannelName.Split(new char[] { '_', '_' })[1];
                    ObjMl.ChannelName = ChannelName.First().ToString().ToUpper() + ChannelName.Substring(1);
                    ObjMl.ConfigName = dsWorkflowdata.Tables[0].Rows[i]["ConfigName"].ToString();
                    ObjMl.Segment = dsWorkflowdata.Tables[0].Rows[i]["Segment"].ToString();
                    ObjMl.SegmentId = dsWorkflowdata.Tables[0].Rows[i]["SegmentId"].ToString();
                    ObjMl.IsDynamicGroup = Convert.ToBoolean(Convert.ToInt16(dsWorkflowdata.Tables[0].Rows[i]["IsDynamicGroup"]));
                    if (dsWorkflowdata.Tables[0].Rows[i]["SegmentName"].ToString().Contains("group"))
                    {
                        ObjMl.IsGroupOrIndividual = false;
                        ObjMl.IsBelongToGroup = true;
                        ObjMl.SegmentName = dsWorkflowdata.Tables[0].Rows[i]["SegmentName"].ToString();
                    }

                    ObjMl.ConfigId = int.Parse(dsWorkflowdata.Tables[0].Rows[i]["ConfigId"].ToString());
                    ObjMl.RulesName = dsWorkflowdata.Tables[0].Rows[i]["RulestName"].ToString();
                    ObjMl.Rules = dsWorkflowdata.Tables[0].Rows[i]["Rules"].ToString();
                    ObjMl.RulesId = int.Parse(dsWorkflowdata.Tables[0].Rows[i]["RulesId"].ToString());
                    ObjMl.PreChannel = dsWorkflowdata.Tables[0].Rows[i]["PreChannel"].ToString();
                    ObjMl.PreConfigId = int.Parse(dsWorkflowdata.Tables[0].Rows[i]["PreConfigId"].ToString());
                    ObjMl.Condition = dsWorkflowdata.Tables[0].Rows[i]["Condition"].ToString();
                    ObjMl.IsRuleSatisfy = Convert.ToBoolean(Convert.ToInt16(dsWorkflowdata.Tables[0].Rows[i]["RuleType"]));
                    ObjMl.Time = 0;
                    ObjMl.DateCondition = 0;
                    if (int.Parse(dsWorkflowdata.Tables[0].Rows[i]["DateCondition"].ToString()) != 0 && int.Parse(dsWorkflowdata.Tables[0].Rows[i]["DateCondition"].ToString()) < 8)
                    {
                        ObjMl.Date = dsWorkflowdata.Tables[0].Rows[i]["Date"].ToString();
                        string[] GetDatevalue = Regex.Split(dsWorkflowdata.Tables[0].Rows[i]["DateValue"].ToString(), "~");

                        var dt = DateTime.ParseExact(GetDatevalue[0].ToString(), "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                        var dto = DateTime.ParseExact(GetDatevalue[1].ToString(), "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                        ObjMl.TimeType = "B/W " + dt.ToString("dd MMM") + " to " + dto.ToString("dd MMM");

                        ObjMl.DateValue = dt;
                        ObjMl.DateValueTo = dto;
                        ObjMl.DateCondition = int.Parse(dsWorkflowdata.Tables[0].Rows[i]["DateCondition"].ToString());

                    }
                    else if (int.Parse(dsWorkflowdata.Tables[0].Rows[i]["DateCondition"].ToString()) == 8)
                    {
                        ObjMl.Date = dsWorkflowdata.Tables[0].Rows[i]["Date"].ToString();
                        string[] GetDatevalue = Regex.Split(dsWorkflowdata.Tables[0].Rows[i]["DateValue"].ToString(), "~");
                        ObjMl.TimeType = "B/W " + GetDatevalue[0].ToString() + " to " + GetDatevalue[1].ToString();

                        ObjMl.DaysOfWeek = dsWorkflowdata.Tables[0].Rows[i]["DaysOfWeek"].ToString();
                        ObjMl.SlotTime = GetDatevalue[0].ToString();
                        ObjMl.SlotTime1 = GetDatevalue[1].ToString();
                        ObjMl.DateCondition = int.Parse(dsWorkflowdata.Tables[0].Rows[i]["DateCondition"].ToString());

                    }
                    else
                    {
                        ObjMl.Date = dsWorkflowdata.Tables[0].Rows[i]["Date"].ToString();
                        if (dsWorkflowdata.Tables[0].Rows[i]["DateValue"].ToString().Contains("Minutes"))
                        {
                            ObjMl.Time = int.Parse(dsWorkflowdata.Tables[0].Rows[i]["DateValue"].ToString().Replace("Minutes", ""));
                            ObjMl.TimeType = dsWorkflowdata.Tables[0].Rows[i]["DateValue"].ToString();
                        }
                        else if (dsWorkflowdata.Tables[0].Rows[i]["DateValue"].ToString().Contains("Hours"))
                        {
                            ObjMl.Time = int.Parse(dsWorkflowdata.Tables[0].Rows[i]["DateValue"].ToString().Replace("Hours", "")) * 60;
                            ObjMl.TimeType = dsWorkflowdata.Tables[0].Rows[i]["DateValue"].ToString();
                        }
                        else if (dsWorkflowdata.Tables[0].Rows[i]["DateValue"].ToString().Contains("Days"))
                        {
                            int GetHours = int.Parse(dsWorkflowdata.Tables[0].Rows[i]["DateValue"].ToString().Replace("Days", "")) * 24;
                            ObjMl.TimeType = dsWorkflowdata.Tables[0].Rows[i]["DateValue"].ToString();
                            ObjMl.Time = GetHours * 60;
                        }
                    }
                    await objDL.Save(ObjMl);
                }
            }
            return Json(0);
        }

        [HttpPost]
        public async Task<JsonResult> GetWebAppPushUsers([FromBody] CreateWorkflow_GetWebAppPushUsers commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            string ApiUrl = "";
            switch (commonDetails.Browser.ToLower())
            {
                case "web":
                    ApiUrl = "" + "GetLeadNotificationUsers?Browser=Browser&AccountId=" + commonDetails.accountId + "";
                    break;
                case "app":
                    ApiUrl = "" + "GetLeadNotificationUsers?Browser=Mobile&AccountId=" + commonDetails.accountId + "";
                    break;

            }
            string Response = "";
            if (!string.IsNullOrEmpty(ApiUrl))
            {
                try
                {
                    WebRequest request = HttpWebRequest.Create(ApiUrl);
                    WebResponse response = await request.GetResponseAsync();
                    StreamReader reader = new StreamReader(response.GetResponseStream());
                    Response = reader.ReadToEnd(); // it takes the response from your url. now you can use as your need                    
                }
                catch
                {
                    //
                }
            }
            return Json(Response);
        }


        //added new...
        [HttpPost]
        public async Task<ActionResult> GetWrokflowNodes([FromBody] CreateWorkflow_GetWrokflowNodes commonDetails)
        {
            using (var obj = DLWorkFlowData.GetDLWorkFlowData(commonDetails.accountId, SQLProvider))
            {
                DataSet dsWorkflowdata = new DataSet();
                P5GenralML.WorkFlow ObjMl = new P5GenralML.WorkFlow();
                P5GenralML.WorkFlowData ObjDMl = new WorkFlowData();

                List<WorkFlowData> result = new List<WorkFlowData>();
                result = (await obj.GetConfigDetail(commonDetails.WorkflowId)).ToList();
                for (var i = 0; i < result.Count; i++)
                {
                    int TitleId = 0;
                    if (result[i].Channel.Contains("rule"))
                    {
                        result[i].TitleId = Int32.Parse(result[i].SegmentId);
                    }
                    if (result[i].Channel.Contains("goal"))
                    {
                        result[i].TitleId = Int32.Parse(result[i].SegmentId);
                    }
                    if ((result[i].Channel.Contains("segment") == false) && (result[i].Channel.Contains("dateandtime") == false))
                    {
                        ObjDMl.ConfigId = Int32.Parse(result[i].SegmentId);
                        if (result[i].Channel.Contains("mail"))
                        {
                            TitleId = await obj.GetTempId("GetMailTempId", ObjDMl);
                            result[i].TitleId = TitleId;
                        }
                        if (result[i].Channel.Contains("sms"))
                        {
                            TitleId = await obj.GetTempId("GetSmsTempId", ObjDMl);
                            result[i].TitleId = TitleId;
                        }

                        if (result[i].Channel.Contains("webpush"))
                        {
                            TitleId = await obj.GetTempId("GetwebpushTempId", ObjDMl);
                            result[i].TitleId = TitleId;
                        }

                        if (result[i].Channel.Contains("apppush"))
                        {
                            TitleId = await obj.GetTempId("GetapppushTempId", ObjDMl);
                            result[i].TitleId = TitleId;
                        }

                    }
                }

                var getdata = JsonConvert.SerializeObject(result, Formatting.Indented);
                return Content(getdata.ToString());

            }
        }

        [HttpPost]
        public async Task<ActionResult> GetWebPushTemplateList([FromBody] CreateWorkflow_GetWebPushTemplateList commonDetails)
        {
            WebPushTemplate webpushTemplate = new WebPushTemplate() { Id = 0, CampaignId = 0, TemplateName = null };

            WebPushTemplateDetails webpushTemplateDetails = new WebPushTemplateDetails(commonDetails.accountId, SQLProvider);
            var Value = await webpushTemplateDetails.GetWebPushTemplateDetails(webpushTemplate, 0, 1000);

            var getdata = JsonConvert.SerializeObject(Value, Formatting.Indented);
            return Content(getdata.ToString());
        }

        [HttpPost]
        public async Task<ActionResult> GetAppPushTemplateList([FromBody] CreateWorkflow_GetWebPushTemplateList commonDetails)
        {
            MobilePushTemplate apppushTemplate = new MobilePushTemplate() { Id = 0, CampaignId = 0, TemplateName = null };

            var apppushTemplateDetails = DLMobilePushTemplate.GetDLMobilePushTemplate(commonDetails.accountId, SQLProvider);
            var Value = await apppushTemplateDetails.GetAllTemplates(apppushTemplate, 0, 1000);

            var getdata = JsonConvert.SerializeObject(Value, Formatting.Indented);
            return Content(getdata.ToString());
        }
    }
}
