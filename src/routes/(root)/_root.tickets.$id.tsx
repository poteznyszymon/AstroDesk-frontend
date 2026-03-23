import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(root)/_root/tickets/$id')({
  component: RouteComponent,
})

function RouteComponent() {
    const { id } = Route.useParams()
  
    return <div className='w-full h-full flex items-center justify-center'>Szczegoly na temat {id}</div>
}