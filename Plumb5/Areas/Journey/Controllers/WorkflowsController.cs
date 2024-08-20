using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.Blazor;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Journey.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;
using System.Globalization;
using Plumb5.Areas.Journey.Models;

namespace Plumb5.Areas.Journey.Controllers
{
    [Area("Journey")]
    public class WorkflowsController : BaseController
    {
        public WorkflowsController(IConfiguration _configuration) : base(_configuration)
        { }
        public IActionResult Index()
        {
            return View("Workflows");
        }

        public async Task<JsonResult> GetMaxCount([FromBody] Workflow_GetMaxCountDto details)
        {
            int returnVal;
            using (var objDL = DLWorkFlow.GetDLWorkFlow(details.accountId, SQLProvider))
            {
                returnVal = await objDL.GetMaxCount(details.WorkflowName);
            }
            return Json(new
            {
                returnVal
            });
        }

        public async Task<JsonResult> GetWorkflowData([FromBody] Workflow_GetWorkflowDataDto details)
        {
            List<WorkFlow> WorkflowDetails = null;
            ArrayList data = new ArrayList() { details.WorkflowName };
            HttpContext.Session.SetString("Workflow", JsonConvert.SerializeObject(data));

            using (var objDL = DLWorkFlow.GetDLWorkFlow(details.accountId, SQLProvider))
            {
                WorkflowDetails = await objDL.GetListDetails(details.OffSet, details.FetchNext, details.WorkflowName);
            }

            return Json(WorkflowDetails);
        }

        [HttpPost]
        public async Task<IActionResult> ExportWorkflow([FromBody] Workflow_ExportWorkflowDto details)
        {
            System.Data.DataSet dataSet = new System.Data.DataSet("General");

            List<WorkFlow> WorkflowDetails = null;

            var WorkflowName = "";

            if (HttpContext.Session.GetString("Workflow") != null)
            {
                ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("Workflow"));
                WorkflowName = Convert.ToString(data[0]);
            }

