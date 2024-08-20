using P5GenralDL;
using P5GenralML;
using System.Data;

namespace Plumb5.Areas.Prospect.Models
{
    public class SourceStageReportModel : IDisposable
    {
        private readonly string sqlVendor;
        public SourceStageReportModel(string sqlVendor)
        {
            this.sqlVendor = sqlVendor;
        }

        public async Task<DataSet> GetSourceReport(int accountId, DateTime FromDateTime, DateTime ToDateTime, int Offset, int FetchNext, List<int> UseridList, bool IsCreatedDate)
        {
            DataSet sourceReport = null;

            try
            {
                using (var objBL = DLSourceReports.GetDLSourceReports(accountId, this.sqlVendor))
                    sourceReport = await objBL.GetReport(FromDateTime, ToDateTime, Offset, FetchNext, UseridList, IsCreatedDate);

                if (sourceReport != null && sourceReport.Tables.Count > 0 && sourceReport.Tables[0].Rows.Count > 0)
                {
                    List<int> UseridLists = sourceReport.Tables[0].AsEnumerable()
                         .Select(row => row.Field<int>("UserInfoUserId"))
                         .ToList();

                    List<UserInfo> userList = null;
                    using (var blUser = DLUserInfo.GetDLUserInfo(this.sqlVendor))
                        userList = blUser.GetDetail(UseridLists);

                    DataColumn newColumn = new DataColumn("Name", typeof(string));
                    sourceReport.Tables[0].Columns.Add(newColumn);

                    if (userList != null && userList.Count > 0)
                    {
                        foreach (DataRow row in sourceReport.Tables[0].Rows)
                        {
                            try
                            {
                                row["Name"] = userList.Where(x => x.UserId == Convert.ToInt32(row["UserInfoUserId"])).ToList()[0].FirstName;
                            }
                            catch
                            {
                                row["Name"] = "NA";
                            }
                        }
                    }
                    else
                    {
                        foreach (DataRow row in sourceReport.Tables[0].Rows)
                            row["Name"] = "NA";
                    }
                }
            }
            catch { }

            return sourceReport;
        }

        public async Task<DataSet> GetStageReport(int accountId, DateTime FromDateTime, DateTime ToDateTime, int Offset, int FetchNext, List<int> UseridList, bool IsCreatedDate)
        {
            DataSet sourceReport = null;

            try
            {
                using (var objBL = DLStageReports.GetDLStageReports(accountId, this.sqlVendor))
                    sourceReport = await objBL.GetReport(FromDateTime, ToDateTime, Offset, FetchNext, UseridList, IsCreatedDate);

                if (sourceReport != null && sourceReport.Tables.Count > 0 && sourceReport.Tables[0].Rows.Count > 0)
                {
                    List<int> UseridLists = sourceReport.Tables[0].AsEnumerable()
                         .Select(row => row.Field<int>("UserInfoUserId"))
                         .ToList();

                    List<UserInfo> userList = null;
                    using (var blUser = DLUserInfo.GetDLUserInfo(this.sqlVendor))
                        userList = blUser.GetDetail(UseridLists);

                    DataColumn newColumn = new DataColumn("Name", typeof(string));
                    sourceReport.Tables[0].Columns.Add(newColumn);

                    if (userList != null && userList.Count > 0)
                    {
                        foreach (DataRow row in sourceReport.Tables[0].Rows)
                        {
                            try
                            {
                                row["Name"] = userList.Where(x => x.UserId == Convert.ToInt32(row["UserInfoUserId"])).ToList()[0].FirstName;
                            }
                            catch
                            {
                                row["Name"] = "NA";
                            }
                        }
                    }
                    else
                    {
                        foreach (DataRow row in sourceReport.Tables[0].Rows)
                            row["Name"] = "NA";
                    }
                }
            }
            catch { }

            return sourceReport;
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
