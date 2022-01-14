export function with_global_state_update<T>( target : any, propertyKey : string, descriptor : PropertyDescriptor )
{
  const method = descriptor.set
  descriptor.set = async function( arg : T )
  {
    await method( arg )
    target.invokeGlobalStateUpdate()
  }
}
