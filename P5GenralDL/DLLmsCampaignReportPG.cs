using Dapper;
using DBInteraction;
using IP5GenralDL;
using Newtonsoft.Json;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLLmsCampaignReportPG : CommonDataBaseInteraction, IDLLmsCampaignReport
    {
        CommonInfo connection;
        public DLLmsCampaignReportPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }
        public async Task<Int32> GetMaxCount(string UserIdList, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, int OrderbyVal, LmsCustomReport filterLead)
        {
            try
            {
                List<LmsCustomReport> reportObject = new List<LmsCustomReport>();
                reportObject.Add(filterLead);
                DataTable filterLeadTable = new DataTable();
                filterLeadTable = ToDataTables(reportObject);
                TextInfo ti = CultureInfo.CurrentCulture.TextInfo;
                foreach (DataColumn column in filterLeadTable.Columns)
                    column.ColumnName = ti.ToLower(column.ColumnName);

                string jsonData = JsonConvert.SerializeObject(filterLeadTable, Formatting.Indented);

                string storeProcCommand = "select * from lms_campaignreport_maxcount( @UserIdList, @FromDateTime, @ToDateTime, @OrderbyVal, @filterLeadTable)";
                object? param = new { UserIdList, FromDateTime, ToDateTime, OrderbyVal, filterLeadTable= new JsonParameter(jsonData) };
                using var db = GetDbConnection(connection.Connection);

                return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
            }
            catch (Exception ex)
            {
                return 0;
            }
        }

        private static DataTable ToDataTables<T>(IList<T> data)
        {
            PropertyDescriptorCollection props = TypeDescriptor.GetProperties(typeof(T));
            DataTable table = new DataTable();
            for (int i = 0; i < props.Count; i++)
            {
                PropertyDescriptor prp = props[i];
                table.Columns.Add(prp.Name, Nullable.GetUnderlyingType(prp.PropertyType) ?? prp.PropertyType);
            }
            object[] values = new object[props.Count];
            foreach (T item in data)
            {
                for (int i = 0; i < values.Length; i++)
                {
                    values[i] = props[i].GetValue(item);
                }
                table.Rows.Add(values);
            }
            return table;
        }
        public async Task<DataSet> GetLmsCampaignReport(string UserIdList, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, int OffSet, int FetchNext, int OrderbyVal, LmsCustomReport filterLead)
        {
            List<LmsCustomReport> reportObject = new List<LmsCustomReport>();
            reportObject.Add(filterLead);
            DataTable filterLeadTable = new DataTable();
            filterLeadTable = ToDataTables(reportObject);
            TextInfo ti = CultureInfo.CurrentCulture.TextInfo;
            foreach (DataColumn column in filterLeadTable.Columns)
                column.ColumnName = ti.ToLower(column.ColumnName);

            string jsonData = JsonConvert.SerializeObject(filterLeadTable, Formatting.Indented);
            string storeProcCommand = "select * from lms_campaignreport_getlmscampaignreport(@UserIdList, @FromDateTime, @ToDateTime, @OffSet , @FetchNext, @OrderbyVal, @filterLeadTable )";
            object? param = new { UserIdList, FromDateTime, ToDateTime, OffSet, FetchNext, OrderbyVal, filterLeadTable = new JsonParameter(jsonData) };

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;

        }
        public async Task<DataSet> GetLmsPhoneCallResponseDetails(int UserInfoUserId, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, int OrderbyVal, string CalledNumber, LmsCustomReport filterLead, string CallEvents)
        {
            List<LmsCustomReport> reportObject = new List<LmsCustomReport>();
            reportObject.Add(filterLead);
            DataTable filterLeadTable = new DataTable();
            filterLeadTable = ToDataTables(reportObject);
            TextInfo ti = CultureInfo.CurrentCulture.TextInfo;
            foreach (DataColumn column in filterLeadTable.Columns)
                column.ColumnName = ti.ToLower(column.ColumnName);
            string storeProcCommand = "select * from lms_campaignreport_getlmsphonecallresponsedetails(@UserInfoUserId, @FromDateTime, @ToDateTime, @OrderbyVal, @CalledNumber, @filterLeadTable, @CallEvents )";
            object? param = new { UserInfoUserId, FromDateTime, ToDateTime, OrderbyVal, CalledNumber, filterLeadTable, CallEvents };

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }
        #region Dispose Method
        private bool _disposed = false;
        protected void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                _disposed = true;
                if (disposing)
                {
                    connection = null;
                }
            }
        }

        public void Dispose()
        {
            Dispose(true);
        }
        #endregion End of Dispose Method
    }
}
