using System;
namespace P5GenralML
{
    public class MLWorkFlowResponse
    {
        //Common
        public int AccountId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public int WorkFlowId { get; set; }
        //Previous Response Check
        public int PrevWorkFlowDataId { get; set; }
        public int PrevConfigId { get; set; }
        public string PrevChannel { get; set; }
        public string PrevChannelType { get; set; }
        public string Condition { get; set; }
        //Current Gona Fire
        public string CurrentChannel { get; set; }
        public string CurrentChannelType { get; set; }
        public int CurrentConfigId { get; set; }
        public int CurrentWorkFlowDataId { get; set; }
    }
    public class MlRespondedContacts
    {
        public int ContactId { get; set; }
        public string MachineId { get; set; }
        public DateTime? RespondedDate { get; set; }
    }
}
