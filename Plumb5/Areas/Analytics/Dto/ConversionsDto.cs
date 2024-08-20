namespace Plumb5.Areas.Analytics.Dto
{
    public record GoalsMaxCountDto(int accountId, string fromdate, string todate);
    public record GoalsReportDto(int accountId, string fromdate, string todate, int start, int end);
    public record SaveGoalSettingDto(int accountId, int goalId, string goalName, string channel, string pages);
    public record ForwardGoalViewDto(int accountId, string fromdate, string todate, int GoalId);
    public record GoalDeleteDto(int accountId, int Id);
    public record GoalReportDto(int accountId);  
}
