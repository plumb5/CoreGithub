namespace Plumb5.Areas.Journey.Models
{
    public class WorkFlowChart
    {
        public List<WorkFlowChartNodes> nodes { get; set; }
        public List<WorkFlowNodesConnections> connections { get; set; }
        public int numberOfElements { get; set; }
    }


    public class WorkFlowChartNodes
    {
        public string blockId { get; set; }
        public int positionX { get; set; }
        public int positionY { get; set; }
        public string label { get; set; }
    }

    public class WorkFlowNodesConnections
    {
        public string connectionId { get; set; }
        public string SourceId { get; set; }
        public string TargetId { get; set; }
        public string anchor { get; set; }
        public string RelationWithParent { get; set; }
    }

    public class ArragConfigData
    {
        public string Channel { get; set; }
        public string Value { get; set; }
        public string Title { get; set; }
    }
}
