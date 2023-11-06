"use client"

import * as z from 'zod';
import axios from 'axios';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Billboard, Size } from '@prisma/client'
import { useForm } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { Trash } from 'lucide-react';
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { AlertModal } from '@/components/modals/alert-modal';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    value: z.string().min(1, 'Name is required'),
})

interface SizeFormProps {
    initialData: Size | null
}

type SizeFormValues = z.infer<typeof formSchema>

export const SizeForm: React.FC<SizeFormProps> = ({
    initialData,
}) => {
    const params = useParams();
    const router = useRouter()

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? 'Editar Tamanho' : 'Criar Tamanho'
    const description = initialData ? 'Editar um Tamanho.' : 'Adicionar um novo Tamanho.'
    const toastMessage = initialData ? 'Tamanho atualizado.' : 'Tamanho criado com sucesso!'
    const action = initialData ? 'Salvar alterações' : 'Criar'

    const form = useForm<SizeFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            value: '',
        }
    })

    const onSubmit = async (data: SizeFormValues) => {
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, data);
            } else {
                await axios.post(`/api/${params.storeId}/sizes`, data);
            }
            router.refresh();
            router.push(`/${params.storeId}/sizes`);
            toast.success(toastMessage)
        } catch (error) {
            toast.error('Algo deu errado!')
        } finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);
            router.refresh();
            router.push(`/${params.storeId}/sizes`);
            toast.success('Tamanho deletado')
        } catch (error) {
            toast.error('Tenha certeza de que você removeu todos produtos que usam esse tamanho.')
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <div className='flex items-center justify-between'>
                <Heading
                    title={title}
                    description={description}
                />
                {initialData && (
                    <Button
                        disabled={loading}
                        onClick={() => setOpen(true)}
                        variant="destructive"
                        size='icon'
                    >
                        <Trash className='h-4 w-4' />
                    </Button>
                )}
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className='grid grid-cols-3 gap-8'>
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder='Nome do tamanho' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='value'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Valor</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder='Valor do tamanho' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className='ml-auto' type='submit'>
                        {action}
                    </Button>
                </form>
            </Form>
        </>
    )

}