namespace P5GenralML
{
    public class MLLmsFilterConditions
    {
        public int Id { get; set; }
        public int UserInfoUserId { get; set; }
        public string? Name { get; set; }
        public string? QueryField { get; set; }
        public bool ShowInDashboard { get; set; }
    }
}
