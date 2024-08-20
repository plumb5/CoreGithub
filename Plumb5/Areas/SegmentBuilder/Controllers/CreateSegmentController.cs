using Microsoft.AspNetCore.Mvc;
using Plumb5.Controllers;
using P5GenralML;
using Plumb5.Areas.SegmentBuilder.Models;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using P5GenralDL;
using Newtonsoft.Json;
using System.Text;
using Microsoft.Data.SqlClient;
using Plumb5.Areas.SegmentBuilder.Dto;
using Microsoft.IdentityModel.Tokens;
namespace Plumb5.Areas.SegmentBuilder.Controllers
{
    [Area("SegmentBuilder")]
    public class CreateSegmentController : BaseController
    {
        public CreateSegmentController(IConfiguration _configuration) : base(_configuration)
        { }
        //
        // GET: /SegmentBuilder/CreateSegment/

        public IActionResult Index()
        {
            return View("CreateSegment");
        }

        [Log]
        public async Task<ActionResult> CreateSegmentBuilder([FromBody] CreateSegment_CreateSegmentBuilderDto CreateSegmentDto)
        {
            var message = "";
            var result = false;
            P5GenralML.SegmentBuilder segmentBuilder = new P5GenralML.SegmentBuilder();
            segmentBuilder.SegmentJson = JsonConvert.SerializeObject(CreateSegmentDto.Segment);

            //var Query = getQuery(Segment, TableNames, false, IsNewOrExisting, Days);
            Tuple<string, string> Query = getQueryString(CreateSegmentDto.Segment, CreateSegmentDto.TableNames, false, CreateSegmentDto.IsNewOrExisting, CreateSegmentDto.Days, CreateSegmentDto.FromDate, CreateSegmentDto.ToDate, IsRecurring: CreateSegmentDto.IsRecurring);
            var Test = await testResult(CreateSegmentDto.AccountId, Query.Item1);
            if (Test.Item1 == true)
            {


                LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

                //Save Group....
                Groups group = new Groups();
                group.Id = CreateSegmentDto.GroupId;
                group.UserInfoUserId = user.UserId;
                group.UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;
                group.Name = CreateSegmentDto.GroupName;
                group.GroupDescription = CreateSegmentDto.GroupDescription;
                group.GroupType = 2;
                var saveGroupId = await SaveOrUpdateGroup(CreateSegmentDto.AccountId, group);
                var getGroupId = CreateSegmentDto.GroupId == 0 ? saveGroupId : CreateSegmentDto.GroupId;


                //Save Segment Builder......               

                if (getGroupId > 0)
                {
                    segmentBuilder.UserInfoUserId = user.UserId;
                    segmentBuilder.GroupId = getGroupId;
                    segmentBuilder.Status = true;
                    //segmentBuilder.SegmentJson = JsonConvert.SerializeObject(Segment);
                    segmentBuilder.SegmentQuery = Query.Item1.ToString();
                    segmentBuilder.ExecutionType = "everyday";
                    segmentBuilder.IsNewOrExisting = CreateSegmentDto.IsNewOrExisting;
                    segmentBuilder.NoOfDays = CreateSegmentDto.Days;
                    segmentBuilder.IsIntervalOrOnce = CreateSegmentDto.IsIntervalOrOnce;
                    segmentBuilder.FromDate = CreateSegmentDto.FromDate;
                    segmentBuilder.ToDate = CreateSegmentDto.ToDate;
                    segmentBuilder.IsRecurring = CreateSegmentDto.IsRecurring;

                    if (CreateSegmentDto.IsRecurring)
                        segmentBuilder.SegmentQueryRecurring = Query.Item2.ToString();
                    else
                        segmentBuilder.SegmentQueryRecurring = "";

                    using (var objBL = DLSegmentBuilder.GetDLSegmentBuilder(CreateSegmentDto.AccountId, SQLProvider))
                    {
                        if (CreateSegmentDto.GroupId == 0)
                        {
                            segmentBuilder.Id = await objBL.Save(segmentBuilder);
                            if (segmentBuilder.Id > 0)
                                result = true;
                            else
                                result = false;

                        }
                        else
                        {
                            result = await objBL.Update(segmentBuilder);
                        }
                    }
                }
                else if (getGroupId == -1)
                {
                    message = "Group name already exists";
                    result = false;
                }
            }
            else
            {
                message = Test.Item2;
                result = false;
            }

            return Json(new { data = segmentBuilder, status = result, message = message });
        }

        private Tuple<string, string> getQueryString(List<SegmentCondition> Segment, string[] TableNames, bool TestQuery = false, bool IsNewOrExisting = false, int Days = 1, string FromDate = null, string ToDate = null, bool IsRecurring = false)
        {

            for (int i = 0; i < Segment.Count; i++)
            {
                if (Segment[i].Column == "EventName")
                    Segment[i].Comparison = "and";
            }

            Tuple<string, string> Query = Tuple.Create("", "");
            int count = Segment.Where(x => x.Column == "EventName").ToList().Count;

            string Query1 = "";
            string Query2 = "";

            if (count == 0 || count == 1)
            {
                Query = getQuery(Segment, TableNames, TestQuery, IsNewOrExisting, Days, FromDate: FromDate, ToDate: ToDate, IsRecurring: IsRecurring);
            }
            else
            {
                List<SegmentCondition> SegmentCustomEvents = Segment.Where(x => x.Table == "CustomEvents").ToList();
                int Count = (int)Math.Truncate((decimal)(Segment.Where(x => x.Table == "CustomEvents").ToList().Count / 2));

                List<SegmentCondition> SegmentConditionAnd = new List<SegmentCondition>();
                List<SegmentCondition> SegmentConditionOR = new List<SegmentCondition>();
                for (int i = 0; i < Count; i++)
                {
                    if (i == 0)
                    {
                        List<SegmentCondition> Segmenteach = SegmentCustomEvents.Take(2).ToList();
                        if (String.IsNullOrEmpty(Segmenteach[1].Comparison) || Segmenteach[1].Comparison.ToLower() == "and")
                            SegmentConditionAnd.AddRange(Segmenteach);
                        else
                            SegmentConditionOR.AddRange(Segmenteach);

                    }
                    else
                    {
                        List<SegmentCondition> Segmenteach = SegmentCustomEvents.Skip(i * 2).Take(2).ToList();
                        if (!String.IsNullOrEmpty(Segmenteach[1].Comparison) && Segmenteach[1].Comparison.ToLower() == "and")
                            SegmentConditionAnd.AddRange(Segmenteach);
                        else
                            SegmentConditionOR.AddRange(Segmenteach);
                    }
                }

                //For And Condition
                int AndLoop = (int)Math.Truncate((decimal)(SegmentConditionAnd.Count / 2));
                if (SegmentConditionAnd != null && AndLoop > 0)
                {
                    for (int i = 0; i < AndLoop; i++)
                    {
                        if (i == 0)
                        {
                            List<SegmentCondition> SegmentTables = Segment.Where(x => x.Table != "CustomEvents").ToList();
                            List<SegmentCondition> Segmenteach = SegmentConditionAnd.Take(2).ToList();
                            SegmentTables.AddRange(Segmenteach);
                            Tuple<string, string> subQuery = getQuery(SegmentTables, TableNames, TestQuery, IsNewOrExisting, Days, false, "CustomEvents", FromDate: FromDate, ToDate: ToDate);
                            Query1 += $" SELECT CustomEvnents.ContactId,CustomEvnents.MachineId,CustomEvnents.DeviceId,UpdatedDate FROM ( {subQuery.Item1} ) AS CustomEvnents ";
                            Query2 += $" SELECT CustomEvnents.ContactId,CustomEvnents.MachineId,CustomEvnents.DeviceId,UpdatedDate FROM ( {subQuery.Item2} ) AS CustomEvnents ";
                        }
                        else
                        {
                            List<SegmentCondition> SegmentTables = Segment.Where(x => x.Table != "CustomEvents").ToList();
                            List<SegmentCondition> Segmenteach = SegmentConditionAnd.Skip(i * 2).Take(2).ToList();
                            SegmentTables.AddRange(Segmenteach);
                            Tuple<string, string> subQuery = getQuery(SegmentTables, TableNames, TestQuery, IsNewOrExisting, Days, true, "CustomEvents", FromDate: FromDate, ToDate: ToDate);

                            if (Segmenteach != null && Segmenteach.Count > 0 && Segmenteach[1].Operator == "CountEquals" && Segmenteach[1].Value == "0")
                            {
                                Query1 += $" WHERE (CAST(CustomEvnents.ContactId AS text) || '-' || CAST(CustomEvnents.MachineId AS text)) NOT IN ( SELECT (CAST(coalesce(CustomEvnents.ContactId,0) AS text) || '-' || CAST(coalesce(CustomEvnents.MachineId,'0') AS text)) FROM ( {subQuery.Item1} ) AS CustomEvnents ";
                                Query2 += $" WHERE (CAST(CustomEvnents.ContactId AS text) || '-' || CAST(CustomEvnents.MachineId AS text)) NOT IN ( SELECT (CAST(coalesce(CustomEvnents.ContactId,0) AS text) || '-' || CAST(coalesce(CustomEvnents.MachineId,'0') AS text)) FROM ( {subQuery.Item2} ) AS CustomEvnents ";
                            }
                            else
                            {
                                Query1 += $" WHERE (CAST(CustomEvnents.ContactId AS text) || '-' || CAST(CustomEvnents.MachineId AS text)) IN ( SELECT (CAST(coalesce(CustomEvnents.ContactId,0) AS text) || '-' || CAST(coalesce(CustomEvnents.MachineId,'0') AS text)) FROM ( {subQuery.Item1} ) AS CustomEvnents ";
                                Query2 += $" WHERE (CAST(CustomEvnents.ContactId AS text) || '-' || CAST(CustomEvnents.MachineId AS text)) IN ( SELECT (CAST(coalesce(CustomEvnents.ContactId,0) AS text) || '-' || CAST(coalesce(CustomEvnents.MachineId,'0') AS text)) FROM ( {subQuery.Item2} ) AS CustomEvnents ";
                            }

                        }
                    }

                    if ((AndLoop - 1) >= 0)
                    {
                        for (int i = 1; i <= (AndLoop - 1); i++)
                        {
                            Query1 += ")";
                            Query2 += ")";
                        }
                    }
                    else
                    {
                        Query1 += " UNION ";
                        Query2 += " UNION ";
                    }
                }

                // For Or Condition
                int ORLoop = (int)Math.Truncate((decimal)(SegmentConditionOR.Count / 2));

                if (SegmentConditionOR != null && ORLoop > 0)
                {
                    for (int i = 0; i < ORLoop; i++)
                    {
                        if (i == 0)
                        {
                            List<SegmentCondition> SegmentTables = Segment.Where(x => x.Table != "CustomEvents").ToList();
                            List<SegmentCondition> Segmenteach = SegmentConditionOR.Take(2).ToList();
                            Segmenteach[1].Comparison = "and";
                            SegmentTables.AddRange(Segmenteach);
                            Tuple<string, string> subQuery = getQuery(SegmentTables, TableNames, TestQuery, IsNewOrExisting, Days, false, "CustomEvents", FromDate: FromDate, ToDate: ToDate);
                            if (!String.IsNullOrEmpty(Query1) && Query1.Length > 0 && Query1.LastIndexOf("UNION") == -1)
                            {
                                Query1 += $" UNION SELECT CustomEvnents.ContactId,CustomEvnents.MachineId,CustomEvnents.DeviceId,UpdatedDate FROM ( {subQuery.Item1} ) AS CustomEvnents ";
                                Query2 += $" UNION SELECT CustomEvnents.ContactId,CustomEvnents.MachineId,CustomEvnents.DeviceId,UpdatedDate FROM ( {subQuery.Item2} ) AS CustomEvnents ";
                            }
                            else
                            {
                                Query1 += $" SELECT CustomEvnents.ContactId,CustomEvnents.MachineId,CustomEvnents.DeviceId,UpdatedDate FROM ( {subQuery.Item1} ) AS CustomEvnents ";
                                Query2 += $" SELECT CustomEvnents.ContactId,CustomEvnents.MachineId,CustomEvnents.DeviceId,UpdatedDate FROM ( {subQuery.Item2} ) AS CustomEvnents ";
                            }
                        }
                        else
                        {
                            List<SegmentCondition> SegmentTables = Segment.Where(x => x.Table != "CustomEvents").ToList();
                            List<SegmentCondition> Segmenteach = SegmentConditionOR.Skip(i * 2).Take(2).ToList();
                            Segmenteach[1].Comparison = "and";
                            SegmentTables.AddRange(Segmenteach);
                            Tuple<string, string> subQuery = getQuery(SegmentTables, TableNames, TestQuery, IsNewOrExisting, Days, false, "CustomEvents", FromDate: FromDate, ToDate: ToDate);

                            Query1 += $" UNION  (SELECT CustomEvnents.ContactId,CustomEvnents.MachineId,CustomEvnents.DeviceId,UpdatedDate FROM ( {subQuery.Item1} ) AS CustomEvnents) ";
                            Query2 += $" UNION  (SELECT CustomEvnents.ContactId,CustomEvnents.MachineId,CustomEvnents.DeviceId,UpdatedDate FROM ( {subQuery.Item2} ) AS CustomEvnents) ";
                        }
                    }
                }

                Query = Tuple.Create(Query1, Query2);
            }

            return Query;
        }

