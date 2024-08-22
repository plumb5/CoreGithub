namespace Plumb5.Areas.SegmentBuilder.Models
{
    public class P5SqlQueryBuilder
    {
        public string BuildWhereStatement(List<P5SqlWhereClause> WhereStatementList)
        {
            string Result = "";
            var LogicOperator = " AND ";


            var levelList = WhereStatementList.Select(s => s.Level).Distinct().ToList();
            foreach (var level in levelList)
            {
                var levelWhereStatement = WhereStatementList.Where(w => w.Level == level).ToList();
                string WhereClause = "";

                foreach (var Clause in levelWhereStatement)
                {
                    var WhereOperator = "";
                    switch (Clause.LogicOperator)
                    {
                        case P5SqlLogicOperator.And:
                            WhereOperator = " AND "; break;
                        case P5SqlLogicOperator.Or:
                            WhereOperator = " OR "; break;
                    }

                    if (WhereClause.Length > 0) { WhereClause += WhereOperator; } else { LogicOperator = WhereOperator; }

                    WhereClause += CreateP5SqlComparisonClause(Clause.FieldName, Clause.ComparisonOperator, Clause.Value, Clause.DataTye);

                }

                LogicOperator = Result.Length > 0 ? LogicOperator : "";
                Result += LogicOperator + " (" + WhereClause + ")";
            }

            return " WHERE " + Result;
        }

        public string CustomEventBuildWhereStatement(List<P5SqlWhereClause> WhereStatementList, string Groupby, string[] EventNames)
        {
            string Result = "";
            var LogicOperator = " AND ";


            var levelList = WhereStatementList.Select(s => s.Level).Distinct().ToList();
            foreach (var level in levelList)
            {
                var levelWhereStatement = WhereStatementList.Where(w => w.Level == level).ToList();
                string WhereClause = "";

                foreach (var Clause in levelWhereStatement)
                {
                    var WhereOperator = "";
                    switch (Clause.LogicOperator)
                    {
                        case P5SqlLogicOperator.And:
                            WhereOperator = " AND "; break;
                        case P5SqlLogicOperator.Or:
                            WhereOperator = " OR "; break;
                    }

                    if (WhereClause.Length > 0) { WhereClause += WhereOperator; } else { LogicOperator = WhereOperator; }

                    WhereClause += CreateP5SqlComparisonClause(Clause.FieldName, Clause.ComparisonOperator, Clause.Value, Clause.DataTye);

                }

                LogicOperator = Result.Length > 0 ? LogicOperator : "";
                Result += LogicOperator + " (" + WhereClause + ")";
            }

            string eventName = string.Empty;
            foreach (var name in EventNames)
            {
                eventName += $" AND EventName like '{name}'";
            }

            if (Groupby == "ContactId")
                return " WHERE ContactId > 0 " + eventName + " AND " + Result;
            else if (Groupby == "MachineId")
                return " WHERE ISNULL(MachineId,'')!='' " + eventName + " AND " + Result;

            return " WHERE " + Result;
        }

        public string BuildHavingStatement(List<P5SqlWhereClause> WhereStatementList, string GroupBy)
        {
            string Result = "";
            var LogicOperator = " AND ";


            var levelList = WhereStatementList.Select(s => s.Level).Distinct().ToList();
            foreach (var level in levelList)
            {
                var levelWhereStatement = WhereStatementList.Where(w => w.Level == level).ToList();
                string WhereClause = "";

                foreach (var Clause in levelWhereStatement)
                {
                    var WhereOperator = "";
                    switch (Clause.LogicOperator)
                    {
                        case P5SqlLogicOperator.And:
                            WhereOperator = " AND "; break;
                        case P5SqlLogicOperator.Or:
                            WhereOperator = " OR "; break;
                    }

                    if (WhereClause.Length > 0) { WhereClause += WhereOperator; } else { LogicOperator = WhereOperator; }

                    WhereClause += CreateP5SqlComparisonHavingClause(Clause.FieldName, Clause.ComparisonOperator, Clause.Value, GroupBy);

                }

                LogicOperator = Result.Length > 0 ? LogicOperator : "";
                Result += LogicOperator + " (" + WhereClause + ")";
            }

            return $" GROUP BY {GroupBy} HAVING {Result}";
        }

        public string CreateP5SqlComparisonClause(string fieldName, P5SqlComparison P5SqlComparisonOperator, object value, string DataType)
        {
            string Output = "";
            if (value != null && value != System.DBNull.Value)
            {
                switch (P5SqlComparisonOperator)
                {
                    case P5SqlComparison.Equals:
                        if (!String.IsNullOrEmpty(DataType) && DataType.ToLower().Contains("number"))
                            Output = fieldName + " = " + Convert.ToInt32(value);
                        else
                            Output = fieldName + " = " + FormatSQLValue(value);
                        break;

                    case P5SqlComparison.NotEquals:
                        if (!String.IsNullOrEmpty(DataType) && DataType.ToLower().Contains("number"))
                            Output = fieldName + " <> " + Convert.ToInt32(value);
                        else
                            Output = fieldName + " <> " + FormatSQLValue(value);
                        break;

                    case P5SqlComparison.GreaterThan:
                        if (!String.IsNullOrEmpty(DataType) && DataType.ToLower().Contains("number"))
                            Output = fieldName + " > " + Convert.ToInt32(value);
                        else
                            Output = fieldName + " > " + FormatSQLValue(value);
                        break;

                    case P5SqlComparison.GreaterOrEquals:
                        if (!String.IsNullOrEmpty(DataType) && DataType.ToLower().Contains("number"))
                            Output = fieldName + " >= " + Convert.ToInt32(value);
                        else
                            Output = fieldName + " >= " + FormatSQLValue(value);
                        break;

                    case P5SqlComparison.LessThan:
                        if (!String.IsNullOrEmpty(DataType) && DataType.ToLower().Contains("number"))
                            Output = fieldName + " < " + Convert.ToInt32(value);
                        else
                            Output = fieldName + " < " + FormatSQLValue(value);
                        break;

                    case P5SqlComparison.LessOrEquals:
                        if (!String.IsNullOrEmpty(DataType) && DataType.ToLower().Contains("number"))
                            Output = fieldName + " <= " + Convert.ToInt32(value);
                        else
                            Output = fieldName + " <= " + FormatSQLValue(value);
                        break;

                    case P5SqlComparison.Like:
                        Output = fieldName + " LIKE " + FormatSQLValue(value, true); break;
                    case P5SqlComparison.NotLike:
                        Output = "NOT " + fieldName + " LIKE " + FormatSQLValue(value, true); break;
                    case P5SqlComparison.In:
                        if (!String.IsNullOrEmpty(DataType) && DataType.ToLower().Contains("number"))
                            Output = fieldName + " IN (" + Convert.ToInt32(value) + ")";
                        else
                            Output = fieldName + " IN (" + FormatSQLValue(value) + ")";
                        break;

                    case P5SqlComparison.IsEmpty:
                        Output = $"ISNULL(${fieldName},'')=''"; break;
                    case P5SqlComparison.IsNotEmpty:
                        Output = $"ISNULL(${fieldName},'')!=''"; break;

                }
            }
            else // value==null	|| value==DBNull.Value
            {
                if ((P5SqlComparisonOperator != P5SqlComparison.Equals) && (P5SqlComparisonOperator != P5SqlComparison.NotEquals) && (P5SqlComparisonOperator != P5SqlComparison.IsEmpty) && (P5SqlComparisonOperator != P5SqlComparison.IsNotEmpty))
                {
                    throw new Exception("Cannot use P5SqlComparison operator " + P5SqlComparisonOperator.ToString() + " for NULL values.");
                }
                else
                {
                    switch (P5SqlComparisonOperator)
                    {
                        case P5SqlComparison.Equals:
                            Output = fieldName + " IS NULL"; break;
                        case P5SqlComparison.NotEquals:
                            Output = "NOT " + fieldName + " IS NULL"; break;
                        case P5SqlComparison.IsEmpty:
                            Output = $"ISNULL({fieldName},'')=''"; break;
                        case P5SqlComparison.IsNotEmpty:
                            Output = $"ISNULL({fieldName},'')!=''"; break;
                    }
                }
            }
            return Output;
        }

        public string CreateP5SqlComparisonHavingClause(string fieldName, P5SqlComparison P5SqlComparisonOperator, object value, string GroupBy)
        {
            string Output = "";
            if (value != null && value != System.DBNull.Value)
            {
                switch (P5SqlComparisonOperator)
                {
                    case P5SqlComparison.CountEquals:
                        Output = $"COUNT(1)" + " = " + Convert.ToInt64(value); break;
                    case P5SqlComparison.CountNotEquals:
                        Output = $"COUNT(1)" + " <> " + Convert.ToInt64(value); break;
                    case P5SqlComparison.CountGreaterThan:
                        Output = $"COUNT(1)" + " > " + Convert.ToInt64(value); break;
                    case P5SqlComparison.CountLessThan:
                        Output = $"COUNT(1)" + " < " + Convert.ToInt64(value); break;
                    case P5SqlComparison.AverageEquals:
                        if (value.ToString().Contains("."))
                            Output = $"AVG(CAST({fieldName} AS DECIMAL))" + " = " + Convert.ToDecimal(value);
                        else
                            Output = $"AVG(CAST({fieldName} AS BIGINT))" + " = " + Convert.ToInt64(value);

                        break;
                    case P5SqlComparison.AverageGreaterThan:
                        if (value.ToString().Contains("."))
                            Output = $"AVG(CAST({fieldName} AS DECIMAL))" + "  > " + Convert.ToDecimal(value);
                        else
                            Output = $"AVG(CAST({fieldName} AS BIGINT))" + "  > " + Convert.ToInt64(value);

                        break;

                    case P5SqlComparison.AverageLessThan:
                        if (value.ToString().Contains("."))
                            Output = $"AVG(CAST({fieldName} AS DECIMAL))" + " < " + Convert.ToDecimal(value);
                        else
                            Output = $"AVG(CAST({fieldName} AS BIGINT))" + "  < " + Convert.ToInt64(value);

                        break;

                    case P5SqlComparison.AverageNotEquals:
                        if (value.ToString().Contains("."))
                            Output = $"AVG(CAST({fieldName} AS DECIMAL))" + " <> " + Convert.ToDecimal(value);
                        else
                            Output = $"AVG(CAST({fieldName} AS BIGINT))" + "  <> " + Convert.ToInt64(value);

                        break;
                    case P5SqlComparison.TotalEquals:
                        if (value.ToString().Contains("."))
                            Output = $"SUM(CAST({fieldName} AS DECIMAL))" + " = " + Convert.ToDecimal(value);
                        else
                            Output = $"SUM(CAST({fieldName} AS BIGINT))" + "  = " + Convert.ToInt64(value);

                        break;
                    case P5SqlComparison.TotalGreaterThan:
                        if (value.ToString().Contains("."))
                            Output = $"SUM(CAST({fieldName} AS DECIMAL))" + " > " + Convert.ToDecimal(value);
                        else
                            Output = $"SUM(CAST({fieldName} AS BIGINT))" + "  > " + Convert.ToInt64(value);

                        break;
                    case P5SqlComparison.TotalLessThan:
                        if (value.ToString().Contains("."))
                            Output = $"SUM(CAST({fieldName} AS DECIMAL))" + " < " + Convert.ToDecimal(value);
                        else
                            Output = $"SUM(CAST({fieldName} AS BIGINT))" + "  < " + Convert.ToInt64(value);

                        break;

                    case P5SqlComparison.TotalNotEquals:
                        if (value.ToString().Contains("."))
                            Output = $"SUM(CAST({fieldName} AS DECIMAL))" + " <> " + Convert.ToDecimal(value);
                        else
                            Output = $"SUM(CAST({fieldName} AS BIGINT))" + "  <> " + Convert.ToInt64(value);

                        break;
                }
            }
            else // value==null	|| value==DBNull.Value
            {
                if ((P5SqlComparisonOperator != P5SqlComparison.Equals) && (P5SqlComparisonOperator != P5SqlComparison.NotEquals))
                {
                    throw new Exception("Cannot use P5SqlComparison operator " + P5SqlComparisonOperator.ToString() + " for NULL values.");
                }
                else
                {
                    switch (P5SqlComparisonOperator)
                    {
                        case P5SqlComparison.Equals:
                            Output = fieldName + " IS NULL"; break;
                        case P5SqlComparison.NotEquals:
                            Output = "NOT " + fieldName + " IS NULL"; break;
                    }
                }
            }
            return Output;
        }

        internal string FormatSQLValue(object someValue, bool like = false)
        {
            string FormattedValue = "";
            //				string StringType = Type.GetType("string").Name;
            //				string DateTimeType = Type.GetType("DateTime").Name;

            if (someValue == null)
            {
                FormattedValue = "NULL";
            }
            else
            {
                var likeSymbol = like == true ? "%" : "";
                switch (someValue.GetType().Name)
                {
                    case "String": FormattedValue = "'" + likeSymbol + ((string)someValue).Replace("'", "''") + likeSymbol + "'"; break;
                    case "DateTime": FormattedValue = "'" + ((DateTime)someValue).ToString("yyyy/MM/dd hh:mm:ss") + "'"; break;
                    case "DBNull": FormattedValue = "NULL"; break;
                    case "Boolean": FormattedValue = (bool)someValue ? "1" : "0"; break;
                    default: FormattedValue = someValue.ToString(); break;
                }
            }
            return FormattedValue;
        }
    }
}
