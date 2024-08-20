using Dapper;
using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLLmsPublisherReportPG : CommonDataBaseInteraction, IDLLmsPublisherReport
    {
        CommonInfo connection;
        public DLLmsPublisherReportPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }
        public async Task<int> GetLmsPublisherMaxCount(string UserIdList, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, int OrderbyVal, LmsCustomReport filterLead, string Stagename)
        {
            List<LmsCustomReport> reportObject = new List<LmsCustomReport>();
            reportObject.Add(filterLead);
            DataTable filterLeadTable = new DataTable();
            filterLeadTable = ToDataTables(reportObject);
            TextInfo ti = CultureInfo.CurrentCulture.TextInfo;
            foreach (DataColumn column in filterLeadTable.Columns)
                column.ColumnName = ti.ToLower(column.ColumnName);


            var jsondata = ConvertDataTableToJson(filterLeadTable);
            string storeProcCommand = "select lms_publisherreport_maxcount(@UserIdList, @FromDateTime, @ToDateTime, @OrderbyVal, @jsondatas, @Stagename)";
            object? param = new { UserIdList, FromDateTime, ToDateTime, OrderbyVal, jsondatas = new JsonParameter(jsondata), Stagename };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }
        public async Task<DataSet> GetLmsPublisherReport(string UserIdList, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, int OffSet, int FetchNext, int OrderbyVal, LmsCustomReport filterLead, string Stagename)
        {
            List<LmsCustomReport> reportObject = new List<LmsCustomReport>();
            reportObject.Add(filterLead);
            DataTable filterLeadTable = new DataTable();
            filterLeadTable = ToDataTables(reportObject);
            TextInfo ti = CultureInfo.CurrentCulture.TextInfo;
            foreach (DataColumn column in filterLeadTable.Columns)
                column.ColumnName = ti.ToLower(column.ColumnName);

            var jsondata = ConvertDataTableToJson(filterLeadTable);
            string storeProcCommand = "select * from lms_publisherreport_getdetails(@UserIdList, @FromDateTime, @ToDateTime, @OffSet, @FetchNext, @OrderbyVal, @jsondatas, @Stagename)";
            object? param = new { UserIdList, FromDateTime, ToDateTime, OffSet, FetchNext, OrderbyVal, jsondatas = new JsonParameter(jsondata), Stagename };

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }
        public async Task<List<Publisher>> GetPublisherList(int? Score = null)
        {
            string storeProcCommand = "select * from publisher_get()";

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<Publisher>(storeProcCommand)).ToList();
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
        public async Task<int> GetLmsSourceMaxCount(string UserIdList, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, int OrderbyVal, LmsCustomReport filterLead)
        {
            List<LmsCustomReport> reportObject = new List<LmsCustomReport>();
            reportObject.Add(filterLead);
            DataTable filterLeadTable = new DataTable();
            filterLeadTable = ToDataTables(reportObject);
            TextInfo ti = CultureInfo.CurrentCulture.TextInfo;
            foreach (DataColumn column in filterLeadTable.Columns)
                column.ColumnName = ti.ToLower(column.ColumnName);

            var jsondata = ConvertDataTableToJson(filterLeadTable);
            string storeProcCommand = "select lms_publisherreport_getsourcemaxcount(@UserIdList, @FromDateTime, @ToDateTime, @OrderbyVal, @jsondatas)";
            object? param = new { UserIdList, FromDateTime, ToDateTime, OrderbyVal, jsondatas = new JsonParameter(jsondata) };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }

        public async Task<DataSet> GetLmsPublisherSourceReport(string UserIdList, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, int OffSet, int FetchNext, int OrderbyVal, LmsCustomReport filterLead)
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

                var jsondata = ConvertDataTableToJson(filterLeadTable);
                string storeProcCommand = "select * from lms_publisherreport_getsourcedetails(@UserIdList, @FromDateTime, @ToDateTime, @OffSet, @FetchNext, @OrderbyVal, @jsondatas)";
                object? param = new { UserIdList, FromDateTime, ToDateTime, OffSet, FetchNext, OrderbyVal, jsondatas = new JsonParameter(jsondata) };

                using var db = GetDbConnection(connection.Connection);
                var list = await db.ExecuteReaderAsync(storeProcCommand, param);
                var dataset = ConvertDataReaderToDataSet(list);
                return dataset;
            }
           catch(Exception ex)
            {
                throw new Exception();
            }
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
