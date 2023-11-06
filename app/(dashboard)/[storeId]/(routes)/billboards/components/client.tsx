"use client"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { DataTable } from "@/components/ui/data-table"
import { Apilist } from "@/components/ui/api-list"

import { BillboardColumn, columns } from "./columns"

 interface BillboardClientProps {
    data: BillboardColumn[]
 }

export const BillboardClient: React.FC<BillboardClientProps> = ({
    data
}) => {
    const router = useRouter();
    const params = useParams();
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Billboards (${data.length})`}
                    description="Gerencie os billboards da sua loja."
                />
                <Button
                    onClick={() => router.push(`/${params.storeId}/billboards/new`)}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Novo
                </Button>
            </div>
            <Separator />
            <DataTable 
                columns={columns}
                data={data}
                searchKey={'label'}
            />
            <Heading 
                title="API"
                description="API calls for Billboards"
            />
            <Separator />
            <Apilist 
                entityName='billboards'
                entityNameId='billboardId'
            />
        </>
    )
}