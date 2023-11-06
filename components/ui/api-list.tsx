"use client"

import { useParams } from "next/navigation";

import { useOrigin } from "@/hooks/use-origin";
import { ApiAlert } from "@/components/ui/api-alert";

interface ApiListProps {
    entityName: string;
    entityNameId: string
}

export const Apilist: React.FC<ApiListProps> = ({
    entityName,
    entityNameId
}) => {
    const params = useParams();
    const origin = useOrigin();

    const baseUrl = `${origin}/api/${params.storeId}`

    return (
        <>
            <ApiAlert
                title="GET"
                variant="public"
                description={`${baseUrl}/${entityName}`}            
            />
            <ApiAlert
                title="GET"
                variant="public"
                description={`${baseUrl}/${entityName}/{${entityNameId}}`}            
            />
            <ApiAlert
                title="POST"
                variant="admin"
                description={`${baseUrl}/${entityName}`}            
            />
            <ApiAlert
                title="PATCH"
                variant="admin"
                description={`${baseUrl}/${entityName}/{${entityNameId}}`}            
            />
            <ApiAlert
                title="DELETE"
                variant="admin"
                description={`${baseUrl}/${entityName}/{${entityNameId}}`}            
            />
        </>
    )
}