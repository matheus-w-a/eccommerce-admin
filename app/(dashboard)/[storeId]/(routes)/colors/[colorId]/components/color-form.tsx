"use client"

import * as z from 'zod';
import axios from 'axios';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Color } from '@prisma/client'
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

const formSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    value: z.string().min(4, 'Cor is required').regex(/^#/, {
        message: 'O valor da cor deve ser um código hex'
    }),
})

interface ColorFormProps {
    initialData: Color | null
}

type ColorFormValues = z.infer<typeof formSchema>

export const ColorForm: React.FC<ColorFormProps> = ({
    initialData,
}) => {
    const params = useParams();
    const router = useRouter()

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? 'Editar Cor' : 'Criar Cor'
    const description = initialData ? 'Editar uma Cor' : 'Adicionar uma nova Cor'
    const toastMessage = initialData ? 'Cor atualizada.' : 'Cor criada com sucesso!'
    const action = initialData ? 'Salvar alterações' : 'Criar'

    const form = useForm<ColorFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            value: '',
        }
    })

    const onSubmit = async (data: ColorFormValues) => {
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, data);
            } else {
                await axios.post(`/api/${params.storeId}/colors`, data);
            }
            router.refresh();
            router.push(`/${params.storeId}/colors`);
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
            await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);
            router.refresh();
            router.push(`/${params.storeId}/colors`);
            toast.success('Cor deletada com sucesso.')
        } catch (error) {
            toast.error('Tenha certeza de que você removeu todas produtos que usam essa cor primeiro.')
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
                                        <Input disabled={loading} placeholder='Nome da cor' {...field} />
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
                                        <div className='flex items-center gap-x-4'>
                                            <Input disabled={loading} placeholder='Valor da cor' {...field} />
                                            <div
                                                className="p-4 rounded-full border"
                                                style={{ backgroundColor: field.value }}
                                            />
                                        </div>
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