        private Tuple<string, string> getQuery(List<SegmentCondition> Segment, string[] TableNames, bool TestQuery = false, bool IsNewOrExisting = false, int Days = 1, bool IsSubQuery = false, string DateFilterTable = null, string FromDate = null, string ToDate = null, bool IsRecurring = false)
        {
            var Query = "";
            Query = TestQuery == true ? "select " : "select distinct ";
            var TableQuery = "";
            Tuple<string, string> DateCondition = null;
            var GroupBy = "";
            TableNames = TableNames.Distinct().ToArray();
            bool IsContactTablePresent = false;

            if (String.IsNullOrEmpty(FromDate) && String.IsNullOrEmpty(ToDate))
            {
                if (TableNames.Contains("Contact"))
                {
                    TableNames = TableNames.Where(x => x != "Contact").ToArray();//remove contact table and push to position one
                    string[] newTableNames = new string[TableNames.Length + 1];
                    newTableNames[0] = "Contact";
                    TableNames.CopyTo(newTableNames, 1);
                    TableNames = newTableNames;
                    IsContactTablePresent = true;
                }

                if (TableNames.Contains("CustomEvents"))
                {
                    TableNames = TableNames.Where(x => x != "CustomEvents").ToArray();//remove contact table and push to position one
                    TableNames = TableNames.Concat(new string[] { "CustomEvents" }).ToArray();
                }
            }

            if (String.IsNullOrEmpty(DateFilterTable))
                DateCondition = GetDateCondition(Segment[0].Table, Days, FromDate, ToDate, IsRecurring);
            else
                DateCondition = GetDateCondition(DateFilterTable, Days, FromDate, ToDate, IsRecurring);

            foreach (var table in TableNames)
            {
                if (table.Contains("Contact"))
                {
                    //if (DateCondition.Length > 0)
                    //{
                    //    DateCondition += $" AND (Contact.UpdatedDate between DATEADD(DAY, -{Days}, GETDATE()) and GETDATE()) ";
                    //}
                    //else
                    //{
                    //    DateCondition += $" (Contact.UpdatedDate between DATEADD(DAY, -{Days}, GETDATE()) and GETDATE()) ";
                    //}

                    if (TableQuery != null && TableQuery.Length == 0)
                    {
                        if (TableNames.Contains("CustomEvents"))
                        {
                            if (IsSubQuery)
                            {
                                if (IsContactTablePresent)
                                {
                                    GroupBy = "Contact.ContactId";

                                    TableQuery += $" COALESCE(Contact.ContactId,0) as ContactId " +
                                      $"FROM CustomEvents " +
                                      $"INNER JOIN Contact ON Contact.ContactId=CustomEvents.ContactId ";
                                }
                                else
                                {
                                    GroupBy = "CustomEvents.MachineId";

                                    TableQuery += $" COALESCE(CustomEvents.MachineId,'0') as MachineId " +
                                      $"FROM CustomEvents " +
                                      $"INNER JOIN Contact  ON Contact.ContactId=CustomEvents.ContactId ";
                                }
                            }
                            else
                            {
                                GroupBy = "Contact.ContactId,CustomEvents.MachineId";

                                TableQuery += $" COALESCE(Contact.ContactId,0) as ContactId,COALESCE(CustomEvents.MachineId,'0') as MachineId,cast('0' as varchar) as DeviceId, MAX(COALESCE(CustomEvents.EventTime,Contact.UpdatedDate)) AS UpdatedDate " +
                                      $"FROM CustomEvents  " +
                                      $"INNER JOIN Contact  ON Contact.ContactId=CustomEvents.ContactId ";
                            }
                        }
                        else
                        {
                            if (IsSubQuery)
                            {
                                if (IsContactTablePresent)
                                {
                                    GroupBy = "Contact.ContactId";

                                    TableQuery += $" COALESCE(Contact.ContactId,0) as ContactId " +
                                      $"FROM VisitorInformation  " +
                                      $"RIGHT JOIN Contact  ON Contact.ContactId=VisitorInformation.ContactId AND VisitorInformation.SourceType=1 ";
                                }
                                else
                                {
                                    GroupBy = "VisitorInformation.MachineId";

                                    TableQuery += $" COALESCE(VisitorInformation.MachineId,'0') as MachineId " +
                                      $"FROM VisitorInformation  " +
                                      $"RIGHT JOIN Contact  ON Contact.ContactId=VisitorInformation.ContactId AND VisitorInformation.SourceType=1 ";
                                }
                            }
                            else
                            {
                                GroupBy = "Contact.ContactId,VisitorInformation.MachineId";

                                TableQuery += $" COALESCE(Contact.ContactId,0) as ContactId,COALESCE(VisitorInformation.MachineId,'0') as MachineId,cast('0' as varchar) as DeviceId, MAX(Contact.UpdatedDate) AS UpdatedDate " +
                                      $"FROM VisitorInformation  " +
                                      $"RIGHT JOIN Contact  ON Contact.ContactId=VisitorInformation.ContactId AND VisitorInformation.SourceType=1 ";
                            }
                        }
                    }
                    else if (TableQuery != null && TableQuery.Length > 0)
                    {
                        if (TableNames.Contains("CustomEvents"))
                        {
                            TableQuery += $"INNER JOIN Contact  ON Contact.ContactId=CustomEvents.ContactId ";
                        }
                        else
                        {
                            TableQuery += $"INNER JOIN Contact  ON Contact.ContactId=VisitorInformation.ContactId ";
                        }

                    }
                }
                else if (table.Contains("SessionTracker"))
                {

                    //if (DateCondition.Length > 0)
                    //{
                    //    DateCondition += $" AND (SessionTracker.Date between DATEADD(DAY, -{Days}, GETDATE()) and GETDATE()) ";
                    //}
                    //else
                    //{
                    //    DateCondition += $" (SessionTracker.Date between DATEADD(DAY, -{Days}, GETDATE()) and GETDATE()) ";
                    //}



                    if (TableQuery != null && TableQuery.Length == 0)
                    {
                        if (TableNames.Contains("CustomEvents"))
                        {
                            if (IsSubQuery)
                            {
                                if (IsContactTablePresent)
                                {
                                    GroupBy = "VisitorInformation.ContactId";

                                    TableQuery += $" COALESCE(CustomEvents.ContactId,0) as ContactId " +
                                  $"FROM CustomEvents  " +
                                  $"INNER JOIN SessionTracker  ON SessionTracker.MachineId=CustomEvents.MachineId ";
                                }
                                else
                                {
                                    GroupBy = "SessionTracker.MachineId";

                                    TableQuery += $" COALESCE(SessionTracker.MachineId,0) as MachineId " +
                                  $"FROM CustomEvents  " +
                                  $"INNER JOIN SessionTracker  ON SessionTracker.MachineId=CustomEvents.MachineId ";
                                }
                            }
                            else
                            {
                                GroupBy = "VisitorInformation.ContactId,SessionTracker.MachineId";

                                TableQuery += $" COALESCE(CustomEvents.ContactId,0) as ContactId,COALESCE(SessionTracker.MachineId,'0') as MachineId,cast('0' as varchar) as DeviceId, MAX(COALESCE(CustomEvents.EventTime,SessionTracker.TimeEnd)) AS UpdatedDate " +
                                  $"FROM CustomEvents  " +
                                  $"INNER JOIN SessionTracker  ON SessionTracker.MachineId=CustomEvents.MachineId ";
                            }
                        }
                        else
                        {
                            if (IsSubQuery)
                            {
                                if (IsContactTablePresent)
                                {
                                    GroupBy = "VisitorInformation.ContactId";

                                    TableQuery += $" COALESCE(VisitorInformation.ContactId,0) as ContactId " +
                                              $"FROM VisitorInformation  " +
                                              $"RIGHT JOIN SessionTracker  ON SessionTracker.MachineId=VisitorInformation.MachineId  AND VisitorInformation.SourceType=1 ";
                                }
                                else
                                {
                                    GroupBy = "SessionTracker.MachineId";

                                    TableQuery += $" COALESCE(SessionTracker.MachineId,'0') as MachineId " +
                                              $"FROM VisitorInformation  " +
                                              $"RIGHT JOIN SessionTracker  ON SessionTracker.MachineId=VisitorInformation.MachineId  AND VisitorInformation.SourceType=1 ";
                                }
                            }
                            else
                            {
                                GroupBy = "VisitorInformation.ContactId,SessionTracker.MachineId";

                                TableQuery += $" COALESCE(VisitorInformation.ContactId,0) as ContactId,COALESCE(SessionTracker.MachineId,'0') as MachineId,cast('0' as varchar) as DeviceId, MAX(SessionTracker.TimeEnd) AS UpdatedDate " +
                                          $"FROM VisitorInformation  " +
                                          $"RIGHT JOIN SessionTracker  ON SessionTracker.MachineId=VisitorInformation.MachineId  AND VisitorInformation.SourceType=1 ";
                            }
                        }

                    }
                    else if (TableQuery != null && TableQuery.Length > 0)
                    {
                        if (TableNames.Contains("CustomEvents"))
                        {
                            TableQuery += $" INNER JOIN SessionTracker  ON SessionTracker.MachineId=CustomEvents.MachineId ";
                        }
                        else
                        {
                            TableQuery += $" INNER JOIN SessionTracker  ON SessionTracker.MachineId=VisitorInformation.MachineId ";
                        }

                    }
                }
                else if (table.Contains("MainTracker"))
                {
                    //if (DateCondition.Length > 0)
                    //{
                    //    DateCondition += $" AND (MainTracker.Date between DATEADD(DAY, -{Days}, GETDATE()) and GETDATE()) ";
                    //}
                    //else
                    //{
                    //    DateCondition += $" (MainTracker.Date between DATEADD(DAY, -{Days}, GETDATE()) and GETDATE()) ";
                    //}


                    if (TableQuery != null && TableQuery.Length == 0)
                    {
                        if (TableNames.Contains("CustomEvents"))
                        {

                            if (IsSubQuery)
                            {
                                if (IsContactTablePresent)
                                {
                                    GroupBy = "CustomEvents.ContactId";

                                    TableQuery += $" COALESCE(CustomEvents.ContactId,0) as ContactId " +
                                              $"FROM CustomEvents  " +
                                              $"INNER JOIN MainTracker  ON MainTracker.MachineId=CustomEvents.MachineId ";
                                }
                                else
                                {
                                    GroupBy = "MainTracker.MachineId";

                                    TableQuery += $" COALESCE(MainTracker.MachineId,'0') as MachineId " +
                                              $"FROM CustomEvents  " +
                                              $"INNER JOIN MainTracker  ON MainTracker.MachineId=CustomEvents.MachineId ";
                                }
                            }
                            else
                            {
                                GroupBy = "CustomEvents.ContactId,MainTracker.MachineId";

                                TableQuery += $" COALESCE(CustomEvents.ContactId,0) as ContactId,COALESCE(MainTracker.MachineId,'0') as MachineId,cast('0' as varchar) as DeviceId,MAX(COALESCE(CustomEvents.EventTime,MainTracker.TimeEnd)) AS UpdatedDate " +
                                          $"FROM CustomEvents  " +
                                          $"INNER JOIN MainTracker  ON MainTracker.MachineId=CustomEvents.MachineId ";
                            }
                        }
                        else
                        {

                            if (IsSubQuery)
                            {
                                if (IsContactTablePresent)
                                {
                                    GroupBy = "VisitorInformation.ContactId";

                                    TableQuery += $" COALESCE(VisitorInformation.ContactId,0) as ContactId " +
                                              $"FROM VisitorInformation  " +
                                              $"RIGHT JOIN MainTracker  ON MainTracker.MachineId=VisitorInformation.MachineId  AND VisitorInformation.SourceType=1 ";
                                }
                                else
                                {
                                    GroupBy = "MainTracker.MachineId";

                                    TableQuery += $" COALESCE(MainTracker.MachineId,'0') as MachineId " +
                                              $"FROM VisitorInformation  " +
                                              $"RIGHT JOIN MainTracker  ON MainTracker.MachineId=VisitorInformation.MachineId  AND VisitorInformation.SourceType=1 ";
                                }
                            }
                            else
                            {
                                GroupBy = "VisitorInformation.ContactId,MainTracker.MachineId";

                                TableQuery += $" COALESCE(VisitorInformation.ContactId,0) as ContactId,COALESCE(MainTracker.MachineId,'0') as MachineId,cast('0' as varchar) as DeviceId,MAX(MainTracker.TimeEnd) AS UpdatedDate " +
                                          $"FROM VisitorInformation  " +
                                          $"RIGHT JOIN MainTracker  ON MainTracker.MachineId=VisitorInformation.MachineId  AND VisitorInformation.SourceType=1 ";
                            }
                        }
                    }
                    else if (TableQuery != null && TableQuery.Length > 0)
                    {
                        if (TableNames.Contains("CustomEvents"))
                        {
                            TableQuery += $" INNER JOIN MainTracker  ON MainTracker.MachineId=CustomEvents.MachineId ";
                        }
                        else
                        {
                            TableQuery += $" INNER JOIN MainTracker  ON MainTracker.MachineId=VisitorInformation.MachineId ";
                        }
                    }
                }
                else if (table.Contains("EventTracker"))
                {
                    //if (DateCondition.Length > 0)
                    //{
                    //    DateCondition += $" AND (EventTracker.Date between DATEADD(DAY, -{Days}, GETDATE()) and GETDATE()) ";
                    //}
                    //else
                    //{
                    //    DateCondition += $" (EventTracker.Date between DATEADD(DAY, -{Days}, GETDATE()) and GETDATE()) ";
                    //}


                    if (TableQuery != null && TableQuery.Length == 0)
                    {
                        if (TableNames.Contains("CustomEvents"))
                        {

                            if (IsSubQuery)
                            {
                                if (IsContactTablePresent)
                                {
                                    GroupBy = "CustomEvents.ContactId";

                                    TableQuery += $" COALESCE(CustomEvents.ContactId,0) as ContactId " +
                                              $"FROM CustomEvents  " +
                                              $"INNER JOIN EventTracker  ON EventTracker.MachineId=CustomEvents.MachineId ";
                                }
                                else
                                {
                                    GroupBy = "EventTracker.MachineId";

                                    TableQuery += $" COALESCE(EventTracker.MachineId,'0') as MachineId " +
                                              $"FROM CustomEvents  " +
                                              $"INNER JOIN EventTracker  ON EventTracker.MachineId=CustomEvents.MachineId ";
                                }
                            }
                            else
                            {
                                GroupBy = "CustomEvents.ContactId,EventTracker.MachineId";

                                TableQuery += $" COALESCE(CustomEvents.ContactId,0) as ContactId,COALESCE(EventTracker.MachineId,'0') as MachineId,cast('0' as varchar) as DeviceId, MAX(COALESCE(CustomEvents.EventTime,EventTracker.Date)) AS UpdatedDate " +
                                          $"FROM CustomEvents  " +
                                          $"INNER JOIN EventTracker  ON EventTracker.MachineId=CustomEvents.MachineId ";
                            }
                        }
                        else
                        {

                            if (IsSubQuery)
                            {
                                if (IsContactTablePresent)
                                {
                                    GroupBy = "VisitorInformation.ContactId";

                                    TableQuery += $" COALESCE(VisitorInformation.ContactId,0) as ContactId " +
                                              $"FROM VisitorInformation  " +
                                              $"RIGHT JOIN EventTracker  ON EventTracker.MachineId=VisitorInformation.MachineId  AND VisitorInformation.SourceType=1 ";
                                }
                                else
                                {
                                    GroupBy = "EventTracker.MachineId";

                                    TableQuery += $" COALESCE(EventTracker.MachineId,'0') as MachineId " +
                                              $"FROM VisitorInformation  " +
                                              $"RIGHT JOIN EventTracker  ON EventTracker.MachineId=VisitorInformation.MachineId  AND VisitorInformation.SourceType=1 ";
                                }
                            }
                            else
                            {
                                GroupBy = "VisitorInformation.ContactId,EventTracker.MachineId";

                                TableQuery += $" COALESCE(VisitorInformation.ContactId,0) as ContactId,COALESCE(EventTracker.MachineId,'0') as MachineId,cast('0' as varchar) as DeviceId,MAX(EventTracker.Date) AS UpdatedDate " +
                                          $"FROM VisitorInformation  " +
                                          $"RIGHT JOIN EventTracker  ON EventTracker.MachineId=VisitorInformation.MachineId  AND VisitorInformation.SourceType=1 ";
                            }
                        }

                    }
                    else if (TableQuery != null && TableQuery.Length > 0)
                    {
                        if (TableNames.Contains("CustomEvents"))
                        {
                            TableQuery += $" INNER JOIN EventTracker  ON EventTracker.MachineId=CustomEvents.MachineId ";
                        }
                        else
                        {
                            TableQuery += $" INNER JOIN EventTracker  ON EventTracker.MachineId=VisitorInformation.MachineId ";
                        }
                    }
                }
                else if (table.Contains("WebPushSent"))
                {
                    //if (DateCondition.Length > 0)
                    //{
                    //    DateCondition += $" AND (WebPushSent.SentDate between DATEADD(DAY, -{Days}, GETDATE()) and GETDATE()) ";
                    //}
                    //else
                    //{
                    //    DateCondition += $" (WebPushSent.SentDate between DATEADD(DAY, -{Days}, GETDATE()) and GETDATE()) ";
                    //}


                    if (TableQuery != null && TableQuery.Length == 0)
                    {
                        if (TableNames.Contains("CustomEvents"))
                        {
                            if (IsSubQuery)
                            {
                                if (IsContactTablePresent)
                                {
                                    GroupBy = "CustomEvents.ContactId";

                                    TableQuery += $" COALESCE(CustomEvents.ContactId,0) as ContactId " +
                                              $"FROM CustomEvents  " +
                                              $"INNER JOIN WebPushSent  ON WebPushSent.MachineId=CustomEvents.MachineId ";
                                }
                                else
                                {
                                    GroupBy = "WebPushSent.MachineId";

                                    TableQuery += $" COALESCE(WebPushSent.MachineId,'0') as MachineId " +
                                              $"FROM CustomEvents  " +
                                              $"INNER JOIN WebPushSent  ON WebPushSent.MachineId=CustomEvents.MachineId ";
                                }
                            }
                            else
                            {
                                GroupBy = "CustomEvents.ContactId,WebPushSent.MachineId";

                                TableQuery += $" COALESCE(CustomEvents.ContactId,0) as ContactId,COALESCE(WebPushSent.MachineId,'0') as MachineId,cast('0' as varchar) as DeviceId,MAX(COALESCE(CustomEvents.EventTime,WebPushSent.SentDate)) AS UpdatedDate " +
                                          $"FROM CustomEvents  " +
                                          $"INNER JOIN WebPushSent  ON WebPushSent.MachineId=CustomEvents.MachineId ";
                            }
                        }
                        else
                        {

                            if (IsSubQuery)
                            {
                                if (IsContactTablePresent)
                                {
                                    GroupBy = "VisitorInformation.ContactId";

                                    TableQuery += $" COALESCE(VisitorInformation.ContactId,0) as ContactId,COALESCE(WebPushSent.MachineId,'0') as MachineId,cast('0' as varchar) as DeviceId " +
                                              $"FROM VisitorInformation  " +
                                              $"RIGHT JOIN WebPushSent  ON WebPushSent.MachineId=VisitorInformation.MachineId  AND VisitorInformation.SourceType=1 ";
                                }
                                else
                                {
                                    GroupBy = "WebPushSent.MachineId";

                                    TableQuery += $" COALESCE(VisitorInformation.ContactId,0) as ContactId,COALESCE(WebPushSent.MachineId,'0') as MachineId,cast('0' as varchar) as DeviceId " +
                                              $"FROM VisitorInformation  " +
                                              $"RIGHT JOIN WebPushSent  ON WebPushSent.MachineId=VisitorInformation.MachineId  AND VisitorInformation.SourceType=1 ";
                                }
                            }
                            else
                            {
                                GroupBy = "VisitorInformation.ContactId,WebPushSent.MachineId";

                                TableQuery += $" COALESCE(VisitorInformation.ContactId,0) as ContactId,COALESCE(WebPushSent.MachineId,'0') as MachineId,cast('0' as varchar) as DeviceId,MAX(WebPushSent.SentDate) AS UpdatedDate " +
                                          $"FROM VisitorInformation  " +
                                          $"RIGHT JOIN WebPushSent  ON WebPushSent.MachineId=VisitorInformation.MachineId  AND VisitorInformation.SourceType=1 ";
                            }
                        }

                    }
                    else if (TableQuery != null && TableQuery.Length > 0)
                    {
                        if (TableNames.Contains("CustomEvents"))
                        {
                            TableQuery += $" INNER JOIN WebPushSent  ON WebPushSent.MachineId=CustomEvents.MachineId ";
                        }
                        else
                        {
                            TableQuery += $" INNER JOIN WebPushSent  ON WebPushSent.MachineId=VisitorInformation.MachineId ";
                        }
                    }
                }
                else if (table.Contains("WebPushUser"))
                {
                    //if (DateCondition.Length > 0)
                    //{
                    //    DateCondition += $" AND (WebPushSent.SentDate between DATEADD(DAY, -{Days}, GETDATE()) and GETDATE()) ";
                    //}
                    //else
                    //{
                    //    DateCondition += $" (WebPushSent.SentDate between DATEADD(DAY, -{Days}, GETDATE()) and GETDATE()) ";
                    //}


                    if (TableQuery != null && TableQuery.Length == 0)
                    {
                        if (TableNames.Contains("CustomEvents"))
                        {
                            if (IsSubQuery)
                            {
                                if (IsContactTablePresent)
                                {
                                    GroupBy = "CustomEvents.ContactId";

                                    TableQuery += $" COALESCE(CustomEvents.ContactId,0) as ContactId " +
                                              $"FROM CustomEvents  " +
                                              $"INNER JOIN WebPushUser  ON WebPushUser.MachineId=CustomEvents.MachineId ";
                                }
                                else
                                {
                                    GroupBy = "WebPushUser.MachineId";

                                    TableQuery += $" COALESCE(WebPushUser.MachineId,'0') as MachineId " +
                                              $"FROM CustomEvents  " +
                                              $"INNER JOIN WebPushUser  ON WebPushUser.MachineId=CustomEvents.MachineId ";
                                }
                            }
                            else
                            {
                                GroupBy = "CustomEvents.ContactId,WebPushUser.MachineId";

                                TableQuery += $" COALESCE(CustomEvents.ContactId,0) as ContactId,COALESCE(WebPushUser.MachineId,'0') as MachineId,cast('0' as varchar) as DeviceId,MAX(COALESCE(CustomEvents.EventTime,WebPushUser.SubscribeDate)) AS UpdatedDate " +
                                          $"FROM CustomEvents  " +
                                          $"INNER JOIN WebPushUser  ON WebPushUser.MachineId=CustomEvents.MachineId ";
                            }
                        }
                        else
                        {

                            if (IsSubQuery)
                            {
                                if (IsContactTablePresent)
                                {
                                    GroupBy = "VisitorInformation.ContactId";

                                    TableQuery += $" COALESCE(VisitorInformation.ContactId,0) as ContactId,COALESCE(WebPushSent.MachineId,'0') as MachineId,cast('0' as varchar) as DeviceId " +
                                              $"FROM VisitorInformation  " +
                                              $"RIGHT JOIN WebPushUser  ON WebPushUser.MachineId=VisitorInformation.MachineId  AND VisitorInformation.SourceType=1 ";
                                }
                                else
                                {
                                    GroupBy = "WebPushUser.MachineId";

                                    TableQuery += $" COALESCE(VisitorInformation.ContactId,0) as ContactId,COALESCE(WebPushUser.MachineId,'0') as MachineId,cast('0' as varchar) as DeviceId " +
                                              $"FROM VisitorInformation  " +
                                              $"RIGHT JOIN WebPushUser  ON WebPushUser.MachineId=VisitorInformation.MachineId  AND VisitorInformation.SourceType=1 ";
                                }
                            }
                            else
                            {
                                GroupBy = "VisitorInformation.ContactId,WebPushUser.MachineId";

                                TableQuery += $" COALESCE(VisitorInformation.ContactId,0) as ContactId,COALESCE(WebPushUser.MachineId,'0') as MachineId,cast('0' as varchar) as DeviceId,MAX(WebPushUser.SubscribeDate) AS UpdatedDate " +
                                          $"FROM VisitorInformation  " +
                                          $"RIGHT JOIN WebPushUser  ON WebPushUser.MachineId=VisitorInformation.MachineId  AND VisitorInformation.SourceType=1 ";
                            }
                        }

                    }
                    else if (TableQuery != null && TableQuery.Length > 0)
                    {
                        if (TableNames.Contains("CustomEvents"))
                        {
                            TableQuery += $" INNER JOIN WebPushUser  ON WebPushUser.MachineId=CustomEvents.MachineId ";
                        }
                        else
                        {
                            TableQuery += $" INNER JOIN WebPushUser  ON WebPushUser.MachineId=VisitorInformation.MachineId ";
                        }
                    }
                }
                else if (table.Contains("MailSent"))
                {
                    //if (DateCondition.Length > 0)
                    //{
                    //    DateCondition += $" AND (MailSent.SentDate between DATEADD(DAY, -{Days}, GETDATE()) and GETDATE()) ";
                    //}
                    //else
                    //{
                    //    DateCondition += $" (MailSent.SentDate between DATEADD(DAY, -{Days}, GETDATE()) and GETDATE()) ";
                    //}

                    if (TableQuery != null && TableQuery.Length == 0)
                    {
                        if (TableNames.Contains("CustomEvents"))
                        {
                            if (IsSubQuery)
                            {
                                if (IsContactTablePresent)
                                {
                                    GroupBy = "MailSent.ContactId";

                                    TableQuery += $" COALESCE(MailSent.ContactId,0) as ContactId " +
                                              $"FROM CustomEvents  " +
                                              $"INNER JOIN MailSent  ON MailSent.ContactId=CustomEvents.ContactId ";
                                }
                                else
                                {
                                    GroupBy = "CustomEvents.MachineId";

                                    TableQuery += $" COALESCE(CustomEvents.MachineId,'0') as MachineId " +
                                              $"FROM CustomEvents  " +
                                              $"INNER JOIN MailSent  ON MailSent.ContactId=CustomEvents.ContactId ";
                                }
                            }
                            else
                            {
                                GroupBy = "MailSent.ContactId,CustomEvents.MachineId";

                                TableQuery += $" COALESCE(MailSent.ContactId,0) as ContactId,COALESCE(CustomEvents.MachineId,'0') as MachineId,cast('0' as varchar) as DeviceId,MAX(COALESCE(CustomEvents.EventTime,MailSent.SentDate)) AS UpdatedDate " +
                                          $"FROM CustomEvents  " +
                                          $"INNER JOIN MailSent  ON MailSent.ContactId=CustomEvents.ContactId ";
                            }
                        }
                        else
                        {
                            if (IsSubQuery)
                            {
                                if (IsContactTablePresent)
                                {
                                    GroupBy = "MailSent.ContactId";

                                    TableQuery += $" COALESCE(MailSent.ContactId,0) as ContactId " +
                                              $"FROM VisitorInformation  " +
                                              $"RIGHT JOIN MailSent  ON MailSent.ContactId=VisitorInformation.ContactId  AND VisitorInformation.SourceType=1 ";
                                }
                                else
                                {
                                    GroupBy = "VisitorInformation.MachineId";

                                    TableQuery += $" COALESCE(VisitorInformation.MachineId,'0') as MachineId " +
                                              $"FROM VisitorInformation  " +
                                              $"RIGHT JOIN MailSent  ON MailSent.ContactId=VisitorInformation.ContactId  AND VisitorInformation.SourceType=1 ";
                                }
                            }
                            else
                            {
                                GroupBy = "MailSent.ContactId,VisitorInformation.MachineId";

                                TableQuery += $" COALESCE(MailSent.ContactId,0) as ContactId,COALESCE(VisitorInformation.MachineId,'0') as MachineId,cast('0' as varchar) as DeviceId,MAX(MailSent.SentDate) AS UpdatedDate " +
                                          $"FROM VisitorInformation  " +
                                          $"RIGHT JOIN MailSent  ON MailSent.ContactId=VisitorInformation.ContactId  AND VisitorInformation.SourceType=1 ";
                            }
                        }
                    }
                    else if (TableQuery != null && TableQuery.Length > 0)
                    {
                        if (TableNames.Contains("CustomEvents"))
                        {
                            TableQuery += $" INNER JOIN MailSent  ON MailSent.ContactId=CustomEvents.ContactId ";
                        }
                        else
                        {
                            TableQuery += $" INNER JOIN MailSent  ON MailSent.ContactId=VisitorInformation.ContactId ";
                        }
                    }

                }
                else if (table.Contains("SmsSent"))
                {
                    //if (DateCondition.Length > 0)
                    //{
                    //    DateCondition += $" AND (SmsSent.SentDate between DATEADD(DAY, -{Days}, GETDATE()) and GETDATE()) ";
                    //}
                    //else
                    //{
                    //    DateCondition += $" (SmsSent.SentDate between DATEADD(DAY, -{Days}, GETDATE()) and GETDATE()) ";
                    //}

                    if (TableQuery != null && TableQuery.Length == 0)
                    {
                        if (TableNames.Contains("CustomEvents"))
                        {
                            if (IsSubQuery)
                            {
                                if (IsContactTablePresent)
                                {
                                    GroupBy = "SmsSent.ContactId";

                                    TableQuery += $" COALESCE(CustomEvents.MachineId,'0') as MachineId " +
                                              $"FROM CustomEvents  " +
                                              $"INNER JOIN SmsSent  ON SmsSent.ContactId=CustomEvents.ContactId ";
                                }
                                else
                                {
                                    GroupBy = "CustomEvents.MachineId";

                                    TableQuery += $" COALESCE(CustomEvents.MachineId,'0') as MachineId " +
                                              $"FROM CustomEvents  " +
                                              $"INNER JOIN SmsSent  ON SmsSent.ContactId=CustomEvents.ContactId ";
                                }
                            }
                            else
                            {
                                GroupBy = "SmsSent.ContactId,CustomEvents.MachineId";

                                TableQuery += $" COALESCE(SmsSent.ContactId,0) as ContactId,COALESCE(CustomEvents.MachineId,'0') as MachineId,cast('0' as varchar) as DeviceId,MAX(COALESCE(CustomEvents.EventTime,SmsSent.SentDate)) AS UpdatedDate " +
                                          $"FROM CustomEvents  " +
                                          $"INNER JOIN SmsSent  ON SmsSent.ContactId=CustomEvents.ContactId ";
                            }
                        }
                        else
                        {

                            if (IsSubQuery)
                            {
                                if (IsContactTablePresent)
                                {
                                    GroupBy = "SmsSent.ContactId";

                                    TableQuery += $" COALESCE(SmsSent.ContactId,0) as ContactId " +
                                              $"FROM VisitorInformation  " +
                                              $"RIGHT JOIN SmsSent  ON SmsSent.ContactId=VisitorInformation.ContactId  AND VisitorInformation.SourceType=1 ";
                                }
                                else
                                {
                                    GroupBy = "VisitorInformation.MachineId";

                                    TableQuery += $" COALESCE(VisitorInformation.MachineId,'0') as MachineId " +
                                              $"FROM VisitorInformation  " +
                                              $"RIGHT JOIN SmsSent  ON SmsSent.ContactId=VisitorInformation.ContactId  AND VisitorInformation.SourceType=1 ";
                                }
                            }
                            else
                            {

                                if (IsSubQuery)
                                {
                                    if (IsContactTablePresent)
                                    {
                                        GroupBy = "SmsSent.ContactId";

                                        TableQuery += $" COALESCE(SmsSent.ContactId,0) as ContactId " +
                                                  $"FROM VisitorInformation  " +
                                                  $"RIGHT JOIN SmsSent  ON SmsSent.ContactId=VisitorInformation.ContactId  AND VisitorInformation.SourceType=1 ";
                                    }
                                    else
                                    {
                                        GroupBy = "VisitorInformation.MachineId";

                                        TableQuery += $" COALESCE(VisitorInformation.MachineId,'0') as MachineId " +
                                                  $"FROM VisitorInformation  " +
                                                  $"RIGHT JOIN SmsSent  ON SmsSent.ContactId=VisitorInformation.ContactId  AND VisitorInformation.SourceType=1 ";
                                    }
                                }
                                else
                                {
                                    GroupBy = "SmsSent.ContactId,VisitorInformation.MachineId";

                                    TableQuery += $" COALESCE(SmsSent.ContactId,0) as ContactId,COALESCE(VisitorInformation.MachineId,'0') as MachineId,cast('0' as varchar) as DeviceId,MAX(SmsSent.SentDate) AS UpdatedDate " +
                                              $"FROM VisitorInformation  " +
                                              $"RIGHT JOIN SmsSent  ON SmsSent.ContactId=VisitorInformation.ContactId  AND VisitorInformation.SourceType=1 ";
                                }
                            }
                        }
                    }
                    else if (TableQuery != null && TableQuery.Length > 0)
                    {
                        if (TableNames.Contains("CustomEvents"))
                        {
                            TableQuery += $" INNER JOIN SmsSent  ON SmsSent.ContactId=CustomEvents.ContactId ";
                        }
                        else
                        {
                            TableQuery += $" INNER JOIN SmsSent  ON SmsSent.ContactId=VisitorInformation.ContactId ";
                        }
                    }

                }
                else if (table.Contains("WhatsappSent"))
                {
                    //if (DateCondition.Length > 0)
                    //{
                    //    DateCondition += $" AND (WhatsappSent.SentDate between DATEADD(DAY, -{Days}, GETDATE()) and GETDATE()) ";
                    //}
                    //else
                    //{
                    //    DateCondition += $" (WhatsappSent.SentDate between DATEADD(DAY, -{Days}, GETDATE()) and GETDATE()) ";
                    //}

                    if (TableQuery != null && TableQuery.Length == 0)
                    {
                        if (TableNames.Contains("CustomEvents"))
                        {
                            if (IsSubQuery)
                            {
                                if (IsContactTablePresent)
                                {
                                    GroupBy = "WhatsappSent.ContactId";

                                    TableQuery += $" COALESCE(WhatsappSent.ContactId,0) as ContactId " +
                                              $"FROM CustomEvents  " +
                                              $"INNER JOIN WhatsappSent  ON WhatsappSent.ContactId=CustomEvents.ContactId ";
                                }
                                else
                                {
                                    GroupBy = "CustomEvents.MachineId";

                                    TableQuery += $" COALESCE(CustomEvents.MachineId,'0') as MachineId " +
                                              $"FROM CustomEvents  " +
                                              $"INNER JOIN WhatsappSent  ON WhatsappSent.ContactId=CustomEvents.ContactId ";
                                }
                            }
                            else
                            {
                                if (IsSubQuery)
                                {
                                    if (IsContactTablePresent)
                                    {
                                        GroupBy = "WhatsappSent.ContactId";

                                        TableQuery += $" COALESCE(WhatsappSent.ContactId,0) as ContactId " +
                                                  $"FROM CustomEvents  " +
                                                  $"INNER JOIN WhatsappSent  ON WhatsappSent.ContactId=CustomEvents.ContactId ";
                                    }
                                    else
                                    {
                                        GroupBy = "CustomEvents.MachineId";

                                        TableQuery += $" COALESCE(CustomEvents.MachineId,'0') as MachineId " +
                                                  $"FROM CustomEvents  " +
                                                  $"INNER JOIN WhatsappSent  ON WhatsappSent.ContactId=CustomEvents.ContactId ";
                                    }
                                }
                                else
                                {
                                    if (IsSubQuery)
                                    {
                                        if (IsContactTablePresent)
                                        {
                                            GroupBy = "WhatsappSent.ContactId";

                                            TableQuery += $" COALESCE(WhatsappSent.ContactId,0) as ContactId " +
                                                      $"FROM CustomEvents  " +
                                                      $"INNER JOIN WhatsappSent  ON WhatsappSent.ContactId=CustomEvents.ContactId ";
                                        }
                                        else
                                        {
                                            GroupBy = "CustomEvents.MachineId";

                                            TableQuery += $" COALESCE(CustomEvents.MachineId,'0') as MachineId " +
                                                      $"FROM CustomEvents  " +
                                                      $"INNER JOIN WhatsappSent  ON WhatsappSent.ContactId=CustomEvents.ContactId ";
                                        }
                                    }
                                    else
                                    {
                                        if (IsSubQuery)
                                        {
                                            if (IsContactTablePresent)
                                            {
                                                GroupBy = "WhatsappSent.ContactId";

                                                TableQuery += $" COALESCE(WhatsappSent.ContactId,0) as ContactId " +
                                                          $"FROM CustomEvents  " +
                                                          $"INNER JOIN WhatsappSent  ON WhatsappSent.ContactId=CustomEvents.ContactId ";
                                            }
                                            else
                                            {
                                                GroupBy = "CustomEvents.MachineId";

                                                TableQuery += $" COALESCE(CustomEvents.MachineId,'0') as MachineId " +
                                                          $"FROM CustomEvents  " +
                                                          $"INNER JOIN WhatsappSent  ON WhatsappSent.ContactId=CustomEvents.ContactId ";
                                            }
                                        }
                                        else
                                        {
                                            GroupBy = "WhatsappSent.ContactId,CustomEvents.MachineId";

                                            TableQuery += $" COALESCE(WhatsappSent.ContactId,0) as ContactId,COALESCE(CustomEvents.MachineId,'0') as MachineId,cast('0' as varchar) as DeviceId,MAX(COALESCE(CustomEvents.EventTime,WhatsappSent.SentDate)) AS UpdatedDate " +
                                                      $"FROM CustomEvents  " +
                                                      $"INNER JOIN WhatsappSent  ON WhatsappSent.ContactId=CustomEvents.ContactId ";
                                        }
                                    }
                                }
                            }
                        }
                        else
                        {
                            if (IsSubQuery)
                            {
                                if (IsContactTablePresent)
                                {
                                    GroupBy = "WhatsappSent.ContactId";

                                    TableQuery += $" COALESCE(VisitorInformation.MachineId,'0') as MachineId " +
                                              $"FROM VisitorInformation  " +
                                              $"RIGHT JOIN WhatsappSent  ON WhatsappSent.ContactId=VisitorInformation.ContactId  AND VisitorInformation.SourceType=1 ";
                                }
                                else
                                {
                                    GroupBy = "VisitorInformation.MachineId";

                                    TableQuery += $" COALESCE(VisitorInformation.MachineId,'0') as MachineId " +
                                              $"FROM VisitorInformation  " +
                                              $"RIGHT JOIN WhatsappSent  ON WhatsappSent.ContactId=VisitorInformation.ContactId  AND VisitorInformation.SourceType=1 ";
                                }
                            }
                            else
                            {
                                GroupBy = "WhatsappSent.ContactId,VisitorInformation.MachineId";

                                TableQuery += $" COALESCE(WhatsappSent.ContactId,0) as ContactId,COALESCE(VisitorInformation.MachineId,'0') as MachineId,cast('0' as varchar) as DeviceId,MAX(WhatsappSent.SentDate) AS UpdatedDate " +
                                          $"FROM VisitorInformation  " +
                                          $"RIGHT JOIN WhatsappSent  ON WhatsappSent.ContactId=VisitorInformation.ContactId  AND VisitorInformation.SourceType=1 ";
                            }
                        }

                    }
                    else if (TableQuery != null && TableQuery.Length > 0)
                    {
                        if (TableNames.Contains("CustomEvents"))
                        {
                            TableQuery += $" INNER JOIN WhatsappSent  ON WhatsappSent.ContactId=CustomEvents.ContactId ";
                        }
                        else
                        {
                            TableQuery += $" INNER JOIN WhatsappSent  ON WhatsappSent.ContactId=VisitorInformation.ContactId ";
                        }
                    }

                }
                else if (table.Contains("CustomEvents"))
                {
                    //if (DateCondition.Length > 0)
                    //{
                    //    DateCondition += $" AND (CustomEvents.UpdatedDate between DATEADD(DAY, -{Days}, GETDATE()) and GETDATE()) ";
                    //}
                    //else
                    //{
                    //    DateCondition += $" (CustomEvents.UpdatedDate between DATEADD(DAY, -{Days}, GETDATE()) and GETDATE()) ";
                    //}


                    if (TableQuery != null && TableQuery.Length == 0)
                    {
                        if (IsSubQuery)
                        {
                            if (IsContactTablePresent)
                            {
                                GroupBy = "CustomEvents.ContactId,CustomEvents.MachineId";

                                TableQuery += $" COALESCE(CustomEvents.ContactId,0) as ContactId,COALESCE(CustomEvents.MachineId,'0') as MachineId,cast('0' as varchar) as DeviceId " +
                                              $"FROM VisitorInformation  " +
                                              $"RIGHT JOIN CustomEvents  ON CustomEvents.MachineId=VisitorInformation.MachineId  AND VisitorInformation.SourceType=1 ";
                            }
                            else
                            {
                                GroupBy = "CustomEvents.ContactId,CustomEvents.MachineId";

                                TableQuery += $" COALESCE(CustomEvents.ContactId,0) as ContactId,COALESCE(CustomEvents.MachineId,'0') as MachineId,cast('0' as varchar) as DeviceId " +
                                              $"FROM VisitorInformation  " +
                                              $"RIGHT JOIN CustomEvents  ON CustomEvents.MachineId=VisitorInformation.MachineId  AND VisitorInformation.SourceType=1 ";
                            }
                        }
                        else
                        {
                            GroupBy = "CustomEvents.ContactId,CustomEvents.MachineId";

                            TableQuery += $" COALESCE(CustomEvents.ContactId,0) as ContactId,COALESCE(CustomEvents.MachineId,'0') as MachineId,cast('0' as varchar) as DeviceId,MAX(CustomEvents.EventTime) AS UpdatedDate " +
                                          $"FROM VisitorInformation  " +
                                          $"RIGHT JOIN CustomEvents  ON CustomEvents.MachineId=VisitorInformation.MachineId  AND VisitorInformation.SourceType=1 ";
                        }
                    }
                }
            }

            Query += TableQuery;

            //if (TableNames.Contains("SessionTracker") && TableNames.Contains("Contact"))
            //{
            //    Query += "Contact.ContactId as ContactId,VisitorInformation.MachineId as MachineId,0 as DeviceId from Contact" +
            //          " inner join VisitorInformation" +
            //          " on VisitorInformation.ContactId = Contact.ContactId" +
            //          " inner join SessionTracker" +
            //          " on SessionTracker.MachineId = VisitorInformation.MachineId";
            //}
            //else if (TableNames.Contains("Contact"))
            //{
            //    Query += "Contact.ContactId as ContactId,0 as MachineId,0 as DeviceId from Contact";
            //}
            //else if (TableNames.Contains("SessionTracker"))
            //{
            //    Query += "0 as ContactId,SessionTracker.MachineId as MachineId,0 as DeviceId from SessionTracker";
            //}


            P5SqlQueryBuilder qBuilder = new P5SqlQueryBuilder();
            List<P5SqlWhereClause> WhereStatementList = new List<P5SqlWhereClause>();
            if (Segment.Count > 0)
            {
                for (int i = 0; i < Segment.Count; i++)
                {
                    var getcol = Segment[i].Table + "." + Segment[i].Column;
                    if (Segment[i].DataType != null && Segment[i].DataType.IndexOf("date") > -1)
                    {
                        getcol = "CAST(" + getcol + "  AS DATE)";
                    }
                    else if (Segment[i].DataType != null && Segment[i].DataType.IndexOf("number") > -1)
                    {
                        getcol = "try_convert_decimal(" + getcol + ")";
                    }

                    var getComparison = Segment[i].Operator;
                    var Comparison = P5SqlComparison.Equals; //getComparison == "Equals" ? P5SqlComparison.Equals : getComparison == "GreaterOrEquals" ? P5SqlComparison.GreaterOrEquals : getComparison == "GreaterThan" ? P5SqlComparison.GreaterThan : getComparison == "In" ? P5SqlComparison.In : getComparison == "LessOrEquals" ? P5SqlComparison.LessOrEquals : getComparison == "LessThan" ? P5SqlComparison.LessThan : getComparison == "Like" ? P5SqlComparison.Like : getComparison == "NotEquals" ? P5SqlComparison.NotEquals : getComparison == "NotLike" ? P5SqlComparison.NotLike : P5SqlComparison.Equals;
                    switch (getComparison)
                    {
                        case "Equals":
                            Comparison = P5SqlComparison.Equals;
                            break;
                        case "GreaterOrEquals":
                            Comparison = P5SqlComparison.GreaterOrEquals;
                            break;
                        case "GreaterThan":
                            Comparison = P5SqlComparison.GreaterThan;
                            break;
                        case "In":
                            Comparison = P5SqlComparison.In;
                            break;
                        case "LessOrEquals":
                            Comparison = P5SqlComparison.LessOrEquals;
                            break;
                        case "LessThan":
                            Comparison = P5SqlComparison.LessThan;
                            break;
                        case "Like":
                            Comparison = P5SqlComparison.Like;
                            break;
                        case "NotEquals":
                            Comparison = P5SqlComparison.NotEquals;
                            break;
                        case "NotLike":
                            Comparison = P5SqlComparison.NotLike;
                            break;
                        case "IsNotEmpty":
                            Comparison = P5SqlComparison.IsNotEmpty;
                            break;
                        case "IsEmpty":
                            Comparison = P5SqlComparison.IsEmpty;
                            break;
                        case "CountEquals":
                            Comparison = P5SqlComparison.CountEquals;
                            break;
                        case "CountGreaterThan":
                            Comparison = P5SqlComparison.CountGreaterThan;
                            break;
                        case "CountLessThan":
                            Comparison = P5SqlComparison.CountLessThan;
                            break;
                        case "CountNotEquals":
                            Comparison = P5SqlComparison.CountNotEquals;
                            break;
                        case "AverageEquals":
                            Comparison = P5SqlComparison.AverageEquals;
                            break;
                        case "AverageGreaterThan":
                            Comparison = P5SqlComparison.AverageGreaterThan;
                            break;
                        case "AverageLessThan":
                            Comparison = P5SqlComparison.AverageLessThan;
                            break;
                        case "AverageNotEquals":
                            Comparison = P5SqlComparison.AverageNotEquals;
                            break;
                        case "TotalEquals":
                            Comparison = P5SqlComparison.TotalEquals;
                            break;
                        case "TotalGreaterThan":
                            Comparison = P5SqlComparison.TotalGreaterThan;
                            break;
                        case "TotalLessThan":
                            Comparison = P5SqlComparison.TotalLessThan;
                            break;
                        case "TotalNotEquals":
                            Comparison = P5SqlComparison.TotalNotEquals;
                            break;
                        default:
                            Comparison = P5SqlComparison.Equals;
                            break;
                    }

                    var getoperator = Segment[i].Comparison == "or" ? P5SqlLogicOperator.Or : P5SqlLogicOperator.And;
                    var whereclause = new P5SqlWhereClause() { LogicOperator = getoperator, FieldName = getcol, DataTye = Segment[i].DataType, ComparisonOperator = Comparison, Value = Segment[i].Value, Level = Segment[i].Level };


                    WhereStatementList.Add(whereclause);
                }
            }


            var filterwhereClauseCondition = GetClausesList(WhereStatementList);

            if (filterwhereClauseCondition.Item2.Count > 0)
            {
                Query += qBuilder.BuildWhereStatement(filterwhereClauseCondition.Item2);
                if (Query.LastIndexOf("AND )") > -1)
                {
                    Query = Query.Remove(Query.LastIndexOf("AND )")) + " )";
                }
            }
            else
            {
                Query += " WHERE ContactId > 0 OR COALESCE(MachineId,'')!='' ";

            }

            string Query1 = "";

            if (DateCondition.Item1.Length > 0)
            {
                Query1 = Query.Replace("WHERE", "WHERE " + DateCondition.Item2 + " AND ");
                Query = Query.Replace("WHERE", "WHERE " + DateCondition.Item1 + " AND ");
            }


            if (filterwhereClauseCondition.Item1.Count > 0)
            {
                Query += qBuilder.BuildHavingStatement(filterwhereClauseCondition.Item1, GroupBy);
                Query1 += qBuilder.BuildHavingStatement(filterwhereClauseCondition.Item1, GroupBy);
            }
            else
            {
                Query += $" GROUP BY {GroupBy}";
                Query1 += $" GROUP BY {GroupBy}";
            }

            //if (TableNames.Contains("SessionTracker") && TableNames.Contains("Contact") && IsNewOrExisting)
            //    Query = Query.Replace("WHERE", "WHERE (Contact.UpdatedDate between DATEADD(MINUTE, -5, GETDATE()) and GETDATE() and SessionTracker.Date between DATEADD(MINUTE, -5, GETDATE()) and GETDATE()) AND ");
            //else if (TableNames.Contains("Contact") && IsNewOrExisting)
            //    Query = Query.Replace("WHERE", "WHERE (Contact.UpdatedDate between DATEADD(MINUTE, -5, GETDATE()) and GETDATE()) AND ");
            //else if (TableNames.Contains("SessionTracker") && IsNewOrExisting)
            //    Query = Query.Replace("WHERE", "WHERE (SessionTracker.Date between DATEADD(MINUTE, -5, GETDATE()) and GETDATE()) AND ");




            return Tuple.Create(Query, Query1);
        }
        public async Task<int> SaveOrUpdateGroup(int accountId, Groups group)
        {

            if (group.Id <= 0)
            {
                using (var objDL = DLGroups.GetDLGroups(accountId, SQLProvider))
                {
                    return await objDL.Save(group);

                }
            }
            else if (group.Id > 0)
            {
                using (var objDL = DLGroups.GetDLGroups(accountId, SQLProvider))
                {
                    if (!await objDL.Update(group))
                    {
                        return -1;
                    }
                }
            }

            return 0;

        }
        public async Task<ActionResult> GetSegment([FromBody] CreateSegment_GetSegmentDto CreateSegmentDto)
        {
            List<P5GenralML.SegmentBuilder> Value = new List<P5GenralML.SegmentBuilder>();
            using (var objDL = DLSegmentBuilder.GetDLSegmentBuilder(CreateSegmentDto.AccountId, SQLProvider))
            {
                Value = (await objDL.GET(CreateSegmentDto.GroupId)).ToList();
            }
            var getdata = JsonConvert.SerializeObject(Value, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");
        }

        public async Task<ActionResult> GetGroupMaxCount([FromBody] CreateSegment_GetGroupMaxCountDto CreateSegmentDto)
        {
            int returnVal = 1;
            using (var objDL = DLGroups.GetDLGroups(CreateSegmentDto.accountId, SQLProvider))
            {
                LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
                Groups group = new Groups() { Name = "", UserGroupId = user.UserId };
                returnVal = await objDL.MaxCount(group);
            }
            return Json(new
            {
                returnVal
            });
        }

        public async Task<JsonResult> VerifyQuery([FromBody] CreateSegment_VerifyQueryDto CreateSegmentDto)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            //#region Logs            
            //Int64 LogId = TrackLogs.SaveLog(account.AdsId, user.UserId, user.UserName, user.EmailId, "GroupByFilter", "Mail", "VerifyQuery", Helper.GetIP(), JsonConvert.SerializeObject(new { FilterQuery = FilterQuery }));
            //#endregion

            //string FilterQuery = getQuery(Segment, TableNames, true, false, Days);
            Tuple<string, string> FilterQuery = getQueryString(CreateSegmentDto.Segment, CreateSegmentDto.TableNames, true, false, CreateSegmentDto.Days, CreateSegmentDto.FromDate, CreateSegmentDto.ToDate);
            var data = await testResult(CreateSegmentDto.AccountId, FilterQuery.Item1);

            return Json(new { Status = data.Item1, Result = data.Item2, ContactList = data.Item3 });
        }

