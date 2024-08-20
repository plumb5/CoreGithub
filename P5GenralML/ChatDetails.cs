using System;

namespace P5GenralML
{
    public class ChatDetails
    {
        public int Id { get; set; }
        public int UserInfoUserId { get; set; }
        public int UserGroupId { get; set; }
        public string? Name { get; set; }
        public string? Header { get; set; }//new
        public int MinimisedWindow { get; set; }//new
        public string? ForegroundColor { get; set; }//new
        public string? BackgroundColor { get; set; }//new

        public Int16 ChatPriority { get; set; }
        public int Position { get; set; }
        public bool Privacy { get; set; }
        public bool? ChatStatus { get; set; }
        public short DesignType { get; set; }
        public string? CustomTitle { get; set; }
        public string? OfflineTitle { get; set; }
        public string? FormOnlineTitle { get; set; }
        public string? FormOfflineTitle { get; set; }
        public string? WelcomeMesg { get; set; }
        public string? AgentAwayMesg { get; set; }
        public string? AgentOfflineMsg { get; set; }
        public string? ChatEndMesg { get; set; }
        public bool DesktopNotificationVisitor { get; set; }
        public string? SoundNotificationVisitor { get; set; }
        public string? SuggestionMesg { get; set; }
        public short IdleTime { get; set; }
        public bool IsNameMandatory { get; set; }
        public bool IsPhoneMandatory { get; set; }
        public bool IsQueryMandatory { get; set; }
        public DateTime ChatCreatedDate { get; set; }
        public bool HideShowP5Logo { get; set; }
        public string? AutoMessageToVisitor { get; set; }
        public string? ReportToDetailsByMail { get; set; }
        public string? WebHooks { get; set; }
        public string? WebHooksFinalUrl { get; set; }
        public bool ShowGreetingMsg { get; set; }
        public bool ShowEngagedMsg { get; set; }
        public bool ShowIfAgentOnline { get; set; }
        public bool IsAgentOnline { get; set; }
        public bool ShowAutoMessageMobile { get; set; }
        public string? GroupId { get; set; }
        public string? AssignToUserId { get; set; }
        public string? WebHookId { get; set; }

        public Boolean IsPreChatSurvey { get; set; }
        public string? NamePlaceholderText { get; set; }
        public string? EmailPlaceholderText { get; set; }
        public string? PhonePlaceholderText { get; set; }
        public string? PrivacyContent { get; set; }
        public string? ButtonText { get; set; }
        public string? ResponseMessage { get; set; }
        public string? ResponseMessageTextColor { get; set; }
        public string? AgentMessageBgColor { get; set; }
        public string? AgentMessageForeColor { get; set; }
        public string? VisitorMessageBgColor { get; set; }
        public string? VisitorMessageForeColor { get; set; }
        public string? ChatBodyBackgroundColor { get; set; }
        public string? IsOverRideSource { get; set; }
        public int SourceType { get; set; }
        public string? MessagePlaceholderText { get; set; }

    }
}
