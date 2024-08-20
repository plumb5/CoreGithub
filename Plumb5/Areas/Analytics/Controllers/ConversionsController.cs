using Microsoft.AspNetCore.Mvc; 
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Analytics.Dto; 
using Plumb5.Controllers;
using System.Data; 
using System.Web; 

namespace Plumb5.Areas.Analytics.Controllers
{
    [Area("Analytics")]
    public class ConversionsController: BaseController
    {
        public ConversionsController(IConfiguration _configuration) : base(_configuration)
        { }

        //
        // GET: /Analytics/Conversions/ 
        private static List<listAllPages> _lists;
        private static int _identifier;
        public IActionResult Goal()
        {
            return View();
        }

        public IActionResult AttributionModel()
        {
            return View();
        }
        public IActionResult Transactions()
        {
            return View();
        }
        public IActionResult ProductPerformance()
        {
            return View();
        }
        public IActionResult SalesPerformance()
        {
            return View();
        }
        public IActionResult CohortAnalysis()
        {
            return View();
        }
        public IActionResult ProductDetails()
        {
            return View();
        }
        [HttpPost]
        public async Task<ActionResult> GoalSetting()
        {
            try
            {
                LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
                var accountInfo = JsonConvert.DeserializeObject<Account>(HttpContext.Session.GetString("AccountInfo")); 
                var accountId = accountInfo.AccountId;
                if (accountInfo!= null)
                {
                    if (_identifier != accountId)//If the account is new
                    {
                        if (_lists != null) _lists.Clear();
                        System.Threading.Tasks.Task.Run(() =>
                        {
                            Caching(accountId);
                        });
                    }
                    return View();
                }
            }
            catch
            {
                // ignored
            }
            return Redirect("~/Login");
        }
        public ActionResult ForwardGoal()
        {
            return View();
        }
        public ActionResult ReverseGoal()
        {
            return View();
        }
        public ActionResult VisitorStages()
        {
            return View();
        }
        public ActionResult Segmentation()
        {
            return View();
        }
        public ActionResult Segmentation1()
        {
            return View();
        }
        public ActionResult SegmentationNew()
        {
            return View();
        }
        public ActionResult SegmentationStage()
        {
            return View();
        }
        [HttpPost]
        public async Task<ActionResult> GoalsMaxCount([FromBody] GoalsMaxCountDto ConversionsDto)
        {
            try
            {
                var ds = new object();
                string ConnectionString =(await Plumb5.Models.AccountDetails.GetAccountConnection(ConversionsDto.accountId, SQLProvider)).ToString();
                using (var objDL = DLConversions.GetDLConversions(ConversionsDto.accountId, SQLProvider))
                {
                    ds = await objDL.GoalsMaxCount(new _Plumb5MLGoal()
                    {
                        AccountId = ConversionsDto.accountId,
                        FromDate = ConversionsDto.fromdate,
                        ToDate = ConversionsDto.todate
                    });
                }
                
                var getdata = JsonConvert.SerializeObject(ds, Formatting.Indented);
                return Content(getdata.ToString(), "application/json"); 
            }
            catch
            {
                return null;
            }
        }
        [HttpPost]
        public async Task<ActionResult> GoalsReport([FromBody] GoalsReportDto ConversionsDto)
        {
            try
            {
                var ds = new object();
                string ConnectionString =(await Plumb5.Models.AccountDetails.GetAccountConnection(ConversionsDto.accountId, SQLProvider)).ToString();
                using (var objDL = DLConversions.GetDLConversions(ConversionsDto.accountId, SQLProvider))
                {
                    ds = await objDL.GetGoalsReport(new _Plumb5MLGoal()
                    {
                        AccountId = ConversionsDto.accountId,
                        Start = ConversionsDto.start,
                        End = ConversionsDto.end

                    });
                }
                var getdata = JsonConvert.SerializeObject(ds, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }
        [HttpPost]
        public async Task<ActionResult> SaveGoalSetting([FromBody] SaveGoalSettingDto ConversionsDto)
        {
            try
            {
                string pageName1 = "", pageName2 = "", pageName3 = "", pageName4 = "", pageName5 = "",
                       pageName6 = "", pageName7 = "", pageName8 = "", pageName9 = "", pageName10 = "";
                var arData = ConversionsDto.pages.Split(',');
                for (int i = 0; i < arData.Length; i++)
                {
                    if (i == 0)
                        pageName1 = arData[0];
                    if (i == 1)
                        pageName2 = arData[1];
                    if (i == 2)
                        pageName3 = arData[2];
                    if (i == 3)
                        pageName4 = arData[3];
                    if (i == 4)
                        pageName5 = arData[4];
                    if (i == 5)
                        pageName6 = arData[5];
                    if (i == 6)
                        pageName7 = arData[6];
                    if (i == 7)
                        pageName8 = arData[7];
                    if (i == 8)
                        pageName9 = arData[8];
                    if (i == 9)
                        pageName10 = arData[9];
                }
                int result=0;
                string ConnectionString = (await Plumb5.Models.AccountDetails.GetAccountConnection(ConversionsDto.accountId, SQLProvider)).ToString();
                 using (var objDL = DLConversions.GetDLConversions(ConversionsDto.accountId, SQLProvider))
                {
                    result = await objDL.Insert_GoalSetting(new _Plumb5MLGoal
                    {
                        AccountId = ConversionsDto.accountId,
                        GoalId = ConversionsDto.goalId,
                        GoalName = ConversionsDto.goalName,
                        Channel = ConversionsDto.channel,
                        PageName1 = pageName1,
                        PageName2 = pageName2,
                        PageName3 = pageName3,
                        PageName4 = pageName4,
                        PageName5 = pageName5,
                        PageName6 = pageName6,
                        PageName7 = pageName7,
                        PageName8 = pageName8,
                        PageName9 = pageName9,
                        PageName10 = pageName10
                    });
                }

                return Json(result);

            }
            catch (Exception ex)
            {
                throw ex;

            }
        }
        [HttpPost]
        public async Task<ActionResult> ForwardGoalView([FromBody] ForwardGoalViewDto ConversionsDto)
        {
            try
            {
                var ds = new object();
                string ConnectionString = (await Plumb5.Models.AccountDetails.GetAccountConnection(ConversionsDto.accountId, SQLProvider)).ToString();
                 using (var objDL = DLConversions.GetDLConversions(ConversionsDto.accountId, SQLProvider))
                {
                    ds = await objDL.Select_ForwardGoal(new _Plumb5MLForwardGoal
                    {
                        AccountId = ConversionsDto.accountId,
                        FromDate = ConversionsDto.fromdate,
                        ToDate = ConversionsDto.todate,
                        GoalId = ConversionsDto.GoalId
                    }); 
                }
                
                var getdata = JsonConvert.SerializeObject(ds, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }
        [HttpPost]
        public async Task<ActionResult> GoalDelete([FromBody] GoalDeleteDto ConversionsDto)
        {
            try
            {
                int result = 0;
                string ConnectionString = (await Plumb5.Models.AccountDetails.GetAccountConnection(ConversionsDto.accountId, SQLProvider)).ToString();
                 using (var objDL = DLConversions.GetDLConversions(ConversionsDto.accountId, SQLProvider))
                {
                    result = await objDL.Delete_GoalSetting(new _Plumb5MLGoal
                    {
                        AccountId = ConversionsDto.accountId,
                        GoalId = ConversionsDto.Id
                    });
                }
                return Json(result);
            }
            catch
            {
                return null;
            }
        }
        [HttpPost]
        /// <summary>
        /// Goal Report
        /// </summary>
        /// <param name="adsId"></param>
        /// <returns></returns>
         [HttpPost]
        public async Task<ActionResult> GoalReport([FromBody] GoalReportDto ConversionsDto)
        {
            try
            {
                var ds = new object();
                using (var objDL = DLConversions.GetDLConversions(ConversionsDto.accountId, SQLProvider))
                {
                    ds = await objDL.Select_Goal(new _Plumb5MLGoal
                    {
                        AccountId = ConversionsDto.accountId,
                        
                    });
                }
                 
                var getdata = JsonConvert.SerializeObject(ds, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
            catch
            {
                return null;
            }
        }
        public async void Caching(int accountId)
        {
            DataSet ds = new DataSet();
            var objDL = DLAudience.GetDLAudience( accountId, SQLProvider);
             ds =await  objDL.Select_SearchBy_AutoSuggest(new _Plumb5MLAutosuggest
            {
                AccountId =  accountId,
                Type = "AllPage"
            });

            try
            {
                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Columns.Count > 0)
                {
                    for (int op = 0; op < ds.Tables[0].Rows.Count; op++)
                    {
                        if (ds.Tables[0].Rows[op][0].ToString() != null && !string.IsNullOrEmpty(ds.Tables[0].Rows[op][0].ToString()))
                        {
                            Type dataType = ds.Tables[0].Rows[op][0].GetType();
                            if (dataType == typeof(string))
                            {
                                 
                                ds.Tables[0].Rows[op][0] = HttpUtility.HtmlDecode(ds.Tables[0].Rows[op][0].ToString());
                            }
                        }
                    }
                }
            }
            catch
            {

            }

            if (ds != null && ds.Tables[0].Rows.Count > 0)
            {
                _lists = ds.Tables[0].AsEnumerable().Select(dataRow => new listAllPages()
                {
                    PageName = dataRow.Field<string>("Value")

                }).ToList();
                _identifier =accountId;
            }
        }

    }
}
