using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.CustomEvents.Dto;
using Plumb5.Areas.SegmentBuilder.Models;
using Plumb5.Controllers;

namespace Plumb5.Areas.CustomEvents.Controllers
{
    [Area("CustomEvents")]
    public class CustomEventsSegmentBuilderController : BaseController
    {
        public CustomEventsSegmentBuilderController(IConfiguration _configuration) : base(_configuration)
        { }

        //
        // GET: /CustomEvents/CustomEventsSegmentBuilder/

        public IActionResult Index()
        {
            return View("CustomEventsSegment");
        }

        [HttpPost]
        public async Task<JsonResult> GetCustomEventsNames([FromBody] CustomEventsSegmentBuilder_GetCustomEventsNames commonDetails)
        {
            List<MLCustomEventsOverView> AllTableColumnsList = new List<MLCustomEventsOverView>();
            using (var objBAL = DLCustomEventsOverView.GetDLCustomEventsOverView(commonDetails.AccountId, SQLProvider))
            {
                var TableList = await objBAL.GetCustomEventsNames();

                foreach (var Table in TableList)
                {
                    MLCustomEventsOverView tablcolumnList = new MLCustomEventsOverView();
                    var ColumnList = (await objBAL.GetCustomEventsColumnNames(Table.Id)).ToList();

                    tablcolumnList.Id = Table.Id;
                    tablcolumnList.EventName = Table.EventName;
                    tablcolumnList.ColumnNames = ColumnList;

                    AllTableColumnsList.Add(tablcolumnList);
                }
            }

            return Json(AllTableColumnsList);
        }

        [HttpPost]
        public async Task<JsonResult> VerifyQuery([FromBody] CustomEventsSegmentBuilder_VerifyQuery commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            string FilterQuery = getQueryString(commonDetails.Segment, commonDetails.TableNames, true, commonDetails.FromDate, commonDetails.ToDate);
            var data = await testResult(commonDetails.AccountId, FilterQuery);

            return Json(new { Status = data.Item1, Result = data.Item2, ContactList = data.Item3 });
        }

