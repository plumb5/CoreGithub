using P5GenralML;

namespace Plumb5.Areas.Prospect.Dto
{
    public record ReportsDto_GetRecentSavedReportDetails(int AccountId, int UserId);
    public record ReportsDto_GetAllForms(int AccountId);
    public record ReportsDto_GetSavedReports(int AccountId, int UserId);
    public record ReportsDto_SaveLmsFilterConditiondetails(int AccountId, MLLmsFilterConditions filterConditions);
    public record ReportsDto_GetFilterConditionDetails(int AccountId, int FilterConditionId);
    public record ReportsDto_DeleteSavedSearch(int AccountId, int Id);
    public record ReportsDto_MyReportsExport(int AccountId, int OffSet, int FetchNext, string FileType);
    public record ReportsDto_GetScheduledMailAlertMaxCount(int AccountId, int UserId, string Fromdate, string Todate);
    public record ReportsDto_GetScheduledMailAlertDetails(int AccountId, int UserId, string Fromdate, string Todate, int OffSet, int FetchNext);
    public record ReportsDto_GetMailTemplateContent(int AccountId, string MailTemplateName, int Id);
    public record ReportsDto_ScheduledMailAlertsExport(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record ReportsDto_DeleteScheduledMailAlerts(int AdsId, Int16 Id);
    public record ReportsDto_GetScheduledSmsAlertMaxCount(int AccountId, int UserId, string Fromdate, string Todate);
    public record ReportsDto_GetScheduledSmsAlertDetails(int AccountId, int UserId, string Fromdate, string Todate, int OffSet, int FetchNext);
    public record ReportsDto_ScheduledSmsAlertsExport(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record ReportsDto_DeleteScheduledSmsAlerts(int AdsId, Int16 Id);
    public record ReportsDto_GetScheduledWhatsappAlertMaxCount(int AccountId, int UserId, string Fromdate, string Todate);
    public record ReportsDto_GetScheduledWhatsappAlertDetails(int AccountId, int UserId, string Fromdate, string Todate, int OffSet, int FetchNext);
    public record ReportsDto_ScheduledWhatsappAlertsExport(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record ReportsDto_DeleteScheduledWhatsappAlerts(int AdsId, Int16 Id);
    public record ReportsDto_GetHistoryReport(int AccountId, int OffSet, int FetchNext, string FileType);
}
