using GraphQL;
using GraphQL.Execution;
using GraphQL.Server.Authorization.AspNetCore;
using System.Text;

namespace Geesemon.Web.GraphQL
{
    public class ApplicationErrorInfoProvider : ErrorInfoProvider
    {
        private readonly IAuthorizationErrorMessageBuilder _messageBuilder;

        public ApplicationErrorInfoProvider(IAuthorizationErrorMessageBuilder messageBuilder)
        {
            _messageBuilder = messageBuilder;
        }

        public override ErrorInfo GetInfo(ExecutionError executionError)
        {
            var info = base.GetInfo(executionError);
            info.Message = executionError switch
            {
                AuthorizationError authorizationError => GetAuthorizationErrorMessage(authorizationError),
                _ => info.Message,
            };
            return info;
        }

        private string GetAuthorizationErrorMessage(AuthorizationError error)
        {
            var errorMessage = new StringBuilder();
            _messageBuilder.AppendFailureHeader(errorMessage, error.OperationType);

            foreach (var failedRequirement in error.AuthorizationResult.Failure.FailedRequirements)
            {
                switch (failedRequirement)
                {
                    //case MinimumAgeRequirement minimumAgeRequirement:
                    //    errorMessage.AppendLine();
                    //    errorMessage.Append("The current user must be at least ");
                    //    errorMessage.Append(minimumAgeRequirement.MinimumAge);
                    //    errorMessage.Append(" years old.");
                    //    break;
                    default:
                        _messageBuilder.AppendFailureLine(errorMessage, failedRequirement);
                        break;
                }
            }

            return errorMessage.ToString();
        }
    }
}
