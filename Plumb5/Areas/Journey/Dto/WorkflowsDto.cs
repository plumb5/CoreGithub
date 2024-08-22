using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;

namespace Plumb5.Areas.Journey.Dto
{
    public record Workflow_GetMaxCountDto(int accountId, string WorkflowName);
    public record Workflow_GetWorkflowDataDto(int accountId, int OffSet, int FetchNext, string fromDateTime, string toDateTime, string WorkflowName);
    public record Workflow_ExportWorkflowDto(int accountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record Workflow_DeleteWorkflowDto(int AccountId, int WorkflowId);
    public record Workflow_CopyOfWorkFlowDto(int AccountId, int WorkflowId, int MaxCount);
    public record Workflow_CreateDuplicateWorkFlowDto(int AccountId, int WorkflowId);
    public record Workflow_UpdateWorkflowStatusDto(int AccountId, int WorkflowId, int IsStop = 0);
    public record Workflow_GetConfigDetailByWorkFlowIdDto(int AccountId, int WorkflowId);
}
