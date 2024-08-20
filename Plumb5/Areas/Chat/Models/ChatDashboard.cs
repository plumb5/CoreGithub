using P5GenralDL;
using P5GenralML;

namespace Plumb5.Areas.Chat.Models
{
    public class ChatDashboard : IDisposable
    {
        readonly int AdsId;
        public ChatDashboard(int adsid)
        {
            AdsId = adsid;
        }

        public async Task<List<MLChatDashBoard>> GetTopThreeAgents(DateTime FromDateTime, DateTime ToDateTime, string SQLProvider)
        {
            List<MLChatDashBoard> dashboardDetails = null;

            using (var objDL = DLChatDashBoard.GetDLCartDetails(AdsId, SQLProvider))
                dashboardDetails = await objDL.TopThreeAgents(FromDateTime, ToDateTime);

            if (dashboardDetails != null && dashboardDetails.Count > 0)
            {
                List<ChatAllAgentsName> AllAgentsNameList = null;

                using (var objDLChatAgentReport = DLChatAgentReport.GetDLChatAgentReport(AdsId, SQLProvider))
                {
                    MLChatAgentReport agentReport = new MLChatAgentReport();
                    AllAgentsNameList = await objDLChatAgentReport.GetAllAgentsName(agentReport);
                }

                if (AllAgentsNameList != null && AllAgentsNameList.Count > 0)
                {
                    IEnumerable<int> AgentsIdList = AllAgentsNameList.Select(x => Convert.ToInt32(x.UserId));

                    List<UserInfo> UserInfoList = new List<UserInfo>();
                    using (var objDLUserInfo = DLUserInfo.GetDLUserInfo(SQLProvider))
                        UserInfoList = objDLUserInfo.GetDetail(AgentsIdList);

                    if (UserInfoList != null && UserInfoList.Count > 0)
                    {
                        UserInfoList = (from UserInfos in UserInfoList
                                        join AllAgentsName in AllAgentsNameList on UserInfos.UserId.ToString() equals AllAgentsName.UserId into UserInfo_join
                                        from AllAgentsName in UserInfo_join.DefaultIfEmpty()
                                        select new UserInfo
                                        {
                                            UserId = UserInfos.UserId,
                                            EmployeeCode = UserInfos.EmployeeCode, //UserInfos.EmployeeCode
                                            FirstName = AllAgentsName.Name
                                        }).ToList();


                        dashboardDetails = (from ConverRate in dashboardDetails
                                            join AgentInfo in UserInfoList on ConverRate.LastAgentServedBy equals AgentInfo.UserId into ChatInteraction_join
                                            from AgentInfo in ChatInteraction_join.DefaultIfEmpty()
                                            where ConverRate.LastAgentServedBy > 0
                                            select new MLChatDashBoard
                                            {
                                                AgentName = AgentInfo == null ? "No agent" : (string.IsNullOrEmpty(AgentInfo.FirstName) ? "No Agent" : AgentInfo.FirstName),
                                                EmployeeCode = AgentInfo == null ? "N/A" : (string.IsNullOrEmpty(AgentInfo.EmployeeCode) ? "N/A" : AgentInfo.EmployeeCode),
                                                ConversionRate = ConverRate.ConversionRate
                                            }).ToList();
                    }
                    else
                    {
                        dashboardDetails = (from ConverRate in dashboardDetails
                                            select new MLChatDashBoard
                                            {
                                                AgentName = "No agent",
                                                EmployeeCode = "N/A",
                                                ConversionRate = ConverRate.ConversionRate
                                            }).ToList();
                    }
                }
                else
                {
                    dashboardDetails = (from ConverRate in dashboardDetails
                                        select new MLChatDashBoard
                                        {
                                            AgentName = "No agent",
                                            EmployeeCode = "N/A",
                                            ConversionRate = ConverRate.ConversionRate
                                        }).ToList();
                }
            }
            else
            {
                dashboardDetails = (from ConverRate in dashboardDetails
                                    select new MLChatDashBoard
                                    {
                                        AgentName = "No agent",
                                        EmployeeCode = "N/A",
                                        ConversionRate = ConverRate.ConversionRate
                                    }).ToList();
            }

            return dashboardDetails;
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