        private Tuple<List<P5SqlWhereClause>, List<P5SqlWhereClause>> GetClausesList(List<P5SqlWhereClause> WhereStatementList)
        {
            var havingClause = WhereStatementList.Where(x => x.ComparisonOperator == P5SqlComparison.CountEquals
            || x.ComparisonOperator == P5SqlComparison.CountGreaterThan
            || x.ComparisonOperator == P5SqlComparison.CountLessThan
            || x.ComparisonOperator == P5SqlComparison.CountNotEquals
            || x.ComparisonOperator == P5SqlComparison.AverageEquals
            || x.ComparisonOperator == P5SqlComparison.AverageGreaterThan
            || x.ComparisonOperator == P5SqlComparison.AverageLessThan
            || x.ComparisonOperator == P5SqlComparison.AverageNotEquals
            || x.ComparisonOperator == P5SqlComparison.TotalEquals
            || x.ComparisonOperator == P5SqlComparison.TotalGreaterThan
            || x.ComparisonOperator == P5SqlComparison.TotalLessThan
            || x.ComparisonOperator == P5SqlComparison.TotalNotEquals
            ).ToList();

            var whereClause = WhereStatementList.Where(x => x.ComparisonOperator == P5SqlComparison.Equals
            || x.ComparisonOperator == P5SqlComparison.GreaterOrEquals
            || x.ComparisonOperator == P5SqlComparison.GreaterThan
            || x.ComparisonOperator == P5SqlComparison.In
            || x.ComparisonOperator == P5SqlComparison.LessOrEquals
            || x.ComparisonOperator == P5SqlComparison.LessThan
            || x.ComparisonOperator == P5SqlComparison.Like
            || x.ComparisonOperator == P5SqlComparison.NotEquals
            || x.ComparisonOperator == P5SqlComparison.NotLike
            || x.ComparisonOperator == P5SqlComparison.IsNotEmpty
            || x.ComparisonOperator == P5SqlComparison.IsEmpty
            ).ToList();


            return Tuple.Create(havingClause, whereClause);
        }

