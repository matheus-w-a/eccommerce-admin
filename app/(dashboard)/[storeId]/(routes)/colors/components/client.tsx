"use client"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { DataTable } from "@/components/ui/data-table"
import { Apilist } from "@/components/ui/api-list"

import { ColorColumn, columns } from "./columns"

 interface ColorsClientProps {
    data: ColorColumn[]
 }

export const ColorsClient: React.FC<ColorsClientProps> = ({
    data
}) => {
    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Cores (${data.length})`}
                    description="Gerencie as cores da sua loja."
                />
                <Button
                    onClick={() => router.push(`/${params.storeId}/colors/new`)}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Novo
                </Button>
            </div>
            <Separator />
            <DataTable 
                columns={columns}
                data={data}
                searchKey={'name'}
            />
            <Heading 
                title="API"
                description="API calls for Colors"
            />
            <Separator />
            <Apilist 
                entityName='colors'
                entityNameId='colorId'
            />
        </>
    )
}