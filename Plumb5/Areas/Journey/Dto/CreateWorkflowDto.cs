using MathNet.Numerics.RootFinding;
using P5GenralML;

namespace Plumb5.Areas.Journey.Dto
{
    public record CreateWorkflow_StoreBasicDetails(int accountId, P5GenralML.WorkFlow WorkFlowBasicDetails);
    public record CreateWorkflow_GetMaxCountOfWorkflow(int accountId);
    public record CreateWorkflow_CheckWorkflowTitle(int accountId, P5GenralML.WorkFlow WorkFlowBasicDetails);
    public record CreateWorkflow_GetWorkflowByWorkflowId(int accountId, int WorkflowId);
    public record CreateWorkflow_GetWorkFlowById(int accountId, int WorkflowId);
    public record CreateWorkflow_UpdateWorkflowchart(int accountId, P5GenralML.WorkFlow WorkFlowBasicDetails);
    public record CreateWorkflow_GetTemplateforEdit(int accountId, int ConfigureId, string NodeText);
    public record CreateWorkflow_GetruleforEdit(int accountId, int workflowId);
    public record CreateWorkflow_UpdateDateTime(int accountId, WorkFlowData DatetimeConfig);
    public record CreateWorkflow_UpdateAudience(int accountId, WorkFlowData AudienceConfig);
    public record CreateWorkflow_GetgroupsCount(int accountId, string GrpIds);
    public record CreateWorkflow_chkbelongstogrp(int accountId, int WorkflowId);
    public record CreateWorkflow_SaveFlowchart(string json);
    public record CreateWorkflow_GetWebAppPushUsers(int accountId, string Browser);
    public record CreateWorkflow_GetWrokflowNodes(int accountId, int WorkflowId);
    public record CreateWorkflow_GetWebPushTemplateList(int accountId);
}
