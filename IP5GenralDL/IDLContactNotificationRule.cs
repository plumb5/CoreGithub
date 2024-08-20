using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLContactNotificationRule : IDisposable
    {
        Task<Int32> SaveContactNotificationRule(ContactNotificationRule leadnotificToSales);
        Task<bool> UpdateContactNotificationRule(ContactNotificationRule leadnotificToSales);
        Task<List<ContactNotificationRule>> GetRuleNotification(int Id, bool? Status = null);
        Task<bool> UpdateLastAssigUserIdNotificationToSales(int Id, int UserInfoUserId);
        Task<bool> DeleteLeadNotificationToSales(int Id);
        Task<bool> ToogleStatus(int Id, bool Status);
        Task<bool> ChangePriority(int Id, Int16 RulePriority);
        Task<List<ContactNotificationRule>> GetRules();
        Task<int> GetMaxCount(string ruleName);
        Task<List<ContactNotificationRule>> GetRulesForBinding(int OffSet, int FetchNext, string ruleName);
    }
}