        private Tuple<string, string> GetDateCondition(string tableName, int Days, string FromDate = null, string ToDate = null, bool IsRecurring = false)
        {
            string DateCondition = "";
            string IsRecurringDateCondition = "";

            switch (tableName)
            {
                case "Contact":
                    if (FromDate != null && ToDate != null)
                        DateCondition = $" (Contact.UpdatedDate between '{FromDate}' and '{ToDate}') ";
                    else
                        DateCondition = $" (Contact.UpdatedDate between CURRENT_DATE - INTERVAL '{Days} day' and now()) ";

                    if (IsRecurring)
                        IsRecurringDateCondition = $" (Contact.UpdatedDate between '$1' and '$2') ";

                    break;
                case "SessionTracker":
                    if (FromDate != null && ToDate != null)
                        DateCondition = $" (SessionTracker.Date between '{FromDate}' and '{ToDate}') ";
                    else
                        DateCondition = $" (SessionTracker.Date between CURRENT_DATE - INTERVAL '{Days} day' and now()) ";

                    if (IsRecurring)
                        IsRecurringDateCondition = $" (SessionTracker.Date between '$1' and '$2') ";

                    break;
                case "MainTracker":
                    if (FromDate != null && ToDate != null)
                        DateCondition = $" (MainTracker.Date between '{FromDate}' and '{ToDate}') ";
                    else
                        DateCondition = $" (MainTracker.Date between CURRENT_DATE - INTERVAL '{Days} day' and now()) ";

                    if (IsRecurring)
                        IsRecurringDateCondition = $" (MainTracker.Date between '$1' and '$2') ";

                    break;
                case "EventTracker":
                    if (FromDate != null && ToDate != null)
                        DateCondition = $" (EventTracker.Date between '{FromDate}' and '{ToDate}') ";
                    else
                        DateCondition = $" (EventTracker.Date between CURRENT_DATE - INTERVAL '{Days} day' and now()) ";

                    if (IsRecurring)
                        IsRecurringDateCondition = $" (EventTracker.Date between '$1' and '$2') ";

                    break;
                case "WebPushSent":
                    if (FromDate != null && ToDate != null)
                        DateCondition = $" (WebPushSent.SentDate between '{FromDate}' and '{ToDate}') ";
                    else
                        DateCondition = $" (WebPushSent.SentDate between CURRENT_DATE - INTERVAL '{Days} day' and now()) ";

                    if (IsRecurring)
                        IsRecurringDateCondition = $" (WebPushSent.SentDate between '$1' and '$2') ";

                    break;
                case "MailSent":
                    if (FromDate != null && ToDate != null)
                        DateCondition = $" (MailSent.SentDate between '{FromDate}' and '{ToDate}') ";
                    else
                        DateCondition = $" (MailSent.SentDate between CURRENT_DATE - INTERVAL '{Days} day' and now()) ";

                    if (IsRecurring)
                        IsRecurringDateCondition = $" (MailSent.SentDate between '$1' and '$2') ";

                    break;
                case "SmsSent":
                    if (FromDate != null && ToDate != null)
                        DateCondition = $" (SmsSent.SentDate between '{FromDate}' and '{ToDate}') ";
                    else
                        DateCondition = $" (SmsSent.SentDate between CURRENT_DATE - INTERVAL '{Days} day' and now()) ";

                    if (IsRecurring)
                        IsRecurringDateCondition = $" (SmsSent.SentDate between '$1' and '$2') ";

                    break;
                case "WhatsappSent":
                    if (FromDate != null && ToDate != null)
                        DateCondition = $" (WhatsappSent.SentDate between '{FromDate}' and '{ToDate}') ";
                    else
                        DateCondition = $" (WhatsappSent.SentDate between CURRENT_DATE - INTERVAL '{Days} day' and now()) ";

                    if (IsRecurring)
                        IsRecurringDateCondition = $" (WhatsappSent.SentDate between '$1' and '$2') ";

                    break;
                case "CustomEvents":
                    if (FromDate != null && ToDate != null)
                        DateCondition = $" (CustomEvents.EventTime between '{FromDate}' and '{ToDate}') ";
                    else
                        DateCondition = $" (CustomEvents.EventTime between CURRENT_DATE - INTERVAL '{Days} day' and now()) ";

                    if (IsRecurring)
                        IsRecurringDateCondition = $" (CustomEvents.EventTime between '$1' and '$2') ";
                    break;

                case "WebPushUser":
                    if (FromDate != null && ToDate != null)
                        DateCondition = $" (WebPushUser.SubscribeDate between '{FromDate}' and '{ToDate}') ";
                    else
                        DateCondition = $" (WebPushUser.SubscribeDate between CURRENT_DATE - INTERVAL '{Days} day' and now()) ";

                    if (IsRecurring)
                        IsRecurringDateCondition = $" (WebPushUser.SubscribeDate between '$1' and '$2') ";

                    break;
            }

            return Tuple.Create(DateCondition, IsRecurringDateCondition);
        }

