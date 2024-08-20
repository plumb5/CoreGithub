using P5GenralML;

namespace P5GenralDL
{
    public interface IDLMailDashboard
    {
        Task<List<MLMailDashboard>> FormImpressionData(DateTime FromDateTime, DateTime ToDateTime);
        Task<List<MLMailDashboard>> GetReport(int Duration, DateTime FromDateTime, DateTime ToDateTime);
    }
}