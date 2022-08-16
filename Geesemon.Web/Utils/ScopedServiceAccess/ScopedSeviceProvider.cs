namespace Geesemon.Web.Utils.ScopedServiceAccess
{
    public class ScopedSeviceProvider<T>
    {
        private readonly IServiceScopeFactory serviceScopeFactory;
        public ScopedSeviceProvider(IServiceScopeFactory serviceScopeFactory)
        {
            this.serviceScopeFactory = serviceScopeFactory;
        }

        //public T Get()
        //{
        //    using (var scope = serviceScopeFactory.CreateScope())
        //    {
        //        var 
        //        if()
        //        return scope.ServiceProvider.GetService<T>();
        //    }
        //}
    }
}
