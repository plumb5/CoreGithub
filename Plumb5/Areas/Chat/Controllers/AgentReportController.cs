using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Chat.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;
using System.Data;
using System.Globalization;

namespace Plumb5.Areas.Chat.Controllers
{
    [Area("Chat")]
    public class AgentReportController : BaseController
    {
        public AgentReportController(IConfiguration _configuration) : base(_configuration)
        { }
        public IActionResult Index()
        {
            return View("AgentReport");
        }

        [HttpPost]
        public async Task<JsonResult> GetAllAgentsName([FromBody] AgentReport_GetAllAgentsNameDto agentReport)
        {
            List<ChatAllAgentsName> allAgentsName = null;

            using (var objDLChat = DLChatAgentReport.GetDLChatAgentReport(agentReport.AdsId, SQLProvider))
            {
                allAgentsName = await objDLChat.GetAllAgentsName(agentReport.agentReport);
            }
            return Json(allAgentsName);
        }

        [HttpPost]
        public async Task<JsonResult> GetImpressionList([FromBody] AgentReport_GetImpressionListDto details)
        {
            List<MLChatInteractionOverView> ChatImpressionList = null;

            DateTime FromDate = DateTime.ParseExact(details.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDate = DateTime.ParseExact(details.ToDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            using (var objDLChat = DLChatInteractionOverView.GetDLChatInteractionOverView(details.AdsId, SQLProvider))
            {
                ChatImpressionList = await objDLChat.GetImpressionList(details.chatOverView, FromDate, ToDate, details.OffSet, details.FetchNext);
            }
            return Json(ChatImpressionList);
        }

        [HttpPost]
        public async Task<JsonResult> GetAutoPingOverViewList([FromBody] AgentReport_GetAutoPingOverViewListDto details)
        {
            List<ChatAutoPingOverView> AutoPingOverViewList = null;

            DateTime FromDate = DateTime.ParseExact(details.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDate = DateTime.ParseExact(details.ToDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            using (var objDLChat = DLChatAutoPingOverView.GetDLCacheReportDetails(details.AdsId, SQLProvider))
            {
                AutoPingOverViewList = await objDLChat.GetAutoPingOverViewList(details.AutoPingOverView, FromDate, ToDate, details.OffSet, details.FetchNext);
            }
            return Json(AutoPingOverViewList);
        }

        [HttpPost]
        public async Task<JsonResult> GetChatCompletedList([FromBody] AgentReport_GetChatCompletedListDto details)
        {
            List<ChatInteractionOverView> ChatInteractionList = null;
            DateTime FromDateTime = DateTime.ParseExact(details.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(details.ToDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            ChatInteractionOverView chatOverView = new ChatInteractionOverView();
            using (var objDLChat = DLChatInteractionOverView.GetDLChatInteractionOverView(details.AdsId, SQLProvider))
            {
                ChatInteractionList = await objDLChat.GetList(details.chatOverView, FromDateTime, ToDateTime);
            }
            var ChatCompletedList = from eachdata in ChatInteractionList
                                    group eachdata by new
                                    {
                                        eachdata.Date.Value.Date
                                    } into groupData
                                    select new
                                    {
                                        Date = groupData.Key.Date.Date,
                                        ChatTakenCount = groupData.Select(p => (p.ChatUserId)).Count(),
                                        AssignedChatCount = groupData.Sum(p => (p != null && p.LastAgentServedBy > 0 ? 1 : 0)),
                                        UnAssignedChatCount = groupData.Sum(p => (p != null && p.LastAgentServedBy == 0 ? 1 : 0)),
                                        FormFilledChatCount = groupData.Sum(p => (p != null && p.IsFormFilled == true ? 1 : 0)),
                                        CompletedChatCount = groupData.Sum(p => (p != null && p.IsCompleted == true ? 1 : 0))
                                    };
            return Json(ChatCompletedList);
        }

        [HttpPost]
        public async Task<JsonResult> GetAgentPerformance([FromBody] AgentReport_GetAgentPerformanceDto details)
        {
            DateTime FromDateTime = DateTime.ParseExact(details.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(details.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            List<ChatInteractionOverView> ChatInteractionList = null;

            using (var objDLChatInteractionOverView = DLChatInteractionOverView.GetDLChatInteractionOverView(details.AdsId, SQLProvider))
            {
                details.chatOverView.ChatUserId = String.IsNullOrEmpty(details.chatOverView.ChatUserId) ? "" : details.chatOverView.ChatUserId;
                details.chatOverView.ChatInitiatedOnPageUrl = String.IsNullOrEmpty(details.chatOverView.ChatInitiatedOnPageUrl) ? "" : details.chatOverView.ChatInitiatedOnPageUrl;
                ChatInteractionList = await objDLChatInteractionOverView.GetList(details.chatOverView, FromDateTime, ToDateTime);
            }
            List<ChatAllAgentsName> AllAgentsNameList = null;
            using (var objDLChatAgentReport = DLChatAgentReport.GetDLChatAgentReport(details.AdsId, SQLProvider))
            {
                MLChatAgentReport agentReport = new MLChatAgentReport();
                AllAgentsNameList = await objDLChatAgentReport.GetAllAgentsName(agentReport);
            }

            IEnumerable<int> AgentsIdList = AllAgentsNameList.Select(x => Convert.ToInt32(x.UserId));

            List<UserInfo> UserInfoList = new List<UserInfo>();
            using (var objDLUserInfo = DLUserInfo.GetDLUserInfo(SQLProvider))
            {
                UserInfoList = objDLUserInfo.GetDetail(AgentsIdList);
            }

            UserInfoList = (from UserInfos in UserInfoList
                            join AllAgentsName in AllAgentsNameList on UserInfos.UserId.ToString() equals AllAgentsName.UserId into UserInfo_join
                            from AllAgentsName in UserInfo_join.DefaultIfEmpty()
                            select new UserInfo
                            {
                                UserId = UserInfos.UserId,
                                EmployeeCode = UserInfos.EmployeeCode,
                                FirstName = AllAgentsName.Name
                            }).ToList();

            var UnionData = from ChatInteraction in ChatInteractionList
                            join AgentInfo in UserInfoList on ChatInteraction.LastAgentServedBy equals AgentInfo.UserId into ChatInteraction_join
                            from AgentInfo in ChatInteraction_join.DefaultIfEmpty()
                            where ChatInteraction.LastAgentServedBy > 0
                            select new
                            {
                                AgentName = AgentInfo == null ? "No agent" : (string.IsNullOrEmpty(AgentInfo.FirstName) ? "No Agent" : AgentInfo.FirstName),
                                EmployeeCode = AgentInfo == null ? "N/A" : (string.IsNullOrEmpty(AgentInfo.EmployeeCode) ? "N/A" : AgentInfo.EmployeeCode),
                                ChatUserId = ChatInteraction.ChatUserId,
                                LastAgentServedBy = ChatInteraction.LastAgentServedBy,
                                InitiatedByUser = ChatInteraction.InitiatedByUser,
                                IsCompleted = ChatInteraction.IsCompleted,
                                IsMissed = ChatInteraction.IsMissed,
                                FeedBack = ChatInteraction.FeedBack,
                                FeedBackForAgentId = ChatInteraction.FeedBackForAgentId,
                                IsTransferd = ChatInteraction.IsTransferd,
                                IsConvertedToLeadOrCustomer = ChatInteraction.IsConvertedToLeadOrCustomer,
                                ChatInitiatedOnPageUrl = ChatInteraction.ChatInitiatedOnPageUrl,
                                ResponseCount = ChatInteraction.ResponseCount,
                                Date = ChatInteraction.Date,
                                IsFormFilled = ChatInteraction.IsFormFilled
                            };

            var AgentPerformanceList = from eachdata in UnionData
                                       group eachdata by new
                                       {
                                           eachdata.LastAgentServedBy,
                                           eachdata.AgentName,
                                           eachdata.EmployeeCode
                                       } into groupData
                                       select new
                                       {
                                           AgentName = groupData.Key.AgentName,
                                           AgentId = groupData.Key.LastAgentServedBy,
                                           EmployeeCode = groupData.Key.EmployeeCode,
                                           ChatTakenCount = groupData.Select(p => (p.ChatUserId)).Count(),
                                           LeadCount = groupData.Sum(p => (p != null && p.IsConvertedToLeadOrCustomer == 1 ? 1 : 0)),
                                           CustomerCount = groupData.Sum(p => (p != null && p.IsConvertedToLeadOrCustomer == 2 ? 1 : 0)),
                                           MissedChatCount = groupData.Sum(p => (p != null && p.IsMissed == true ? 1 : 0)),
                                           ServedChatCount = groupData.Sum(p => (p != null && p.IsMissed == false ? 1 : 0)),
                                           CompletedChatCount = groupData.Sum(p => (p != null && p.IsCompleted == true ? 1 : 0)),
                                           DroppedChatCount = groupData.Sum(p => (p != null && (p.IsCompleted == false && p.IsMissed == false) ? 1 : 0))
                                       };
            return Json(AgentPerformanceList);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> AgentPerformanceExport([FromBody] AgentReport_AgentPerformanceExportDto details)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                DateTime FromDate = DateTime.ParseExact(details.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                DateTime ToDate = DateTime.ParseExact(details.ToDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

                DataTable dtt = new DataTable();
                DataSet dataSet = new DataSet("General");
                DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

                List<ChatInteractionOverView> ChatInteractionList = null;
                using (var objDLChatInteractionOverView = DLChatInteractionOverView.GetDLChatInteractionOverView(account.AdsId, SQLProvider))
                {
                    ChatInteractionOverView chatOverView = new ChatInteractionOverView();
                    ChatInteractionList = await objDLChatInteractionOverView.GetList(chatOverView, FromDate, ToDate);
                }

                List<ChatAllAgentsName> AllAgentsNameList = null;
                using (var objDLChatAgentReport = DLChatAgentReport.GetDLChatAgentReport(account.AdsId, SQLProvider))
                {
                    MLChatAgentReport agentReport = new MLChatAgentReport();
                    AllAgentsNameList = await objDLChatAgentReport.GetAllAgentsName(agentReport);
                }

                IEnumerable<int> AgentsIdList = AllAgentsNameList.Select(x => Convert.ToInt32(x.UserId));

                List<UserInfo> UserInfoList = new List<UserInfo>();
                using (var objDLUserInfo = DLUserInfo.GetDLUserInfo(SQLProvider))
                {
                    UserInfoList = objDLUserInfo.GetDetail(AgentsIdList);
                }

                UserInfoList = (from UserInfos in UserInfoList
                                join AllAgentsName in AllAgentsNameList on UserInfos.UserId.ToString() equals AllAgentsName.UserId into UserInfo_join
                                from AllAgentsName in UserInfo_join.DefaultIfEmpty()
                                select new UserInfo
                                {
                                    UserId = UserInfos.UserId,
                                    EmployeeCode = UserInfos.EmployeeCode,
                                    FirstName = AllAgentsName.Name
                                }).ToList();
                if (ChatInteractionList.Count > 0)
                {
                    var UnionData = from ChatInteraction in ChatInteractionList
                                    join AgentInfo in UserInfoList on ChatInteraction.LastAgentServedBy equals AgentInfo.UserId into ChatInteraction_join
                                    from AgentInfo in ChatInteraction_join.DefaultIfEmpty()
                                    where ChatInteraction.LastAgentServedBy > 0
                                    select new
                                    {
                                        AgentName = AgentInfo == null ? "No agent" : (string.IsNullOrEmpty(AgentInfo.FirstName) ? "No Agent" : AgentInfo.FirstName),
                                        EmployeeCode = AgentInfo == null ? "N/A" : (string.IsNullOrEmpty(AgentInfo.EmployeeCode) ? "N/A" : AgentInfo.EmployeeCode),
                                        ChatUserId = ChatInteraction.ChatUserId,
                                        LastAgentServedBy = ChatInteraction.LastAgentServedBy,
                                        InitiatedByUser = ChatInteraction.InitiatedByUser,
                                        IsCompleted = ChatInteraction.IsCompleted,
                                        IsMissed = ChatInteraction.IsMissed,
                                        FeedBack = ChatInteraction.FeedBack,
                                        FeedBackForAgentId = ChatInteraction.FeedBackForAgentId,
                                        IsTransferd = ChatInteraction.IsTransferd,
                                        IsConvertedToLeadOrCustomer = ChatInteraction.IsConvertedToLeadOrCustomer,
                                        ChatInitiatedOnPageUrl = ChatInteraction.ChatInitiatedOnPageUrl,
                                        ResponseCount = ChatInteraction.ResponseCount,
                                        Date = ChatInteraction.Date
                                    };

                    var reportData1 = from eachdata in UnionData
                                      group eachdata by new
                                      {
                                          eachdata.LastAgentServedBy,
                                          eachdata.AgentName,
                                          eachdata.EmployeeCode
                                      } into groupData
                                      select new
                                      {
                                          AgentCode = groupData.Key.EmployeeCode,
                                          AgentName = groupData.Key.AgentName,
                                          ChatTaken = groupData.Select(p => (p.ChatUserId)).Count(),
                                          Completed = groupData.Sum(p => (p != null && p.IsCompleted == true ? 1 : 0)),
                                          Incomplete = groupData.Sum(p => (p != null && (p.IsCompleted == false && p.IsMissed == false) ? 1 : 0)),
                                          Missed = groupData.Sum(p => (p != null && p.IsMissed == true ? 1 : 0)),
                                          Lead = groupData.Sum(p => (p != null && p.IsConvertedToLeadOrCustomer == 1 ? 1 : 0)),
                                          Customer = groupData.Sum(p => (p != null && p.IsConvertedToLeadOrCustomer == 2 ? 1 : 0)),
                                          Chat_To_Lead = Math.Round((Convert.ToDouble(groupData.Sum(p => (p != null && p.IsConvertedToLeadOrCustomer == 1 ? 1 : 0))) / Convert.ToDouble(groupData.Select(p => (p.ChatUserId)).Count())) * 100, 2),
                                          Chat_To_Customer = Math.Round((Convert.ToDouble(groupData.Sum(p => (p != null && p.IsConvertedToLeadOrCustomer == 2 ? 1 : 0))) / Convert.ToDouble(groupData.Select(p => (p.ChatUserId)).Count())) * 100, 2)
                                      };

                    dtt = reportData1.CopyToDataTable();
                }
                else
                {
                    return Json(new { Status = true, MainPath = "" });
                }

                if (dtt.Rows.Count > 0)
                    dataSet.Tables.Add(dtt);
                else
                    return Json(new { Status = true, MainPath = "" });

                string FileName = DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + details.FileType;

                string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

                if (details.FileType == "csv")
                    Helper.SaveDataSetToCSV(dataSet, MainPath);
                else
                    Helper.SaveDataSetToExcel(dataSet, MainPath);

                MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
                return Json(new { Status = true, MainPath });
            }
            else
            {
                return Json(new { Status = true, MainPath = "" });
            }
        }


        [Log]
        [HttpPost]
        public async Task<JsonResult> ChatCompletedExport([FromBody] AgentReport_ChatCompletedExportDto details)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                DateTime FromDate = DateTime.ParseExact(details.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                DateTime ToDate = DateTime.ParseExact(details.ToDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                DataTable dtt = new DataTable();

                // Create a DataSet and put both tables in it.
                DataSet dataSet = new DataSet("General");
                DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

                List<ChatInteractionOverView> ChatInteractionList = null;
                using (var objDLChatInteractionOverView = DLChatInteractionOverView.GetDLChatInteractionOverView(account.AdsId, SQLProvider))
                {
                    ChatInteractionOverView chatOverView = new ChatInteractionOverView();
                    ChatInteractionList = await objDLChatInteractionOverView.GetList(chatOverView, FromDate, ToDate);
                }
                List<ChatAllAgentsName> AllAgentsNameList = null;
                using (var objDLChatAgentReport = DLChatAgentReport.GetDLChatAgentReport(account.AdsId, SQLProvider))
                {
                    MLChatAgentReport agentReport = new MLChatAgentReport();
                    AllAgentsNameList = await objDLChatAgentReport.GetAllAgentsName(agentReport);
                }

                IEnumerable<int> AgentsIdList = AllAgentsNameList.Select(x => Convert.ToInt32(x.UserId));

                List<UserInfo> UserInfoList = new List<UserInfo>();
                using (var objDLUserInfo = DLUserInfo.GetDLUserInfo(SQLProvider))
                {
                    UserInfoList = objDLUserInfo.GetDetail(AgentsIdList);
                }

                UserInfoList = (from UserInfos in UserInfoList
                                join AllAgentsName in AllAgentsNameList on UserInfos.UserId.ToString() equals AllAgentsName.UserId into UserInfo_join
                                from AllAgentsName in UserInfo_join.DefaultIfEmpty()
                                select new UserInfo
                                {
                                    UserId = UserInfos.UserId,
                                    EmployeeCode = UserInfos.EmployeeCode,
                                    FirstName = AllAgentsName.Name
                                }).ToList();
                if (ChatInteractionList.Count > 0)
                {
                    var UnionData = from ChatInteraction in ChatInteractionList
                                    join AgentInfo in UserInfoList on ChatInteraction.LastAgentServedBy equals AgentInfo.UserId into ChatInteraction_join
                                    from AgentInfo in ChatInteraction_join.DefaultIfEmpty()
                                    where ChatInteraction.LastAgentServedBy > 0
                                    select new
                                    {
                                        AgentName = AgentInfo == null ? "No agent" : (string.IsNullOrEmpty(AgentInfo.FirstName) ? "No Agent" : AgentInfo.FirstName),
                                        EmployeeCode = AgentInfo == null ? "N/A" : (string.IsNullOrEmpty(AgentInfo.EmployeeCode) ? "N/A" : AgentInfo.EmployeeCode),
                                        ChatUserId = ChatInteraction.ChatUserId,
                                        LastAgentServedBy = ChatInteraction.LastAgentServedBy,
                                        InitiatedByUser = ChatInteraction.InitiatedByUser,
                                        IsCompleted = ChatInteraction.IsCompleted,
                                        IsMissed = ChatInteraction.IsMissed,
                                        FeedBack = ChatInteraction.FeedBack,
                                        FeedBackForAgentId = ChatInteraction.FeedBackForAgentId,
                                        IsTransferd = ChatInteraction.IsTransferd,
                                        IsConvertedToLeadOrCustomer = ChatInteraction.IsConvertedToLeadOrCustomer,
                                        ChatInitiatedOnPageUrl = ChatInteraction.ChatInitiatedOnPageUrl,
                                        ResponseCount = ChatInteraction.ResponseCount,
                                        Date = ChatInteraction.Date
                                    };

                    var reportData1 = from eachdata in UnionData
                                      group eachdata by new
                                      {
                                          eachdata.LastAgentServedBy,
                                          eachdata.AgentName,
                                          eachdata.EmployeeCode
                                      } into groupData
                                      select new
                                      {
                                          AgentCode = groupData.Key.EmployeeCode,
                                          AgentName = groupData.Key.AgentName,
                                          ChatTaken = groupData.Select(p => (p.ChatUserId)).Count(),
                                          Completed = groupData.Sum(p => (p != null && p.IsCompleted == true ? 1 : 0)),
                                          Incomplete = groupData.Sum(p => (p != null && (p.IsCompleted == false && p.IsMissed == false) ? 1 : 0)),
                                          Missed = groupData.Sum(p => (p != null && p.IsMissed == true ? 1 : 0)),
                                          Lead = groupData.Sum(p => (p != null && p.IsConvertedToLeadOrCustomer == 1 ? 1 : 0)),
                                          Customer = groupData.Sum(p => (p != null && p.IsConvertedToLeadOrCustomer == 2 ? 1 : 0)),
                                          Chat_To_Lead = Math.Round((Convert.ToDouble(groupData.Sum(p => (p != null && p.IsConvertedToLeadOrCustomer == 1 ? 1 : 0))) / Convert.ToDouble(groupData.Select(p => (p.ChatUserId)).Count())) * 100, 2),
                                          Chat_To_Customer = Math.Round((Convert.ToDouble(groupData.Sum(p => (p != null && p.IsConvertedToLeadOrCustomer == 2 ? 1 : 0))) / Convert.ToDouble(groupData.Select(p => (p.ChatUserId)).Count())) * 100, 2)
                                      };

                    dtt = reportData1.CopyToDataTable();
                }
                else
                    return Json(new { Status = true, MainPath = "" });

                if (dtt.Rows.Count > 0)
                    dataSet.Tables.Add(dtt);
                else
                    return Json(new { Status = true, MainPath = "" });

                string FileName = DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + details.FileType;

                string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

                if (details.FileType == "csv")
                    Helper.SaveDataSetToCSV(dataSet, MainPath);
                else
                    Helper.SaveDataSetToExcel(dataSet, MainPath);

                MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
                return Json(new { Status = true, MainPath });
            }
            else
            {
                return Json(new { Status = true, MainPath = "" });
            }
        }


        [Log]
        [HttpPost]
        public async Task<JsonResult> ChatInitiatedExport([FromBody] AgentReport_ChatInitiatedExportDto details)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                DateTime FromDate = DateTime.ParseExact(details.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                DateTime ToDate = DateTime.ParseExact(details.ToDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                System.Data.DataTable dtt = new System.Data.DataTable();

                // Create a DataSet and put both tables in it.
                System.Data.DataSet dataSet = new System.Data.DataSet("General");
                DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

                List<MLChatInteractionOverView> ChatImpressionList = null;

                using (var objDLChatInteractionOverView = DLChatInteractionOverView.GetDLChatInteractionOverView(account.AdsId, SQLProvider))
                {
                    ChatInteractionOverView chatOverView = new ChatInteractionOverView();
                    ChatImpressionList = await objDLChatInteractionOverView.GetImpressionList(chatOverView, FromDate, ToDate, 0, 10);
                }

                if (ChatImpressionList.Count > 0)
                {
                    var result = from eachdata in ChatImpressionList
                                 select new
                                 {
                                     InitiatedURL = eachdata.ChatInitiatedOnPageUrl,
                                     ChatConversion = eachdata.ResponseCount
                                 };
                    dtt = result.CopyToDataTable();
                }
                else
                    return Json(new { Status = true, MainPath = "" });

                if (dtt.Rows.Count > 0)
                    dataSet.Tables.Add(dtt);
                else
                    return Json(new { Status = true, MainPath = "" });

                string FileName = DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + details.FileType;

                string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

                if (details.FileType == "csv")
                    Helper.SaveDataSetToCSV(dataSet, MainPath);
                else
                    Helper.SaveDataSetToExcel(dataSet, MainPath);

                MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
                return Json(new { Status = true, MainPath });
            }
            else
            {
                return Json(new { Status = true, MainPath = "" });
            }
        }


        [Log]
        [HttpPost]
        public async Task<JsonResult> PingToChatExport([FromBody] AgentReport_PingToChatExportDto details)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                DateTime FromDate = DateTime.ParseExact(details.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                DateTime ToDate = DateTime.ParseExact(details.ToDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                System.Data.DataTable dtt = new System.Data.DataTable();

                // Create a DataSet and put both tables in it.
                System.Data.DataSet dataSet = new System.Data.DataSet("General");
                DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

                List<ChatAutoPingOverView> AutoPingOverViewList = null;

                using (var objDLChatAutoPingOverView = DLChatAutoPingOverView.GetDLCacheReportDetails(account.AdsId, SQLProvider))
                {
                    ChatAutoPingOverView AutoPingOverView=new ChatAutoPingOverView();
                    AutoPingOverViewList = await objDLChatAutoPingOverView.GetAutoPingOverViewList(AutoPingOverView, FromDate, ToDate, details.OffSet, details.FetchNext);
                }

                if (AutoPingOverViewList.Count > 0)
                {
                    var result = from eachdata in AutoPingOverViewList
                                 select new
                                 {
                                     URL = string.IsNullOrEmpty(eachdata.URL) ? "Auto Pings - without Rules" : eachdata.URL,
                                     AutoPing = eachdata.AutoPingCount,
                                     Response = eachdata.ResponseCount,
                                     PingToChat = Math.Round(Convert.ToDouble(eachdata.ResponseCount) / Convert.ToInt32(eachdata.AutoPingCount) * 100, 2)
                                 };
                    dtt = result.CopyToDataTable();
                }
                else
                    return Json(new { Status = true, MainPath = "" });

                if (dtt.Rows.Count > 0)
                    dataSet.Tables.Add(dtt);
                else
                    return Json(new { Status = true, MainPath = "" });

                string FileName = DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + details.FileType;

                string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

                if (details.FileType == "csv")
                    Helper.SaveDataSetToCSV(dataSet, MainPath);
                else
                    Helper.SaveDataSetToExcel(dataSet, MainPath);

                MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
                return Json(new { Status = true, MainPath });
            }
            else
            {
                return Json(new { Status = true, MainPath = "" });
            }
        }
    }
}