        [Log]
        [HttpPost]
        public async Task<IActionResult> CreateSegmentBuilder([FromBody] CustomEventsSegmentBuilder_CreateSegmentBuilder commonDetails)
        {
            var message = "";
            var result = false;
            P5GenralML.CustomEventsSegmentBuilder segmentBuilder = new P5GenralML.CustomEventsSegmentBuilder();

            var Query = getQueryString(commonDetails.Segment, commonDetails.TableNames, false, commonDetails.FromDate, commonDetails.ToDate);
            var Test = await testResult(commonDetails.AccountId, Query);
            if (Test.Item1 == true)
            {
                LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

                //Save Group....
                Groups group = new Groups();
                group.Id = commonDetails.GroupId;
                group.UserInfoUserId = user.UserId;
                group.UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;
                group.Name = commonDetails.GroupName;
                group.GroupDescription = commonDetails.GroupDescription;
                group.GroupType = 3;
                var saveGroupId = await SaveOrUpdateGroup(commonDetails.AccountId, group);
                var getGroupId = commonDetails.GroupId == 0 ? saveGroupId : commonDetails.GroupId;


                //Save Segment Builder......               

                if (getGroupId > 0)
                {
                    segmentBuilder.UserInfoUserId = user.UserId;
                    segmentBuilder.GroupId = getGroupId;
                    segmentBuilder.Status = true;
                    segmentBuilder.SegmentJson = JsonConvert.SerializeObject(commonDetails.Segment);
                    segmentBuilder.SegmentQuery = Query.ToString();
                    segmentBuilder.ExecutionType = "instant";

                    using (var objBL = DLCustomEventsSegmentBuilder.GetDLCustomEventsSegmentBuilder(commonDetails.AccountId, SQLProvider))
                    {
                        if (commonDetails.GroupId == 0)
                        {
                            segmentBuilder.Id = await objBL.Save(segmentBuilder);
                            if (segmentBuilder.Id > 0)
                            {
                                try
                                {
                                    objBL.StartFilter(segmentBuilder.Id);
                                    result = true;
                                }
                                catch (Exception ex)
                                {
                                    segmentBuilder.ErrorMessage = ex.Message;
                                    objBL.Update(segmentBuilder);

                                    message = ex.Message;
                                    result = false;
                                }
                            }
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

        private string getQueryString(List<SegmentCondition> Segment, string[] TableNames, bool TestQuery = false, string FromDate = null, string ToDate = null)
        {

            for (int i = 0; i < Segment.Count; i++)
            {
                if (Segment[i].Column == "EventName")
                    Segment[i].Comparison = "and";
            }

            var Query = "";
            int count = Segment.Where(x => x.Column == "EventName").ToList().Count;

            if (count == 0 || count == 1)
            {
                Query = getQuery(Segment, TableNames, TestQuery, FromDate: FromDate, ToDate: ToDate);
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
                            string subQuery = getQuery(SegmentTables, TableNames, TestQuery, false, "CustomEvents", FromDate: FromDate, ToDate: ToDate);
                            Query += $" SELECT CustomEvnents.ContactId,CustomEvnents.MachineId,CustomEvnents.DeviceId FROM ( {subQuery} ) AS CustomEvnents ";
                        }
                        else
                        {
                            List<SegmentCondition> SegmentTables = Segment.Where(x => x.Table != "CustomEvents").ToList();
                            List<SegmentCondition> Segmenteach = SegmentConditionAnd.Skip(i * 2).Take(2).ToList();
                            SegmentTables.AddRange(Segmenteach);
                            string subQuery = getQuery(SegmentTables, TableNames, TestQuery, true, "CustomEvents", FromDate: FromDate, ToDate: ToDate);

                            if (Segmenteach != null && Segmenteach.Count > 0 && Segmenteach[1].Operator == "CountEquals" && Segmenteach[1].Value == "0")
                            {
                                Query += $" WHERE (CAST(CustomEvnents.ContactId AS text) || '-' || CAST(CustomEvnents.MachineId AS text)) NOT IN ( SELECT (CAST(COALESCE(CustomEvnents.ContactId,0) AS text) || '-' || CAST(COALESCE(CustomEvnents.MachineId,'0') AS text)) FROM ( {subQuery} ) AS CustomEvnents ";
                            }
                            else
                            {
                                Query += $" WHERE (CAST(CustomEvnents.ContactId AS text) || '-' || CAST(CustomEvnents.MachineId AS text)) IN ( SELECT (CAST(COALESCE(CustomEvnents.ContactId,0) AS text) || '-' || CAST(COALESCE(CustomEvnents.MachineId,'0') AS text)) FROM ( {subQuery} ) AS CustomEvnents ";
                            }

                        }
                    }

                    if ((AndLoop - 1) >= 0)
                    {
                        for (int i = 1; i <= (AndLoop - 1); i++)
                        {
                            Query += ")";
                        }
                    }
                    else
                    {
                        Query += " UNION ";
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
                            string subQuery = getQuery(SegmentTables, TableNames, TestQuery, false, "CustomEvents", FromDate: FromDate, ToDate: ToDate);
                            if (!String.IsNullOrEmpty(Query) && Query.Length > 0 && Query.LastIndexOf("UNION") == -1)
                            {
                                Query += $" UNION SELECT CustomEvnents.ContactId,CustomEvnents.MachineId,CustomEvnents.DeviceId FROM ( {subQuery} ) AS CustomEvnents ";
                            }
                            else
                            {
                                Query += $" SELECT CustomEvnents.ContactId,CustomEvnents.MachineId,CustomEvnents.DeviceId FROM ( {subQuery} ) AS CustomEvnents ";
                            }
                        }
                        else
                        {
                            List<SegmentCondition> SegmentTables = Segment.Where(x => x.Table != "CustomEvents").ToList();
                            List<SegmentCondition> Segmenteach = SegmentConditionOR.Skip(i * 2).Take(2).ToList();
                            Segmenteach[1].Comparison = "and";
                            SegmentTables.AddRange(Segmenteach);
                            string subQuery = getQuery(SegmentTables, TableNames, TestQuery, false, "CustomEvents", FromDate: FromDate, ToDate: ToDate);

                            Query += $" UNION  (SELECT CustomEvnents.ContactId,CustomEvnents.MachineId,CustomEvnents.DeviceId FROM ( {subQuery} ) AS CustomEvnents) ";
                        }
                    }
                }
            }

            return Query;
        }

        private string getQuery(List<SegmentCondition> Segment, string[] TableNames, bool TestQuery = false, bool IsSubQuery = false, string DateFilterTable = null, string FromDate = null, string ToDate = null)
        {
            var Query = "";
            Query = TestQuery == true ? "select " : "select distinct ";
            var TableQuery = "";
            var DateCondition = "";
            var GroupBy = "";
            TableNames = TableNames.Distinct().ToArray();
            bool IsContactTablePresent = false;

            if (TableNames.Contains("CustomEvents"))
            {
                TableNames = TableNames.Where(x => x != "CustomEvents").ToArray();//remove contact table and push to position one
                TableNames = TableNames.Concat(new string[] { "CustomEvents" }).ToArray();
            }

            if (String.IsNullOrEmpty(DateFilterTable))
                DateCondition = GetDateCondition(Segment[0].Table, FromDate, ToDate);
            else
                DateCondition = GetDateCondition(DateFilterTable, FromDate, ToDate);

            foreach (var table in TableNames)
            {
                if (table.Contains("CustomEvents"))
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

                                TableQuery += $" COALESCE(CustomEvents.ContactId,0) as ContactId,COALESCE(CustomEvents.MachineId,'0') as MachineId,CAST(0 AS VARCHAR) as DeviceId " +
                                              $"FROM VisitorInformation " +
                                              $"RIGHT JOIN CustomEvents ON CustomEvents.MachineId=VisitorInformation.MachineId  AND VisitorInformation.SourceType=1 ";
                            }
                            else
                            {
                                GroupBy = "CustomEvents.ContactId,CustomEvents.MachineId";

                                TableQuery += $" COALESCE(CustomEvents.ContactId,0) as ContactId,COALESCE(CustomEvents.MachineId,'0') as MachineId,CAST(0 AS VARCHAR) as DeviceId " +
                                              $"FROM VisitorInformation " +
                                              $"RIGHT JOIN CustomEvents ON CustomEvents.MachineId=VisitorInformation.MachineId  AND VisitorInformation.SourceType=1 ";
                            }
                        }
                        else
                        {
                            GroupBy = "CustomEvents.ContactId,CustomEvents.MachineId";

                            TableQuery += $" COALESCE(CustomEvents.ContactId,0) as ContactId,COALESCE(CustomEvents.MachineId,'0') as MachineId,CAST(0 AS VARCHAR) as DeviceId " +
                                          $"FROM VisitorInformation " +
                                          $"RIGHT JOIN CustomEvents ON CustomEvents.MachineId=VisitorInformation.MachineId  AND VisitorInformation.SourceType=1 ";
                        }
                    }
                }
            }

            Query += TableQuery;

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

            if (DateCondition.Length > 0)
            {
                Query = Query.Replace("WHERE", "WHERE " + DateCondition + " AND ");
            }


            if (filterwhereClauseCondition.Item1.Count > 0)
            {
                Query += qBuilder.BuildHavingStatement(filterwhereClauseCondition.Item1, GroupBy);
            }

            return Query;
        }

        private string GetDateCondition(string tableName, string FromDate = null, string ToDate = null)
        {
            string DateCondition = "";
            switch (tableName)
            {
                case "CustomEvents":
                    DateCondition = $" (CustomEvents.EventTime between '{FromDate}' and '{ToDate}') ";
                    break;

            }

            return DateCondition;
        }

        public async Task<Tuple<bool, string, List<MLSegmentOutputColumns>>> testResult(int AccountId, string FilterQuery)
        {
            var Status = true; string Result = "";
            List<MLSegmentOutputColumns> ContactList = null;

            if (FilterQuery.ToLower().IndexOf("delete") > -1)
            {
                Status = false; Result = "Error : Dangerous SQL Statement.";
            }
            else
            {
                try
                {
                    using (var objBAL = DLSegmentBuilder.GetDLSegmentBuilder(AccountId, SQLProvider))
                    {
                        ContactList = (await objBAL.GetCustomEventsTestResultByQuery(FilterQuery)).ToList();
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

        public async Task<int> SaveOrUpdateGroup(int accountId, Groups group)
        {

            if (group.Id <= 0)
            {
                using (var objBL = DLGroups.GetDLGroups(accountId, SQLProvider))
                {
                    return await objBL.Save(group);

                }
            }
            else if (group.Id > 0)
            {
                using (var objBL = DLGroups.GetDLGroups(accountId, SQLProvider))
                {
                    if (!await objBL.Update(group))
                    {
                        return -1;
                    }
                }
            }

            return 0;
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

        [HttpPost]
        public async Task<JsonResult> GetAllTableColumns([FromBody] CustomEventsSegmentBuilder_GetCustomEventsNames commonDetails)
        {
            List<TableAndColumnNames> AllTableColumnsList = new List<TableAndColumnNames>();

            #region Custom Events
            using (var objBAL = DLCustomEventsOverView.GetDLCustomEventsOverView(commonDetails.AccountId, SQLProvider))
            {
                var TableList = await objBAL.GetCustomEventsNames();

                foreach (var Table in TableList)
                {
                    TableAndColumnNames tablcolumnList = new TableAndColumnNames();
                    var ColumnList = await objBAL.GetCustomEventsColumnNames(Table.Id);

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
    }
}
