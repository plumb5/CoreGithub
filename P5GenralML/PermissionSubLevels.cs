namespace P5GenralML
{
    public class PermissionSubLevels
    {
        public long Id { get; set; }
        public int PermissionLevelId { get; set; }
        public string AreaName { get; set; }
        public string ControllerName { get; set; }
        public string ActionName { get; set; }
        public string FeatureName { get; set; }
        public bool HasPermission { get; set; }
    }
}