        public async Task<Tuple<bool, string, List<MLSegmentOutputColumns>>> testResult(int AccountId, string FilterQuery)
        {
            var Status = true; string Result = "";
            List<MLSegmentOutputColumns> ContactList = null;

            if (FilterQuery.ToLower().IndexOf("insert") > -1 || FilterQuery.ToLower().IndexOf("delete") > -1 || FilterQuery.ToLower().IndexOf("truncate") > -1)
            {
                Status = false; Result = "Error : Dangerous SQL Statement.";
            }
            else
            {
                try
                {
                    using (var objBAL = DLSegmentBuilder.GetDLSegmentBuilder(AccountId, SQLProvider))
                    {
                        ContactList = (await objBAL.GetTestResultByQuery(FilterQuery)).ToList();
                    }
                    Status = true; Result = "Success";
                }
                catch (SqlException ex)
                {
                    Status = false; Result = "SqlError : " + ex.ToString();
                }
                catch (Exception ex)
                {
                    Status = false; Result = "Error : " + ex.ToString();
                }
            }

            return Tuple.Create(Status, Result, ContactList);
        }

        public async Task<JsonResult> GetAllTableColumns([FromBody] CreateSegment_GetAllTableColumnsDto CreateSegmentDto)
        {

            List<TableAndColumnNames> AllTableColumnsList = new List<TableAndColumnNames>();
            using (var objBAL = DLSegmentTableNames.GetDLSegmentTableNames(CreateSegmentDto.AccountId, SQLProvider))
            {
                var TableList = await objBAL.GET();

                foreach (var Table in TableList)
                {
                    TableAndColumnNames tablcolumnList = new TableAndColumnNames();
                    var ColumnList = (await objBAL.GETCOLUMNS(Table.TableName)).ToList();

                    tablcolumnList.TableName = Table.TableName;
                    tablcolumnList.IdentityColumn = Table.IdentityColumn;
                    tablcolumnList.DisplayTableName = Table.DisplayTableName;
                    tablcolumnList.ColumnNames = ColumnList;

                    AllTableColumnsList.Add(tablcolumnList);
                }

            }


            #region Custom Events
            using (var objBAL = DLCustomEventsOverView.GetDLCustomEventsOverView(CreateSegmentDto.AccountId, SQLProvider))
            {
                var TableList = await objBAL.GetCustomEventsNames();

                foreach (var Table in TableList)
                {
                    TableAndColumnNames tablcolumnList = new TableAndColumnNames();
                    var ColumnList = (await objBAL.GetCustomEventsColumnNames(Table.Id)).ToList();

                    tablcolumnList.TableName = "CustomEvents";
                    tablcolumnList.IdentityColumn = "MachineId";
                    tablcolumnList.DisplayTableName = Table.EventName;
                    tablcolumnList.ColumnNames = (from Column in ColumnList
                                                  select new MLTableColumns
                                                  {
                                                      ColumnName = Column.ColumnName,
                                                      DataType = Column.DataType,
                                                      DisplayColumnName = Column.ColumnName
                                                  }).ToList();
                    AllTableColumnsList.Add(tablcolumnList);
                }
            }
            #endregion Custom Events


            return Json(AllTableColumnsList);
        }

        public async Task<ActionResult> GetGroupsDetails([FromBody] CreateSegment_GetGroupsDetailsDto CreateSegmentDto)
        {
            Groups groupDetails = new Groups();
            using (var objDLGroups = DLGroups.GetDLGroups(CreateSegmentDto.AccountId, SQLProvider))
            {
                groupDetails.Id = CreateSegmentDto.GroupId;
                groupDetails = await objDLGroups.Get(groupDetails);
            }
            return Json(groupDetails);
        }

        public async Task<JsonResult> GetAllFieldDetails([FromBody] CreateSegment_GetAllFieldDetailsDto CreateSegmentDto)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            List<int> UserInfoUserIdList = (user.Members != null && user.Members.Count > 0) ? user.Members.Select(x => x.UserInfoUserId).ToList<int>() : null;
            using (var objBAL = DLContactExtraField.GetDLContactExtraField(CreateSegmentDto.AccountId, SQLProvider))
            {
                return Json(await objBAL.GetList(user.UserId, UserInfoUserIdList));
            }
        }
    }
}

