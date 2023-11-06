"use client"

import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { DataTable } from "@/components/ui/data-table"

import { OrderColumn, columns } from "./columns"

 interface OrderClientProps {
    data: OrderColumn[]
 }

export const OrderClient: React.FC<OrderClientProps> = ({
    data
}) => {
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Pedidos (${data.length})`}
                    description="Gerencie os pedidos da sua loja."
                />
            </div>
            <Separator />
            <DataTable 
                columns={columns}
                data={data}
                searchKey={'products'}
            />
        </>
    )
}