            using (var objDL = DLWorkFlow.GetDLWorkFlow(details.accountId, SQLProvider))
            {
                WorkflowDetails = await objDL.GetListDetails(details.OffSet, details.FetchNext, WorkflowName);
            }
            string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(details.accountId, SQLProvider);
            var NewListData = WorkflowDetails.Select(x => new
            {
                x.Title,
                x.Status,
                CreatedDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.CreatedDate)).ToString()
            });

            System.Data.DataTable dtt = new System.Data.DataTable();
            dtt = NewListData.CopyToDataTable();
            dataSet.Tables.Add(dtt);

            string FileName = "WorkflowDetails_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + details.FileType;
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
        public async Task<JsonResult> DeleteWorkflow([FromBody] Workflow_DeleteWorkflowDto details)
        {

            using (var obj = DLWorkFlow.GetDLWorkFlow(details.AccountId, SQLProvider))
            {
                P5GenralML.WorkFlow ObjMl = new P5GenralML.WorkFlow();
                var result =await obj.Delete(details.WorkflowId);


                var getdata = JsonConvert.SerializeObject(result, Formatting.Indented);
                return Json(result);
            }
        }

        [HttpPost]
        [Log]
        public async Task<IActionResult> CopyOfWorkFlow([FromBody] Workflow_CopyOfWorkFlowDto details)
        {
            try
            {
                DomainInfo? _accountInfo = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
                LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

                using (var obj = DLWorkFlow.GetDLWorkFlow(details.AccountId, SQLProvider))
                {
                    System.Data.DataSet ArrayConfigdata = new System.Data.DataSet();
                    dynamic DsResponces;
                    //string NewArrayConfig = "";
                    P5GenralML.WorkFlow ObjMl = new P5GenralML.WorkFlow();
                    ObjMl.WorkFlowId = details.WorkflowId;
                    var Count = await obj.GetDetails(ObjMl);
                    int WorkflowmaxCount = details.MaxCount + 1;
                    ObjMl.Title = Count.Title + WorkflowmaxCount;
                    ObjMl.Status = 2;
                    ObjMl.Flowchart = Count.Flowchart;

                    ObjMl.UserName = user.UserName;
                    ObjMl.IsStarted = false;
                    var CopyChannel = new CopyChannel { };


                    if (Count.Status != 2)
                    {
                        List<CopyChannel> Copydetails = new List<CopyChannel>();
                        System.Xml.XmlDocument xd1 = new System.Xml.XmlDocument();
                        string lcHtml = Count.ArrayConfig.Replace("\"_id\" : , ", "\"_id\" : 0, ");
                        xd1 = JsonConvert.DeserializeXmlNode("{\"root\":" + lcHtml + "}", "root");
                        ArrayConfigdata.ReadXml(new System.Xml.XmlNodeReader(xd1));
                        if (ArrayConfigdata.Tables[0].Rows.Count != 0)
                        {
                            for (var i = 0; i < ArrayConfigdata.Tables[0].Rows.Count; i++)
                            {
                                int NewConfigId = 0;
                                if (ArrayConfigdata.Tables[0].Rows[i]["Channel"].ToString().Contains("segment"))
                                {
                                    Copydetails.Add(new CopyChannel { Channel = ArrayConfigdata.Tables[0].Rows[i]["Channel"].ToString(), Value = ArrayConfigdata.Tables[0].Rows[i]["Value"].ToString(), Title = ArrayConfigdata.Tables[0].Rows[i]["Title"].ToString() });
                                }
                                if (ArrayConfigdata.Tables[0].Rows[i]["Channel"].ToString().Contains("rule"))
                                {
                                    Copydetails.Add(new CopyChannel { Channel = ArrayConfigdata.Tables[0].Rows[i]["Channel"].ToString(), Value = ArrayConfigdata.Tables[0].Rows[i]["Value"].ToString(), Title = ArrayConfigdata.Tables[0].Rows[i]["Title"].ToString() });
                                }
                                if (ArrayConfigdata.Tables[0].Rows[i]["Channel"].ToString().Contains("dateandtime"))
                                {
                                    Copydetails.Add(new CopyChannel { Channel = ArrayConfigdata.Tables[0].Rows[i]["Channel"].ToString(), Value = ArrayConfigdata.Tables[0].Rows[i]["Value"].ToString(), Title = ArrayConfigdata.Tables[0].Rows[i]["Title"].ToString() });
                                }
                                if (ArrayConfigdata.Tables[0].Rows[i]["Channel"].ToString().Contains("goal"))
                                {
                                    Copydetails.Add(new CopyChannel { Channel = ArrayConfigdata.Tables[0].Rows[i]["Channel"].ToString(), Value = ArrayConfigdata.Tables[0].Rows[i]["Value"].ToString(), Title = ArrayConfigdata.Tables[0].Rows[i]["Title"].ToString() });
                                }
                                if (ArrayConfigdata.Tables[0].Rows[i]["Channel"].ToString().Contains("mail"))
                                {
                                    using (var ObjMail = DLWorkFlowMail.GetDLWorkFlowMail(details.AccountId, SQLProvider))
                                    {
                                        DsResponces = ObjMail.GetMailDetails(Convert.ToInt16(ArrayConfigdata.Tables[0].Rows[i]["Value"]));
                                        P5GenralML.WorkFlowMail ObjMailMl = new WorkFlowMail();
                                        ObjMailMl.MailTemplateId = DsResponces.MailTemplateId;
                                        ObjMailMl.MailSubject = DsResponces.MailSubject;
                                        ObjMailMl.FromEmailId = DsResponces.FromEmailId;
                                        ObjMailMl.FromName = DsResponces.FromName;
                                        ObjMailMl.ReplyToEmailId = DsResponces.ReplyToEmailId;
                                        ObjMailMl.Subscribe = DsResponces.Subscribe;
                                        ObjMailMl.IsPromotionalOrTransactionalType = DsResponces.IsPromotionalOrTransactionalType;
                                        NewConfigId = await ObjMail.Save(ObjMailMl);
                                        Copydetails.Add(new CopyChannel { Channel = ArrayConfigdata.Tables[0].Rows[i]["Channel"].ToString(), Value = NewConfigId.ToString(), Title = ArrayConfigdata.Tables[0].Rows[i]["Title"].ToString() });

                                    }
                                }
                                if (ArrayConfigdata.Tables[0].Rows[i]["Channel"].ToString().Contains("sms"))
                                {
                                    using (var ObjSms = DLWorkFlowSMS.GetDLWorkFlowSMS(details.AccountId, SQLProvider))
                                    {
                                        DsResponces = ObjSms.GetSmsDetails(Convert.ToInt16(ArrayConfigdata.Tables[0].Rows[i]["Value"]));
                                        P5GenralML.WorkFlowSMS ObjSmsMl = new WorkFlowSMS();
                                        ObjSmsMl.IsPromotionalOrTransactionalType = DsResponces.IsPromotionalOrTransactionalType;
                                        ObjSmsMl.SmsTemplateId = DsResponces.SmsTemplateId;
                                        NewConfigId = await ObjSms.Save(ObjSmsMl);
                                        Copydetails.Add(new CopyChannel { Channel = ArrayConfigdata.Tables[0].Rows[i]["Channel"].ToString(), Value = NewConfigId.ToString(), Title = ArrayConfigdata.Tables[0].Rows[i]["Title"].ToString() });
                                    }
                                }
                                if (ArrayConfigdata.Tables[0].Rows[i]["Channel"].ToString().Contains("webpush"))
                                {
                                    using (var ObjWebPush = DLWorkFlowWebPush.GetDLWorkFlowWebPush(details.AccountId, SQLProvider))
                                    {
                                        DsResponces = ObjWebPush.GetDetails(Convert.ToInt16(ArrayConfigdata.Tables[0].Rows[i]["Value"]));
                                        P5GenralML.MLWorkFlowWebPush ObjWebPushMl = new MLWorkFlowWebPush();
                                        ObjWebPushMl.WebPushTemplateId = DsResponces.CampaignId;
                                        NewConfigId = await ObjWebPush.Save(ObjWebPushMl);
                                        Copydetails.Add(new CopyChannel { Channel = ArrayConfigdata.Tables[0].Rows[i]["Channel"].ToString(), Value = NewConfigId.ToString(), Title = ArrayConfigdata.Tables[0].Rows[i]["Title"].ToString() });

                                    }
                                }
                                if (ArrayConfigdata.Tables[0].Rows[i]["Channel"].ToString().Contains("apppush"))
                                {
                                    using (var Objapppush = DLWorkFlowMobile.GetDLWorkFlowMobile(details.AccountId, SQLProvider))
                                    {
                                        DsResponces = Objapppush.GetDetails(Convert.ToInt16(ArrayConfigdata.Tables[0].Rows[i]["Value"]));
                                        P5GenralML.MLWorkFlowMobile ObjapppushMl = new MLWorkFlowMobile();
                                        ObjapppushMl.MobilePushTemplateId = DsResponces.MobilePushTemplateId;
                                        NewConfigId = await Objapppush.Save(ObjapppushMl);
                                        Copydetails.Add(new CopyChannel { Channel = ArrayConfigdata.Tables[0].Rows[i]["Channel"].ToString(), Value = NewConfigId.ToString(), Title = ArrayConfigdata.Tables[0].Rows[i]["Title"].ToString() });

                                    }
                                }

                            }
                        }

                        ObjMl.ArrayConfig = JsonConvert.SerializeObject(Copydetails);
                        int CopyOfNewworkflowId = await obj.Save(ObjMl);
                        ObjMl.WorkFlowId = CopyOfNewworkflowId;
                        ObjMl.Title = "";
                        var Getlatestdata = obj.GetDetails(ObjMl);
                        var getdata = JsonConvert.SerializeObject(Getlatestdata, Formatting.Indented);
                        return Content(getdata.ToString());
                    }
                    else
                    {
                        int CopyOfNewworkflowId = await obj.Save(ObjMl);
                        ObjMl.WorkFlowId = CopyOfNewworkflowId;
                        ObjMl.Title = "";
                        var Getlatestdata = obj.GetDetails(ObjMl);
                        var getdata = JsonConvert.SerializeObject(Getlatestdata, Formatting.Indented);
                        return Content(getdata.ToString());
                    }

                }

            }
            catch { return null; }
        }

        [HttpPost]
        [Log]
        public async Task<JsonResult> CreateDuplicateWorkFlow([FromBody] Workflow_CreateDuplicateWorkFlowDto details)
        {
            string ErrorMessage = string.Empty;
            bool Result = false;
            try
            {
                LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

                P5GenralML.WorkFlow workFlow = new P5GenralML.WorkFlow() { WorkFlowId = details.WorkflowId };
                using (var objBL = DLWorkFlow.GetDLWorkFlow(details.AccountId, SQLProvider))
                    workFlow = await objBL.GetDetails(workFlow);

                if (workFlow != null)
                {
                    List<WorkFlowData> WorkFlowDataList = null;
                    using (var objdataBL = DLWorkFlowData.GetDLWorkFlowData(details.AccountId, SQLProvider))
                        WorkFlowDataList = (await objdataBL.GetDetailsList(workFlow.WorkFlowId)).ToList();

                    if (WorkFlowDataList != null && WorkFlowDataList.Count > 0)
                    {
                        WorkFlowChart workFlowChartNodes = JsonConvert.DeserializeObject<WorkFlowChart>(workFlow.Flowchart);
                        List<ArragConfigData> arragConfigData = JsonConvert.DeserializeObject<List<ArragConfigData>>(workFlow.ArrayConfig);

                        if (workFlowChartNodes != null && workFlowChartNodes.nodes != null && workFlowChartNodes.nodes.Count > 0 && workFlowChartNodes.connections != null && workFlowChartNodes.connections.Count > 0)
                        {
                            Random rnd = new Random();
                            for (int i = 0; i < workFlowChartNodes.nodes.Count; i++)
                            {
                                try
                                {
                                    var uniqueid = rnd.Next();
                                    var blockid = workFlowChartNodes.nodes[i].blockId;
                                    var blockids = workFlowChartNodes.nodes[i].blockId.Split('_');

                                    for (int j = 0; j < workFlowChartNodes.connections.Count; j++)
                                    {
                                        if (blockid == workFlowChartNodes.connections[j].SourceId)
                                        {
                                            workFlowChartNodes.connections[j].SourceId = $"{blockids[0]}_{blockids[1]}_{uniqueid}";
                                        }

                                        if (blockid == workFlowChartNodes.connections[j].TargetId)
                                        {
                                            workFlowChartNodes.connections[j].TargetId = $"{blockids[0]}_{blockids[1]}_{uniqueid}";
                                        }
                                    }

                                    for (int l = 0; l < arragConfigData.Count; l++)
                                    {
                                        if (blockid == arragConfigData[l].Channel)
                                        {
                                            arragConfigData[l].Channel = $"{blockids[0]}_{blockids[1]}_{uniqueid}";
                                        }

                                        if (blockid.ToLower().Contains("mail") && arragConfigData[l].Channel.ToLower().Contains("mail"))
                                        {
                                            WorkFlowMail workFlowMail = null;
                                            using (var ObjMail = DLWorkFlowMail.GetDLWorkFlowMail(details.AccountId, SQLProvider))
                                            {
                                                workFlowMail = await ObjMail.GetMailDetails(Convert.ToInt32(arragConfigData[l].Value));
                                                if (workFlowMail != null)
                                                {
                                                    workFlowMail.ConfigureMailId = 0;
                                                    workFlowMail.ConfigureMailId = await ObjMail.Save(workFlowMail);
                                                    if (workFlowMail.ConfigureMailId > 0)
                                                        arragConfigData[l].Value = Convert.ToString(workFlowMail.ConfigureMailId);
                                                }
                                            }
                                        }
                                        else if (blockid.ToLower().Contains("sms") && arragConfigData[l].Channel.ToLower().Contains("sms"))
                                        {
                                            WorkFlowSMS workFlowSms = null;
                                            using (var Objsms = DLWorkFlowSMS.GetDLWorkFlowSMS(details.AccountId, SQLProvider))
                                            {
                                                workFlowSms = await Objsms.GetSmsDetails(Convert.ToInt32(arragConfigData[l].Value));
                                                if (workFlowSms != null)
                                                {
                                                    workFlowSms.ConfigureSmsId = 0;
                                                    workFlowSms.ConfigureSmsId = await Objsms.Save(workFlowSms);
                                                    if (workFlowSms.ConfigureSmsId > 0)
                                                        arragConfigData[l].Value = Convert.ToString(workFlowSms.ConfigureSmsId);
                                                }
                                            }
                                        }
                                        else if (blockid.ToLower().Contains("webpush") && arragConfigData[l].Channel.ToLower().Contains("webpush"))
                                        {
                                            WorkFlowWebPush workFlowWeb = null;
                                            using (var Objweb = DLWorkFlowWebPush.GetDLWorkFlowWebPush(details.AccountId, SQLProvider))
                                            {
                                                workFlowWeb = await Objweb.GetWebPushDetails(Convert.ToInt32(arragConfigData[l].Value));
                                                if (workFlowWeb != null)
                                                {
                                                    MLWorkFlowWebPush mLWorkFlowWebPush = new MLWorkFlowWebPush { WebPushTemplateId = workFlowWeb.WebPushTemplateId };
                                                    workFlowWeb.ConfigureWebPushId = await Objweb.Save(mLWorkFlowWebPush);
                                                    if (workFlowWeb.ConfigureWebPushId > 0)
                                                        arragConfigData[l].Value = Convert.ToString(workFlowWeb.ConfigureWebPushId);
                                                }
                                            }
                                        }
                                        else if (blockid.ToLower().Contains("apppush") && arragConfigData[l].Channel.ToLower().Contains("apppush"))
                                        {
                                            WorkFlowMobile workFlowMobile = null;
                                            using (var ObjMobile = DLWorkFlowMobile.GetDLWorkFlowMobile(details.AccountId, SQLProvider))
                                            {
                                                //workFlowMobile = await ObjMobile.GetWorkFlowMobileDetails(Convert.ToInt32(arragConfigData[l].Value));
                                                if (workFlowMobile != null)
                                                {
                                                    MLWorkFlowMobile mLWorkFlowMobile = new MLWorkFlowMobile { MobilePushTemplateId = workFlowMobile.MobilePushTemplateId };
                                                    workFlowMobile.ConfigureMobileId = await ObjMobile.Save(mLWorkFlowMobile);
                                                    if (workFlowMobile.ConfigureMobileId > 0)
                                                        arragConfigData[l].Value = Convert.ToString(workFlowMobile.ConfigureMobileId);
                                                }
                                            }
                                        }
                                        else if (blockid.ToLower().Contains("whatsapp") && arragConfigData[l].Channel.ToLower().Contains("whatsapp"))
                                        {
                                            WorkFlowWhatsApp workFlowWhatsapp = null;
                                            using (var Objsms = DLWorkFlowWhatsApp.GetDLWorkFlowWhatsApp(details.AccountId, SQLProvider))
                                            {
                                                workFlowWhatsapp = await Objsms.GetWhatsAppDetails(Convert.ToInt32(arragConfigData[l].Value));
                                                if (workFlowWhatsapp != null)
                                                {
                                                    MLWorkFlowWhatsApp mlworkFlowWhatsapp = new MLWorkFlowWhatsApp { WhatsAppTemplateId = workFlowWhatsapp.WhatsAppTemplateId, TemplateName = workFlowWhatsapp.TemplateName };
                                                    workFlowWhatsapp.ConfigureWhatsAppId = await Objsms.Save(mlworkFlowWhatsapp);
                                                    if (workFlowWhatsapp.ConfigureWhatsAppId > 0)
                                                        arragConfigData[l].Value = Convert.ToString(workFlowWhatsapp.ConfigureWhatsAppId);
                                                }
                                            }
                                        }
                                        else if (blockid.ToLower().Contains("webhook") && arragConfigData[l].Channel.ToLower().Contains("webhook"))
                                        {
                                            WorkFlowWebHook workFlowHook = null;
                                            using (var ObjHook = DLWorkFlowWebHook.GetDLWorkFlowWebHook(details.AccountId, SQLProvider))
                                            {
                                                workFlowHook = await ObjHook.GetWebHookDetails(Convert.ToInt32(arragConfigData[l].Value));
                                                if (workFlowHook != null)
                                                {
                                                    workFlowHook.ConfigureWebHookId = 0;
                                                    workFlowHook.ConfigureWebHookId = await ObjHook.Save(workFlowHook);
                                                    if (workFlowHook.ConfigureWebHookId > 0)
                                                        arragConfigData[l].Value = Convert.ToString(workFlowHook.ConfigureWebHookId);
                                                }
                                            }
                                        }
                                    }

                                    for (int k = 0; k < WorkFlowDataList.Count; k++)
                                    {
                                        if (blockid == WorkFlowDataList[k].Channel)
                                        {
                                            WorkFlowDataList[k].Channel = $"{blockids[0]}_{blockids[1]}_{uniqueid}";
                                        }

                                        if (blockid == WorkFlowDataList[k].Segment)
                                        {
                                            WorkFlowDataList[k].Channel = $"{blockids[0]}_{blockids[1]}_{uniqueid}";
                                        }
                                    }

                                    workFlowChartNodes.nodes[i].blockId = $"{blockids[0]}_{blockids[1]}_{uniqueid}";
                                }
                                catch (Exception ex)
                                {
                                    ErrorMessage = ex.Message;
                                    Result = false;
                                    break;
                                }
                            }

                            workFlow.Flowchart = JsonConvert.SerializeObject(workFlowChartNodes);
                            workFlow.ArrayConfig = JsonConvert.SerializeObject(arragConfigData);
                            workFlow.WorkFlowId = 0;
                            workFlow.Status = 2;
                            workFlow.IsStarted = false;
                            workFlow.Title = $"{workFlow.Title}_duplicate_{Helper.GenerateUniqueNumber()}";
                            workFlow.UserName = user.UserName;
                            using (var objBL = DLWorkFlow.GetDLWorkFlow(details.AccountId, SQLProvider))
                            {
                                int Workflowid = await objBL.Save(workFlow);

                                //if (Workflowid > 0)
                                //{
                                //    if (WorkFlowDataList != null && WorkFlowDataList.Count > 0)
                                //    {
                                //        for (int h = 0; h < WorkFlowDataList.Count; h++)
                                //        {
                                //            WorkFlowDataList[h].WorkFlowDataId = 0;
                                //            using (BLWorkFlowData objdataBL = new BLWorkFlowData(AccountId))
                                //                objdataBL.Save(WorkFlowDataList[h]);
                                //        }
                                //    }
                                //}
                            }

                            ErrorMessage = "Created sucessfully";
                            Result = true;
                        }
                        else
                        {
                            ErrorMessage = "No details, to copy";
                            Result = false;
                        }
                    }
                    else
                    {
                        WorkFlowChart workFlowChartNodes = JsonConvert.DeserializeObject<WorkFlowChart>(workFlow.Flowchart);
                        List<ArragConfigData> arragConfigData = JsonConvert.DeserializeObject<List<ArragConfigData>>(workFlow.ArrayConfig);

                        if (workFlowChartNodes != null && workFlowChartNodes.nodes != null && workFlowChartNodes.nodes.Count > 0 && workFlowChartNodes.connections != null && workFlowChartNodes.connections.Count > 0)
                        {
                            for (int i = 0; i < workFlowChartNodes.nodes.Count; i++)
                            {
                                try
                                {
                                    var uniqueid = Helper.GenerateUniqueNumber();
                                    var blockid = workFlowChartNodes.nodes[i].blockId;
                                    var blockids = workFlowChartNodes.nodes[i].blockId.Split('_');

                                    for (int j = 0; j < workFlowChartNodes.connections.Count; j++)
                                    {
                                        if (blockid == workFlowChartNodes.connections[j].SourceId)
                                        {
                                            workFlowChartNodes.connections[j].SourceId = $"{blockids[0]}_{blockids[1]}_{uniqueid}";
                                        }

                                        if (blockid == workFlowChartNodes.connections[j].TargetId)
                                        {
                                            workFlowChartNodes.connections[j].TargetId = $"{blockids[0]}_{blockids[1]}_{uniqueid}";
                                        }
                                    }

                                    for (int l = 0; l < arragConfigData.Count; l++)
                                    {
                                        if (blockid == arragConfigData[l].Channel)
                                        {
                                            arragConfigData[l].Channel = $"{blockids[0]}_{blockids[1]}_{uniqueid}";
                                        }

                                        if (blockid.ToLower().Contains("mail") && arragConfigData[l].Channel.ToLower().Contains("mail"))
                                        {
                                            WorkFlowMail workFlowMail = null;
                                            using (var ObjMail = DLWorkFlowMail.GetDLWorkFlowMail(details.AccountId, SQLProvider))
                                            {
                                                workFlowMail = await ObjMail.GetMailDetails(Convert.ToInt32(arragConfigData[l].Value));
                                                if (workFlowMail != null)
                                                {
                                                    workFlowMail.ConfigureMailId = 0;
                                                    workFlowMail.ConfigureMailId = await ObjMail.Save(workFlowMail);
                                                    if (workFlowMail.ConfigureMailId > 0)
                                                        arragConfigData[l].Value = Convert.ToString(workFlowMail.ConfigureMailId);
                                                }
                                            }
                                        }
                                        else if (blockid.ToLower().Contains("sms") && arragConfigData[l].Channel.ToLower().Contains("sms"))
                                        {
                                            WorkFlowSMS workFlowSms = null;
                                            using (var Objsms = DLWorkFlowSMS.GetDLWorkFlowSMS(details.AccountId, SQLProvider))
                                            {
                                                workFlowSms = await Objsms.GetSmsDetails(Convert.ToInt32(arragConfigData[l].Value));
                                                if (workFlowSms != null)
                                                {
                                                    workFlowSms.ConfigureSmsId = 0;
                                                    workFlowSms.ConfigureSmsId = await Objsms.Save(workFlowSms);
                                                    if (workFlowSms.ConfigureSmsId > 0)
                                                        arragConfigData[l].Value = Convert.ToString(workFlowSms.ConfigureSmsId);
                                                }
                                            }
                                        }
                                        else if (blockid.ToLower().Contains("webpush") && arragConfigData[l].Channel.ToLower().Contains("webpush"))
                                        {
                                            WorkFlowWebPush workFlowWeb = null;
                                            using (var Objweb = DLWorkFlowWebPush.GetDLWorkFlowWebPush(details.AccountId, SQLProvider))
                                            {
                                                workFlowWeb = await Objweb.GetWebPushDetails(Convert.ToInt32(arragConfigData[l].Value));
                                                if (workFlowWeb != null)
                                                {
                                                    MLWorkFlowWebPush mLWorkFlowWebPush = new MLWorkFlowWebPush { WebPushTemplateId = workFlowWeb.WebPushTemplateId };
                                                    workFlowWeb.ConfigureWebPushId = await Objweb.Save(mLWorkFlowWebPush);
                                                    if (workFlowWeb.ConfigureWebPushId > 0)
                                                        arragConfigData[l].Value = Convert.ToString(workFlowWeb.ConfigureWebPushId);
                                                }
                                            }
                                        }
                                        else if (blockid.ToLower().Contains("apppush") && arragConfigData[l].Channel.ToLower().Contains("apppush"))
                                        {
                                            WorkFlowMobile workFlowMobile = null;
                                            using (var ObjMobile = DLWorkFlowMobile.GetDLWorkFlowMobile(details.AccountId, SQLProvider))
                                            {
                                                // workFlowMobile = await ObjMobile.GetWorkFlowMobileDetails(Convert.ToInt32(arragConfigData[l].Value));
                                                if (workFlowMobile != null)
                                                {
                                                    MLWorkFlowMobile mLWorkFlowMobile = new MLWorkFlowMobile { MobilePushTemplateId = workFlowMobile.MobilePushTemplateId };
                                                    workFlowMobile.ConfigureMobileId = await ObjMobile.Save(mLWorkFlowMobile);
                                                    if (workFlowMobile.ConfigureMobileId > 0)
                                                        arragConfigData[l].Value = Convert.ToString(workFlowMobile.ConfigureMobileId);
                                                }
                                            }
                                        }
                                        else if (blockid.ToLower().Contains("webhook") && arragConfigData[l].Channel.ToLower().Contains("webhook"))
                                        {
                                            WorkFlowWebHook workFlowHook = null;
                                            using (var ObjHook = DLWorkFlowWebHook.GetDLWorkFlowWebHook(details.AccountId, SQLProvider))
                                            {
                                                workFlowHook = await ObjHook.GetWebHookDetails(Convert.ToInt32(arragConfigData[l].Value));
                                                if (workFlowHook != null)
                                                {
                                                    workFlowHook.ConfigureWebHookId = 0;
                                                    workFlowHook.ConfigureWebHookId = await ObjHook.Save(workFlowHook);
                                                    if (workFlowHook.ConfigureWebHookId > 0)
                                                        arragConfigData[l].Value = Convert.ToString(workFlowHook.ConfigureWebHookId);
                                                }
                                            }
                                        }
                                    }

                                    workFlowChartNodes.nodes[i].blockId = $"{blockids[0]}_{blockids[1]}_{uniqueid}";
                                }
                                catch (Exception ex)
                                {
                                    ErrorMessage = ex.Message;
                                    Result = false;
                                    break;
                                }
                            }

                            workFlow.Flowchart = JsonConvert.SerializeObject(workFlowChartNodes);
                            workFlow.ArrayConfig = JsonConvert.SerializeObject(arragConfigData);
                            workFlow.WorkFlowId = 0;
                            workFlow.Status = 2;
                            workFlow.IsStarted = false;
                            workFlow.Title = $"{workFlow.Title}_duplicate_{Helper.GenerateUniqueNumber()}";
                            workFlow.UserName = user.UserName;
                            using (var objBL = DLWorkFlow.GetDLWorkFlow(details.AccountId, SQLProvider))
                            {
                                int Workflowid = await objBL.Save(workFlow);

                                //if (Workflowid > 0)
                                //{
                                //    if (WorkFlowDataList != null && WorkFlowDataList.Count > 0)
                                //    {
                                //        for (int h = 0; h < WorkFlowDataList.Count; h++)
                                //        {
                                //            WorkFlowDataList[h].WorkFlowDataId = 0;
                                //            using (BLWorkFlowData objdataBL = new BLWorkFlowData(AccountId))
                                //                objdataBL.Save(WorkFlowDataList[h]);
                                //        }
                                //    }
                                //}
                            }

                            ErrorMessage = "Created sucessfully";
                            Result = true;
                        }
                        else
                        {
                            ErrorMessage = "No details, to copy";
                            Result = false;
                        }
                    }
                }
                else
                {
                    ErrorMessage = "No details, to copy";
                    Result = false;
                }
            }
            catch (Exception ex)
            {
                ErrorMessage = ex.Message;
                Result = false;
            }

            return Json(new { Result = Result, ErrorMessage = ErrorMessage });
        }

        [HttpPost]
        [Log]
        public async Task<JsonResult> UpdateWorkflowStatus([FromBody] Workflow_UpdateWorkflowStatusDto details)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            //#region Logs 
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(AccountId, user.UserId, user.UserName, user.EmailId, "Create", "Workflow", "Updateworkflowstatus", Helper.GetIP(), JsonConvert.SerializeObject(WorkflowId));
            //#endregion

            using (var obj = DLWorkFlow.GetDLWorkFlow(details.AccountId, SQLProvider))
            {
                obj.UpdateStatus(details.WorkflowId, details.IsStop, user.UserName);
            }

            // Delete the data from workflow scheduled table- If campaign is going on
            if (details.IsStop == 1) // Only for stop
            {
                using (var objDL = DLWorkFlowBulkMailSent.GetDLWorkFlowBulkMailSent(details.AccountId, SQLProvider))
                {
                    await objDL.DeleteAllTheDataWhichAreInQuque(details.WorkflowId);
                }

                using (var objDL = DLWorkFlowBulkSmsSent.GetDLWorkFlowBulkSmsSent(details.AccountId, SQLProvider))
                {
                    await objDL.DeleteAllTheDataWhichAreInQuque(details.WorkflowId);
                }

                using (var objDL = DLWorkFlowWebPushBulk.GetDLWorkFlowWebPushBulk(details.AccountId, SQLProvider))
                {
                    await objDL.DeleteAllTheDataWhichAreInQuque(details.WorkflowId);
                }

                using (var objDL = DLWorkFlowMobileAppPushBulk.GetDLWorkFlowMobileAppPushBulk(details.AccountId, SQLProvider))
                {
                    await objDL.DeleteAllTheDataWhichAreInQuque(details.WorkflowId);
                }

                using (var objDL = DLWorkFlowMobileAppPushOneToOne.GetDLWorkFlowMobileAppPushOneToOne(details.AccountId, SQLProvider))
                {
                    await objDL.DeleteAllTheDataWhichAreInQuque(details.WorkflowId);
                }
            }

            return Json(0);
        }


        [HttpPost]
        public async Task<IActionResult> GetConfigDetailByWorkFlowId([FromBody] Workflow_GetConfigDetailByWorkFlowIdDto details)
        {

            string ChannelName = "";
            dynamic DsResponces = "";
            int GetEnteredCount = 0;
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            using (var objs = DLWorkFlowData.GetDLWorkFlowData(details.AccountId, SQLProvider))
            {
                P5GenralML.WorkFlow ObjMl = new P5GenralML.WorkFlow();

                List<WorkFlowData> result = (await objs.GetConfigDetailByWorkFlowId(details.WorkflowId)).ToList();
                for (var i = 0; i < result.Count; i++)
                {
                    ChannelName = result[i].ChannelName;
                    DateTime? FromDateTime = null;
                    DateTime? ToDateTime = null;


                    if (ChannelName.ToLower() == "mail")
                    {
                        using (var obj = DLWorkFlowMail.GetDLWorkFlowMail(details.AccountId, SQLProvider))
                        {
                            DsResponces =await obj.GetDetails(result[i].ConfigId, FromDateTime, ToDateTime);
                            if (DsResponces != null) { GetEnteredCount += DsResponces.DeliveredCount; }
                        }
                    }
                    else if (ChannelName.ToLower() == "sms")
                    {
                        using (var obj = DLWorkFlowSMS.GetDLWorkFlowSMS(details.AccountId, SQLProvider))
                        {
                            DsResponces = await obj.GetDetails(result[i].ConfigId, FromDateTime, ToDateTime);
                            if (DsResponces != null)
                            { GetEnteredCount += DsResponces.DeliverCount; }
                        }
                    }

                    else if (ChannelName.ToLower() == "webpush")
                    {
                        using (var obj = DLWorkFlowWebPush.GetDLWorkFlowWebPush(details.AccountId, SQLProvider))
                        {
                            DsResponces = await obj.GetCountsData(result[i].ConfigId);
                            if (DsResponces != null)
                            { GetEnteredCount += DsResponces.ViewCount; }
                        }
                    }

                    else if (ChannelName.ToLower() == "apppush")
                    {
                        using (var obj = DLWorkFlowMobile.GetDLWorkFlowMobile(details.AccountId, SQLProvider))
                        {
                            DsResponces = await obj.GetCountsData(result[i].ConfigId);
                            if (DsResponces != null)
                            { GetEnteredCount += DsResponces.ViewCount; }
                        }
                    }
                    else if (ChannelName.ToLower() == "whatsapp")
                    {
                        using (var obj = DLWorkFlowWhatsApp.GetDLWorkFlowWhatsApp(details.AccountId, SQLProvider))
                        {
                            DsResponces = await obj.GetDetails(result[i].ConfigId, FromDateTime, ToDateTime);
                            if (DsResponces != null) { GetEnteredCount += DsResponces.DeliverCount; }
                        }
                    }

                }
                var getdata = JsonConvert.SerializeObject(GetEnteredCount, Formatting.Indented);
                return Content(getdata.ToString());
            }
        }
    }
}
