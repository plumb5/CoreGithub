using P5GenralML;


namespace IP5GenralDL
{
    public interface IDLConversions:IDisposable
    {
        Task<object?> GoalsMaxCount(_Plumb5MLGoal mlObj);
        Task<object?> GetGoalsReport(_Plumb5MLGoal mlObj);
        Task<object?> Select_Goal(_Plumb5MLGoal mlObj);
        Task<Int32> Insert_GoalSetting(_Plumb5MLGoal mlObj);
        Task<Int32> Delete_GoalSetting(_Plumb5MLGoal mlObj);
        Task<object?> Select_ForwardGoal(_Plumb5MLForwardGoal mlObj);
    }
}
