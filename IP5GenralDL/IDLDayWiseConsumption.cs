using P5GenralML;

namespace P5GenralDL
{
    public interface IDLDayWiseConsumption : IDisposable
    {
        Task<DayWiseConsumption?> GetTodaysConsumption(int UserId);
        Task<DayWiseConsumption?> GetTotalConsumption(int AccountId, DateTime FromDateTime, DateTime ToDateTime);
        Task SaveEmailVerifyCount(DayWiseConsumption ConsumptionDetails);
        Task SaveMailCount(DayWiseConsumption ConsumptionDetails);
        Task SaveMobilePushCount(DayWiseConsumption ConsumptionDetails);
        Task SaveSmsCount(DayWiseConsumption ConsumptionDetails);
        Task SaveSpamCount(DayWiseConsumption ConsumptionDetails);
        Task SaveWebPushCount(DayWiseConsumption ConsumptionDetails);
        Task SaveWhatsappCount(DayWiseConsumption ConsumptionDetails);
    }
}