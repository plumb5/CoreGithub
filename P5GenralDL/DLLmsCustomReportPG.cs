﻿using Dapper;
using DBInteraction;
using Newtonsoft.Json;
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
    internal class DLLmsCustomReportPG : CommonDataBaseInteraction, IDLLmsCustomReport
    {
        CommonInfo connection;
        public DLLmsCustomReportPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLLmsCustomReportPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<int> GetMaxCount(LmsCustomReport filterLead, int publishertype = 0)
        {
            List<LmsCustomReport> reportObject = new List<LmsCustomReport>();
            reportObject.Add(filterLead);
            DataTable filterLeadTable = new DataTable();
            filterLeadTable = ToDataTables(reportObject);
            TextInfo ti = CultureInfo.CurrentCulture.TextInfo;
            foreach (DataColumn column in filterLeadTable.Columns)
                column.ColumnName = ti.ToLower(column.ColumnName);
            string jsonData = JsonConvert.SerializeObject(filterLeadTable, Formatting.Indented);
            string storeProcCommand = "select * from lms_customreport_maxcount(@filterdata, @publishertype)";
            object? param = new { filterdata = new JsonParameter(jsonData), publishertype };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }

        public async Task<List<MLLeadsDetails>> GetLeadsWithContact(LmsCustomReport filterLead, int OffSet, int FetchNext, int publishertype = 0)
        {
            List<LmsCustomReport> reportObject = new List<LmsCustomReport>();
            reportObject.Add(filterLead);
            DataTable filterLeadTable = new DataTable();
            filterLeadTable = ToDataTables(reportObject);
            TextInfo ti = CultureInfo.CurrentCulture.TextInfo;
            foreach (DataColumn column in filterLeadTable.Columns)
                column.ColumnName = ti.ToLower(column.ColumnName);
            string jsonData = JsonConvert.SerializeObject(filterLeadTable, Formatting.Indented);
            string storeProcCommand = "select * from lms_customreport_get(@filterdata, @OffSet, @FetchNext, @publishertype)";
            object? param = new { filterdata = new JsonParameter(jsonData), OffSet, FetchNext, publishertype };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MLLeadsDetails>(storeProcCommand, param)).ToList();

        }

        public async Task<MLLeadsDetails?> GetLmsGrpDetailsByContactId(int ContactId, int lmsgroupid)
        {
            string storeProcCommand = "select * from lms_grpdetails_get(@ContactId, @lmsgroupid)";
            object? param = new { ContactId, lmsgroupid };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MLLeadsDetails?>(storeProcCommand, param);

        }

        public async Task<List<FormDetails>> GetAllForms()
        {
            string storeProcCommand = "select * from lms_customreport_getallforms()";
            object? param = new { };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<FormDetails>(storeProcCommand, param)).ToList();

        }

        public async Task<List<MLContact>> GetLeadsHistoryReport(string action, List<int> contact, string FromDate, string ToDate)
        {
            try
            {
                string storeProcCommand = action.ToLower() == "select * from getleadscurrenthistory(@contactidlist,@FromDate, @ToDate)" ? "select * from lms_historyreport_getleadscurrenthistory(@contactidlist,@FromDate, @ToDate)" : "select * from lms_historyreport_getleadshistoryreport(@contactidlist,@FromDate, @ToDate)";
                object? param = new { contactidlist = contact.Count > 0 ? String.Join(",", contact) : "", FromDate, ToDate };

                using var db = GetDbConnection(connection.Connection);
                return (await db.QueryAsync<MLContact>(storeProcCommand, param)).ToList();
            }
            catch(Exception ex)
            {
                throw new Exception();
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
        public async Task<bool> Getheaderflag()
        {
            string storeProcCommand = "select * from lms_headerflag_get()";
            object? param = new { };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        #region Dispose Method
        bool disposed;
        protected virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {
                    connection = null;
                }
            }
            //dispose unmanaged ressources
            disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
        }

        #endregion End of Dispose Method
    }
}
